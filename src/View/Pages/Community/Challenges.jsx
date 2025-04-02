import "./challenges.scss";
import { useState } from "react";
import InteractiveQuiz from "./InteractiveQuiz";

const interactiveChallenges = [
  {
    id: "mcq",
    title: "Quick Quiz",
    description: "Test your knowledge with multiple-choice questions.",
    icon: "🧠",
  },
  {
    id: "dragdrop",
    title: "Code Sorting",
    description: "Sort code blocks into the correct order.",
    icon: "🧩",
  },
  {
    id: "match",
    title: "Match the Concepts",
    description: "Match terms with their correct definitions.",
    icon: "🎯",
  },
];

const mockChallenges = [
  {
    id: 1,
    title: "Create a React Todo App",
    description: "Build a todo list app using React with add/delete functionality and local state.",
    category: "Frontend",
    status: "Not Started",
    type: "external",
  },
  {
    id: 2,
    title: "Basic Python Calculator",
    description: "Create a command-line calculator that can perform basic operations.",
    category: "Programming",
    status: "Not Started",
    type: "external",
  },
  {
    id: 3,
    title: "SQL Student Records Query",
    description: "Write SQL queries to analyze student data.",
    category: "Backend",
    status: "In Progress",
    type: "external",
  },
];

const Challenges = () => {
  const [challenges, setChallenges] = useState(mockChallenges);
  const [submissionLinks, setSubmissionLinks] = useState({});
  const [showQuiz, setShowQuiz] = useState(false);

  const handleStatusChange = (id, newStatus) => {
    if (newStatus === "Completed") {
      const confirmSubmit = window.confirm(
        "Are you sure you want to submit this challenge? This action cannot be undone."
      );
      if (!confirmSubmit) return;
    }

    const updated = challenges.map((ch) =>
      ch.id === id ? { ...ch, status: newStatus } : ch
    );
    setChallenges(updated);
  };

  const handleLinkChange = (e, id) => {
    setSubmissionLinks((prev) => ({
      ...prev,
      [id]: e.target.value,
    }));
  };

  return (
    <div className="challenges-page">
      
      {/* 🔹 Interactive Challenges */}
      <div className="interactive-preview">
        <h3>Interactive Challenges</h3>
        <div className="interactive-cards">
        {interactiveChallenges.map((item) => (
          <div
            key={item.id}
            className="interactive-card"
            onClick={() => {
              if (item.id === "mcq") setShowQuiz(true);
            }}
          >
            <div className="challenge-icon">{item.icon}</div>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
          </div>
        ))}

        </div>
        <button className="explore-btn">Explore More</button>
      </div>

      {/* 🔹 External Challenges */}
      <div className="challenge-list">
        {challenges.map((challenge) => (
          <div className="challenge-card" key={challenge.id}>
            <div className="challenge-header">
              <h3>{challenge.title}</h3>
              <span className={`status ${challenge.status.toLowerCase().replace(" ", "-")}`}>
                {challenge.status}
              </span>
            </div>
            <p className="description">{challenge.description}</p>
            <p className="category">Category: {challenge.category}</p>

            <div className="actions">
              {challenge.status === "Not Started" && (
                <button
                  onClick={() => handleStatusChange(challenge.id, "In Progress")}
                >
                  Start Challenge
                </button>
              )}

              {/* Show submission form if challenge is external + in progress */}
              {challenge.type === "external" && challenge.status === "In Progress" && (
                <div className="submission-form">
                  <input
                    type="text"
                    placeholder="Enter GitHub or Drive link..."
                    value={submissionLinks[challenge.id] || ""}
                    onChange={(e) => handleLinkChange(e, challenge.id)}
                    className="submission-input"
                  />
                  <button
                    onClick={() => handleStatusChange(challenge.id, "Completed")}
                    disabled={!submissionLinks[challenge.id]?.trim()}
                  >
                    Submit Solution
                  </button>
                </div>
              )}

              {challenge.status === "Completed" && (
                <button disabled className="completed-btn">
                  ✅ Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {showQuiz && <InteractiveQuiz onClose={() => setShowQuiz(false)} />}
    </div>
  );
};

export default Challenges;
