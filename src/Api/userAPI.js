import axios from "axios";

export const fetchStudents = async () => {
  const res = await axios.get("http://localhost:8080/api/users/students");
  return res.data;
};

export const fetchLecturers = async () => {
  const res = await axios.get("http://localhost:8080/api/users/lecturers");
  return res.data;
};

export const fetchAdmins = async () => {
  const res = await axios.get("http://localhost:8080/api/users/admins");
  return res.data;
};