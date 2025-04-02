import { useState } from "react";
import { jobPosts } from "../../../Static/communityData";
import "./jobBoard.scss";

const JobBoard = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("All");
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]); // for future use

  const handleSaveJob = (job) => {
    setSavedJobs((prev) =>
      prev.some((j) => j.id === job.id)
        ? prev.filter((j) => j.id !== job.id)
        : [...prev, job]
    );
  };

  const handleApplyJob = (job) => {
    setAppliedJobs((prev) =>
      prev.some((j) => j.id === job.id)
        ? prev.filter((j) => j.id !== job.id) // unapply
        : [...prev, job]
    );
  };

  const filteredJobs = jobPosts.filter((job) => {
    const matchesSearch = job.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = jobTypeFilter === "All" || job.type === jobTypeFilter;
    return matchesSearch && matchesType;
  });

  const renderJobCard = (job) => (
    <div className="jobCard" key={job.id}>
      <h4>{job.title}</h4>
      <p className="company">
        {job.company} • {job.location}
      </p>
      <p className="description">{job.description}</p>
      <div className="meta">
        <span className="type">{job.type}</span>
        <span className="date">Posted: {job.postedDate}</span>
      </div>
      <div className="tags">
        {job.tags.map((tag, idx) => (
          <span key={idx} className="tag">
            {tag}
          </span>
        ))}
      </div>
      <div className="actions">
        <button
          className={`applyBtn ${
            appliedJobs.some((j) => j.id === job.id) ? "applied" : ""
          }`}
          onClick={() => handleApplyJob(job)}
        >
          {appliedJobs.some((j) => j.id === job.id) ? "Applied" : "Apply"}
        </button>

        <button
          className={`saveBtn ${
            savedJobs.some((j) => j.id === job.id) ? "saved" : ""
          }`}
          onClick={() => handleSaveJob(job)}
        >
          {savedJobs.some((j) => j.id === job.id) ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="jobBoardPage">
      <h2>Job Board</h2>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "all" ? "active" : ""}
          onClick={() => setActiveTab("all")}
        >
          All Jobs
        </button>
        <button
          className={activeTab === "saved" ? "active" : ""}
          onClick={() => setActiveTab("saved")}
        >
          Saved Jobs
        </button>
        <button
          className={activeTab === "applied" ? "active" : ""}
          onClick={() => setActiveTab("applied")}
        >
          My Applications
        </button>
      </div>

      {/* Filters & Search */}
      {activeTab === "all" && (
        <div className="filters">
          <input
            type="text"
            placeholder="Search job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Internship">Internship</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
          </select>
        </div>
      )}

      {/* Job Cards */}
      <div className="jobGrid">
        {activeTab === "all" && filteredJobs.map(renderJobCard)}
        {activeTab === "saved" && savedJobs.length > 0 && savedJobs.map(renderJobCard)}
        {activeTab === "saved" && savedJobs.length === 0 && (<p>No saved jobs.</p>)}
        {activeTab === "applied" && appliedJobs.length > 0 && appliedJobs.map(renderJobCard)}
        {activeTab === "applied" && appliedJobs.length === 0 && <p>No applications yet.</p>}

      </div>
    </div>
  );
};

export default JobBoard;
