import { useState, useEffect } from "react";
// --- UPDATED ---
// Import the new API function to get a single course
import { getCourseById } from "../Api/coursePageApi.js";

const useCourseData = (id) => {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // --- UPDATED ---
    // This effect now fetches a single course from the backend using its ID.
    const fetchCourse = async () => {
      // Don't try to fetch if there's no ID
      if (!id) {
        setLoading(false);
        setError(new Error("No course ID provided."));
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        const course = await getCourseById(id);
        setCourseData(course);
      } catch (err) {
        // If the API throws an error (e.g., 404 Not Found), we catch it here
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]); // Rerun the effect if the ID in the URL changes

  return { courseData, error, loading };
};

export default useCourseData;