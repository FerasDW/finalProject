import React from "react";
import Math from "../Assets/Courses/math.jpg";
import DataStructure from "../Assets/Courses/datastructure.jpg";
import Physics from "../Assets/Courses/physics.png";
import Economy from "../Assets/Courses/economy.jpg";

const coursesList = [
  // Certificate Program (1 Year) - Basic IT Skills
  { id: 101, code: "CERT101", title: "Computer Fundamentals", students: 30, rating: 4.2, lessons: 12, year: "1", semester: "1", group: "Certificate IT", img: DataStructure },
  { id: 102, code: "CERT102", title: "Microsoft Office Suite", students: 30, rating: 4.3, lessons: 12, year: "1", semester: "1", group: "Certificate IT", img: DataStructure },
  { id: 103, code: "CERT103", title: "Internet & Email Basics", students: 30, rating: 4.1, lessons: 10, year: "1", semester: "1", group: "Certificate IT", img: DataStructure },

  { id: 104, code: "CERT201", title: "Basic Web Design", students: 28, rating: 4.4, lessons: 12, year: "1", semester: "2", group: "Certificate IT", img: DataStructure },
  { id: 105, code: "CERT202", title: "Digital Marketing Basics", students: 28, rating: 4.5, lessons: 12, year: "1", semester: "2", group: "Certificate IT", img: Economy },
  { id: 106, code: "CERT203", title: "IT Support Fundamentals", students: 28, rating: 4.3, lessons: 10, year: "1", semester: "2", group: "Certificate IT", img: DataStructure },

  // Diploma Program (2 Years) - Business Administration
  { id: 201, code: "DIP101", title: "Introduction to Business", students: 60, rating: 4.3, lessons: 14, year: "1", semester: "1", group: "Business Diploma", img: Economy },
  { id: 202, code: "DIP102", title: "Principles of Accounting", students: 60, rating: 4.2, lessons: 14, year: "1", semester: "1", group: "Business Diploma", img: Economy },
  { id: 203, code: "DIP103", title: "Business Mathematics", students: 60, rating: 4.0, lessons: 14, year: "1", semester: "1", group: "Business Diploma", img: Math },
  { id: 204, code: "DIP104", title: "Business Communication", students: 60, rating: 4.4, lessons: 12, year: "1", semester: "1", group: "Business Diploma", img: Economy },

  { id: 205, code: "DIP105", title: "Marketing Fundamentals", students: 55, rating: 4.5, lessons: 14, year: "1", semester: "2", group: "Business Diploma", img: Economy },
  { id: 206, code: "DIP106", title: "Human Resource Management", students: 55, rating: 4.3, lessons: 14, year: "1", semester: "2", group: "Business Diploma", img: Economy },
  { id: 207, code: "DIP107", title: "Business Statistics", students: 55, rating: 4.1, lessons: 13, year: "1", semester: "2", group: "Business Diploma", img: Math },
  { id: 208, code: "DIP108", title: "Customer Service", students: 55, rating: 4.6, lessons: 12, year: "1", semester: "2", group: "Business Diploma", img: Economy },

  { id: 209, code: "DIP201", title: "Advanced Accounting", students: 50, rating: 4.4, lessons: 14, year: "2", semester: "1", group: "Business Diploma", img: Economy },
  { id: 210, code: "DIP202", title: "Project Management", students: 50, rating: 4.7, lessons: 14, year: "2", semester: "1", group: "Business Diploma", img: Economy },
  { id: 211, code: "DIP203", title: "Business Law", students: 50, rating: 4.2, lessons: 13, year: "2", semester: "1", group: "Business Diploma", img: Economy },

  { id: 212, code: "DIP204", title: "Strategic Management", students: 48, rating: 4.8, lessons: 14, year: "2", semester: "2", group: "Business Diploma", img: Economy },
  { id: 213, code: "DIP205", title: "Business Internship", students: 48, rating: 4.9, lessons: 12, year: "2", semester: "2", group: "Business Diploma", img: Economy },

  // Bachelor Program (3 Years) - Information Systems
  { id: 301, code: "IS101", title: "Introduction to Information Systems", students: 45, rating: 4.3, lessons: 14, year: "1", semester: "1", group: "Information Systems", img: DataStructure },
  { id: 302, code: "CS101", title: "Programming Fundamentals", students: 45, rating: 4.5, lessons: 14, year: "1", semester: "1", group: "Information Systems", img: DataStructure },
  { id: 303, code: "MATH101", title: "Mathematics for IT", students: 45, rating: 4.2, lessons: 14, year: "1", semester: "1", group: "Information Systems", img: Math },
  { id: 304, code: "ENG101", title: "Technical English", students: 45, rating: 4.0, lessons: 12, year: "1", semester: "1", group: "Information Systems", img: Math },
  { id: 305, code: "IT101", title: "Computer Basics", students: 45, rating: 4.4, lessons: 12, year: "1", semester: "1", group: "Information Systems", img: DataStructure },

  { id: 306, code: "CS102", title: "Object Oriented Programming", students: 42, rating: 4.6, lessons: 14, year: "1", semester: "2", group: "Information Systems", img: DataStructure },
  { id: 307, code: "DB101", title: "Database Management", students: 42, rating: 4.4, lessons: 14, year: "1", semester: "2", group: "Information Systems", img: DataStructure },
  { id: 308, code: "MATH102", title: "Statistics for IT", students: 42, rating: 4.1, lessons: 14, year: "1", semester: "2", group: "Information Systems", img: Math },
  { id: 309, code: "IS102", title: "Systems Analysis", students: 42, rating: 4.3, lessons: 13, year: "1", semester: "2", group: "Information Systems", img: DataStructure },
  { id: 310, code: "NET101", title: "Computer Networks", students: 42, rating: 4.5, lessons: 13, year: "1", semester: "2", group: "Information Systems", img: DataStructure },

  { id: 311, code: "CS201", title: "Data Structures & Algorithms", students: 38, rating: 4.7, lessons: 14, year: "2", semester: "1", group: "Information Systems", img: DataStructure },
  { id: 312, code: "IS201", title: "Information Systems Design", students: 38, rating: 4.4, lessons: 14, year: "2", semester: "1", group: "Information Systems", img: DataStructure },
  { id: 313, code: "WEB201", title: "Web Development", students: 38, rating: 4.6, lessons: 13, year: "2", semester: "1", group: "Information Systems", img: DataStructure },
  { id: 314, code: "DB201", title: "Advanced Database Systems", students: 38, rating: 4.5, lessons: 13, year: "2", semester: "1", group: "Information Systems", img: DataStructure },

  { id: 315, code: "IS202", title: "Enterprise Systems", students: 35, rating: 4.5, lessons: 14, year: "2", semester: "2", group: "Information Systems", img: DataStructure },
  { id: 316, code: "SEC201", title: "Information Security", students: 35, rating: 4.8, lessons: 13, year: "2", semester: "2", group: "Information Systems", img: DataStructure },
  { id: 317, code: "MOB201", title: "Mobile App Development", students: 35, rating: 4.7, lessons: 14, year: "2", semester: "2", group: "Information Systems", img: DataStructure },

  { id: 318, code: "IS301", title: "System Integration", students: 32, rating: 4.6, lessons: 14, year: "3", semester: "1", group: "Information Systems", img: DataStructure },
  { id: 319, code: "AI301", title: "Artificial Intelligence Basics", students: 32, rating: 4.8, lessons: 14, year: "3", semester: "1", group: "Information Systems", img: DataStructure },
  { id: 320, code: "PROJ301", title: "Capstone Project I", students: 32, rating: 4.9, lessons: 12, year: "3", semester: "1", group: "Information Systems", img: DataStructure },

  { id: 321, code: "IS302", title: "IT Management", students: 30, rating: 4.7, lessons: 13, year: "3", semester: "2", group: "Information Systems", img: DataStructure },
  { id: 322, code: "PROJ302", title: "Capstone Project II", students: 30, rating: 4.9, lessons: 14, year: "3", semester: "2", group: "Information Systems", img: DataStructure },

  // Bachelor Program (4 Years) - Nursing
  { id: 401, code: "NUR101", title: "Fundamentals of Nursing", students: 65, rating: 4.6, lessons: 14, year: "1", semester: "1", group: "Nursing", img: Physics },
  { id: 402, code: "ANAT101", title: "Human Anatomy", students: 65, rating: 4.4, lessons: 14, year: "1", semester: "1", group: "Nursing", img: Physics },
  { id: 403, code: "PHYS101", title: "Human Physiology", students: 65, rating: 4.3, lessons: 14, year: "1", semester: "1", group: "Nursing", img: Physics },
  { id: 404, code: "MED101", title: "Medical Terminology", students: 65, rating: 4.2, lessons: 12, year: "1", semester: "1", group: "Nursing", img: Physics },
  { id: 405, code: "PSY101", title: "Psychology in Healthcare", students: 65, rating: 4.5, lessons: 12, year: "1", semester: "1", group: "Nursing", img: Math },

  { id: 406, code: "NUR102", title: "Nursing Practice", students: 62, rating: 4.7, lessons: 14, year: "1", semester: "2", group: "Nursing", img: Physics },
  { id: 407, code: "PHARM101", title: "Pharmacology Basics", students: 62, rating: 4.4, lessons: 14, year: "1", semester: "2", group: "Nursing", img: Physics },
  { id: 408, code: "MIC101", title: "Microbiology", students: 62, rating: 4.3, lessons: 13, year: "1", semester: "2", group: "Nursing", img: Physics },
  { id: 409, code: "COMM101", title: "Healthcare Communication", students: 62, rating: 4.6, lessons: 12, year: "1", semester: "2", group: "Nursing", img: Math },
  { id: 410, code: "ETH101", title: "Medical Ethics", students: 62, rating: 4.5, lessons: 12, year: "1", semester: "2", group: "Nursing", img: Math },

  { id: 411, code: "NUR201", title: "Advanced Nursing Care", students: 58, rating: 4.8, lessons: 14, year: "2", semester: "1", group: "Nursing", img: Physics },
  { id: 412, code: "CLIN201", title: "Clinical Assessment", students: 58, rating: 4.6, lessons: 13, year: "2", semester: "1", group: "Nursing", img: Physics },
  { id: 413, code: "PATH201", title: "Pathophysiology", students: 58, rating: 4.5, lessons: 13, year: "2", semester: "1", group: "Nursing", img: Physics },
  { id: 414, code: "PHARM201", title: "Advanced Pharmacology", students: 58, rating: 4.4, lessons: 14, year: "2", semester: "1", group: "Nursing", img: Physics },

  { id: 415, code: "NUR202", title: "Pediatric Nursing", students: 55, rating: 4.7, lessons: 14, year: "2", semester: "2", group: "Nursing", img: Physics },
  { id: 416, code: "SURG201", title: "Surgical Nursing", students: 55, rating: 4.6, lessons: 14, year: "2", semester: "2", group: "Nursing", img: Physics },
  { id: 417, code: "MENT201", title: "Mental Health Nursing", students: 55, rating: 4.5, lessons: 13, year: "2", semester: "2", group: "Nursing", img: Physics },

  { id: 418, code: "NUR301", title: "Critical Care Nursing", students: 52, rating: 4.8, lessons: 14, year: "3", semester: "1", group: "Nursing", img: Physics },
  { id: 419, code: "COMM301", title: "Community Health Nursing", students: 52, rating: 4.6, lessons: 14, year: "3", semester: "1", group: "Nursing", img: Physics },
  { id: 420, code: "RES301", title: "Nursing Research", students: 52, rating: 4.4, lessons: 13, year: "3", semester: "1", group: "Nursing", img: Math },

  { id: 421, code: "NUR302", title: "Leadership in Nursing", students: 50, rating: 4.7, lessons: 13, year: "3", semester: "2", group: "Nursing", img: Physics },
  { id: 422, code: "CLIN301", title: "Clinical Practicum", students: 50, rating: 4.9, lessons: 14, year: "3", semester: "2", group: "Nursing", img: Physics },

  { id: 423, code: "NUR401", title: "Advanced Clinical Practice", students: 48, rating: 4.8, lessons: 14, year: "4", semester: "1", group: "Nursing", img: Physics },
  { id: 424, code: "CAPSTONE401", title: "Nursing Capstone Project", students: 48, rating: 4.9, lessons: 12, year: "4", semester: "1", group: "Nursing", img: Physics },

  { id: 425, code: "INTERN401", title: "Professional Internship", students: 45, rating: 4.9, lessons: 14, year: "4", semester: "2", group: "Nursing", img: Physics },
  { id: 426, code: "PREP401", title: "NCLEX-RN Preparation", students: 45, rating: 4.8, lessons: 12, year: "4", semester: "2", group: "Nursing", img: Physics }
];

export default coursesList;