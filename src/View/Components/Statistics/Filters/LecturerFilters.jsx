import { useState, useEffect } from "react";

const LecturerFilters = ({ onChange }) => {
  const [data, setData] = useState({
    minCourses: "",
    ratingAbove: "",
    contractType: "",
  });

  useEffect(() => {
    onChange(data);
  }, [data]);

  return (
    <div>
      <h3>Lecturer Filters</h3>

      <label>
        Teaches more than:
        <input
          type="number"
          value={data.minCourses}
          onChange={(e) => setData({ ...data, minCourses: e.target.value })}
          placeholder="e.g. 3"
          style={{ marginLeft: "10px" }}
        />
      </label>

      <br />

      <label>
        Rating above:
        <input
          type="number"
          value={data.ratingAbove}
          onChange={(e) => setData({ ...data, ratingAbove: e.target.value })}
          placeholder="e.g. 4.5"
          style={{ marginLeft: "10px" }}
        />
      </label>

      <br />

      <label>
        Contract Type:
        <select
          value={data.contractType}
          onChange={(e) =>
            setData({ ...data, contractType: e.target.value })
          }
          style={{ marginLeft: "10px" }}
        >
          <option value="">Select</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
        </select>
      </label>
    </div>
  );
};

export default LecturerFilters;
