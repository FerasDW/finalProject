import { useState } from "react";
import {
  messagesData,
  announcementsData,
  fullAnnouncementsData,
  targetAudienceOptions,
  templatesData,
  fullTemplatesData,
} from "../Static/messagesPageData.js";
import { getFullMessageById, getFullAnnouncementById, getFullTemplateById } from "../Utils/messagesUtils.js";

const useMessages = () => {
  const [activeSection, setActiveSection] = useState("requests");
  const [selectedYear, setSelectedYear] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [createAnnouncementModalOpen, setCreateAnnouncementModalOpen] = useState(false);
  const [editAnnouncementModalOpen, setEditAnnouncementModalOpen] = useState(false);
  const [viewAnnouncementModalOpen, setViewAnnouncementModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [announcementFormData, setAnnouncementFormData] = useState({});
  const [currentAnnouncements, setCurrentAnnouncements] = useState(announcementsData);
  const [currentFullAnnouncements, setCurrentFullAnnouncements] = useState(fullAnnouncementsData);
  const [createTemplateModalOpen, setCreateTemplateModalOpen] = useState(false);
  const [editTemplateModalOpen, setEditTemplateModalOpen] = useState(false);
  const [viewTemplateModalOpen, setViewTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateFormData, setTemplateFormData] = useState({});
  const [currentTemplates, setCurrentTemplates] = useState(templatesData);
  const [currentFullTemplates, setCurrentFullTemplates] = useState(fullTemplatesData);
  const [useTemplateModalOpen, setUseTemplateModalOpen] = useState(false);
  const [useTemplateFields, setUseTemplateFields] = useState([]);
  const [useTemplateFormTitle, setUseTemplateFormTitle] = useState("");

  const handleViewMessage = (row) => {
    const fullMessage = getFullMessageById(row.id, messagesData);
    setSelectedMessage(fullMessage);
    setViewModalOpen(true);
  };

  const handleReply = (row) => {
    const fullMessage = getFullMessageById(row.id, messagesData);
    setSelectedMessage(fullMessage);
    setReplyModalOpen(true);
  };

  const handleCreateAnnouncement = () => {
    setSelectedAnnouncement(null);
    setAnnouncementFormData({});
    setCreateAnnouncementModalOpen(true);
  };

  const handleViewAnnouncement = (row) => {
    const fullAnnouncement = getFullAnnouncementById(row.id, currentFullAnnouncements);
    if (fullAnnouncement) {
      setSelectedAnnouncement(fullAnnouncement);
      setViewAnnouncementModalOpen(true);
    } else {
      console.error("Announcement not found:", row.id);
    }
  };

  const handleEditAnnouncement = (row) => {
    const fullAnnouncement = getFullAnnouncementById(row.id, currentFullAnnouncements);
    if (fullAnnouncement) {
      setSelectedAnnouncement(fullAnnouncement);
      const formData = {
        title: fullAnnouncement.title,
        content: fullAnnouncement.content,
        targetAudienceType: fullAnnouncement.targetAudienceType,
        priority: fullAnnouncement.priority,
        expiryDate: fullAnnouncement.expiryDate,
        scheduledDate: fullAnnouncement.scheduledDate || "",
      };
      setAnnouncementFormData(formData);
      setEditAnnouncementModalOpen(true);
    } else {
      console.error("Announcement not found for editing:", row.id);
    }
  };

  const handleAnnouncementSubmit = (formData) => {
    console.log("Announcement submitted:", formData);

    if (selectedAnnouncement) {
      const updatedFullAnnouncement = {
        ...selectedAnnouncement,
        title: formData.title,
        content: formData.content,
        targetAudience: targetAudienceOptions.find((opt) => opt.value === formData.targetAudienceType)?.label || formData.targetAudienceType,
        targetAudienceType: formData.targetAudienceType,
        priority: formData.priority,
        expiryDate: formData.expiryDate,
        scheduledDate: formData.scheduledDate || null,
        status: formData.scheduledDate ? "scheduled" : "active",
      };

      setCurrentFullAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement.id === selectedAnnouncement.id ? updatedFullAnnouncement : announcement
        )
      );

      setCurrentAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement.id === selectedAnnouncement.id
            ? {
                id: announcement.id,
                title: formData.title,
                targetAudience: targetAudienceOptions.find((opt) => opt.value === formData.targetAudienceType)?.label || formData.targetAudienceType,
                priority: formData.priority,
                status: formData.scheduledDate ? "scheduled" : "active",
                createdDate: announcement.createdDate,
              }
            : announcement
        )
      );
      setEditAnnouncementModalOpen(false);
    } else {
      const newId = Math.max(...currentAnnouncements.map((a) => a.id), 0) + 1;
      const currentDate = new Date().toISOString().split("T")[0];
      const currentTime = new Date().toTimeString().split(" ")[0].substring(0, 5);

      const newFullAnnouncement = {
        id: newId,
        title: formData.title,
        content: formData.content,
        targetAudience: targetAudienceOptions.find((opt) => opt.value === formData.targetAudienceType)?.label || formData.targetAudienceType,
        targetAudienceType: formData.targetAudienceType,
        priority: formData.priority,
        status: formData.scheduledDate ? "scheduled" : "active",
        createdDate: currentDate,
        createdTime: currentTime,
        expiryDate: formData.expiryDate,
        scheduledDate: formData.scheduledDate || null,
      };

      const newTableAnnouncement = {
        id: newId,
        title: formData.title,
        targetAudience: targetAudienceOptions.find((opt) => opt.value === formData.targetAudienceType)?.label || formData.targetAudienceType,
        priority: formData.priority,
        status: formData.scheduledDate ? "scheduled" : "active",
        createdDate: currentDate,
      };

      setCurrentFullAnnouncements((prev) => [newFullAnnouncement, ...prev]);
      setCurrentAnnouncements((prev) => [newTableAnnouncement, ...prev]);
      setCreateAnnouncementModalOpen(false);
    }

    setAnnouncementFormData({});
    setSelectedAnnouncement(null);
  };

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setTemplateFormData({});
    setCreateTemplateModalOpen(true);
  };

  const handleViewTemplate = (row) => {
    const fullTemplate = getFullTemplateById(row.id, currentFullTemplates);
    if (fullTemplate) {
      setSelectedTemplate(fullTemplate);
      setViewTemplateModalOpen(true);
    }
  };

  const handleEditTemplate = (row) => {
    const fullTemplate = getFullTemplateById(row.id, currentFullTemplates);
    if (fullTemplate) {
      setSelectedTemplate(fullTemplate);
      const formData = {
        name: fullTemplate.name,
        category: fullTemplate.category,
        subject: fullTemplate.subject,
        content: fullTemplate.content,
        variables: fullTemplate.variables.join(", "),
        targetAudience: fullTemplate.targetAudience,
        status: fullTemplate.status,
      };
      setTemplateFormData(formData);
      setEditTemplateModalOpen(true);
    }
  };

  const handleTemplateSubmit = (formData) => {
    const variablesArray = formData.variables
      ? formData.variables.split(",").map((v) => v.trim()).filter((v) => v)
      : [];

    if (selectedTemplate) {
      const updatedFullTemplate = {
        ...selectedTemplate,
        name: formData.name,
        category: formData.category,
        subject: formData.subject,
        content: formData.content,
        variables: variablesArray,
        targetAudience: formData.targetAudience,
        status: formData.status,
        lastModified: new Date().toISOString().split("T")[0],
      };

      setCurrentFullTemplates((prev) =>
        prev.map((template) =>
          template.id === selectedTemplate.id ? updatedFullTemplate : template
        )
      );

      setCurrentTemplates((prev) =>
        prev.map((template) =>
          template.id === selectedTemplate.id
            ? {
                id: template.id,
                name: formData.name,
                category: formData.category,
                targetAudience: formData.targetAudience,
                status: formData.status,
                lastModified: new Date().toISOString().split("T")[0],
              }
            : template
        )
      );
      setEditTemplateModalOpen(false);
    } else {
      const newId = Math.max(...currentTemplates.map((t) => t.id), 0) + 1;
      const currentDate = new Date().toISOString().split("T")[0];

      const newFullTemplate = {
        id: newId,
        name: formData.name,
        category: formData.category,
        subject: formData.subject,
        content: formData.content,
        variables: variablesArray,
        targetAudience: formData.targetAudience,
        createdDate: currentDate,
        lastModified: currentDate,
        status: formData.status,
      };

      const newTableTemplate = {
        id: newId,
        name: formData.name,
        category: formData.category,
        targetAudience: formData.targetAudience,
        status: formData.status,
        lastModified: currentDate,
      };

      setCurrentFullTemplates((prev) => [newFullTemplate, ...prev]);
      setCurrentTemplates((prev) => [newTableTemplate, ...prev]);
      setCreateTemplateModalOpen(false);
    }

    setTemplateFormData({});
    setSelectedTemplate(null);
  };

  const handleUseTemplate = (row) => {
    const fullTemplate = getFullTemplateById(row.id, currentFullTemplates);
    if (!fullTemplate) return;

    const content = fullTemplate.content;
    const variableMatches = content.match(/\{([^}]+)\}/g) || [];
    const uniqueVariables = [...new Set(variableMatches.map((v) => v.replace(/[{}]/g, "").trim()))];

    const dynamicFields = uniqueVariables.map((variable) => ({
      name: variable,
      label: variable.charAt(0).toUpperCase() + variable.slice(1),
      type: "text",
      required: true,
    }));

    setUseTemplateFormTitle(fullTemplate.name);
    setUseTemplateFields(dynamicFields);
    setUseTemplateModalOpen(true);
  };

  return {
    activeSection,
    setActiveSection,
    selectedYear,
    setSelectedYear,
    viewModalOpen,
    setViewModalOpen,
    replyModalOpen,
    setReplyModalOpen,
    selectedMessage,
    createAnnouncementModalOpen,
    setCreateAnnouncementModalOpen,
    editAnnouncementModalOpen,
    setEditAnnouncementModalOpen,
    viewAnnouncementModalOpen,
    setViewAnnouncementModalOpen,
    selectedAnnouncement,
    announcementFormData,
    currentAnnouncements,
    currentFullAnnouncements,
    createTemplateModalOpen,
    setCreateTemplateModalOpen,
    editTemplateModalOpen,
    setEditTemplateModalOpen,
    viewTemplateModalOpen,
    setViewTemplateModalOpen,
    selectedTemplate,
    templateFormData,
    currentTemplates,
    currentFullTemplates,
    useTemplateModalOpen,
    setUseTemplateModalOpen,
    useTemplateFields,
    useTemplateFormTitle,
    handleViewMessage,
    handleReply,
    handleCreateAnnouncement,
    handleViewAnnouncement,
    handleEditAnnouncement,
    handleAnnouncementSubmit,
    handleCreateTemplate,
    handleViewTemplate,
    handleEditTemplate,
    handleTemplateSubmit,
    handleUseTemplate,
  };
};

export default useMessages;