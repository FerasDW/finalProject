import { useState } from "react";
import { jobPosts } from "../../../Static/communityData";
import "./jobBoard.scss";

const JobBoard = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  // Navigation and UI state
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("All");
  
  // Job interaction state
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [postedJobs, setPostedJobs] = useState([]);
  
  // Job management state
  const [editingJob, setEditingJob] = useState(null);
  const [jobApplications, setJobApplications] = useState({}); // Track applications per job ID
  const [viewingApplications, setViewingApplications] = useState(null);

  // New job form state with all required fields
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    type: "Full-time",
    tags: [],
    salary: "",
    remote: "No",
    experience: "Entry Level",
    deadline: "",
    benefits: [],
    requirements: "",
    status: "Active"
  });

  // ============================================================================
  // CONSTANTS AND CONFIGURATION
  // ============================================================================
  
  // Predefined skills for job posting form
  const predefinedSkills = [
    "JavaScript", "React", "Node.js", "Python", "Java", "SQL",
    "UI/UX Design", "Project Management", "Data Analysis", "AWS",
    "TypeScript", "MongoDB", "Docker", "Git", "GraphQL", "Vue.js",
    "Angular", "PHP", "C++", "Machine Learning", "Kubernetes", "Redis",
    "PostgreSQL", "Firebase", "Figma", "Adobe Creative Suite"
  ];

  // Available benefits for job postings
  const benefitOptions = [
    "Health Insurance", "401(k)", "Flexible Hours", "Remote Work",
    "Paid Time Off", "Professional Development", "Stock Options",
    "Gym Membership", "Free Meals", "Childcare", "Dental Insurance",
    "Vision Insurance", "Life Insurance", "Commuter Benefits",
    "Mental Health Support", "Conference Budget", "Work From Home Stipend",
    "Unlimited PTO"
  ];

  // Mock data for job applications (in production, this would come from API)
  const mockApplications = {
    1: [
      { id: 1, name: "John Doe", email: "john@email.com", status: "pending" },
      { id: 2, name: "Jane Smith", email: "jane@email.com", status: "reviewed" }
    ]
  };

  // ============================================================================
  // JOB INTERACTION HANDLERS
  // ============================================================================
  
  /**
   * Toggle save/unsave job functionality
   * @param {Object} job - Job object to save or unsave
   */
  const handleSaveJob = (job) => {
    setSavedJobs((prev) =>
      prev.some((j) => j.id === job.id)
        ? prev.filter((j) => j.id !== job.id) // Remove if already saved
        : [...prev, job] // Add if not saved
    );
  };

  /**
   * Handle job application - toggle apply/unapply and update application count
   * @param {Object} job - Job object to apply to or unapply from
   */
  const handleApplyJob = (job) => {
    const isCurrentlyApplied = appliedJobs.some((j) => j.id === job.id);
    
    // Update applied jobs list
    setAppliedJobs((prev) =>
      isCurrentlyApplied
        ? prev.filter((j) => j.id !== job.id) // Remove application
        : [...prev, job] // Add application
    );
    
    // Update application count for the job
    setJobApplications(prev => ({
      ...prev,
      [job.id]: isCurrentlyApplied 
        ? Math.max((prev[job.id] || 1) - 1, 0) // Decrease count, minimum 0
        : (prev[job.id] || 0) + 1 // Increase count
    }));
  };

  // ============================================================================
  // JOB MANAGEMENT HANDLERS (CRUD Operations)
  // ============================================================================
  
  /**
   * Delete a job posting with confirmation
   * @param {number} jobId - ID of job to delete
   */
  const handleDeleteJob = (jobId) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      // Remove job from posted jobs
      setPostedJobs(prev => prev.filter(job => job.id !== jobId));
      
      // Clean up applications data for this job
      setJobApplications(prev => {
        const newApps = { ...prev };
        delete newApps[jobId];
        return newApps;
      });
      
      alert("Job deleted successfully!");
    }
  };

  /**
   * Initialize job editing mode
   * @param {Object} job - Job object to edit
   */
  const handleEditJob = (job) => {
    setEditingJob(job);
    setNewJob(job); // Populate form with existing job data
    setActiveTab("post"); // Switch to post job tab
  };

  /**
   * Display applications for a specific job (mock functionality)
   * @param {Object} job - Job object to view applications for
   */
  const handleViewApplications = (job) => {
    setViewingApplications(job);
    // In production, this would open a modal or navigate to applications page
    alert(`Viewing applications for: ${job.title}\nApplications: ${jobApplications[job.id] || 0}`);
  };

  /**
   * Handle job posting form submission (create or update)
   * @param {Event} e - Form submission event
   */
  const handlePostJob = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newJob.title || !newJob.company || !newJob.description) {
      alert("Please fill in required fields.");
      return;
    }

    if (editingJob) {
      // Update existing job
      setPostedJobs(prev => 
        prev.map(job => job.id === editingJob.id ? { ...newJob, id: editingJob.id } : job)
      );
      setEditingJob(null);
      alert("Job updated successfully!");
    } else {
      // Create new job with unique ID and current date
      const jobToPost = {
        ...newJob,
        id: Date.now(), // Simple ID generation (use UUID in production)
        postedDate: new Date().toLocaleDateString()
      };
      setPostedJobs((prev) => [...prev, jobToPost]);
      alert("Job posted successfully!");
    }

    // Reset form to initial state
    resetJobForm();
    setActiveTab("all"); // Navigate back to all jobs
  };

  /**
   * Reset the new job form to initial state
   */
  const resetJobForm = () => {
    setNewJob({
      title: "",
      company: "",
      location: "",
      description: "",
      type: "Full-time",
      tags: [],
      salary: "",
      remote: "No",
      experience: "Entry Level",
      deadline: "",
      benefits: [],
      requirements: "",
      status: "Active"
    });
  };

  // ============================================================================
  // FORM HANDLERS FOR JOB POSTING
  // ============================================================================
  
  /**
   * Toggle skill selection in job posting form
   * @param {string} skill - Skill to toggle
   */
  const handleSkillToggle = (skill) => {
    setNewJob(prev => ({
      ...prev,
      tags: prev.tags.includes(skill)
        ? prev.tags.filter(t => t !== skill) // Remove skill
        : [...prev.tags, skill] // Add skill
    }));
  };

  /**
   * Toggle benefit selection in job posting form
   * @param {string} benefit - Benefit to toggle
   */
  const handleBenefitToggle = (benefit) => {
    setNewJob(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter(b => b !== benefit) // Remove benefit
        : [...prev.benefits, benefit] // Add benefit
    }));
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  
  /**
   * Check if a job was posted by the current user
   * @param {Object} job - Job object to check
   * @returns {boolean} - True if job was posted by current user
   */
  const isMyJob = (job) => {
    return postedJobs.some(pJob => pJob.id === job.id);
  };

  // ============================================================================
  // COMPUTED VALUES AND FILTERS
  // ============================================================================
  
  // Combine static job posts with user-posted jobs
  const allJobs = [...jobPosts, ...postedJobs];

  // Filter jobs based on search term and job type
  const filteredJobs = allJobs.filter((job) => {
    const matchesSearch = job.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = jobTypeFilter === "All" || job.type === jobTypeFilter;
    return matchesSearch && matchesType;
  });

  // ============================================================================
  // RENDER FUNCTIONS
  // ============================================================================
  
  /**
   * Render a single job card with appropriate actions based on ownership
   * @param {Object} job - Job object to render
   * @returns {JSX.Element} - Job card component
   */
  const renderJobCard = (job) => {
    const myJob = isMyJob(job);
    const applicationCount = jobApplications[job.id] || 0;

    return (
      <div className="jobCard" key={job.id}>
        {/* Job Header with Title and Status */}
        <div className="jobHeader">
          <h4>{job.title}</h4>
          {job.status && (
            <span className={`jobStatus ${job.status.toLowerCase()}`}>
              {job.status}
            </span>
          )}
        </div>
        
        {/* Company and Location Information */}
        <p className="company">
          🏢 {job.company} • 📍 {job.location}
        </p>
        <p className="description">{job.description}</p>
        
        {/* Job Metadata */}
        <div className="meta">
          <span className="type">💼 {job.type}</span>
          <span className="date">📅 Posted: {job.postedDate}</span>
          {job.salary && <span className="salary">💰 {job.salary}</span>}
        </div>
        
        {/* Skill Tags */}
        <div className="tags">
          {job.tags.map((tag, idx) => (
            <span key={idx} className="tag">
              {tag}
            </span>
          ))}
        </div>
        
        {/* Action Buttons - Different for own jobs vs other jobs */}
        <div className="actions">
          {myJob ? (
            // Actions for jobs posted by current user
            <>
              <button
                className="viewApplicationsBtn"
                onClick={() => handleViewApplications(job)}
              >
                👥 View Applications ({applicationCount})
              </button>
              <button
                className="editBtn"
                onClick={() => handleEditJob(job)}
              >
                ✏️ Edit
              </button>
              <button
                className="deleteBtn"
                onClick={() => handleDeleteJob(job.id)}
              >
                🗑️ Delete
              </button>
            </>
          ) : (
            // Actions for other users' jobs
            <>
              <button
                className={`applyBtn ${
                  appliedJobs.some((j) => j.id === job.id) ? "applied" : ""
                }`}
                onClick={() => handleApplyJob(job)}
              >
                {appliedJobs.some((j) => j.id === job.id) ? "✅ Applied" : "📤 Apply"}
              </button>

              <button
                className={`saveBtn ${
                  savedJobs.some((j) => j.id === job.id) ? "saved" : ""
                }`}
                onClick={() => handleSaveJob(job)}
              >
                {savedJobs.some((j) => j.id === job.id) ? "💾 Saved" : "💾 Save"}
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  // ============================================================================
  // MAIN COMPONENT RENDER
  // ============================================================================
  
  return (
    <div className="jobBoardPage">
      <h2>💼 Job Board</h2>

      {/* Navigation Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "all" ? "active" : ""}
          onClick={() => setActiveTab("all")}
        >
          📋 All Jobs
        </button>
        <button
          className={activeTab === "saved" ? "active" : ""}
          onClick={() => setActiveTab("saved")}
        >
          💾 Saved Jobs ({savedJobs.length})
        </button>
        <button
          className={activeTab === "applied" ? "active" : ""}
          onClick={() => setActiveTab("applied")}
        >
          📝 My Applications ({appliedJobs.length})
        </button>
        <button
          className={activeTab === "post" ? "active" : ""}
          onClick={() => setActiveTab("post")}
        >
          {editingJob ? "✏️ Edit Job" : "➕ Post Job"}
        </button>
        {/* Conditionally show My Jobs tab if user has posted jobs */}
        {postedJobs.length > 0 && (
          <button
            className={activeTab === "myJobs" ? "active" : ""}
            onClick={() => setActiveTab("myJobs")}
          >
            🏢 My Jobs ({postedJobs.length})
          </button>
        )}
      </div>

      {/* Search and Filter Controls - Only show for relevant tabs */}
      {(activeTab === "all" || activeTab === "myJobs") && (
        <div className="filters">
          <div className="searchGroup">
            <span className="searchIcon">🔍</span>
            <input
              type="text"
              placeholder="Search job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Internship">Internship</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
      )}

      {/* Main Content Area - Job Cards or Post Job Form */}
      <div className={activeTab === "post" ? "postJobContainer" : "jobGrid"}>
        
        {/* ALL JOBS TAB - Show all filtered jobs */}
        {activeTab === "all" && filteredJobs.map((job) => renderJobCard(job))}
        
        {/* MY JOBS TAB - Show only user's posted jobs with filters */}
        {activeTab === "myJobs" && 
          postedJobs.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = jobTypeFilter === "All" || job.type === jobTypeFilter;
            return matchesSearch && matchesType;
          }).map((job) => renderJobCard(job))
        }
        
        {/* SAVED JOBS TAB - Show saved jobs or empty state */}
        {activeTab === "saved" && (
          savedJobs.length > 0 ? 
            savedJobs.map((job) => renderJobCard(job)) :
            <div className="emptyState">
              <p>💾 No saved jobs yet.</p>
              <p>Save jobs you're interested in to view them here!</p>
            </div>
        )}
        
        {/* APPLIED JOBS TAB - Show applied jobs or empty state */}
        {activeTab === "applied" && (
          appliedJobs.length > 0 ? 
            appliedJobs.map((job) => renderJobCard(job)) :
            <div className="emptyState">
              <p>📝 No applications yet.</p>
              <p>Apply to jobs to track your applications here!</p>
            </div>
        )}

        {/* POST/EDIT JOB TAB - Job posting form */}
        {activeTab === "post" && (
          <div className="postJobWrapper">
            {/* Form Header */}
            <div className="postJobHeader">
              <h3>{editingJob ? "✏️ Edit Job Posting" : "🚀 Post a New Job"}</h3>
              <p>{editingJob ? "Update your job posting details" : "Find the perfect candidate for your team"}</p>
            </div>
            
            <div className="postJobContent">
              {/* Main Form */}
              <div className="postJobForm">
                <form onSubmit={handlePostJob}>
                  
                  {/* BASIC INFORMATION SECTION */}
                  <div className="formSection">
                    <h4>📋 Basic Information</h4>
                    <div className="formGrid">
                      <div className="formGroup">
                        <label>Job Title *</label>
                        <input
                          type="text"
                          value={newJob.title}
                          onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                          placeholder="e.g. Senior Frontend Developer"
                          required
                        />
                      </div>

                      <div className="formGroup">
                        <label>Company Name *</label>
                        <input
                          type="text"
                          value={newJob.company}
                          onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                          placeholder="e.g. Tech Corp Inc."
                          required
                        />
                      </div>

                      <div className="formGroup">
                        <label>Location</label>
                        <input
                          type="text"
                          value={newJob.location}
                          onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                          placeholder="e.g. New York, NY"
                        />
                      </div>

                      <div className="formGroup">
                        <label>Job Type</label>
                        <select
                          value={newJob.type}
                          onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                        </select>
                      </div>

                      <div className="formGroup">
                        <label>Experience Level</label>
                        <select
                          value={newJob.experience}
                          onChange={(e) => setNewJob({ ...newJob, experience: e.target.value })}
                        >
                          <option value="Entry Level">Entry Level</option>
                          <option value="Mid Level">Mid Level</option>
                          <option value="Senior Level">Senior Level</option>
                          <option value="Executive">Executive</option>
                        </select>
                      </div>

                      <div className="formGroup">
                        <label>Remote Work</label>
                        <select
                          value={newJob.remote}
                          onChange={(e) => setNewJob({ ...newJob, remote: e.target.value })}
                        >
                          <option value="No">On-site</option>
                          <option value="Yes">Fully Remote</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* JOB DETAILS SECTION */}
                  <div className="formSection fullWidth">
                    <h4>💼 Job Details</h4>
                    <div className="formGroup fullWidth">
                      <label>Job Description *</label>
                      <textarea
                        rows="4"
                        value={newJob.description}
                        onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                        placeholder="Describe the role, responsibilities, and what you're looking for..."
                        required
                      />
                    </div>

                    <div className="formGroup fullWidth">
                      <label>Requirements</label>
                      <textarea
                        rows="3"
                        value={newJob.requirements}
                        onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                        placeholder="List the required qualifications, experience, and skills..."
                      />
                    </div>

                    <div className="formGrid twoColumns">
                      <div className="formGroup">
                        <label>Salary Range</label>
                        <input
                          type="text"
                          value={newJob.salary}
                          onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                          placeholder="e.g. $70k - $90k"
                        />
                      </div>

                      <div className="formGroup">
                        <label>Application Deadline</label>
                        <input
                          type="date"
                          value={newJob.deadline}
                          onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* SKILLS SELECTION SECTION */}
                  <div className="formSection fullWidth">
                    <h4>🛠️ Required Skills</h4>
                    <div className="skillsGrid threeColumns">
                      {predefinedSkills.map((skill) => (
                        <label key={skill} className="skillCheckbox">
                          <input
                            type="checkbox"
                            checked={newJob.tags.includes(skill)}
                            onChange={() => handleSkillToggle(skill)}
                          />
                          <span>{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* BENEFITS SELECTION SECTION */}
                  <div className="formSection fullWidth">
                    <h4>🎁 Benefits & Perks</h4>
                    <div className="benefitsGrid threeColumns">
                      {benefitOptions.map((benefit) => (
                        <label key={benefit} className="benefitCheckbox">
                          <input
                            type="checkbox"
                            checked={newJob.benefits.includes(benefit)}
                            onChange={() => handleBenefitToggle(benefit)}
                          />
                          <span>{benefit}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* FORM ACTION BUTTONS */}
                  <div className="formActions">
                    <button type="submit" className="postJobBtn">
                      {editingJob ? "💾 Update Job" : "🚀 Post Job"}
                    </button>
                    
                    {/* Show cancel button only when editing */}
                    {editingJob && (
                      <button 
                        type="button" 
                        className="cancelBtn"
                        onClick={() => {
                          setEditingJob(null);
                          resetJobForm();
                          setActiveTab("all");
                        }}
                      >
                        ❌ Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* SIDEBAR WITH TIPS AND PREVIEW */}
              <div className="postJobSidebar">
                {/* Tips for Better Job Posts */}
                <div className="tipsCard">
                  <h4>💡 Tips for Better Job Posts</h4>
                  <ul>
                    <li>Write a clear, specific job title</li>
                    <li>Include salary range to attract more candidates</li>
                    <li>Be specific about required skills</li>
                    <li>Mention company culture and values</li>
                    <li>Set realistic deadlines</li>
                  </ul>
                </div>

                {/* Live Preview of Job Card */}
                <div className="previewCard">
                  <h4>👀 Live Preview</h4>
                  <div className="jobCardPreview">
                    <h5>{newJob.title || "Job Title"}</h5>
                    <p className="companyPreview">
                      🏢 {newJob.company || "Company Name"} • 📍 {newJob.location || "Location"}
                    </p>
                    <p className="descriptionPreview">
                      {newJob.description || "Job description will appear here..."}
                    </p>
                    <div className="metaPreview">
                      <span className="typePreview">💼 {newJob.type}</span>
                      <span className="experiencePreview">🎯 {newJob.experience}</span>
                    </div>
                    {newJob.tags.length > 0 && (
                      <div className="tagsPreview">
                        {newJob.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="tagPreview">{tag}</span>
                        ))}
                        {newJob.tags.length > 3 && <span className="tagPreview">+{newJob.tags.length - 3} more</span>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Job Posting Statistics */}
                <div className="statsCard">
                  <h4>📊 Job Posting Stats</h4>
                  <div className="statItem">
                    <span className="statLabel">📝 Skills Selected:</span>
                    <span className="statValue">{newJob.tags.length}</span>
                  </div>
                  <div className="statItem">
                    <span className="statLabel">🎁 Benefits Offered:</span>
                    <span className="statValue">{newJob.benefits.length}</span>
                  </div>
                  <div className="statItem">
                    <span className="statLabel">📄 Description Length:</span>
                    <span className="statValue">{newJob.description.length} chars</span>
                  </div>
                </div>

                {/* Job Posting Guidelines Checklist */}
                <div className="guidelinesCard">
                  <h4>📋 Posting Guidelines</h4>
                  <div className="guideline">
                    <span className={newJob.title ? "guideline-check" : "guideline-cross"}>
                      {newJob.title ? "✅" : "❌"}
                    </span>
                    <span>Add a clear job title</span>
                  </div>
                  <div className="guideline">
                    <span className={newJob.description.length > 50 ? "guideline-check" : "guideline-cross"}>
                      {newJob.description.length > 50 ? "✅" : "❌"}
                    </span>
                    <span>Write detailed description (50+ chars)</span>
                  </div>
                  <div className="guideline">
                    <span className={newJob.tags.length >= 3 ? "guideline-check" : "guideline-cross"}>
                      {newJob.tags.length >= 3 ? "✅" : "❌"}
                    </span>
                    <span>Select at least 3 skills</span>
                  </div>
                  <div className="guideline">
                    <span className={newJob.salary ? "guideline-check" : "guideline-cross"}>
                      {newJob.salary ? "✅" : "❌"}
                    </span>
                    <span>Include salary information</span>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobBoard;