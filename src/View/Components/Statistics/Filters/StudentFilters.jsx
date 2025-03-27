import { useState, useEffect } from "react";

const StudentFilters = ({ onChange }) => {
  const [data, setData] = useState({
    unpaid: false,
    paid: false,
    gpaAbove: "",
    topPercent: "",
    gpaRange: { min: "", max: "" },
    ageRange: { min: "", max: "" },
    year: "",
    semester: "",
  });

  useEffect(() => {
    onChange(data);
  }, [data]);

  return (
    <div>
      <h3>Student Filters</h3>

      <label>
        <input
          type="checkbox"
          checked={data.unpaid}
          onChange={(e) => setData({ ...data, unpaid: e.target.checked })}
        />
        Has not paid tuition
      </label>

      <br />

      <label>
        <input
          type="checkbox"
          checked={data.paid}
          onChange={(e) => setData({ ...data, paid: e.target.checked })}
        />
        Has paid tuition
      </label>

      <br />

      <label>
        GPA above:
        <input
          type="number"
          value={data.gpaAbove}
          onChange={(e) => setData({ ...data, gpaAbove: e.target.value })}
          placeholder="e.g. 85"
          style={{ marginLeft: "10px" }}
        />
      </label>

      <br />

      <label>
        Top % by GPA:
        <input
          type="number"
          value={data.topPercent}
          onChange={(e) => setData({ ...data, topPercent: e.target.value })}
          placeholder="e.g. 5"
          style={{ marginLeft: "10px" }}
        />
      </label>

      <br />

      <label>
        GPA Range:
        <input
          type="number"
          placeholder="Min"
          value={data.gpaRange.min}
          onChange={(e) =>
            setData({
              ...data,
              gpaRange: { ...data.gpaRange, min: e.target.value },
            })
          }
          style={{ margin: "0 5px" }}
        />
        <input
          type="number"
          placeholder="Max"
          value={data.gpaRange.max}
          onChange={(e) =>
            setData({
              ...data,
              gpaRange: { ...data.gpaRange, max: e.target.value },
            })
          }
        />
      </label>

      <br />

      <label>
        Age Range:
        <input
          type="number"
          placeholder="Min"
          value={data.ageRange.min}
          onChange={(e) =>
            setData({
              ...data,
              ageRange: { ...data.ageRange, min: e.target.value },
            })
          }
          style={{ margin: "0 5px" }}
        />
        <input
          type="number"
          placeholder="Max"
          value={data.ageRange.max}
          onChange={(e) =>
            setData({
              ...data,
              ageRange: { ...data.ageRange, max: e.target.value },
            })
          }
        />
      </label>

      <br />

      <label>
        Year:
        <input
          type="number"
          value={data.year}
          onChange={(e) => setData({ ...data, year: e.target.value })}
          placeholder="e.g. 2025"
          style={{ marginLeft: "10px" }}
        />
      </label>

      <br />

      <label>
        Semester:
        <select
          value={data.semester}
          onChange={(e) => setData({ ...data, semester: e.target.value })}
          style={{ marginLeft: "10px" }}
        >
          <option value="">Select</option>
          <option value="Spring">Spring</option>
          <option value="Summer">Summer</option>
          <option value="Fall">Fall</option>
        </select>
      </label>
    </div>
  );
};

export default StudentFilters;
