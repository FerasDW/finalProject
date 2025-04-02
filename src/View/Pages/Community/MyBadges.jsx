import { useEffect, useState } from "react";
import "./myBadges.scss";

const MyBadges = () => {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    // قراءة نتائج التحديات من localStorage
    const quizBadge = JSON.parse(localStorage.getItem("quizBadge"));

    const availableBadges = [
      {
        id: "quiz",
        title: "Quiz Master",
        description: "Awarded for completing the Quick Quiz challenge.",
        icon: "🏅",
        earned: quizBadge?.completed,
        score: quizBadge?.score,
        time: quizBadge?.time,
      },
      // يمكنك إضافة المزيد من البادجات هنا لاحقًا
    ];

    setBadges(availableBadges);
  }, []);

  return (
    <div className="my-badges-page">
      <h2 className="page-title">🎖️ My Badges</h2>
      <div className="badges-list">
        {badges.map((badge) => (
          <div className={`badge-card ${badge.earned ? "earned" : "locked"}`} key={badge.id}>
            <div className="badge-icon">{badge.icon}</div>
            <div className="badge-content">
              <h4>{badge.title}</h4>
              <p>{badge.description}</p>
              {badge.earned ? (
                <p className="details">
                  ✅ Score: {badge.score} | Time: {badge.time}s
                </p>
              ) : (
                <p className="details">🔒 Not earned yet</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBadges;
