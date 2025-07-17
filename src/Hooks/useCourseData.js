// hooks/useCourseData.js
import { useState, useEffect } from "react";
import { getCourseById } from "../Utils/courseUtils.js"; // Note: This function needs to be added to coursesUtils.js
import { coursesList } from "../Static/FIxed/coursesData.js";

const useCourseData = (id, locationState) => {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      const course = getCourseById(parseInt(id), coursesList) || (locationState?.course ? locationState.course : null);
      if (!course) {
        setError(new Error("Course not found"));
      } else {
        setCourseData(course);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [id, locationState]);

  return { courseData, error, loading };
};

export default useCourseData;

