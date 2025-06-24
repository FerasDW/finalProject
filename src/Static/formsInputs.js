// formsInputs.js
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

export const categoryFields = [
  {
    name: 'name',
    label: 'Category Name',
    placeholder: 'e.g., Presentations, Assignments...',
    required: true,
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Brief description of this category...',
    rows: 3,
  },
  {
    name: 'color',
    label: 'Color',
    type: 'radio',
    options: [
      { value: '#3b82f6', label: 'Blue' },
      { value: '#10b981', label: 'Green' },
      { value: '#f59e0b', label: 'Yellow' },
      { value: '#ef4444', label: 'Red' },
      { value: '#8b5cf6', label: 'Purple' },
      { value: '#06b6d4', label: 'Cyan' },
    ],
    required: true,
  }
];

export const uploadFileFields = (categories) => [
  {
    name: 'categoryId',
    label: 'Select Category',
    type: 'select',
    placeholder: 'Choose a category...',
    options: categories.map(cat => ({
      value: cat.id,
      label: cat.name
    })),
    required: true,
  },
  {
    name: 'file',
    label: 'Choose File',
    type: 'file',
    accept: ".pdf,.docx,.pptx,.txt",
    required: true,
  }
];

export const studentFormFields = [
  {
    name: 'photo',
    label: 'Profile Photo URL',
    type: 'url',
    placeholder: 'https://example.com/photo.jpg',
    required: false
  },
  {
    name: 'name',
    label: 'Full Name',
    type: 'text',
    placeholder: 'Enter student full name',
    required: true
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'student@example.com',
    required: true
  },
  {
    name: 'division',
    label: 'Division',
    type: 'select',
    required: true,
    options: [
      { value: '', label: 'Select Division' },
      { value: 'computer-science', label: 'Computer Science' },
      { value: 'engineering', label: 'Engineering' },
      { value: 'mathematics', label: 'Mathematics' },
      { value: 'physics', label: 'Physics' },
      { value: 'chemistry', label: 'Chemistry' }
    ]
  },
  {
    name: 'academicYear',
    label: 'Academic Year',
    type: 'select',
    required: true,
    options: [
      { value: '', label: 'Select Academic Year' },
      { value: '2023-24', label: '2023-24' },
      { value: '2024-25', label: '2024-25' },
      { value: '2025-26', label: '2025-26' }
    ]
  },
  {
    name: 'learningGroup',
    label: 'Learning Group',
    type: 'select',
    required: true,
    options: [
      { value: '', label: 'Select Learning Group' },
      { value: 'group-a', label: 'Group A' },
      { value: 'group-b', label: 'Group B' },
      { value: 'group-c', label: 'Group C' }
    ]
  },
  {
    name: 'graduationYear',
    label: 'Graduation Year',
    type: 'select',
    required: true,
    options: [
      { value: '', label: 'Select Graduation Year' },
      { value: '2024', label: '2024' },
      { value: '2025', label: '2025' },
      { value: '2026', label: '2026' },
      { value: '2027', label: '2027' }
    ]
  },
  {
    name: 'yearGroup',
    label: 'Year Group',
    type: 'select',
    required: true,
    options: [
      { value: '', label: 'Select Year Group' },
      { value: 'First Year', label: 'First Year' },
      { value: 'Second Year', label: 'Second Year' },
      { value: 'Third Year', label: 'Third Year' },
      { value: 'Fourth Year', label: 'Fourth Year' }
    ]
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    options: [
      { value: '', label: 'Select Status' },
      { value: 'Active', label: 'Active' },
      { value: 'Inactive', label: 'Inactive' },
      { value: 'Graduated', label: 'Graduated' },
      { value: 'Suspended', label: 'Suspended' }
    ]
  }
];

export const studentValidationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  photo: {
    pattern: /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i,
    message: 'Please enter a valid image URL'
  }
};

// announcementsFormFields
import { targetAudienceOptions, priorityOptions } from "./messagesData.js";
export const announcementFormFields = [
  {
    name: "title",
    label: "Announcement Title",
    type: "text",
    required: true,
    placeholder: "Enter announcement title..."
  },
  {
    name: "content",
    label: "Content",
    type: "textarea",
    required: true,
    rows: 6,
    placeholder: "Enter announcement content..."
  },
  {
    name: "targetAudienceType",
    label: "Target Audience",
    type: "select",
    required: true,
    options: targetAudienceOptions
  },
  {
    name: "priority",
    label: "Priority",
    type: "select",
    required: true,
    options: priorityOptions
  },
  {
    name: "expiryDate",
    label: "Expiry Date",
    type: "date",
    required: true
  },
  {
    name: "scheduledDate",
    label: "Schedule for Later (Optional)",
    type: "datetime-local",
    required: false
  }
];

// messagesFormFields
import { templateCategoryOptions, templateTargetAudienceOptions, templateStatusOptions } from "./messagesData.js";

export const templateFormFields = [
  {
    name: "name",
    label: "Template Name",
    type: "text",
    required: true,
    placeholder: "Enter template name..."
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    required: true,
    options: templateCategoryOptions
  },
  {
    name: "subject",
    label: "Email Subject",
    type: "text",
    required: true,
    placeholder: "Enter email subject (use {variable} for dynamic content)..."
  },
  {
    name: "content",
    label: "Template Content",
    type: "textarea",
    required: true,
    rows: 8,
    placeholder: "Enter template content (use {variable} for dynamic content)..."
  },
  {
    name: "variables",
    label: "Variables (comma separated)",
    type: "text",
    required: false,
    placeholder: "e.g., studentName, courseName, date..."
  },
  {
    name: "targetAudience",
    label: "Target Audience",
    type: "select",
    required: true,
    options: templateTargetAudienceOptions
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: templateStatusOptions
  }
];