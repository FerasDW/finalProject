import { useState } from "react";

// Components
import MidPageNavbar from "../../Components/CoursePage/Content/MidPageNavBar";
import Table from "../../Components/Tables/Table";
import Modal from "../../Components/Modal/Modal.jsx";
import DynamicForm from "../../Components/Forms/dynamicForm.jsx";

// Static Data
import {
  messagesData,
  getFullMessageById,
  announcementsData,
  fullAnnouncementsData,
  getFullAnnouncementById,
  targetAudienceOptions,
  priorityOptions,
  templatesData,
  fullTemplatesData,
  getFullTemplateById,
  templateCategoryOptions,
  templateTargetAudienceOptions,
  templateStatusOptions,
} from "../../../Static/messagesData.js";
import {
  templateFormFields,
  announcementFormFields,
} from "../../../Static/formsInputs.js";
import {
  getModalConfig,
  renderModalField,
  getModalTitle,
  getModalSize,
  getModalFooter,
} from "../../../Static/Modals.js";

// Styles
import "../../../CSS/Pages/Messages/messages.css";

const Messages = () => {
  // Main navigation state
  const [activeSection, setActiveSection] = useState("requests");
  const [selectedYear, setSelectedYear] = useState("");

  // Message states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Announcement states
  const [createAnnouncementModalOpen, setCreateAnnouncementModalOpen] = useState(false);
  const [editAnnouncementModalOpen, setEditAnnouncementModalOpen] = useState(false);
  const [viewAnnouncementModalOpen, setViewAnnouncementModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [announcementFormData, setAnnouncementFormData] = useState({});
  const [currentAnnouncements, setCurrentAnnouncements] = useState(announcementsData);
  const [currentFullAnnouncements, setCurrentFullAnnouncements] = useState(fullAnnouncementsData);

  // Template states
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

  // Message handlers
  const handleViewMessage = (row) => {
    const fullMessage = getFullMessageById(row.id);
    setSelectedMessage(fullMessage);
    setViewModalOpen(true);
  };

  const handleReply = (row) => {
    const fullMessage = getFullMessageById(row.id);
    setSelectedMessage(fullMessage);
    setReplyModalOpen(true);
  };

  const handleReplySubmit = (formData) => {
    console.log("Reply submitted:", formData);
    // Handle reply submission logic here
    setReplyModalOpen(false);
  };

  // Announcement handlers
  const handleCreateAnnouncement = () => {
    setSelectedAnnouncement(null);
    setAnnouncementFormData({});
    setCreateAnnouncementModalOpen(true);
  };

  const handleViewAnnouncement = (row) => {
    const fullAnnouncement = currentFullAnnouncements.find((a) => a.id === row.id);
    if (fullAnnouncement) {
      setSelectedAnnouncement(fullAnnouncement);
      setViewAnnouncementModalOpen(true);
    } else {
      console.error("Announcement not found:", row.id);
    }
  };

  const handleEditAnnouncement = (row) => {
    const fullAnnouncement = currentFullAnnouncements.find((a) => a.id === row.id);
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
      // Edit existing announcement
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
      // Create new announcement
      const newId = Math.max(...currentAnnouncements.map((a) => a.id)) + 1;
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

  // Template handlers
  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setTemplateFormData({});
    setCreateTemplateModalOpen(true);
  };

  const handleViewTemplate = (row) => {
    const fullTemplate = currentFullTemplates.find((t) => t.id === row.id);
    if (fullTemplate) {
      setSelectedTemplate(fullTemplate);
      setViewTemplateModalOpen(true);
    }
  };

  const handleEditTemplate = (row) => {
    const fullTemplate = currentFullTemplates.find((t) => t.id === row.id);
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
      // Edit existing template
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
      // Create new template
      const newId = Math.max(...currentTemplates.map((t) => t.id)) + 1;
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
    const fullTemplate = currentFullTemplates.find((t) => t.id === row.id);
    if (!fullTemplate) return;

    const content = fullTemplate.content;

    // Extract variables in {curlyBraces}
    const variableMatches = content.match(/\{([^}]+)\}/g) || [];
    const uniqueVariables = [...new Set(variableMatches.map((v) => v.replace(/[{}]/g, "").trim()))];

    // Convert to form field config expected by DynamicForm
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

  // Helper function to render view modal content
  const renderViewModalContent = (modalType, data) => {
    const config = getModalConfig(modalType);
    if (!config || !data) return null;

    return (
      <div className="view-modal-container">
        {config.fields.map((field, index) => {
          const renderedField = renderModalField(field, data);
          if (!renderedField) return null;

          if (field.type === "content") {
            return (
              <div key={index}>
                <strong>{renderedField.label}:</strong>
                <div className={renderedField.className}>{renderedField.value}</div>
              </div>
            );
          }

          return (
            <div key={index} className="view-modal-info">
              <strong>{renderedField.label}:</strong>{" "}
              {renderedField.className ? (
                <span className={renderedField.className}>{renderedField.value}</span>
              ) : (
                renderedField.value
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Helper function to render reply modal content
  const renderReplyModalContent = () => {
    const config = getModalConfig("replyMessage");
    if (!config || !selectedMessage) return null;

    return (
      <div>
        {config.showOriginalMessage && (
          <div className="original-msg-box">
            <strong>Original Message:</strong>
            <div className="original-msg-text">{selectedMessage.message}</div>
          </div>
        )}
        <div>
          <label className="reply-label">Your Reply:</label>
          <textarea
            rows="6"
            className="reply-textarea"
            placeholder="Type your reply here..."
          />
        </div>
      </div>
    );
  };

  // Helper function to render modal footer
  const renderModalFooter = (modalType, onCancel, onSubmit) => {
    const footerConfig = getModalFooter(modalType);
    if (!footerConfig) return null;

    return (
      <div className="reply-footer">
        {footerConfig.buttons.map((button, index) => (
          <button
            key={index}
            className={button.className}
            onClick={button.action === "cancel" ? onCancel : onSubmit}
          >
            {button.text}
          </button>
        ))}
      </div>
    );
  };

  // Section rendering
  const renderSection = () => {
    switch (activeSection) {
      case "requests":
        return (
          <Table
            data={messagesData}
            actionButtons={[
              (row) => (
                <button onClick={() => handleViewMessage(row)} className="msg-view-btn">
                  👁 View
                </button>
              ),
              (row) => (
                <button onClick={() => handleReply(row)} className="msg-reply-btn">
                  ↩ Reply
                </button>
              ),
            ]}
          />
        );
      case "announcement":
        return (
          <Table
            data={currentAnnouncements}
            showAddButton={true}
            onAddClick={handleCreateAnnouncement}
            actionButtons={[
              (row) => (
                <button onClick={() => handleViewAnnouncement(row)} className="msg-view-btn">
                  👁 View
                </button>
              ),
              (row) => (
                <button onClick={() => handleEditAnnouncement(row)} className="msg-edit-btn">
                  ✏️ Edit
                </button>
              ),
            ]}
          />
        );
      case "templates":
        return (
          <Table
            data={currentTemplates}
            showAddButton={true}
            onAddClick={handleCreateTemplate}
            actionButtons={[
              (row) => (
                <button onClick={() => handleUseTemplate(row)} className="msg-use-btn">
                  ➕ Use
                </button>
              ),
              (row) => (
                <button onClick={() => handleViewTemplate(row)} className="msg-view-btn">
                  👁 View
                </button>
              ),
              (row) => (
                <button onClick={() => handleEditTemplate(row)} className="msg-edit-btn">
                  ✏️ Edit
                </button>
              ),
            ]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="mid-navbar-container">
        <MidPageNavbar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          sections={["requests", "announcement", "templates"]}
          showYear={false}
        />
      </div>

      <div className="dynamic-section">{renderSection()}</div>

      {/* Message Modals */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title={getModalTitle("viewMessage", selectedMessage)}
        size={getModalSize("viewMessage")}
      >
        {renderViewModalContent("viewMessage", selectedMessage)}
      </Modal>

      <Modal
        isOpen={replyModalOpen}
        onClose={() => setReplyModalOpen(false)}
        title={getModalTitle("replyMessage", selectedMessage)}
        size={getModalSize("replyMessage")}
        footer={renderModalFooter("replyMessage", 
          () => setReplyModalOpen(false), 
          handleReplySubmit
        )}
      >
        {renderReplyModalContent()}
      </Modal>

      {/* Announcement Modals */}
      {createAnnouncementModalOpen && (
        <DynamicForm
          title="Create New Announcement"
          fields={announcementFormFields}
          onSubmit={handleAnnouncementSubmit}
          onCancel={() => setCreateAnnouncementModalOpen(false)}
          submitText="Create Announcement"
          initialData={announcementFormData}
        />
      )}

      {editAnnouncementModalOpen && (
        <DynamicForm
          title="Edit Announcement"
          fields={announcementFormFields}
          onSubmit={handleAnnouncementSubmit}
          onCancel={() => setEditAnnouncementModalOpen(false)}
          submitText="Save Changes"
          initialData={announcementFormData}
        />
      )}

      <Modal
        isOpen={viewAnnouncementModalOpen}
        onClose={() => setViewAnnouncementModalOpen(false)}
        title={getModalTitle("viewAnnouncement", selectedAnnouncement)}
        size={getModalSize("viewAnnouncement")}
      >
        {renderViewModalContent("viewAnnouncement", selectedAnnouncement)}
      </Modal>

      {/* Template Modals */}
      {createTemplateModalOpen && (
        <DynamicForm
          title="Create New Template"
          fields={templateFormFields}
          onSubmit={handleTemplateSubmit}
          onCancel={() => setCreateTemplateModalOpen(false)}
          submitText="Create Template"
          initialData={templateFormData}
        />
      )}

      {editTemplateModalOpen && (
        <DynamicForm
          title="Edit Template"
          fields={templateFormFields}
          onSubmit={handleTemplateSubmit}
          onCancel={() => setEditTemplateModalOpen(false)}
          submitText="Save Changes"
          initialData={templateFormData}
        />
      )}

      <Modal
        isOpen={viewTemplateModalOpen}
        onClose={() => setViewTemplateModalOpen(false)}
        title={getModalTitle("viewTemplate", selectedTemplate)}
        size={getModalSize("viewTemplate")}
      >
        {renderViewModalContent("viewTemplate", selectedTemplate)}
      </Modal>

      {useTemplateModalOpen && (
        <DynamicForm
          title={`Use Template: ${useTemplateFormTitle}`}
          fields={useTemplateFields}
          onSubmit={(data) => {
            console.log("Template used with data:", data);
            setUseTemplateModalOpen(false);
          }}
          onCancel={() => setUseTemplateModalOpen(false)}
          submitText="Send"
        />
      )}
    </>
  );
};

export default Messages;