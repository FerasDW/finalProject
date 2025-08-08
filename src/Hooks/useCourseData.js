// Hooks/useCourseData.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { getCourseById } from '../Api/coursePageApi.js';
import { getAllLecturers } from '../Api/dashboardPageApi.js';
import { getAllDepartments } from '../Api/coursePageApi.js';
import { getAcademicYearOptionsForDepartment } from '../Utils/courseUtils.js';

const useCourseData = (courseId, initialCourseData = null) => {
  console.log("🔧 useCourseData hook initialized with:", { courseId, hasInitialData: !!initialCourseData });
  
  const [courseData, setCourseData] = useState(initialCourseData);
  const [lecturers, setLecturers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [loading, setLoading] = useState(!initialCourseData);
  const [error, setError] = useState(null);
  
  // Use ref to track if fetch is in progress to prevent duplicate calls
  const fetchInProgressRef = useRef(false);
  
  // Use ref to track the last courseId to prevent unnecessary fetches
  const lastCourseIdRef = useRef(courseId);

  const fetchData = useCallback(async () => {
    console.log("🔧 fetchData called in useCourseData");
    
    // Prevent duplicate fetches
    if (fetchInProgressRef.current) {
      console.log("🔄 Fetch already in progress, skipping...");
      return;
    }
    
    if (!courseId) {
      console.log("❌ No courseId provided");
      setLoading(false);
      return;
    }

    // If courseId hasn't changed and we already have data, skip fetch
    if (courseId === lastCourseIdRef.current && courseData && lecturers.length > 0) {
      console.log("📋 Data already available for this courseId, skipping fetch");
      setLoading(false);
      return;
    }

    try {
      fetchInProgressRef.current = true;
      setLoading(true);
      setError(null);
      console.log("📡 Starting data fetch...");

      // Fetch course data, lecturers, and departments in parallel
      const fetchPromises = [
        initialCourseData ? Promise.resolve(initialCourseData) : getCourseById(courseId),
        getAllLecturers(),
        getAllDepartments()
      ];

      console.log("📡 Executing parallel API calls...");
      const [courseResponse, allUsersResponse, departmentsResponse] = await Promise.all(fetchPromises);

      console.log("📡 API responses received:");
      console.log("- Course:", courseResponse?.name || 'Unknown');
      console.log("- All users:", allUsersResponse?.length || 0);
      console.log("- Departments:", departmentsResponse?.length || 0);

      // Filter lecturers to only those with role 1200
      const filteredLecturers = allUsersResponse?.filter(user => user.role === "1200") || [];
      console.log("👨‍🏫 Filtered lecturers (role 1200):", filteredLecturers.length);
      
      setLecturers(filteredLecturers);
      setDepartments(departmentsResponse || []);

      // If we have course data, enhance it with lecturer information
      if (courseResponse) {
        console.log("🔧 Processing course data...");
        
        const lecturer = filteredLecturers.find(l => l.id === courseResponse.lecturerId);
        console.log("👨‍🏫 Found lecturer for course:", lecturer?.name || 'Not found');

        // Transform course data to include lecturer information and preserve original structure
        const enhancedCourseData = {
          ...courseResponse,
          lecturerName: lecturer ? lecturer.name : 'Unknown Lecturer',
          lecturer: lecturer || null,
          // Preserve existing fields for compatibility
          title: courseResponse.name || courseResponse.title,
          instructorName: lecturer ? lecturer.name : 'Unknown Lecturer',
          // Ensure enrollments array exists
          enrollments: courseResponse.enrollments || []
        };

        console.log("✅ Enhanced course data:", enhancedCourseData.name);
        setCourseData(enhancedCourseData);

        // Generate academic year options for the course's department
        if (courseResponse.department && departmentsResponse?.length > 0) {
          console.log("🔧 Generating academic year options for department:", courseResponse.department);
          
          const yearOptions = getAcademicYearOptionsForDepartment(
            courseResponse.department, 
            departmentsResponse
          );
          
          console.log("📚 Academic year options:", yearOptions);
          setAcademicYearOptions(yearOptions);
        }
      }

      // Update the last courseId ref
      lastCourseIdRef.current = courseId;

    } catch (err) {
      console.error('❌ Error fetching course data:', err);
      setError(err);
    } finally {
      setLoading(false);
      fetchInProgressRef.current = false;
      console.log("✅ useCourseData fetch completed");
    }
  }, [courseId, initialCourseData]);

  useEffect(() => {
    // Only fetch if courseId has changed or we don't have data
    if (courseId !== lastCourseIdRef.current || (!courseData && !fetchInProgressRef.current)) {
      console.log("🚀 Effect triggered - courseId changed or no data available");
      fetchData();
    }
  }, [fetchData]);

  const refetch = useCallback(() => {
    console.log("🔄 Refetch called for courseId:", courseId);
    if (courseId) {
      // Reset refs to force a fresh fetch
      lastCourseIdRef.current = null;
      fetchInProgressRef.current = false;
      setCourseData(null);
      setLoading(true);
      setError(null);
      fetchData();
    }
  }, [courseId, fetchData]);

  const returnValue = {
    courseData,
    lecturers,
    departments,
    academicYearOptions,
    loading,
    error,
    refetch
  };

  console.log("🔧 useCourseData returning:", {
    courseData: !!returnValue.courseData,
    lecturersCount: returnValue.lecturers.length,
    departmentsCount: returnValue.departments.length,
    academicYearOptionsCount: returnValue.academicYearOptions.length,
    loading: returnValue.loading,
    error: !!returnValue.error
  });

  return returnValue;
};

export default useCourseData;