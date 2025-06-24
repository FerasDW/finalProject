import React, { useState } from "react";
import {
  Plus,
  Upload,
  Download,
  Eye,
  Trash2,
  Edit,
  Folder,
  File,
  Search,
  MoreVertical,
  X,
  FolderPlus,
} from "lucide-react";
import "../../../../CSS/Pages/CoursePage/CourseFilesManager.css";
import DynamicForm from "../../Forms/dynamicForm.jsx";
import PopUp from "../../Cards/PopUp.jsx";
import {
  categoryFields,
  uploadFileFields,
} from "../../../../Static/formsInputs.js";
import { mockCourseCategories } from "../../../../Static/coursePageData.js";

const CourseFilesManager = ({ userRole = "1100", courseMaterials = [] }) => {
  const [categories, setCategories] = useState(mockCourseCategories);
  const [activeCategory, setActiveCategory] = useState(
    categories[0]?.id || null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddFile, setShowAddFile] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    color: "#3b82f6",
  });

  const isAdmin = userRole === "1100"; // Assuming 1100 is admin role

  const getFileIcon = (type) => {
    const iconProps = { size: 24 };
    switch (type) {
      case "presentation":
        return <File {...iconProps} className="file-icon presentation" />;
      case "document":
        return <File {...iconProps} className="file-icon document" />;
      case "video":
        return <File {...iconProps} className="file-icon video" />;
      case "audio":
        return <File {...iconProps} className="file-icon audio" />;
      default:
        return <File {...iconProps} className="file-icon default" />;
    }
  };

  const handleDownloadFile = (file) => {
    if (file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Fallback if no URL - could call an API endpoint
      console.error('No download URL available for file:', file.name);
      // You could show a toast notification here
    }
  };

  const handleAddCategory = (data) => {
    if (data.name?.trim()) {
      const category = {
        id: Date.now(),
        name: data.name,
        description: data.description || "",
        color: data.color || "#3b82f6",
        files: [],
      };
      setCategories([...categories, category]);
      setShowAddCategory(false);
    }
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories(categories.filter((cat) => cat.id !== categoryId));
    if (activeCategory === categoryId) {
      setActiveCategory(categories[0]?.id || null);
    }
  };

  const handleDeleteFile = (categoryId, fileId) => {
    setCategories(
      categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, files: cat.files.filter((file) => file.id !== fileId) }
          : cat
      )
    );
  };

  const handleFileUpload = (categoryId, file) => {
    if (!categoryId || !file) {
      console.error("Missing categoryId or file");
      return;
    }

    const newFile = {
      id: Date.now(),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      uploadDate: new Date().toISOString().split("T")[0],
      type: "document",
      url: URL.createObjectURL(file) // Create a temporary URL for the uploaded file
    };

    setCategories(
      categories.map((cat) =>
        cat.id === categoryId ? { ...cat, files: [...cat.files, newFile] } : cat
      )
    );

    setShowAddFile(false);
  };

  const activeFiles =
    categories.find((cat) => cat.id === activeCategory)?.files || [];
  const filteredFiles = activeFiles.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="files-manager">
      <div className="files-container">
        {/* Sidebar - Categories */}
        <div className="categories-sidebar">
          <div className="categories-sidebar-content">
            <h3 className="categories-sidebar-title">Categories</h3>
            <div className="categories-list">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`category-item ${
                    activeCategory === category.id ? "active" : ""
                  }`}
                  style={{
                    borderLeftColor:
                      activeCategory === category.id
                        ? category.color
                        : "transparent",
                  }}
                >
                  <div className="category-main">
                    <div className="category-info">
                      <div
                        className="category-color"
                        style={{ backgroundColor: category.color }}
                      />
                      <div className="category-details">
                        <h4 className="category-name">{category.name}</h4>
                        <p className="category-count">
                          {category.files.length} files
                        </p>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="category-actions">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Edit category logic
                          }}
                          className="action-btn"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(category.id);
                          }}
                          className="action-btn delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="category-description">{category.description}</p>
                </div>
              ))}

              {/* Add Category Button */}
              {isAdmin && (
                <div
                  onClick={() => setShowAddCategory(true)}
                  className="add-category-item"
                >
                  <div className="category-main">
                    <div className="category-info">
                      <div className="add-category-icon">
                        <Plus size={16} />
                      </div>
                      <div className="category-details">
                        <h4 className="category-name">Add New Category</h4>
                        <p className="category-count">Create a new category</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content - Files */}
        <div className="main-content">
          {/* Search Section */}
          <div className="search-section">
            <div className="search-container">
              <div className="search-input-wrapper">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
          </div>

          {/* Files Grid */}
          {activeCategory ? (
            <div className="files-grid">
              {filteredFiles.map((file) => (
                <div key={file.id} className="file-card">
                  {/* File Icon */}
                  <div className="file-icon-container">
                    <div className="file-icon-wrapper">
                      {getFileIcon(file.type)}
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="file-info">
                    <h4 className="file-name">{file.name}</h4>
                    <p className="file-size">{file.size}</p>
                    <p className="file-date">Uploaded: {file.uploadDate}</p>
                  </div>

                  {/* Actions */}
                  <div className="file-actions">
                    <button className="file-action-btn view">
                      <Eye size={16} />
                      View
                    </button>
                    <button 
                      className="file-action-btn download"
                      onClick={() => handleDownloadFile(file)}
                    >
                      <Download size={16} />
                      Download
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() =>
                          handleDeleteFile(activeCategory, file.id)
                        }
                        className="file-action-btn delete"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Upload Zone for Admin */}
              {isAdmin && (
                <div
                  className="upload-zone"
                  onClick={() => setShowAddFile(true)}
                >
                  <Upload className="upload-icon" size={32} />
                  <p className="upload-title">Upload New File</p>
                  <p className="upload-subtitle">Click to browse files</p>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <Folder className="empty-icon" size={48} />
              <p className="empty-text">Select a category to view files</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Category with PopUp */}
      <PopUp
        isOpen={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        size="medium"
        showCloseButton={false}
      >
        <DynamicForm
          title="Add New Category"
          fields={categoryFields}
          initialData={newCategory}
          onSubmit={(data) => {
            handleAddCategory(data);
            setShowAddCategory(false);
          }}
          onCancel={() => setShowAddCategory(false)}
          submitText="Add Category"
          cancelText="Cancel"
        />
      </PopUp>

      {/* File Upload Modal */}
      <PopUp
        isOpen={showAddFile}
        onClose={() => setShowAddFile(false)}
        size="medium"
        showCloseButton={false}
      >
        <DynamicForm
          title="Upload File"
          fields={uploadFileFields(categories)}
          initialData={{ categoryId: activeCategory }}
          onSubmit={(data) => {
            handleFileUpload(data.categoryId, data.file);
            setShowAddFile(false);
          }}
          onCancel={() => setShowAddFile(false)}
          submitText="Upload File"
          cancelText="Cancel"
        />
      </PopUp>
    </div>
  );
};

export default CourseFilesManager;