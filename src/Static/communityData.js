import Friends from "../Assets/1.png";
import Groups from "../Assets/2.png";
import Market from "../Assets/3.png";
import Watch from "../Assets/4.png";
import Memories from "../Assets/5.png";

import JobBoard from "../Assets/Icons/Job.png";
import Resume from "../Assets/Icons/CV.png";
import Applications from "../Assets/Icons/Applications.png";
import Saved from "../Assets/Icons/Bookmark.png";
import Challenges from "../Assets/Icons/Challenges.png";
import Badges from "../Assets/Icons/Badges.png";

// ==============================
// User & Profile Data
// ==============================
export const currentUser = {
  id: 1,
  name: "Muhammed Taha",
  profilePic: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
};

export const users = [
  {
    id: 1,
    name: "Muhammed Taha",
    profilePic: currentUser.profilePic,
  },
  {
    id: 2,
    name: "Amelia Clark",
    profilePic: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
  },
  {
    id: 3,
    name: "Ethan Lee",
    profilePic: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
  },
  {
    id: 4,
    name: "Grace Hall",
    profilePic: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg",
  },
  {
    id: 5,
    name: "Jane Smith",
    profilePic: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg",
  },
  {
    id: 6,
    name: "Ahmed Ali",
    profilePic: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg",
  },
];

// ==============================
// Posts (Feed / Profile)
// ==============================
export const mockPosts = [
  {
    id: 1,
    name: currentUser.name,
    userId: currentUser.id,
    profilePic: currentUser.profilePic,
    desc: "Excited to share my new project with you all!",
    img: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg",
    role: "Student",
  },
  {
    id: 2,
    name: users[4].name,
    userId: users[4].id,
    profilePic: users[4].profilePic,
    desc: "Loving the view from here 🏞️",
    img: "https://images.pexels.com/photos/3573351/pexels-photo-3573351.jpeg",
    role: "Student",
  },
  {
    id: 3,
    name: users[5].name,
    userId: users[5].id,
    profilePic: users[5].profilePic,
    desc: "Any React devs here? Let’s connect!",
    img: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
    role: "Lecturer",
  },
];

// ==============================
// Groups & Group Posts
// ==============================
export const groupsList = [
  {
    id: 1,
    name: "AI & Machine Learning Club",
    description: "Discuss ML papers, share projects, and collaborate on AI challenges.",
    members: 112,
    type: "Public",
    img: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
  },
  {
    id: 2,
    name: "YVC Engineering Department",
    description: "Official group for engineering students and faculty at YVC.",
    members: 58,
    type: "Private",
    img: "https://images.pexels.com/photos/256658/pexels-photo-256658.jpeg",
  },
  {
    id: 3,
    name: "Women in Tech - YVC",
    description: "Empowering women in STEM fields through mentorship and support.",
    members: 84,
    type: "Public",
    img: "https://images.pexels.com/photos/3810792/pexels-photo-3810792.jpeg",
  },
  {
    id: 4,
    name: "Creative Designers",
    description: "A place for design students to share ideas, portfolios, and inspiration.",
    members: 37,
    type: "Public",
    img: "https://images.pexels.com/photos/3153201/pexels-photo-3153201.jpeg",
  },
];

export const groupPosts = {
  1: [
    {
      id: 101,
      user: "Ethan Lee",
      content: "Check out this cool ML paper I found!",
      date: "2h ago",
    },
    {
      id: 102,
      user: "Muhammed Taha",
      content: "Does anyone want to collaborate on a YOLO project?",
      date: "1d ago",
    },
  ],
  2: [
    {
      id: 201,
      user: "Grace Hall",
      content: "Reminder: Engineering meetup this Thursday.",
      date: "3h ago",
    },
  ],
  3: [],
  4: [
    {
      id: 401,
      user: "Jane Smith",
      content: "Sharing my final exam summary for 'Design Theory 101'. Hope this helps!",
      date: "1d ago",
      file: {
        name: "Design-Theory-Summary.pdf",
        url: "https://example.com/files/Design-Theory-Summary.pdf",
      },
    },
    {
      id: 402,
      user: "Muhammed Taha",
      content: "Attached is a PPT for last semester's project showcase.",
      date: "2d ago",
      file: {
        name: "Project-Showcase-2024.pptx",
        url: "https://example.com/files/Project-Showcase-2024.pptx",
      },
    },
  ],
};

// ==============================
// Friends Page
// ==============================
export const friendsList = [
  {
    id: 2,
    name: users[1].name,
    role: "Student",
    title: "Computer Science, 3rd year",
    university: "Yezreel Valley College",
    profilePic: users[1].profilePic,
  },
  {
    id: 3,
    name: users[2].name,
    role: "Lecturer",
    title: "AI & Machine Learning",
    university: "Yezreel Valley College",
    profilePic: users[2].profilePic,
  },
  {
    id: 5,
    name: users[4].name,
    role: "Student",
    title: "Business Admin, 2nd year",
    university: "Yezreel Valley College",
    profilePic: users[4].profilePic,
  },
];

// ==============================
// Suggested Friends
// ==============================
export const suggestedFriends = [
  {
    id: 11,
    name: "Lina Bar",
    profilePic: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg",
    role: "Student",
    title: "Psychology, 2nd year",
    university: "Yezreel Valley College",
  },
  {
    id: 12,
    name: "Adam Ron",
    profilePic: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    role: "Lecturer",
    title: "Cyber Security",
    university: "Yezreel Valley College",
  },
  {
    id: 13,
    name: "Noa Klein",
    profilePic: "https://images.pexels.com/photos/301899/pexels-photo-301899.jpeg",
    role: "Student",
    title: "Software Engineering",
    university: "Yezreel Valley College",
  },
  {
    id: 14,
    name: "Maya Levi",
    profilePic: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    role: "Student",
    title: "Marketing & Media",
    university: "Yezreel Valley College",
  },
];

// ==============================
// Comments
// ==============================
export const commentUser = currentUser;

export const initialComments = [
  {
    id: 1,
    desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    name: users[3].name,
    userId: users[3].id,
    profilePicture: users[3].profilePic,
  },
  {
    id: 2,
    desc: "Another comment here!",
    name: users[2].name,
    userId: users[2].id,
    profilePicture: users[2].profilePic,
  },
];

// ==============================
// Stories
// ==============================
export const stories = users
  .filter((u) => u.id !== currentUser.id)
  .map((u) => ({ id: u.id, name: u.name, img: u.profilePic }));

// ==============================
// RightBar: Suggestions & Activities
// ==============================

export const suggestions = [
  {
    id: 7,
    name: "Emily Clark",
    img: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
  },
  {
    id: 8,
    name: "James Miller",
    img: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
  },
];

export const activities = [
  {
    id: 1,
    name: currentUser.name,
    action: "updated their profile picture",
    img: currentUser.profilePic,
    time: "5 mins ago",
  },
  {
    id: 2,
    name: users[2].name,
    action: "commented on a post",
    img: users[2].profilePic,
    time: "12 mins ago",
  },
  {
    id: 3,
    name: users[3].name,
    action: "liked a story",
    img: users[3].profilePic,
    time: "20 mins ago",
  },
  {
    id: 4,
    name: users[5].name,
    action: "shared a memory",
    img: users[5].profilePic,
    time: "45 mins ago",
  },
];

// ==============================
// Job Board
// ==============================
export const jobPosts = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "TechNova",
    location: "Remote",
    type: "Internship",
    tags: ["React", "HTML", "CSS"],
    postedDate: "2025-03-25",
    description: "Join our frontend team and build amazing UIs for students.",
  },
  {
    id: 2,
    title: "Data Analyst",
    company: "DataMind",
    location: "Tel Aviv, Israel",
    type: "Full-time",
    tags: ["Python", "SQL", "Pandas"],
    postedDate: "2025-03-20",
    description: "Analyze data and create insightful dashboards.",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Creative Labs",
    location: "Hybrid",
    type: "Part-time",
    tags: ["Figma", "Design Thinking"],
    postedDate: "2025-03-21",
    description: "Design user-centered solutions with our team.",
  },
];


export const onlineFriends = [users[1], users[2], users[3], users[4], users[5]];

/*-------------------------- leftBar.js --------------------------*/
export const leftBarMenuItems = [
  { id: 1, icon: Friends, label: "Friends" },
  { id: 2, icon: Groups, label: "Groups" },
  { id: 3, icon: JobBoard, label: "Job Board" },
  { id: 4, icon: Resume, label: "My CV" },
  { id: 5, icon: Applications, label: "Applications" },
  { id: 6, icon: Saved, label: "Saved Posts" },
  { id: 7, icon: Challenges, label: "Skill Challenges" },
  { id: 8, icon: Badges, label: "My Badges" },
];
