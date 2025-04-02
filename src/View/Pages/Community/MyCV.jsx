import { useState, useEffect, useRef } from "react";
import "./mycv.scss";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfWorker from "pdfjs-dist/legacy/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;


const MyCV = () => {
  const [activeTab, setActiveTab] = useState("mycv");
  const [cvFile, setCvFile] = useState(null);
  const [cvSaved, setCvSaved] = useState(false);
  const [freeText, setFreeText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
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

  useEffect(() => {
    const renderPdfThumbnail = async () => {
      if (!cvFile || !canvasRef.current) return;

      const fileReader = new FileReader();
      fileReader.onload = async function () {
        const typedarray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 1 });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;
      };
      fileReader.readAsArrayBuffer(cvFile);
    };

    renderPdfThumbnail();
  }, [cvFile]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setCvFile(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAutoExtract = async () => {
    if (!freeText.trim()) return;
    setIsExtracting(true);
    try {
      const response = await axios.post("http://localhost:8080/api/ai/cv/generate", {
        type: "full",
        input: freeText,
      });

      const raw = (response.data?.suggestion || "").trim();
      const cleaned = raw.startsWith("{") ? raw : raw.slice(raw.indexOf("{"));
      const result = JSON.parse(cleaned);
      setFormData((prev) => ({ ...prev, ...result }));
    } catch (error) {
      console.error("Extraction error:", error);
      alert("Failed to extract CV data. Try again later.");
    } finally {
      setIsExtracting(false);
    }
  };

  const aiFeatures = [
    {
      key: "autoFill",
      title: "🪄 CV Maker by AI",
      content: (
        <>
          <p style={{ fontSize: "14px", marginBottom: "8px", color: "#555" }}>
            Let AI help you write and improve your CV. Try the auto-fill feature or explore more coming tools!
          </p>
          <textarea
            placeholder="Write your CV in one paragraph and let AI fill the fields..."
            rows={6}
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
          />
          <button onClick={handleAutoExtract} disabled={isExtracting}>
            {isExtracting ? "Extracting..." : "🚀 Auto-Fill"}
          </button>
        </>
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

  const [openFeature, setOpenFeature] = useState("autoFill");
  const toggleFeature = (key) => setOpenFeature(openFeature === key ? null : key);

  return (
    <div className="myCVPage">
      <div className="cvTabs">
        <button className={activeTab === "mycv" ? "active" : ""} onClick={() => setActiveTab("mycv")}>
          📄 My CV
        </button>
        <button className={activeTab === "customize" ? "active" : ""} onClick={() => setActiveTab("customize")}>
          🎨 Customize
        </button>
        <button className={activeTab === "export" ? "active" : ""} onClick={() => setActiveTab("export")}>
          📤 Export & Save
        </button>
      </div>

      {activeTab === "mycv" && (
        <div className="cvCard previewCard">
          {!cvSaved ? (
            <div className="cvOptions">
              <h3>You don't have a CV yet</h3>
              <button className="createNowBtn" onClick={() => setActiveTab("form")}>✍️ Create CV</button>
              <label htmlFor="cvUpload" className="uploadLabel">📤 Upload Existing CV</label>
              <input id="cvUpload" type="file" accept="application/pdf" onChange={handleUpload} hidden />

              {cvFile && (
                <>
                  <p>📄 <strong>{cvFile.name}</strong></p>
                  <canvas ref={canvasRef} style={{ cursor: "pointer", maxWidth: "300px", border: "1px solid #ccc" }} onClick={() => setShowPdfViewer(true)} />
                  <button className="downloadBtn" onClick={handleDownload}>Download Uploaded CV</button>
                </>
              )}
            </div>
          ) : (
            <div className="cvPreview">
              <h3>{formData.name}</h3>
              <p className="subtitle">{formData.title}</p>
              <p>{formData.summary}</p>
              <hr />
              <h4>🎓 Education</h4>
              <p>{formData.education}</p>
              <h4>💼 Experience</h4>
              <p>{formData.experience}</p>
              <h4>🧠 Skills</h4>
              <p>{formData.skills}</p>
              <h4>🔗 Links</h4>
              <p>{formData.links}</p>
              <button className="editBtn" onClick={() => setActiveTab("form")}>✏️ Edit CV</button>
            </div>
          )}
        </div>
      )}

      {activeTab === "form" && (
        <div className="formWithSidebar">
          <div className="cvForm">
            <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
            <input name="title" placeholder="Professional Title" value={formData.title} onChange={handleChange} />
            <textarea name="summary" placeholder="Professional Summary" rows={3} value={formData.summary} onChange={handleChange} />
            <textarea name="education" placeholder="Education" rows={3} value={formData.education} onChange={handleChange} />
            <textarea name="experience" placeholder="Work Experience" rows={3} value={formData.experience} onChange={handleChange} />
            <textarea name="skills" placeholder="Skills (comma separated)" rows={2} value={formData.skills} onChange={handleChange} />
            <input name="links" placeholder="Links (LinkedIn, Portfolio, etc.)" value={formData.links} onChange={handleChange} />
            <button className="saveCvBtn" onClick={() => { setCvSaved(true); setActiveTab("mycv"); }}>Save CV</button>
          </div>

          <div className="aiHelperBox">
            <h3>💡 Discover AI Features</h3>
            <div className="aiFeatureList">
              {aiFeatures.map((feature) => (
                <div key={feature.key} className="featureItem">
                  <div className="featureHeader" onClick={() => toggleFeature(feature.key)}>
                    {feature.title}
                  </div>
                  {openFeature === feature.key && (
                    <div className="featureContent">
                      {feature.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "customize" && (
        <div className="cvCard">
          <h3>🎨 Customize your CV</h3>
          <p>Coming soon: themes, profile photo, layout styles...</p>
        </div>
      )}

      {activeTab === "export" && (
        <div className="cvCard">
          <h3>📤 Export & Save</h3>
          <p>Coming soon: download as PDF, save to cloud, email export...</p>
        </div>
      )}

      {showPdfViewer && (
        <div className="pdfModal">
          <div className="pdfOverlay" onClick={() => setShowPdfViewer(false)}></div>
          <div className="pdfContent">
            <button onClick={() => setShowPdfViewer(false)} className="closeBtn">❌ Close</button>
            <iframe src={URL.createObjectURL(cvFile)} title="PDF Viewer" style={{ width: "100%", height: "80vh", border: "none" }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCV;
