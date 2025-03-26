import Step1Filters from "./Filters/Step1Filters";
import { students, lecturers } from "../../../Static/statisticsData";

import { useState, useRef } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";


const StatisticsContent = () => {
  const [step, setStep] = useState(1);
  const [filtersData, setFiltersData] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]);

  const steps = ["Filters", "Preview", "Download"];

  const handleStep1Next = ({ userType, filters }) => {
    setFiltersData({ userType, filters });

    let results = [];

    if (userType === "student") {
      results = filterStudents(filters);
    } else {
      results = filterLecturers(filters);
    }

    setFilteredResults(results);
    setStep(2);
  };

  const filterStudents = (filters) => {
    return students.filter((student) => {
      if (filters.unpaid && student.hasPaid) return false;
      if (filters.paid && !student.hasPaid) return false;
      if (filters.gpaAbove && student.gpa < parseFloat(filters.gpaAbove)) return false;
      if (filters.topPercent) {
        const sorted = [...students].sort((a, b) => b.gpa - a.gpa);
        const topCount = Math.ceil((parseFloat(filters.topPercent) / 100) * students.length);
        const topStudents = sorted.slice(0, topCount).map((s) => s.id);
        if (!topStudents.includes(student.id)) return false;
      }
      if (filters.gpaRange.min && student.gpa < parseFloat(filters.gpaRange.min)) return false;
      if (filters.gpaRange.max && student.gpa > parseFloat(filters.gpaRange.max)) return false;
      if (filters.ageRange.min && student.age < parseInt(filters.ageRange.min)) return false;
      if (filters.ageRange.max && student.age > parseInt(filters.ageRange.max)) return false;
      if (filters.year && student.year !== parseInt(filters.year)) return false;
      if (filters.semester && student.semester !== filters.semester) return false;

      return true;
    });
  };

  const filterLecturers = (filters) => {
    return lecturers.filter((lecturer) => {
      if (filters.minCourses && lecturer.courses <= parseInt(filters.minCourses)) return false;
      if (filters.ratingAbove && lecturer.rating < parseFloat(filters.ratingAbove)) return false;
      if (filters.contractType && lecturer.contractType !== filters.contractType) return false;
      return true;
    });
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const title = filtersData?.userType === "student" ? "Student Report" : "Lecturer Report";

    doc.setFontSize(18);
    doc.text(title, 14, 22);

    const tableData = filteredResults.map((item) =>
      filtersData.userType === "student"
        ? [
            item.id,
            item.name,
            item.age,
            item.gpa,
            item.hasPaid ? "Yes" : "No",
            item.year,
            item.semester,
          ]
        : [item.id, item.name, item.courses, item.rating, item.contractType]
    );

    const tableHeaders =
      filtersData.userType === "student"
        ? [["ID", "Name", "Age", "GPA", "Paid", "Year", "Semester"]]
        : [["ID", "Name", "Courses", "Rating", "Contract Type"]];

    doc.autoTable({
      head: tableHeaders,
      body: tableData,
      startY: 30,
    });

    doc.save(`${title.replace(" ", "_")}.pdf`);
  };

  return (
    <div style={{ padding: "30px", maxWidth: "1000px", margin: "auto" }}>
      {/* Horizontal Stepper */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
        {steps.map((label, index) => (
          <div
            key={index}
            onClick={() => setStep(index + 1)}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              borderBottom: step === index + 1 ? "3px solid #007bff" : "1px solid #ccc",
              color: step === index + 1 ? "#007bff" : "#555",
              fontWeight: step === index + 1 ? "bold" : "normal",
              transition: "all 0.2s",
              marginRight: "20px",
            }}
          >
            Step {index + 1}: {label}
          </div>
        ))}
      </div>

      {/* Step content */}
      {step === 1 && <Step1Filters onNext={handleStep1Next} />}

      {step === 2 && (
        <div>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Filtered Results</h2>

          <div style={{ overflowX: "auto" }}>
            <table
              border="1"
              cellPadding="10"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead style={{ backgroundColor: "#f2f2f2" }}>
                <tr>
                  {filtersData.userType === "student" ? (
                    <>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Age</th>
                      <th>GPA</th>
                      <th>Paid</th>
                      <th>Year</th>
                      <th>Semester</th>
                    </>
                  ) : (
                    <>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Courses</th>
                      <th>Rating</th>
                      <th>Contract Type</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>

                    {filtersData.userType === "student" ? (
                      <>
                        <td>{item.age}</td>
                        <td>{item.gpa}</td>
                        <td>{item.hasPaid ? "Yes" : "No"}</td>
                        <td>{item.year}</td>
                        <td>{item.semester}</td>
                      </>
                    ) : (
                      <>
                        <td>{item.courses}</td>
                        <td>{item.rating}</td>
                        <td>{item.contractType}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: "30px", display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setStep(1)} style={buttonStyle}>
              Back to Filters
            </button>

            <button onClick={() => setStep(3)} style={buttonStyle}>
              Go to Download
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <h2>Download Report</h2>
          <p>You can now download the filtered data as a PDF file.</p>
          <button onClick={handleDownloadPDF} style={{ ...buttonStyle, marginTop: "20px" }}>
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default StatisticsContent;
