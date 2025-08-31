import axios from 'axios';

const API_BASE_URL = 'http://13.61.114.153:8082/api';

// Helper function to get token from localStorage
const getToken = () => {
    return localStorage.getItem("jwtToken");
};

// Helper function to get authorization headers
const getAuthHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Create axios config with auth headers
const createAuthConfig = (additionalConfig = {}) => {
    return {
        ...additionalConfig,
        headers: {
            ...getAuthHeaders(),
            ...additionalConfig.headers
        }
    };
};

const api = axios.create({
  baseURL: API_BASE_URL,
});

// --- User Endpoints ---
export const fetchAdmins = async () => {
  const response = await api.get('/users/role/1100', createAuthConfig());
  return response.data;
};

export const fetchLecturers = async () => {
  const response = await api.get('/users/role/1200', createAuthConfig());
  return response.data;
};

export const fetchUsersByRole = async (roleCode) => {
    const response = await api.get(`/users/role/${roleCode}`, createAuthConfig());
    return response.data;
};

// --- Messages Endpoints ---

export const fetchReceivedMessages = async () => {
  const response = await api.get('/messages/received', createAuthConfig());
  return response.data;
};

export const fetchSentMessages = async () => {
  const response = await api.get('/messages/sent', createAuthConfig());
  return response.data;
};

export const fetchMessageById = async (messageId) => {
  const response = await api.get(`/messages/${messageId}`, createAuthConfig());
  return response.data;
};

export const createMessage = async (messageData) => {
  const response = await api.post('/messages', messageData, createAuthConfig());
  return response.data;
};

export const sendMessageReply = async (messageId, replyData) => {
  const response = await api.post(`/messages/${messageId}/reply`, replyData, createAuthConfig());
  return response.data;
};

// --- Announcements Endpoints ---

export const fetchAnnouncements = async () => {
  const response = await api.get('/announcements', createAuthConfig());
  return response.data;
};

export const fetchAnnouncementById = async (announcementId) => {
  const response = await api.get(`/announcements/${announcementId}`, createAuthConfig());
  return response.data;
};

export const createAnnouncement = async (announcementData) => {
  const response = await api.post('/announcements', announcementData, createAuthConfig());
  return response.data;
};

export const updateAnnouncement = async (announcementId, announcementData) => {
  const response = await api.put(`/announcements/${announcementId}`, announcementData, createAuthConfig());
  return response.data;
};

export const duplicateAnnouncement = async (announcementId, announcementData) => {
  const response = await api.post(`/announcements/${announcementId}/duplicate`, announcementData, createAuthConfig());
  return response.data;
};

export const deleteAnnouncement = async (announcementId) => {
  const response = await api.delete(`/announcements/${announcementId}`, createAuthConfig());
  return response.data;
};

// --- Templates Endpoints ---

export const fetchTemplates = async () => {
  const response = await api.get('/templates', createAuthConfig());
  return response.data;
};

export const fetchTemplateById = async (templateId) => {
  const response = await api.get(`/templates/${templateId}`, createAuthConfig());
  return response.data;
};

export const createTemplate = async (templateData) => {
  const response = await api.post('/templates', templateData, createAuthConfig());
  return response.data;
};

export const updateTemplate = async (templateId, templateData) => {
  const response = await api.put(`/templates/${templateId}`, templateData, createAuthConfig());
  return response.data;
};

export const useTemplate = async (templateId, templateData) => {
  const response = await api.post(`/templates/${templateId}/use`, templateData, createAuthConfig());
  return response.data;
};

export const deleteTemplate = async (templateId) => {
  const response = await api.delete(`/templates/${templateId}`, createAuthConfig());
  return response.data;
};

// --- Files Endpoints ---

export const fetchFiles = async () => {
  const response = await api.get('/files', createAuthConfig());
  return response.data;
};

export const fetchFileById = async (fileId) => {
  const response = await api.get(`/files/${fileId}`, createAuthConfig());
  return response.data;
};

export const uploadFile = async (file, fileMetadata) => {
  const formData = new FormData();
  formData.append('file', file);
  for (const key in fileMetadata) {
    if (Object.prototype.hasOwnProperty.call(fileMetadata, key)) {
      formData.append(key, fileMetadata[key]);
    }
  }

  const response = await api.post('/files/upload', formData, createAuthConfig({
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }));
  return response.data;
};

export const deleteFile = async (fileId) => {
  const response = await api.delete(`/files/${fileId}`, createAuthConfig());
  return response.data;
};