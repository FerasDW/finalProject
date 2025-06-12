import { useState, useEffect, useRef } from "react";
import DynamicForm from "../../../View/Components/Forms/dynamicForm";
import { cvFormFields } from "../../../Static/formsInputs"
import "../../../CSS/Pages/Community/mycv.scss";

const MyCV = () => {
  const [activeTab, setActiveTab] = useState("mycv");
  const [cvFile, setCvFile] = useState(null);
  const [cvSaved, setCvSaved] = useState(false);
  const [freeText, setFreeText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [openFeature, setOpenFeature] = useState("autoFill");
  const [isSaving, setIsSaving] = useState(false); // Loading state for form submission
  const canvasRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    summary: "",
    education: "",
    experience: "",
    skills: "",
    links: "",
  });

  // Render PDF thumbnail
  useEffect(() => {
    const renderPdfThumbnail = async () => {
      if (!cvFile || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.width = 300;
      canvas.height = 400;
      context.fillStyle = "#f8f9fa";
      context.fillRect(0, 0, 300, 400);
      context.fillStyle = "#666";
      context.font = "16px sans-serif";
      context.textAlign = "center";
      context.fillText("PDF Preview", 150, 200);
      context.fillText("(Click to view full)", 150, 220);
    };

    renderPdfThumbnail();
  }, [cvFile]);

  // Backend API placeholder
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
  const cvApi = {
    saveCV: async (cvData) => console.log("TODO: Save CV to backend", cvData),
    uploadCV: async (file) => console.log("TODO: Upload CV file to backend", file.name),
    getUserCVs: async () => console.log("TODO: Fetch user CVs from backend"),
    deleteCV: async (cvId) => console.log("TODO: Delete CV from backend", cvId)
  };

  // Handle file upload
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setCvFile(file);
      // cvApi.uploadCV(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  // Download CV file
  const handleDownload = () => {
    if (cvFile) {
      const url = URL.createObjectURL(cvFile);
      const link = document.createElement("a");
      link.href = url;
      link.download = cvFile.name;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  // Delete CV file
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this CV?")) {
      setCvFile(null);
      setCvSaved(false);
    }
  };

  // Handle form submission from DynamicForm
  const handleFormSubmit = async (data) => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormData(data);
      setCvSaved(true);
      setActiveTab("mycv");
      // cvApi.saveCV(data);
    } catch (error) {
      console.error("Error saving CV:", error);
      alert("Failed to save CV. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setActiveTab("mycv");
  };

  // AI extraction
  const handleAutoExtract = async () => {
    if (!freeText.trim()) return;
    setIsExtracting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/cv/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "full", input: freeText }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const raw = (data?.suggestion || "").trim();
      const cleaned = raw.startsWith("{") ? raw : raw.slice(raw.indexOf("{"));
      const result = JSON.parse(cleaned);
      setFormData((prev) => ({ ...prev, ...result }));
    } catch (error) {
      console.error("Extraction error:", error);
      alert("Failed to extract CV data. Please try again later.");  
    } finally {
      setIsExtracting(false);
    }
  };

  const toggleFeature = (key) => setOpenFeature(openFeature === key ? null : key);

  const aiFeatures = [
    {
      key: "autoFill",
      title: "🪄 CV Maker by AI",
      content: (
        <div className="ai-feature-content">
          <p>Let AI help you write and improve your CV. Try the auto-fill feature or explore more coming tools!</p>
          <textarea
            placeholder="Write your CV in one paragraph and let AI fill the fields..."
            rows={6}
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
          />
          <button onClick={handleAutoExtract} disabled={isExtracting}>
            {isExtracting ? "Extracting..." : "🚀 Auto-Fill"}
          </button>
        </div>
      ),
    },
    {
      key: "summary",
      title: "✨ Improve professional summary",
      content: <p>Coming soon: AI will rewrite your summary in a more professional tone.</p>,
    },
    {
      key: "experience", 
      title: "📄 Optimize experience section",
      content: <p>Coming soon: AI will enhance your job descriptions.</p>,
    },
    {
      key: "coverLetter",
      title: "📬 Generate a cover letter", 
      content: <p>Coming soon: Auto-generate personalized cover letters.</p>,
    },
    {
      key: "translate",
      title: "🌍 Translate to English/French",
      content: <p>Coming soon: Instantly translate your CV.</p>,
    },
  ];

  return (
    <div className="cv-page">
      {/* Tabs */}
      <div className="cv-tabs">
        <button 
          className={activeTab === "mycv" ? "active" : ""} 
          onClick={() => setActiveTab("mycv")}
        >
          📄 My CV
        </button>
        <button 
          className={activeTab === "create" ? "active" : ""} 
          onClick={() => setActiveTab("create")}
        >
          ✍️ Create CV
        </button>
        <button 
          className={activeTab === "manage" ? "active" : ""} 
          onClick={() => setActiveTab("manage")}
        >
          📁 Manage CV
        </button>
      </div>

      {/* My CV Tab - Only shows CV preview */}
      {activeTab === "mycv" && (
        <div className="cv-card">
          {!cvSaved && !cvFile ? (
            <div className="empty-state">
              <h3>You don't have a CV yet</h3>
              <p>Get started by creating a new CV or uploading an existing one</p>
              <div className="action-buttons">
                <button className="btn-primary" onClick={() => setActiveTab("create")}>
                  ✍️ Create New CV
                </button>
                <button className="btn-secondary" onClick={() => setActiveTab("manage")}>
                  📁 Upload CV
                </button>
              </div>
            </div>
          ) : cvSaved ? (
            <div className="cv-preview">
              <div className="cv-header">
                <h3>{formData.name}</h3>
                <button className="edit-btn" onClick={() => setActiveTab("create")}>
                  ✏️ Edit
                </button>
              </div>
              <p className="cv-title">{formData.title}</p>
              <p className="cv-summary">{formData.summary}</p>
              <hr />
              <div className="cv-section">
                <h4>🎓 Education</h4>
                <p>{formData.education}</p>
              </div>
              <div className="cv-section">
                <h4>💼 Experience</h4>
                <p>{formData.experience}</p>
              </div>
              <div className="cv-section">
                <h4>🧠 Skills</h4>
                <p>{formData.skills}</p>
              </div>
              <div className="cv-section">
                <h4>🔗 Links</h4>
                <p>{formData.links}</p>
              </div>
            </div>
          ) : (
            <div className="cv-preview">
              <div className="cv-header">
                <h3>📄 {cvFile.name}</h3>
                <button className="edit-btn" onClick={() => setActiveTab("create")}>
                  ✍️ Create New
                </button>
              </div>
              <p className="cv-file-info">PDF file uploaded successfully</p>
            </div>
          )}
        </div>
      )}

      {/* Create CV Tab - Using DynamicForm */}
      {activeTab === "create" && (
        <div className="form-with-sidebar">
          <div className="cv-form">
            <DynamicForm
              title="✍️ Create/Edit Your CV"
              fields={cvFormFields}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              submitText="💾 Save CV"
              cancelText="Cancel"
              showCancel={true}
              loading={isSaving}
              initialData={formData}
              className="cv-dynamic-form"
            />
          </div>

          <div className="ai-helper">
            <h3>💡 AI Assistant</h3>
            <div className="ai-features">
              {aiFeatures.map((feature) => (
                <div key={feature.key} className="feature-item">
                  <div 
                    className="feature-header"
                    onClick={() => toggleFeature(feature.key)}
                    style={{ 
                      borderLeft: `4px solid ${openFeature === feature.key ? '#4CAF50' : '#2196F3'}` 
                    }}
                  >
                    {feature.title}
                  </div>
                  {openFeature === feature.key && (
                    <div className="feature-content">
                      {feature.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Manage CV Tab - Only file operations */}
      {activeTab === "manage" && (
        <div className="cv-card">
          <h3>📁 Manage Your CV Files</h3>
          <p>Upload, download, and manage your CV files</p>

          <div className="upload-section">
            <h4>📤 Upload New CV</h4>
            <label htmlFor="cvUpload" className="upload-label">
              Choose PDF File
            </label>
            <input 
              id="cvUpload" 
              type="file" 
              accept="application/pdf" 
              onChange={handleUpload} 
              hidden 
            />
          </div>

          {cvFile && (
            <div className="file-preview">
              <h4>📄 Current File</h4>
              <p className="file-name">{cvFile.name}</p>
              <div className="file-actions">
                <button className="btn-secondary" onClick={handleDownload}>
                  📥 Download
                </button>
                <button className="btn-secondary" onClick={() => setShowPdfViewer(true)}>
                  👁️ View Full
                </button>
                <button className="btn-danger" onClick={handleDelete}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          )}

          {!cvFile && !cvSaved && (
            <div className="empty-state">
              <p>No CV files uploaded yet.</p>
              <p>Upload a PDF file to get started!</p>
            </div>
          )}
        </div>
      )}

      {/* PDF Modal */}
      {showPdfViewer && cvFile && (
        <div className="pdf-modal">
          <div className="pdf-overlay" onClick={() => setShowPdfViewer(false)}></div>
          <div className="pdf-content">
            <button onClick={() => setShowPdfViewer(false)} className="close-btn">
              ❌ Close
            </button>
            <iframe 
              src={URL.createObjectURL(cvFile)} 
              title="PDF Viewer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCV;