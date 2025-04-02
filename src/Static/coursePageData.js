// coursePageData.js

import React from "react";
import Box from "../View/Components/Dashboard/Content/Box";
import PieChart from "../View/Components/Charts/pieCharts";
import CourseDetails from "../View/Components/CoursePage/CourseDetails";

export const courseDetailsData = [
  { label: "Course Code", value: "62187" },
  { label: "Course Type", value: "Lecture" },
  { label: "Course Title", value: "Mobile Application Development" },
  { label: "Instructor", value: "Dr. Badarna Murad", isButton: true },
  { label: "Minimum Passing Grade", value: "56" },
  { label: "Enrolled Students: 99", value: "view all", isButton: true },
  { label: "Class Timing", value: "Thursday 14:00 - 16:30" },
  { label: "Location", value: "Room 7010, Emek Yezreel Campus" },
];

export const enrolledStudentsData = {
  label: "Enrolled Students",
  value: "100",
  buttonText: "view all",
};

export const courseData = [
  { id: "attendant", value: 40 },
  { id: "not attendant", value: 30 },
  { id: "approved", value: 30 },
];


export const contentConfig = {
  1100: (
    <>
      <div className="row" style={{marginTop:"10px"}}>
        <Box
          title="Course Details"
          contentBox={<CourseDetails />}
          gridRow="span 1"
          gridColumn="span 8"
        />
        <Box
          title="Progress studies percentage"
          chart={<PieChart data={courseData} />}
          gridRow="span 1"
          gridColumn="span 4"
        />
        </div>
        
      
    </>
  ),
  student: (
    <>
      {/* <div className="row">
        <Box
          title="Course Information"
          contentBox={<CourseDetails />}
          gridRow="span 12"
          bgColor="#fffccc"
          gridColumn="span 12"
        />
        <Box
          contentBox={<Announcements />}
          bgColor="#e0e0e0"
          gridColumn="span 6"
          gridRow="span 6"
        />
        <Box
          contentBox={<Materials />}
          bgColor="#f5f5f5"
          gridColumn="span 6"
          gridRow="span 6"
        />
        <Box
          contentBox={<EnrolledStudents />}
          gridColumn="span 6"
          gridRow="span 2"
        />
      </div> */}
    </>
  ),
};
export const courseMaterials = [
  {
    title: "Course Readings",
    files: [
      { title: "Book Chapter 1", link: "/files/chapter1.pdf" },
      { title: "Book Chapter 2", link: "/files/chapter2.pdf" },
    ],
  },
  {
    title: "Lecture Files",
    files: [
      { title: "Lecture 1 - Introduction", link: "/files/lecture1.pdf" },
      { title: "Lecture 2 - UI Design", link: "/files/lecture2.pdf" },
      { title: "Lecture 3 - Advanced Concepts", link: "/files/lecture3.pdf" },
    ],
  },
  {
    title: "Assistant Files",
    files: [{ title: "Lecture 1 - Introduction", link: "/files/lecture1.pdf" }],
  },
  {
    title: "Project Guidelines",
    files: [
      { title: "Project Guidelines", link: "/files/project-guidelines.pdf" },
    ],
  },
];

export const announcements = [
  {
    title: "Midterm Exam scheduled for April 15, 2025",
    content:
      "  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nulla facilisi. Mauris ultrices eros in cursus turpis massa. Nullam eget felis eget nunc lobortis. Vivamus arcu felis bibendum ut tristique et egestas. Sed viverra ipsum nunc aliquet bibendum enim facilisis gravida neque. Integer malesuada nunc vel risus commodo viverra. Lectus sit amet est placerat in egestas erat imperdiet. Amet massa vitae tortor condimentum lacinia quis vel. Dui id ornare arcu odio ut sem nulla pharetra diam. ",
  },
  {
    title: "New Assignment uploaded! Due: March 25, 2025",
    content: "Details about the new assignment...",
  },
  {
    title: "No lecture on March 20, 2025",
    content: "Information regarding the canceled lecture...",
  },
  {
    title: "No lecture on March 20, 2025",
    content: "Information regarding the canceled lecture...",
  },
];

export const assignments = [
  { title: "Assignment 1", content: "Due: March 25, 2025" },
  { title: "Assignment 2", content: "Due: April 10, 2025" },
  { title: "Midterm Exam", content: "Date: April 15, 2025" },
  { title: "Final Project", content: "Submission: May 30, 2025" },
];
