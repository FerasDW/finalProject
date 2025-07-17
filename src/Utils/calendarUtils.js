export const assignmentFields = [
  {
    label: "Title",
    name: "title",
    type: "text",
    required: true,
  },
  {
    label: "Type",
    name: "type",
    type: "select",
    options: ["assignment", "exam", "project"],
    required: true,
  },
  {
    label: "Due Date",
    name: "dueDate",
    type: "date",
    required: true,
  },
  {
    label: "Description",
    name: "description",
    type: "textarea",
  },
  {
    label: "Progress",
    name: "progress",
    type: "number",
    min: 0,
    max: 100,
  },
  {
    label: "Badges",
    name: "badges",
    type: "select",
    options: ["urgent", "important", "optional"],
    multiple: true,
  },
];