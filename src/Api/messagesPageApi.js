import {
  messagesData,
  announcementsData,
  fullAnnouncementsData,
  templatesData,
  fullTemplatesData,
} from "../Static/messagesPageData.js";

// Fetch all messages
export const fetchMessages = async () => {
  try {
    return messagesData;
  } catch (error) {
    throw new Error("Failed to fetch messages");
  }
};

// Fetch message by ID
export const fetchMessageById = async (messageId) => {
  try {
    const message = messagesData.find((msg) => msg.id === parseInt(messageId));
    if (!message) {
      throw new Error(`Message with ID ${messageId} not found`);
    }
    return message;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Send reply to a message
export const sendMessageReply = async (messageId, replyData) => {
  try {
    return { messageId, ...replyData };
  } catch (error) {
    throw new Error("Failed to send reply");
  }
};

// Fetch all announcements
export const fetchAnnouncements = async () => {
  try {
    return announcementsData;
  } catch (error) {
    throw new Error("Failed to fetch announcements");
  }
};

// Fetch full announcement by ID
export const fetchFullAnnouncementById = async (announcementId) => {
  try {
    const announcement = fullAnnouncementsData.find((ann) => ann.id === parseInt(announcementId));
    if (!announcement) {
      throw new Error(`Announcement with ID ${announcementId} not found`);
    }
    return announcement;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Create a new announcement
export const createAnnouncement = async (announcementData) => {
  try {
    const newId = Math.max(...announcementsData.map((a) => a.id), 0) + 1;
    const currentDate = new Date().toISOString().split("T")[0];
    const currentTime = new Date().toTimeString().split(" ")[0].substring(0, 5);
    const newAnnouncement = {
      id: newId,
      ...announcementData,
      createdDate: currentDate,
      createdTime: currentTime,
    };
    return newAnnouncement;
  } catch (error) {
    throw new Error("Failed to create announcement");
  }
};

// Update an existing announcement
export const updateAnnouncement = async (announcementId, announcementData) => {
  try {
    const announcement = fullAnnouncementsData.find((ann) => ann.id === parseInt(announcementId));
    if (!announcement) {
      throw new Error(`Announcement with ID ${announcementId} not found`);
    }
    return { ...announcement, ...announcementData };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Fetch all templates
export const fetchTemplates = async () => {
  try {
    return templatesData;
  } catch (error) {
    throw new Error("Failed to fetch templates");
  }
};

// Fetch full template by ID
export const fetchFullTemplateById = async (templateId) => {
  try {
    const template = fullTemplatesData.find((tpl) => tpl.id === parseInt(templateId));
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }
    return template;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Create a new template
export const createTemplate = async (templateData) => {
  try {
    const newId = Math.max(...templatesData.map((t) => t.id), 0) + 1;
    const currentDate = new Date().toISOString().split("T")[0];
    const newTemplate = {
      id: newId,
      ...templateData,
      createdDate: currentDate,
      lastModified: currentDate,
    };
    return newTemplate;
  } catch (error) {
    throw new Error("Failed to create template");
  }
};

// Update an existing template
export const updateTemplate = async (templateId, templateData) => {
  try {
    const template = fullTemplatesData.find((tpl) => tpl.id === parseInt(templateId));
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }
    return { ...template, ...templateData, lastModified: new Date().toISOString().split("T")[0] };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Use a template
export const useTemplate = async (templateId, templateData) => {
  try {
    const template = fullTemplatesData.find((tpl) => tpl.id === parseInt(templateId));
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }
    return { templateId, ...templateData };
  } catch (error) {
    throw new Error("Failed to use template");
  }
};