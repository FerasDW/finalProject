import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../Context/AuthContext';
import { meetingApi, courseApi, attendanceApi } from '../Api/videoMeetingApi';
import {
  generateRoomId,
  parseInvitationLink,
  openMeetingInNewTab,
  validateMeetingForm,
  calculateAttendancePercentage,
  calculateTotalAttendanceTime,
  generateInvitationLink
} from '../Utils/videoMeetingUtils';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://13.61.114.153:8082';

// Helper function to get token from localStorage
const getToken = () => {
    return localStorage.getItem("jwtToken");
};

/**
 * Main video meeting hook for dashboard functionality
 */
export const useVideoMeeting = () => {
  const { authData } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = authData?.id;
  const userRole = authData?.role || authData?.userType;
  const userName = authData?.name || authData?.username;

  const fetchMeetings = useCallback(async (filters = {}) => {
    if (!userId) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const fetchedMeetings = await meetingApi.getUserMeetings(filters);
      setMeetings(fetchedMeetings || []);
      console.log('DEBUG: Set', (fetchedMeetings || []).length, 'meetings for user', userId);
    } catch (err) {
      console.error('ERROR: Failed to fetch meetings:', err);
      setError(err.message);
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchCourses = useCallback(async () => {
    if (!userId) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      let fetchedCourses;
      if (userRole === 'lecturer' || userRole === '1200') {
        fetchedCourses = await courseApi.getLecturerCourses();
      } else {
        fetchedCourses = await courseApi.getStudentCourses();
      }
      setCourses(fetchedCourses || []);
      console.log('DEBUG: Set', (fetchedCourses || []).length, 'courses for user', userId);
    } catch (err) {
      console.error('ERROR: Failed to fetch courses:', err);
      setError(err.message);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [userId, userRole]);

  const createMeeting = useCallback(async (meetingData) => {
    if (!userId) throw new Error('User not authenticated');
    
    try {
      setLoading(true);
      setError(null);
      if (!meetingData.roomId) {
        meetingData.roomId = generateRoomId({
          type: meetingData.type || 'scheduled',
          courseId: meetingData.courseId
        });
      }
      const newMeeting = await meetingApi.createMeeting({
        ...meetingData,
        createdBy: userId,
        status: meetingData.status || 'scheduled'
      });
      setMeetings(prev => [newMeeting, ...prev]);
      return newMeeting;
    } catch (err) {
      console.error('ERROR: Failed to create meeting:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const joinMeeting = useCallback(async (meetingId, joinData = {}) => {
    if (!userId) throw new Error('User not authenticated');
    
    try {
      const joinResponse = await meetingApi.joinMeeting(meetingId, {
        ...joinData,
        userId: userId,
        userName: userName
      });
      return joinResponse;
    } catch (err) {
      console.error('ERROR: Failed to join meeting:', err);
      throw err;
    }
  }, [userId, userName]);

  const leaveMeeting = useCallback(async (meetingId, sessionId) => {
    if (!userId) return;
    
    try {
      await meetingApi.leaveMeeting(meetingId, sessionId);
    } catch (err) {
      console.error('ERROR: Failed to record meeting leave:', err);
    }
  }, [userId]);

  const createInstantMeeting = useCallback(() => {
    if (!userId) throw new Error('User not authenticated');
    
    const roomId = generateRoomId({ type: 'instant' });
    const finalUserName = userName || 'User';
    openMeetingInNewTab({
      roomId,
      userId: userId,
      userName: finalUserName,
      title: 'Instant Meeting'
    });
    return roomId;
  }, [userId, userName]);

  const joinMeetingFromLink = useCallback((invitationLink, providedUserName) => {
    if (!userId) throw new Error('User not authenticated');
    const meetingInfo = parseInvitationLink(invitationLink);
    if (!meetingInfo) {
      throw new Error('Invalid invitation link');
    }
    const finalUserName = providedUserName || userName || 'User';
    openMeetingInNewTab({
      roomId: meetingInfo.roomId,
      userId: userId,
      userName: finalUserName,
      title: meetingInfo.title,
      courseId: meetingInfo.courseId,
      meetingId: meetingInfo.meetingId
    });
    return meetingInfo;
  }, [userId, userName]);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    if (userId) {
      fetchMeetings();
      fetchCourses();
    } else {
      setMeetings([]);
      setCourses([]);
    }
  }, [userId, fetchMeetings, fetchCourses]);

  return {
    meetings,
    courses,
    loading,
    error,
    user: authData,
    fetchMeetings,
    fetchCourses,
    createMeeting,
    joinMeeting,
    leaveMeeting,
    createInstantMeeting,
    joinMeetingFromLink,
    clearError
  };
};

export const useMeetingForm = (initialData = {}, validationRules = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const initialDataRef = useRef(initialData);
  const validationRulesRef = useRef(validationRules);

  useEffect(() => {
    initialDataRef.current = initialData;
    validationRulesRef.current = validationRules;
    setFormData(initialData);
  }, [initialData, validationRules]);

  const updateField = useCallback((name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => {
      if (prev[name]) {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const validateForm = useCallback(() => {
    const requiredFields = Object.keys(validationRulesRef.current).filter(
      field => validationRulesRef.current[field]?.required
    );
    const validation = validateMeetingForm(formData, requiredFields);
    setErrors(validation.errors);
    return validation.isValid;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(initialDataRef.current);
    setErrors({});
    setLoading(false);
  }, []);

  const submitForm = useCallback((onSubmit) => {
    return async () => {
      if (!validateForm()) {
        return false;
      }
      setLoading(true);
      try {
        await onSubmit(formData);
        return true;
      } catch (error) {
        console.error('ERROR: Form submission failed:', error);
        setErrors({ submit: error.message });
        return false;
      } finally {
        setLoading(false);
      }
    };
  }, [formData, validateForm]);

  return {
    formData,
    errors,
    loading,
    updateField,
    validateForm,
    resetForm,
    submitForm,
    setErrors
  };
};

export const useMeetingAttendance = (meetingId) => {
  const { authData } = useAuth();
  const [attendanceData, setAttendanceData] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const sessionRef = useRef(null);
  const isJoiningRef = useRef(false);
  const hasJoinedRef = useRef(false);
  const mountedRef = useRef(true);

  const fetchAttendance = useCallback(async () => {
    if (!meetingId || !mountedRef.current) {
      return;
    }
    try {
      setLoading(true);
      const attendance = await meetingApi.getMeetingAttendance(meetingId);
      if (mountedRef.current) {
        setAttendanceData(attendance);
      }
    } catch (error) {
      console.error('ERROR: Failed to fetch attendance:', error);
      if (mountedRef.current) {
        setAttendanceData([]);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [meetingId]);

  const startAttendanceSession = useCallback(async () => {
    if (!meetingId || !authData?.id || currentSession || isJoiningRef.current || hasJoinedRef.current || !mountedRef.current) {
      return currentSession || sessionRef.current;
    }
    try {
      isJoiningRef.current = true;
      let session;
      try {
        const recentSessionCheck = await meetingApi.checkRecentSession(meetingId, authData.id);
        if (recentSessionCheck && recentSessionCheck.canResume && mountedRef.current) {
          session = await meetingApi.resumeSession(meetingId, recentSessionCheck.sessionId);
        } else if (mountedRef.current) {
          session = await meetingApi.joinMeeting(meetingId, {
            userId: authData.id,
            userName: authData.name || authData.username || 'User'
          });
        }
      } catch (resumeError) {
        if (mountedRef.current) {
          session = await meetingApi.joinMeeting(meetingId, {
            userId: authData.id,
            userName: authData.name || authData.username || 'User'
          });
        }
      }
      if (session && mountedRef.current) {
        setCurrentSession(session);
        sessionRef.current = session;
        hasJoinedRef.current = true;
      }
      return session;
    } catch (error) {
      console.error('ERROR: Failed to start attendance session:', error);
      throw error;
    } finally {
      isJoiningRef.current = false;
    }
  }, [meetingId, authData?.id, authData?.name, authData?.username, currentSession]);

  const endAttendanceSession = useCallback(async () => {
    const session = currentSession || sessionRef.current;
    if (!meetingId || !session?.id || !mountedRef.current) {
      return;
    }
    try {
      await meetingApi.leaveMeeting(meetingId, session.id);
      if (mountedRef.current) {
        setCurrentSession(null);
        sessionRef.current = null;
        hasJoinedRef.current = false;
        await fetchAttendance();
      }
    } catch (error) {
      console.error('ERROR: Failed to end attendance session:', error);
      if (mountedRef.current) {
        setCurrentSession(null);
        sessionRef.current = null;
        hasJoinedRef.current = false;
      }
    }
  }, [meetingId, currentSession, fetchAttendance]);

  const calculateUserAttendance = useCallback((userId) => {
    if (!attendanceData || !Array.isArray(attendanceData)) return 0;
    const userSessions = attendanceData.filter(session => session.userId === userId);
    const totalAttended = calculateTotalAttendanceTime(userSessions);
    return calculateAttendancePercentage(totalAttended, 60);
  }, [attendanceData]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (sessionRef.current && hasJoinedRef.current && meetingId) {
        const session = sessionRef.current;
        try {
          const leaveData = new Blob([JSON.stringify({
            sessionId: session.id,
            leaveTime: new Date().toISOString(),
            reason: 'hook_unmount',
            token: getToken() // Added token to beacon data
          })], { type: 'application/json' });
          navigator.sendBeacon(
            `${API_BASE_URL}/api/meetings/${meetingId}/leave`,
            leaveData
          );
        } catch (error) {
          console.warn('Failed to send leave beacon:', error);
        }
        sessionRef.current = null;
        hasJoinedRef.current = false;
      }
    };
  }, [meetingId]);

  useEffect(() => {
    if (meetingId) {
      fetchAttendance();
    }
  }, [meetingId, fetchAttendance]);

  return {
    attendanceData,
    currentSession,
    loading,
    fetchAttendance,
    startAttendanceSession,
    endAttendanceSession,
    calculateUserAttendance
  };
};

export const useZegoMeeting = (roomId, userId, userName, meetingTitle, courseId, meetingId) => {
  const [zegoInstance, setZegoInstance] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionState, setConnectionState] = useState('DISCONNECTED');
  const meetingRef = useRef(null);
  const instanceRef = useRef(null);
  const initializingRef = useRef(false);
  const mountedRef = useRef(true);
  const joinAttemptRef = useRef(0);
  const maxRetries = 3;
  const APP_ID = parseInt(process.env.REACT_APP_ZEGO_APP_ID) || 1026475955;
  const SERVER_SECRET = process.env.REACT_APP_ZEGO_SERVER_SECRET || "6db4503eb3a9a1636cc2bdc0523e25de";

  const initializeZego = useCallback(async () => {
    if (!roomId || !userId || !userName || !meetingRef.current || initializingRef.current || !mountedRef.current) {
      return;
    }

    try {
      initializingRef.current = true;
      joinAttemptRef.current += 1;
      if (mountedRef.current) {
        setLoading(true);
        setError(null);
        setConnectionState('CONNECTING');
      }
      if (instanceRef.current) {
        try {
          if (typeof instanceRef.current.leaveRoom === 'function') {
            instanceRef.current.leaveRoom();
          }
          if (typeof instanceRef.current.destroy === 'function') {
            instanceRef.current.destroy();
          }
        } catch (cleanupError) {
          console.warn('Error cleaning up previous instance:', cleanupError);
        }
        instanceRef.current = null;
      }
      let ZegoUIKitPrebuilt;
      try {
        const importPromise = import('@zegocloud/zego-uikit-prebuilt');
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Import timeout')), 10000)
        );
        const zegoModule = await Promise.race([importPromise, timeoutPromise]);
        ZegoUIKitPrebuilt = zegoModule.ZegoUIKitPrebuilt;
        if (!ZegoUIKitPrebuilt) {
          throw new Error('ZegoUIKitPrebuilt not found in module');
        }
      } catch (importError) {
        console.error('Failed to import ZegoCloud SDK:', importError);
        throw new Error('Failed to load video meeting library. Please refresh the page.');
      }

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        APP_ID,
        SERVER_SECRET,
        roomId,
        userId,
        userName
      );
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      if (mountedRef.current) {
        setZegoInstance(zp);
        instanceRef.current = zp;
      }

      const config = {
        container: meetingRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
        showPreJoinView: false,
        showLeavingView: false,
        turnOnMicrophoneWhenJoining: false,
        turnOnCameraWhenJoining: false,
        showMyCameraToggleButton: true,
        showMyMicrophoneToggleButton: true,
        showAudioVideoSettingsButton: true,
        showScreenSharingButton: true,
        showTextChat: true,
        showUserList: true,
        maxUsers: 100,
        layout: "Auto",
        showLayoutButton: true,
        sharedLinks: [
          {
            name: 'Join Meeting',
            url: generateInvitationLink({
              roomId,
              title: meetingTitle || 'Video Meeting',
              courseId: courseId,
              meetingId: meetingId,
              baseUrl: window.location.origin
            })
          }
        ],
        onJoinRoom: () => {
          if (mountedRef.current) {
            setIsConnected(true);
            setConnectionState('CONNECTED');
            setLoading(false);
            setError(null);
          }
        },
        onLeaveRoom: () => {
          if (mountedRef.current) {
            setIsConnected(false);
            setConnectionState('DISCONNECTED');
          }
          setTimeout(() => {
            if (window.opener) {
              window.close();
            } else {
              window.history.back();
            }
          }, 100);
        },
        onUserUpdate: (users) => {
          if (mountedRef.current) {
            setParticipants(users || []);
            console.log(`👥 Participants updated: ${(users || []).length} users`);
          }
        },
        onConnectionStateChanged: (state) => {
          if (mountedRef.current) {
            setConnectionState(state);
            if (state === 'CONNECTED') {
              setIsConnected(true);
              setError(null);
              setLoading(false);
            } else if (state === 'DISCONNECTED') {
              setIsConnected(false);
            } else if (state === 'RECONNECTING') {
            }
          }
        },
        onError: (error) => {
          console.error('❌ ZegoCloud error:', error);
          if (mountedRef.current) {
            if (error.code && !['NETWORK_ERROR', 'RECONNECT_FAILED'].includes(error.code)) {
              setError(error.message || 'Meeting error occurred');
              setLoading(false);
            }
            if (error.code === 'NETWORK_ERROR') {
              setConnectionState('RECONNECTING');
            }
          }
        },
        timeout: 30000
      };

      const joinPromise = zp.joinRoom(config);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Join room timeout')), 30000)
      );
      await Promise.race([joinPromise, timeoutPromise]);
    } catch (err) {
      console.error('❌ Failed to initialize ZegoCloud:', err);
      if (mountedRef.current) {
        const errorMessage = err.message || 'Failed to initialize meeting';
        setError(errorMessage);
        setConnectionState('FAILED');
        setLoading(false);
        if (joinAttemptRef.current < maxRetries &&
            (err.message?.includes('timeout') || err.message?.includes('network'))) {
          console.log(`DEBUG: Retrying ZegoCloud init (attempt ${joinAttemptRef.current + 1}/${maxRetries})`);
          setTimeout(() => {
            if (mountedRef.current) {
              initializeZego();
            }
          }, 2000 * joinAttemptRef.current);
        }
      }
    } finally {
      initializingRef.current = false;
    }
  }, [roomId, userId, userName, meetingTitle, courseId, meetingId, APP_ID, SERVER_SECRET]);

  const cleanup = useCallback(() => {
    if (instanceRef.current) {
      try {
        if (typeof instanceRef.current.leaveRoom === 'function') {
          instanceRef.current.leaveRoom();
        }
        setTimeout(() => {
          try {
            if (instanceRef.current && typeof instanceRef.current.destroy === 'function') {
              instanceRef.current.destroy();
            }
          } catch (error) {
            console.warn('Error destroying ZegoCloud instance:', error);
          }
          instanceRef.current = null;
        }, 100);
      } catch (error) {
        console.warn('Error during ZegoCloud cleanup:', error);
        instanceRef.current = null;
      }
    }
    if (mountedRef.current) {
      setZegoInstance(null);
      setIsConnected(false);
      setParticipants([]);
      setConnectionState('DISCONNECTED');
    }
    initializingRef.current = false;
  }, []);

  const leaveMeeting = useCallback(() => {
    if (mountedRef.current) {
      setIsConnected(false);
      setConnectionState('DISCONNECTING');
      setLoading(true);
    }
    cleanup();
    setTimeout(() => {
      if (window.opener) {
        window.close();
      } else {
        window.history.back();
      }
    }, 200);
  }, [cleanup]);

  useEffect(() => {
    if (roomId && userId && userName && meetingRef.current && mountedRef.current) {
      const timeoutId = setTimeout(() => {
        if (mountedRef.current) {
          initializeZego();
        }
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [roomId, userId, userName, meetingTitle, courseId, meetingId, initializeZego]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (instanceRef.current) {
        try {
          if (typeof instanceRef.current.leaveRoom === 'function') {
            instanceRef.current.leaveRoom();
          }
          setTimeout(() => {
            try {
              if (instanceRef.current && typeof instanceRef.current.destroy === 'function') {
                instanceRef.current.destroy();
              }
            } catch (error) {
              console.warn('Error destroying ZegoCloud on unmount:', error);
            }
            instanceRef.current = null;
          }, 50);
        } catch (error) {
          console.warn('Error during unmount cleanup:', error);
        }
      }
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (instanceRef.current) {
        try {
          instanceRef.current.leaveRoom?.();
          instanceRef.current.destroy?.();
        } catch (error) {
        }
        instanceRef.current = null;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return {
    zegoInstance,
    isConnected,
    participants,
    loading,
    error,
    connectionState,
    meetingRef,
    leaveMeeting,
    reinitialize: initializeZego
  };
};

export const useCourseAnalytics = (courseId) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async (filters = {}) => {
    if (!courseId) return;
    try {
      setLoading(true);
      setError(null);
      const analyticsData = await courseApi.getCourseAnalytics(courseId, filters);
      setAnalytics(analyticsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics
  };
};