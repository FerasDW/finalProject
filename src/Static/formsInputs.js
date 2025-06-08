export const reportsForm = {
  name: "reportQuery",
  label: "Report Query",
  type: "text",
  placeholder: "Enter your report query here...",
};

export const courseFields = [
  {
    name: 'title',
    label: 'Course Title',
    type: 'text',
    placeholder: 'Enter course title',
    required: true,
  },
  {
    name: 'code',
    label: 'Course Code',
    type: 'text',
    placeholder: 'e.g., CS101',
    required: true,
  },
  {
    name: 'year',
    label: 'Year',
    type: 'select',
    options: [
      { label: 'First Year', value: '1' },
      { label: 'Second Year', value: '2' },
      { label: 'Third Year', value: '3' },
      { label: 'Fourth Year', value: '4' },
    ],
    required: true,
  },
  {
    name: 'semester',
    label: 'Semester',
    type: 'select',
    options: [
      { label: 'First Semester', value: '1' },
      { label: 'Second Semester', value: '2' },
    ],
    required: true,
  },
  {
    name: 'group',
    label: 'Program Group',
    type: 'select',
    options: [
      { label: 'Information Systems', value: 'Information Systems' },
      { label: 'Certificate IT', value: 'Certificate IT' },
      { label: 'Business Diploma', value: 'Business Diploma' },
      { label: 'Nursing', value: 'Nursing' },
    ],
    required: true,
  },
  {
    name: 'students',
    label: 'Number of Students',
    type: 'number',
    placeholder: 'e.g., 30',
    required: false,
  },
  {
    name: 'lessons',
    label: 'Number of Lessons',
    type: 'number',
    placeholder: 'e.g., 12',
    required: false,
  },
  {
    name: 'rating',
    label: 'Rating',
    type: 'number',
    placeholder: 'e.g., 4.5',
    required: false,
  },
  {
    name: 'img',
    label: 'Image URL',
    type: 'text',
    placeholder: 'Enter image URL',
    required: false,
  }
];

// cvFormFields.js
export const cvFormFields = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your full name",
    required: true
  },
  {
    name: "title",
    label: "Professional Title",
    type: "text",
    placeholder: "e.g., Software Engineer, Marketing Manager",
    required: true
  },
  {
    name: "summary",
    label: "Professional Summary",
    type: "textarea",
    placeholder: "Write a brief professional summary about yourself",
    required: false
  },
  {
    name: "education",
    label: "Education",
    type: "textarea",
    placeholder: "List your educational background",
    required: false
  },
  {
    name: "experience",
    label: "Work Experience",
    type: "textarea",
    placeholder: "Describe your work experience",
    required: false
  },
  {
    name: "skills",
    label: "Skills",
    type: "textarea",
    placeholder: "List your skills (comma separated)",
    required: false
  },
  {
    name: "links",
    label: "Links",
    type: "text",
    placeholder: "LinkedIn, Portfolio, etc.",
    required: false
  }
];