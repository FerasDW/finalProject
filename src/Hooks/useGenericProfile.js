import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit,
  Eye,
  Check,
  X,
  Download,
  FileText,
  Book,
  Calendar,
  Users,
  Award,
  TrendingUp,
  Clock,
  Star,
} from "lucide-react";
import { profileConfigs } from "../Static/genericProfilePageData.js";
import { getLetterGrade, getStudentEnrolledCourses } from "../Utils/genericProfileUtils.js";

const useGenericProfile = (entityType, id, initialSection) => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState({});
  const [statCards, setStatCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(initialSection);
  const [selectedYear, setSelectedYear] = useState("");
  const [showActions, setShowActions] = useState(false);
  const [editGradeModalOpen, setEditGradeModalOpen] = useState(false);
  const [addGradeModalOpen, setAddGradeModalOpen] = useState(false);
  const [editCourseModalOpen, setEditCourseModalOpen] = useState(false);
  const [addCourseModalOpen, setAddCourseModalOpen] = useState(false);
  const [editEnrollmentModalOpen, setEditEnrollmentModalOpen] = useState(false);
  const [addEnrollmentModalOpen, setAddEnrollmentModalOpen] = useState(false);
  const [editScheduleModalOpen, setEditScheduleModalOpen] = useState(false);
  const [addScheduleModalOpen, setAddScheduleModalOpen] = useState(false);
  const [editResourceModalOpen, setEditResourceModalOpen] = useState(false);
  const [addResourceModalOpen, setAddResourceModalOpen] = useState(false);
  const [viewRequestModalOpen, setViewRequestModalOpen] = useState(false);
  const [responseRequestModalOpen, setResponseRequestModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({});
  const [requestResponse, setRequestResponse] = useState("");
  const { availableCourses, generateScheduleData, generateResourcesData } = profileConfigs;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const validEntityTypes = ["student", "lecturer"];
        if (!entityType || !validEntityTypes.includes(entityType)) {
          throw new Error(`Invalid entity type: "${entityType}"`);
        }

        const sanitizedId = parseInt(id);
        if (isNaN(sanitizedId) || sanitizedId <= 0) {
          throw new Error(`Invalid ID: "${id}"`);
        }

        const config = profileConfigs[entityType];
        if (!config || !config.dataSource?.length) {
          throw new Error(`No data available for ${entityType}`);
        }

        const data = config.getProfileData(sanitizedId);
        const mainEntity = entityType === "student" ? data.student : data.lecturer;
        if (!mainEntity) {
          throw new Error(`${entityType} with ID ${sanitizedId} not found`);
        }

        setProfileData({ ...data, config });
        setStats(config.getStats(data));
        setStatCards(config.getStatCards(config.getStats(data)));
      } catch (err) {
        console.error("Profile loading error:", err.message);
        setError(err.message);
        setTimeout(() => {
          const dashboardRoute = entityType === "student" ? "/students" : "/lecturers";
          navigate(dashboardRoute, { replace: true });
        }, 5000);
      } finally {
        setLoading(false);
      }
    };

    if (entityType && id) {
      loadProfile();
    } else {
      setError("Missing required parameters");
      setLoading(false);
    }
  }, [entityType, id, navigate]);

  const gradeFormFields = useMemo(
    () => [
      {
        name: "courseCode",
        label: "Course",
        type: "select",
        required: true,
        options: getStudentEnrolledCourses(profileData),
      },
      {
        name: "grade",
        label: "Grade (0-100)",
        type: "number",
        required: true,
        min: 0,
        max: 100,
        step: 0.1,
        placeholder: "Enter grade between 0 and 100",
      },
      { name: "credits", label: "Credits", type: "number", required: true, min: 1, max: 6 },
      {
        name: "semester",
        label: "Semester",
        type: "select",
        required: true,
        options: [
          { value: "Fall 2024", label: "Fall 2024" },
          { value: "Spring 2025", label: "Spring 2025" },
          { value: "Summer 2025", label: "Summer 2025" },
          { value: "Fall 2025", label: "Fall 2025" },
        ],
      },
    ],
    [profileData]
  );

  const editGradeFormFields = [
    { name: "courseCode", label: "Course Code", type: "text", required: true, disabled: true },
    { name: "courseName", label: "Course Name", type: "text", required: true, disabled: true },
    {
      name: "grade",
      label: "Grade (0-100)",
      type: "number",
      required: true,
      min: 0,
      max: 100,
      step: 0.1,
      placeholder: "Enter grade between 0 and 100",
    },
    { name: "credits", label: "Credits", type: "number", required: true, min: 1, max: 6 },
    { name: "semester", label: "Semester", type: "text", required: true, disabled: true },
  ];

  const lecturerCourseFormFields = [
    {
      name: "courseCode",
      label: "Course to Assign",
      type: "select",
      required: true,
      options: availableCourses,
    },
    {
      name: "semester",
      label: "Semester",
      type: "select",
      required: true,
      options: [
        { value: "Fall 2024", label: "Fall 2024" },
        { value: "Spring 2025", label: "Spring 2025" },
        { value: "Summer 2025", label: "Summer 2025" },
        { value: "Fall 2025", label: "Fall 2025" },
      ],
    },
    { name: "classSize", label: "Expected Class Size", type: "number", required: true, min: 1, max: 200 },
    { name: "notes", label: "Additional Notes", type: "textarea", required: false },
  ];

  const courseFormFields = [
    {
      name: "courseCode",
      label: "Course Code",
      type: "text",
      required: true,
      pattern: "[A-Z]{2,4}[0-9]{3}",
      placeholder: "e.g., CS101",
    },
    { name: "courseName", label: "Course Name", type: "text", required: true },
    { name: "credits", label: "Credits", type: "number", required: true, min: 1, max: 6 },
    {
      name: "semester",
      label: "Semester",
      type: "select",
      required: true,
      options: [
        { value: "Fall 2024", label: "Fall 2024" },
        { value: "Spring 2025", label: "Spring 2025" },
        { value: "Summer 2025", label: "Summer 2025" },
        { value: "Fall 2025", label: "Fall 2025" },
      ],
    },
    { name: "department", label: "Department", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea", required: false },
  ];

  const enrollmentFormFields = [
    {
      name: "courseCode",
      label: "Course Code",
      type: "select",
      required: true,
      options: availableCourses,
    },
    {
      name: "semester",
      label: "Semester",
      type: "select",
      required: true,
      options: [
        { value: "Fall 2024", label: "Fall 2024" },
        { value: "Spring 2025", label: "Spring 2025" },
        { value: "Summer 2025", label: "Summer 2025" },
        { value: "Fall 2025", label: "Fall 2025" },
      ],
    },
    { name: "instructor", label: "Instructor", type: "text", required: true },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { value: "enrolled", label: "Enrolled" },
        { value: "pending", label: "Pending" },
        { value: "dropped", label: "Dropped" },
      ],
    },
  ];

  const scheduleFormFields = [
    {
      name: "day",
      label: "Day",
      type: "select",
      required: true,
      options: [
        { value: "Monday", label: "Monday" },
        { value: "Tuesday", label: "Tuesday" },
        { value: "Wednesday", label: "Wednesday" },
        { value: "Thursday", label: "Thursday" },
        { value: "Friday", label: "Friday" },
        { value: "Saturday", label: "Saturday" },
      ],
    },
    { name: "startTime", label: "Start Time", type: "time", required: true },
    { name: "endTime", label: "End Time", type: "time", required: true },
    {
      name: "availability",
      label: "Availability Status",
      type: "select",
      required: true,
      options: [
        { value: "available", label: "Available" },
        { value: "busy", label: "Busy" },
        { value: "preferred", label: "Preferred Hours" },
      ],
    },
    { name: "notes", label: "Notes", type: "textarea", required: false },
  ];

  const resourceFormFields = [
    {
      name: "type",
      label: "Information Type",
      type: "select",
      required: true,
      options: [
        { value: "cv", label: "CV/Resume" },
        { value: "education", label: "Educational Background" },
        { value: "research", label: "Research Work" },
        { value: "milestone", label: "Career Milestone" },
        { value: "publication", label: "Publication" },
        { value: "award", label: "Award/Recognition" },
      ],
    },
    { name: "title", label: "Title", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea", required: true },
    { name: "date", label: "Date", type: "date", required: false },
    { name: "institution", label: "Institution/Organization", type: "text", required: false },
    { name: "url", label: "URL/Link", type: "url", required: false },
    { name: "tags", label: "Tags (comma separated)", type: "text", required: false },
  ];

  const generateWorkingHoursCards = () => [
    {
      id: "weekly-hours",
      title: "Weekly Hours",
      value: "40",
      icon: <Clock />,
      trend: { value: "5%", isPositive: true },
      description: "Total working hours per week",
      backgroundColor: "#6366f1",
    },
    {
      id: "available-days",
      title: "Available Days",
      value: "5",
      icon: <Calendar />,
      trend: { value: "2", isPositive: true },
      description: "Days available for teaching",
      backgroundColor: "#ec4899",
    },
    {
      id: "office-hours",
      title: "Office Hours",
      value: "12",
      icon: <Users />,
      trend: { value: "3", isPositive: true },
      description: "Weekly office hours",
      backgroundColor: "#06b6d4",
    },
    {
      id: "preferred-slots",
      title: "Preferred Slots",
      value: "8",
      icon: <Star />,
      trend: { value: "2", isPositive: true },
      description: "Preferred teaching time slots",
      backgroundColor: "#10b981",
    },
  ];

  const generateProfileCards = () => [
    {
      id: "cv-status",
      title: "CV Status",
      value: "Updated",
      icon: <FileText />,
      trend: { value: "Jan 2024", isPositive: true },
      description: "Last CV update",
      backgroundColor: "#f59e0b",
    },
    {
      id: "education-records",
      title: "Education",
      value: "3",
      icon: <Award />,
      trend: { value: "Degrees", isPositive: true },
      description: "Educational qualifications",
      backgroundColor: "#8b5cf6",
    },
    {
      id: "research-projects",
      title: "Research",
      value: "5",
      icon: <Book />,
      trend: { value: "Active", isPositive: true },
      description: "Research projects",
      backgroundColor: "#3b82f6",
    },
    {
      id: "career-milestones",
      title: "Milestones",
      value: "12",
      icon: <TrendingUp />,
      trend: { value: "Achievements", isPositive: true },
      description: "Career achievements",
      backgroundColor: "#ef4444",
    },
  ];

  const TableSection = ({
    title,
    description,
    data,
    showAddButton = true,
    onAddClick,
    actionButtons = [],
    entityType = "records",
    icon = "default",
    columnConfig = {},
    hiddenColumns = [],
    children,
  }) => (
    <div className="table-section">
      {children}
      <DynamicTable
        data={data}
        title={title}
        entityType={entityType}
        icon={icon}
        searchPlaceholder={`Search ${entityType}...`}
        addButtonText={`Add ${entityType.slice(0, -1)}`}
        showAddButton={showAddButton}
        onAddClick={onAddClick}
        actionButtons={actionButtons}
        columnConfig={columnConfig}
        hiddenColumns={hiddenColumns}
        rowsPerPage={10}
        compact={false}
      />
    </div>
  );

  const handleEditGrade = (row) => {
    setSelectedRecord(row);
    setFormData