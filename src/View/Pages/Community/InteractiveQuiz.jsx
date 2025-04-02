import React, { useState } from "react";
import "./interactiveQuiz.scss";
import { useNavigate } from "react-router-dom";

const quizData = [
  {
    question: "What does HTML stand for?",
    options: ["Hyper Trainer Marking Language", "Hyper Text Markup Language", "Hyper Text Marketing Language", "High Tech Modern Language"],
    correctIndex: 1,
  },
  {
    question: "Which one is a JavaScript framework?",
    options: ["Laravel", "Django", "React", "Flask"],
    correctIndex: 2,
  },
  {
    question: "What does CSS stand for?",
    options: ["Cascading Style Sheets", "Creative Style System", "Colorful Style Settings", "Computer Style Sheet"],
    correctIndex: 0,
  },
];

const InteractiveQuiz = ({ onClose }) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const navigate = useNavigate();
  const [showSummary, setShowSummary] = useState(false); // react model to show summary

  
  const handleOptionClick = (index) => {
    if (selected === null) {
      setSelected(index);
      setShowResult(true);
      if (index === currentQ.correctIndex) {
        setScore((prev) => prev + 1);
      }
    }
  };
  
  const handleNext = () => {
    if (current + 1 < quizData.length) {
      setCurrent(current + 1);
      setSelected(null);
      setShowResult(false);
    } else {
        const endTime = Date.now();
        const timeTaken = Math.floor((endTime - startTime) / 1000);
      
        // 🟢 Save to localStorage
        localStorage.setItem("quizBadge", JSON.stringify({
          score,
          total: quizData.length,
          time: timeTaken,
          completed: true,
        }));
      
        setShowSummary({ score, time: timeTaken });
      }      
  };

// Future: send badge result to backend
    /*
    fetch("https://your-backend-api.com/api/quiz-result", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer yourTokenHere" // ← optional
    },
    body: JSON.stringify({
        userId: 1,
        challengeId: "quiz",
        score: score,
        total: quizData.length,
        timeTaken: timeTaken,
        completed: true
    }),
    })
    .then(res => res.json())
    .then(data => {
    console.log("Saved to backend:", data);
    })
    .catch(err => {
    console.error("Failed to save quiz result:", err);
    });
    */


  const currentQ = quizData[current];

  return (
    <div className="quiz-overlay">
      <div className="quiz-box">
        <h3>Question {current + 1} of {quizData.length}</h3>
        <p className="question">{currentQ.question}</p>
        <ul className="options">
          {currentQ.options.map((opt, index) => (
            <li
              key={index}
              className={`option ${showResult && index === currentQ.correctIndex ? "correct" : ""}
                ${showResult && selected === index && selected !== currentQ.correctIndex ? "wrong" : ""}
              `}
              onClick={() => handleOptionClick(index)}
            >
              {opt}
            </li>
          ))}
        </ul>

        <div className="quiz-actions">
          <button onClick={handleNext} disabled={!showResult}>
            {current + 1 < quizData.length ? "Next" : "Finish"}
          </button>
          <button className="quiz-summary-close-btn" onClick={onClose}>X</button>
        </div>
        {showSummary && (
            <div className="quiz-summary-overlay">
                <div className="quiz-summary-box">
                <button className="close-x" onClick={() => setShowSummary(false)}>✖</button>

                <h3>🎉 Quiz Completed!</h3>
                <p>Score: {showSummary.score}/{quizData.length}</p>
                <p>Time Taken: {showSummary.time} seconds</p>
                
                <button onClick={() => navigate("/community/my-badges")}>
                    Go to My Badges
                </button>
                </div>
            </div>
            )}
      </div>
      

    </div>
  );
};

export default InteractiveQuiz;
