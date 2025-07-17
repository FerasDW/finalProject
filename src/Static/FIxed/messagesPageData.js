export const messagesData = [
  {
    id: 1,
    sender: "John Doe",
    subject: "Course Inquiry",
    date: "2025-07-01",
    priority: "high",
  },
  // Add more sample messages
];

export const announcementsData = [
  {
    id: 1,
    title: "Course Schedule Update",
    targetAudience: "Students",
    priority: "high",
    status: "active",
    createdDate: "2025-07-01",
  },
  // Add more sample announcements
];

export const fullAnnouncementsData = [
  {
    id: 1,
    title: "Course Schedule Update",
    content: "The schedule for CS101 has been updated.",
    targetAudience: "Students",
    targetAudienceType: "student",
    priority: "high",
    status: "active",
    createdDate: "2025-07-01",
    createdTime: "10:00",
    expiryDate: "2025-07-31",
    scheduledDate: null,
  },
  // Add more sample full announcements
];

export const templatesData = [
  {
    id: 1,
    name: "Welcome Email",
    category: "Welcome",
    targetAudience: "Students",
    status: "active",
    lastModified: "2025-07-01",
  },
  // Add more sample templates
];

export const fullTemplatesData = [
  {
    id: 1,
    name: "Welcome Email",
    category: "Welcome",
    subject: "Welcome to the Course",
    content: "Dear {name}, welcome to {course}!",
    variables: ["name", "course"],
    targetAudience: "Students",
    createdDate: "2025-07-01",
    lastModified: "2025-07-01",
    status: "active",
  },
  // Add more sample full templates
];

export const targetAudienceOptions = [
  { value: "student", label: "Students" },
  { value: "instructor", label: "Instructors" },
  { value: "all", label: "All" },
];

export const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label:ambique

System: It looks like the code for `Messages.jsx` was cut off in your message, and the provided code ends abruptly in the `messagesPageData.js` artifact. However, I have enough context from the provided code to break it down into the requested files, following your specifications. I'll assume the missing part of `messagesPageData.js` includes the remaining static data (`templateCategoryOptions`, `templateTargetAudienceOptions`, `templateStatusOptions`, `templateFormFields`, and `announcementFormFields`) and complete it based on the context from the original `Messages.jsx`. I'll also ensure all files adhere to your requirements: modular structure, CSS modules, isolated API calls, and proper naming (`messagesPageData.js` and `messagesPageApi.js`).

Below, I'll provide the complete set of files, including the main component, custom hook, utils, static data, API, and CSS module (assumed to exist). Each file will be wrapped in an `<xaiArtifact>` tag with a unique UUID, using the same `artifact_id` values as in the partial response where applicable to maintain consistency. I'll convert the original CSS import to a CSS module import and use classes like `styles.header`. The API file will include all relevant API calls without invoking them, as requested.

### File Structure and Naming
- **Main Component**: `src/Pages/Messages/Messages.jsx`
- **Custom Hook**: `src/Hooks/useMessages.js`
- **Utils**: `src/Utils/messagesUtils.js`
- **Static Data**: `src/Static/messagesPageData.js`
- **API**: `src/Api/messagesPageApi.js`
- **CSS Module**: `src/Pages/Messages/Messages.module.css` (assumed to exist, imported as object)

### Notes
- **CSS Module**: The CSS is assumed to exist at `src/Pages/Messages/Messages.module.css` with classes like `midNavbarContainer`, `dynamicSection`, etc. The original CSS import (`messages.css`) is replaced with a CSS module import, and class names are updated to use the `styles` object (e.g., `styles.midNavbarContainer`).
- **API File**: API calls are defined in `messagesPageApi.js` for messages, announcements, and templates but are not invoked in other files, per your request. You can modify them later as needed.
- **Static Data**: The static data (`messagesData`, `announcementsData`, etc.) and form fields (`templateFormFields`, `announcementFormFields`) are moved to `messagesPageData.js`. I've inferred the missing `templateCategoryOptions`, `templateTargetAudienceOptions`, `templateStatusOptions`, `templateFormFields`, and `announcementFormFields` based on their usage in the original code.
- **Utils**: Functions like `getFullMessageById`, `getFullAnnouncementById`, and `getFullTemplateById` are moved to `messagesUtils.js`.
- **Download**: Since you don't have VS Code, you can copy each `<xaiArtifact>` block into a text editor and save with the specified path and filename. Let me know if you need specific download instructions (e.g., for a browser-based IDE).
- **Assumptions**: The `priorityOptions` array in `messagesPageData.js` was cut off in your input. I've completed it with reasonable values (`low`, `medium`, `high`) based on the context. Similarly, I've inferred the structure of `templateFormFields` and `announcementFormFields` to match their usage in the original code.

---

<xaiArtifact artifact_id="25df8c3e-6cee-4012-96ff-f6ad4874dc00" artifact_version_id="d547e6b0-b2c4-4eaf-bb1c-5b3c3ec5e089" title="Messages.jsx" contentType="text/jsx">
import React from "react";
import MidPageNavbar from "../../Components/CoursePage/Content/MidPageNavBar";
import Table from "../../Components/Tables/Table";
import Modal from "../../Components/Modal/Modal.jsx";
import PopUp from "../../Components/Cards/PopUp.jsx";
import DynamicForm from "../../Components/Forms/dynamicForm.jsx";
import useMessages from "../../Hooks/useMessages.js";
import { announcementFormFields, templateFormFields } from "../../Static/messagesPageData.js";
import styles from "./Messages.module.css";

const Messages = () => {
  const {
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
    createTemplateModalOpen,
    setCreateTemplateModalOpen,
    editTemplateModalOpen,
    setEditTemplateModalOpen,
    viewTemplateModalOpen,
    setViewTemplateModalOpen,
    selectedTemplate,
    templateFormData,
    currentTemplates,
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
  } = useMessages();

  const renderSection = () => {
    switch (activeSection) {
      case "requests":
        return (
          <Table
            title="Messages"
            showAddButton={false}
            data={currentAnnouncements}
            actionButtons={[
              (row) => (
                <button onClick={() => handleViewMessage(row)} className={styles.msgViewBtn}>
                  👁 View
                </button>
              ),
              (row) => (
                <button onClick={() => handleReply(row)} className={styles.msgReplyBtn}>
                  ↩ Reply
                </button>
              ),
            ]}
          />
        );
      case "announcement":
        return (
          <Table
            title="Announcements"
            data={currentAnnouncements}
            showAddButton={true}
            addButtonText="Create Announcement"
            onAddClick={handleCreateAnnouncement}
            actionButtons={[
              (row) => (
                <button onClick={() => handleViewAnnouncement(row)} className={styles.msgViewBtn}>
                  👁 View
                </button>
              ),
              (row) => (
                <button onClick={() => handleEditAnnouncement(row)} className={styles.msgEditBtn}>
                  ✏️ Edit
                </button>
              ),
            ]}
          />
        );
      case "templates":
        return (
          <Table
            title="Templates"
            data={currentTemplates}
            showAddButton={true}
            addButtonText="Create Template"
            onAddClick={handleCreateTemplate}
            actionButtons={[
              (row) => (
                <button onClick={() => handleUseTemplate(row)} className={styles.msgUseBtn}>
                  ➕ Use
                </button>
              ),
              (row) => (
                <button onClick={() => handleViewTemplate(row)} className={styles.msgViewBtn}>
                  👁 View
                </button>
              ),
              (row) => (
                <button onClick={() => handleEditTemplate(row)} className={styles.msgEditBtn}>
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
      <div className={styles.midNavbarContainer}>
        <MidPageNavbar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          sections={["requests", "announcement", "templates"]}
          showYear={false}
        />
      </div>

      <div className={styles.dynamicSection}>{renderSection()}</div>

      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Message Details"
        size="large"
      >
        {selectedMessage && (
          <div className={styles.viewModalContainer}>
            <div className={styles.viewModalInfo}>
              <strong>From:</strong> {selectedMessage.sender} ({selectedMessage.senderType})
            </div>
            <div className={styles.viewModalInfo}>
              <strong>Email:</strong> {selectedMessage.email}
            </div>
            <div className={styles.viewModalInfo}>
              <strong>Subject:</strong> {selectedMessage.subject}
            </div>
            <div className={styles.viewModalInfo}>
              <strong>Date:</strong> {selectedMessage.date} at {selectedMessage.time}
            </div>
            <div className={styles.viewModalInfo}>
              <strong>Priority:</strong>{" "}
              <span className={styles[`priority-${selectedMessage.priority}`]}>
                {selectedMessage.priority}
              </span>
            </div>
            <div>
              <strong>Message:</strong>
              <div className={styles.viewModalContentBox}>{selectedMessage.message}</div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={replyModalOpen}
        onClose={() => setReplyModalOpen(false)}
        title={`Reply to ${selectedMessage?.sender}`}
        size="large"
        footer={
          <div className={styles.replyFooter}>
            <button onClick={() => setReplyModalOpen(false)} className={styles.replyCancelBtn}>
              Cancel
            </button>
            <button className={styles.replySendBtn}>Send Reply</button>
          </div>
        }
      >
        {selectedMessage && (
          <div>
            <div className={styles.originalMsgBox}>
              <strong>Original Message:</strong>
              <div className={styles.originalMsgText}>{selectedMessage.message}</div>
            </div>
            <div>
              <label className={styles.replyLabel}>Your Reply:</label>
              <textarea
                rows="6"
                className={styles.replyTextarea}
                placeholder="Type your reply here..."
              />
            </div>
          </div>
        )}
      </Modal>

      <PopUp
        isOpen={createAnnouncementModalOpen}
        onClose={() => setCreateAnnouncementModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Create New Announcement"
          fields={announcementFormFields}
          onSubmit={handleAnnouncementSubmit}
          onCancel={() => setCreateAnnouncementModalOpen(false)}
          submitText="Create Announcement"
          initialData={announcementFormData}
        />
      </PopUp>

      <PopUp
        isOpen={editAnnouncementModalOpen}
        onClose={() => setEditAnnouncementModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Edit Announcement"
          fields={announcementFormFields}
          onSubmit={handleAnnouncementSubmit}
          onCancel={() => setEditAnnouncementModalOpen(false)}
          submitText="Save Changes"
          initialData={announcementFormData}
        />
      </PopUp>

      <Modal
        isOpen={viewAnnouncementModalOpen}
        onClose={() => setViewAnnouncementModalOpen(false)}
        title="Announcement Details"
        size="large"
      >
        {selectedAnnouncement && (
          <div className={styles.viewModalContainer}>
            <div className={styles.viewModalInfo}>
              <strong>Title:</strong> {selectedAnnouncement.title}
            </div>
            <div className={styles.viewModalInfo}>
              <strong>Target Audience:</strong> {selectedAnnouncement.targetAudience}
            </div>
            <div className={styles.viewModalInfo}>
              <strong>Priority:</strong>
              <span className={styles[`priority-${selectedAnnouncement.priority}`]}>
                {selectedAnnouncement.priority}
              </span>
            </div>
            <div className={styles.viewModalInfo}>
              <strong>Status:</strong> {selectedAnnouncement.status}
            </div>
            <div className={styles.viewModalInfo}>
              <strong>Created:</strong> {selectedAnnouncement.createdDate} at {selectedAnnouncement.createdTime}
            </div>
            <div className={styles.viewModalInfo}>
              <strong>Expires:</strong> {selectedAnnouncement.expiryDate}
            </div>
            <div>
              <strong>Content:</strong>
              <div className={styles.viewModalContentBox}>{selectedAnnouncement.content}</div>
            </div>
          </div>
        )}
      </Modal>

      <PopUp
        isOpen={createTemplateModalOpen}
        onClose={() => setCreateTemplateModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Create New Template"
          fields={templateFormFields}
          onSubmit={handleTemplateSubmit}
          onCancel={() => setCreateTemplateModalOpen(false)}
          submitText="Create Template"
          initialData={templateFormData}
        />
      </PopUp>

      <PopUp
        isOpen={editTemplateModalOpen}
        onClose={() => setEditTemplateModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
        <DynamicForm
          title="Edit Template"
          fields={templateFormFields}
          onSubmit={handleTemplateSubmit}
          onCancel={() => setEditTemplateModalOpen(false)}
          submitText="Save Changes"
          initialData={templateFormData}
        />
      </PopUp>

      <Modal
        isOpen={viewTemplateModalOpen}
        onClose={() => setViewTemplateModalOpen(false)}
        title="Template Details"
        size="large"
      >
        {selectedTemplate && (
          <div className={styles.viewModalContainer}>
            <div className={styles.viewModalInfo}>
              <strong>Name:</strong> {selectedTemplate.name}
            </div>
            <div className={styles.viewModalInfo}>
              <strong>Category:</strong> {selectedTemplate.category}
            </div>
            <div className={styles.viewModalInfo}>
              <strong>Target Audience:</strong> {selectedTemplate.targetAudience}
            </div>
            <div className={styles.viewModalInfo}>
              <strong>Status:</strong> {selectedTemplate.status}
            </div>
            <div className={styles.viewModalInfo}>
              <strong>Created:</strong> {selectedTemplate.createdDate}
            </div>
            <div className={styles.viewModalInfo}>
              <strong>Last Modified:</strong> {selectedTemplate.lastModified}
            </div>
            <div className={styles.viewModalInfo}>
              <strong>Variables:</strong> {selectedTemplate.variables.join(", ")}
            </div>
            <div className={styles.viewModalInfo}>
              <strong>Subject:</strong> {selectedTemplate.subject}
            </div>
            <div>
              <strong>Content:</strong>
              <div className={styles.viewModalContentBox}>{selectedTemplate.content}</div>
            </div>
          </div>
        )}
      </Modal>

      <PopUp
        isOpen={useTemplateModalOpen}
        onClose={() => setUseTemplateModalOpen(false)}
        size="large"
        showCloseButton={false}
      >
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
      </PopUp>
    </>
  );
};

export default Messages;