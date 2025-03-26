import { useState } from "react";
import StudentFilters from "./StudentFilters";
import LecturerFilters from "./LecturerFilters";

const Step1Filters = ({ onNext }) => {
  const [userType, setUserType] = useState("student");
  const [filters, setFilters] = useState({});

  const handleNext = () => {
    onNext({ userType, filters });
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Select Report Target</h2>

      <div>
        <label>
          <input
            type="radio"
            value="student"
            checked={userType === "student"}
            onChange={() => setUserType("student")}
          />
          Student
        </label>

        <label style={{ marginLeft: "20px" }}>
          <input
            type="radio"
            value="lecturer"
            checked={userType === "lecturer"}
            onChange={() => setUserType("lecturer")}
          />
          Lecturer
        </label>
      </div>

      <hr />

      {userType === "student" && (
        <StudentFilters onChange={(data) => setFilters(data)} />
      )}

      {userType === "lecturer" && (
        <LecturerFilters onChange={(data) => setFilters(data)} />
      )}

      <button onClick={handleNext} style={{ marginTop: "20px" }}>
        Next
      </button>
    </div>
  );
};

export default Step1Filters;
