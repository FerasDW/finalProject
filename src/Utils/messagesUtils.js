export const getFullMessageById = (id, messages) => {
  return messages.find((message) => message.id === id);
};

export const getFullAnnouncementById = (id, announcements) => {
  return announcements.find((announcement) => announcement.id === id);
};

export const getFullTemplateById = (id, templates) => {
  return templates.find((template) => template.id === id);
};