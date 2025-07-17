// formsInputs.js
export const reportsForm = {
  name: "reportQuery",
  label: "Report Query",
  type: "text",
  placeholder: "Enter your report query here...",
};

import { getAllGroups, semesterOptions } from "./coursesData";

export const courseFields = [
  {
    name: "title",
    label: "Course Title",
    type: "text",
    placeholder: "Enter course title",
    required: true,
  },
  {
    name: "code",
    label: "Course Code",
    type: "text",
    placeholder: "e.g., CS101",
    required: true,
  },
  {
    name: "group",
    label: "Program Group",
    type: "select",
    options: getAllGroups(),
    required: true,
  },
  {
    name: "year", // fix
    label: "Academic Year", //
    type: "select",
    options: [],
    required: true,
    dependsOn: "group",
  },
  {
    name: "semester",
    label: "Semester",
    type: "select",
    options: semesterOptions,
    required: true,
  },
  {
    name: "academicYear", // fix
    label: "Year", //
    type: "number",
    value: new Date().getFullYear(),
    required: true,
    disabled: true, 
  },
  {
    name: "students",
    label: "Maximum Students",
    type: "number",
    placeholder: "e.g., 30",
    required: false,
  },
  {
    name: "lessons",
    label: "Number of Lessons",
    type: "number",
    placeholder: "e.g., 12",
    required: false,
  },
  {
    name: "credits",
    label: "Credits",
    type: "number",
    placeholder: "e.g., 3",
    required: false,
  },
  {
    // fix to select instructor by the group 
    name: "instructor", 
    label: "Instructor",
    type: "text",
    placeholder: "Enter instructor name",
    required: false,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter course description",
    required: false,
    rows: 3,
  },
  {
    name: "img",
    label: "Image URL",
    type: "text",
    placeholder: "Enter image URL",
    required: false,
  },

  // add checkbox selectable (yes or no) for the course // קורס בחירה
];

// cvFormFields.js
export const cvFormFields = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your full name",
    required: true,
  },
  {
    name: "title",
    label: "Professional Title",
    type: "text",
    placeholder: "e.g., Software Engineer, Marketing Manager",
    required: true,
  },
  {
    name: "summary",
    label: "Professional Summary",
    type: "textarea",
    placeholder: "Write a brief professional summary about yourself",
    required: false,
  },
  {
    name: "education",
    label: "Education",
    type: "textarea",
    placeholder: "List your educational background",
    required: false,
  },
  {
    name: "experience",
    label: "Work Experience",
    type: "textarea",
    placeholder: "Describe your work experience",
    required: false,
  },
  {
    name: "skills",
    label: "Skills",
    type: "textarea",
    placeholder: "List your skills (comma separated)",
    required: false,
  },
  {
    name: "links",
    label: "Links",
    type: "text",
    placeholder: "LinkedIn, Portfolio, etc.",
    required: false,
  },
];

export const categoryFields = [
  {
    name: "name",
    label: "Category Name",
    placeholder: "e.g., Presentations, Assignments...",
    required: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Brief description of this category...",
    rows: 3,
  },
  {
    name: "color",
    label: "Color",
    type: "radio",
    options: [
      { value: "#3b82f6", label: "Blue" },
      { value: "#10b981", label: "Green" },
      { value: "#f59e0b", label: "Yellow" },
      { value: "#ef4444", label: "Red" },
      { value: "#8b5cf6", label: "Purple" },
      { value: "#06b6d4", label: "Cyan" },
    ],
    required: true,
  },
];

export const uploadFileFields = (categories) => [
  {
    name: "categoryId",
    label: "Select Category",
    type: "select",
    placeholder: "Choose a category...",
    options: categories.map((cat) => ({
      value: cat.id,
      label: cat.name,
    })),
    required: true,
  },
  {
    name: "file",
    label: "Choose File",
    type: "file",
    accept: ".pdf,.docx,.pptx,.txt",
    required: true,
  },
];

export const studentFormFields = [
  {
    name: "photo",
    label: "Profile Photo URL",
    type: "url",
    placeholder: "https://example.com/photo.jpg",
    required: false,
  },
  {
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter student full name",
    required: true,
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "student@example.com",
    required: true,
  },
  {
    name: "division",
    label: "Division",
    type: "select",
    required: true,
    options: [
      { value: "", label: "Select Division" },
      { value: "computer-science", label: "Computer Science" },
      { value: "engineering", label: "Engineering" },
      { value: "mathematics", label: "Mathematics" },
      { value: "physics", label: "Physics" },
      { value: "chemistry", label: "Chemistry" },
    ],
  },
  {
    name: "academicYear",
    label: "Academic Year",
    type: "select",
    required: true,
    options: [
      { value: "", label: "Select Academic Year" },
      { value: "2023-24", label: "2023-24" },
      { value: "2024-25", label: "2024-25" },
      { value: "2025-26", label: "2025-26" },
    ],
  },
  {
    name: "learningGroup",
    label: "Learning Group",
    type: "select",
    required: true,
    options: [
      { value: "", label: "Select Learning Group" },
      { value: "group-a", label: "Group A" },
      { value: "group-b", label: "Group B" },
      { value: "group-c", label: "Group C" },
    ],
  },
  {
    name: "graduationYear",
    label: "Graduation Year",
    type: "select",
    required: true,
    options: [
      { value: "", label: "Select Graduation Year" },
      { value: "2024", label: "2024" },
      { value: "2025", label: "2025" },
      { value: "2026", label: "2026" },
      { value: "2027", label: "2027" },
    ],
  },
  {
    name: "yearGroup",
    label: "Year Group",
    type: "select",
    required: true,
    options: [
      { value: "", label: "Select Year Group" },
      { value: "First Year", label: "First Year" },
      { value: "Second Year", label: "Second Year" },
      { value: "Third Year", label: "Third Year" },
      { value: "Fourth Year", label: "Fourth Year" },
    ],
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { value: "", label: "Select Status" },
      { value: "Active", label: "Active" },
      { value: "Inactive", label: "Inactive" },
      { value: "Graduated", label: "Graduated" },
      { value: "Suspended", label: "Suspended" },
    ],
  },
];

export const studentValidationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
  },
  photo: {
    pattern: /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i,
    message: "Please enter a valid image URL",
  },
};

// announcementsFormFields
import { targetAudienceOptions, priorityOptions } from "./messagesData.js";
export const announcementFormFields = [
  {
    name: "title",
    label: "Announcement Title",
    type: "text",
    required: true,
    placeholder: "Enter announcement title...",
  },
  {
    name: "content",
    label: "Content",
    type: "textarea",
    required: true,
    rows: 6,
    placeholder: "Enter announcement content...",
  },
  {
    name: "targetAudienceType",
    label: "Target Audience",
    type: "select",
    required: true,
    options: targetAudienceOptions,
  },
  {
    name: "priority",
    label: "Priority",
    type: "select",
    required: true,
    options: priorityOptions,
  },
  {
    name: "expiryDate",
    label: "Expiry Date",
    type: "date",
    required: true,
  },
  {
    name: "scheduledDate",
    label: "Schedule for Later (Optional)",
    type: "datetime-local",
    required: false,
  },
];

// messagesFormFields
import {
  templateCategoryOptions,
  templateTargetAudienceOptions,
  templateStatusOptions,
} from "./messagesData.js";

export const templateFormFields = [
  {
    name: "name",
    label: "Template Name",
    type: "text",
    required: true,
    placeholder: "Enter template name...",
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    required: true,
    options: templateCategoryOptions,
  },
  {
    name: "subject",
    label: "Email Subject",
    type: "text",
    required: true,
    placeholder: "Enter email subject (use {variable} for dynamic content)...",
  },
  {
    name: "content",
    label: "Template Content",
    type: "textarea",
    required: true,
    rows: 8,
    placeholder:
      "Enter template content (use {variable} for dynamic content)...",
  },
  {
    name: "variables",
    label: "Variables (comma separated)",
    type: "text",
    required: false,
    placeholder: "e.g., studentName, courseName, date...",
  },
  {
    name: "targetAudience",
    label: "Target Audience",
    type: "select",
    required: true,
    options: templateTargetAudienceOptions,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: templateStatusOptions,
  },
];


// community form fields

// Add these to your formsInputs.js file

// CREATE GROUP FORM FIELDS
export const createGroupFields = [
  {
    name: 'name',
    label: 'Group Name',
    type: 'text',
    placeholder: 'Enter a catchy group name',
    required: true,
    helperText: 'Choose a name that describes your group\'s purpose'
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'What\'s this group about? Who should join?',
    required: true,
    rows: 4,
    helperText: 'Help people understand what your group is for'
  },
  {
    name: 'type',
    label: 'Privacy Setting',
    type: 'radio',
    required: true,
    options: [
      { 
        value: 'Public', 
        label: 'Public - Anyone can join and see content' 
      },
      { 
        value: 'Private', 
        label: 'Private - Only invited members can join' 
      }
    ]
  },
  {
    name: 'img',
    label: 'Group Image (Optional)',
    type: 'file',
    accept: 'image/*',
    helperText: 'Upload a cover image for your group (max 5MB)'
  }
];

// CREATE GROUP VALIDATION RULES
export const createGroupValidation = {
  name: (value) => {
    if (value.length < 3) return 'Group name must be at least 3 characters';
    if (value.length > 100) return 'Group name must be less than 100 characters';
    return null;
  },
  description: (value) => {
    if (value.length < 10) return 'Description must be at least 10 characters';
    if (value.length > 500) return 'Description must be less than 500 characters';
    return null;
  },
  img: (file) => {
    if (file && file.size > 5 * 1024 * 1024) {
      return 'File size must be less than 5MB';
    }
    if (file && !file.type.startsWith('image/')) {
      return 'Please select an image file';
    }
    return null;
  }
};

// INVITE FRIENDS FORM FIELDS
export const inviteFriendsFields = [
  {
    name: 'message',
    label: 'Invitation Message (Optional)',
    type: 'textarea',
    placeholder: 'Hey! You should join this group. I think you\'ll like it!',
    rows: 3,
    helperText: 'Add a personal message to your invitation'
  }
];

// INVITE FRIENDS VALIDATION RULES
export const inviteFriendsValidation = {
  message: (value) => {
    if (value && value.length > 500) {
      return 'Message must be less than 500 characters';
    }
    return null;
  }
};

// UPDATE GROUP FORM FIELDS
export const updateGroupFields = [
  {
    name: 'name',
    label: 'Group Name',
    type: 'text',
    placeholder: 'Enter group name',
    required: true
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Describe your group',
    required: true,
    rows: 4
  },
  {
    name: 'type',
    label: 'Privacy Setting',
    type: 'select',
    required: true,
    options: [
      { value: 'Public', label: 'Public' },
      { value: 'Private', label: 'Private' }
    ]
  },
  {
    name: 'img',
    label: 'Group Image URL (Optional)',
    type: 'url',
    placeholder: 'https://example.com/image.jpg'
  }
];

// UPDATE GROUP VALIDATION RULES
export const updateGroupValidation = {
  name: (value) => {
    if (value.length < 3) return 'Group name must be at least 3 characters';
    if (value.length > 100) return 'Group name must be less than 100 characters';
    return null;
  },
  description: (value) => {
    if (value.length < 10) return 'Description must be at least 10 characters';
    if (value.length > 500) return 'Description must be less than 500 characters';
    return null;
  }
};

// GROUP SEARCH FILTERS
export const groupSearchFields = [
  {
    name: 'searchTerm',
    label: 'Search Groups',
    type: 'search',
    placeholder: 'Search by name or description...'
  },
  {
    name: 'type',
    label: 'Group Type',
    type: 'select',
    options: [
      { value: 'all', label: 'All Types' },
      { value: 'Public', label: 'Public Groups' },
      { value: 'Private', label: 'Private Groups' }
    ]
  },
  {
    name: 'sortBy',
    label: 'Sort By',
    type: 'select',
    options: [
      { value: 'activity', label: 'Most Active' },
      { value: 'members', label: 'Most Members' },
      { value: 'newest', label: 'Newest First' }
    ]
  }
];

// GROUP SETTINGS FORM FIELDS
export const groupSettingsFields = [
  {
    name: 'allowMemberInvites',
    label: 'Allow members to invite friends',
    type: 'checkbox'
  },
  {
    name: 'requireApproval',
    label: 'Require admin approval for new posts',
    type: 'checkbox'
  },
  {
    name: 'allowMemberPromote',
    label: 'Allow members to promote content',
    type: 'checkbox'
  },
  {
    name: 'category',
    label: 'Group Category',
    type: 'select',
    options: [
      { value: 'study', label: 'Study Groups' },
      { value: 'social', label: 'Social & Networking' },
      { value: 'professional', label: 'Professional Development' },
      { value: 'hobby', label: 'Hobbies & Interests' },
      { value: 'sports', label: 'Sports & Fitness' },
      { value: 'tech', label: 'Technology' },
      { value: 'other', label: 'Other' }
    ]
  }
];

// REPORT GROUP FORM FIELDS
export const reportGroupFields = [
  {
    name: 'reason',
    label: 'Reason for Reporting',
    type: 'select',
    required: true,
    options: [
      { value: 'spam', label: 'Spam or Scam' },
      { value: 'harassment', label: 'Harassment or Bullying' },
      { value: 'inappropriate', label: 'Inappropriate Content' },
      { value: 'fake', label: 'Fake Information' },
      { value: 'violence', label: 'Violence or Threats' },
      { value: 'other', label: 'Other' }
    ]
  },
  {
    name: 'details',
    label: 'Additional Details',
    type: 'textarea',
    placeholder: 'Please provide more information about why you\'re reporting this group...',
    rows: 4,
    required: true
  }
];

// REPORT GROUP VALIDATION RULES
export const reportGroupValidation = {
  details: (value) => {
    if (value.length < 10) return 'Please provide more details (at least 10 characters)';
    if (value.length > 1000) return 'Details must be less than 1000 characters';
    return null;
  }
};

// PROMOTE MEMBER FORM FIELDS
export const promoteMemberFields = [
  {
    name: 'role',
    label: 'New Role',
    type: 'select',
    required: true,
    options: [
      { value: 'Member', label: 'Member' },
      { value: 'Co-founder', label: 'Co-founder (Admin)' }
    ]
  },
  {
    name: 'reason',
    label: 'Reason for Promotion (Optional)',
    type: 'textarea',
    placeholder: 'Why are you promoting this member?',
    rows: 2
  }
];

// TRANSFER OWNERSHIP FORM FIELDS
export const transferOwnershipFields = [
  {
    name: 'confirmation',
    label: 'Type "TRANSFER" to confirm',
    type: 'text',
    placeholder: 'TRANSFER',
    required: true,
    helperText: 'This action cannot be undone. You will lose founder privileges.'
  },
  {
    name: 'reason',
    label: 'Reason for Transfer',
    type: 'textarea',
    placeholder: 'Why are you transferring ownership?',
    rows: 3,
    required: true
  }
];

// TRANSFER OWNERSHIP VALIDATION
export const transferOwnershipValidation = {
  confirmation: (value) => {
    if (value !== 'TRANSFER') return 'Please type "TRANSFER" to confirm';
    return null;
  },
  reason: (value) => {
    if (value.length < 10) return 'Please provide a reason (at least 10 characters)';
    return null;
  }
};