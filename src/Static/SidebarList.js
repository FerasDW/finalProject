import { Home, BookOpen, Calendar, Mail, Users, BarChart2, Settings, LogOut } from "react-feather";
import maleFace1 from "../Assets/Images/Logo/PNG/maleFace1.png";
import maleFace2 from "../Assets/Images/Logo/PNG/maleFace2.png";
import femaleFace1 from "../Assets/Images/Logo/PNG/femaleFace1.png";
import femaleFace2 from "../Assets/Images/Logo/PNG/femaleFace2.png";


export const leftMenuItems = [
    { title: "Home", icon: <Home />},
    { title: "Courses", icon: <BookOpen />},
    { title: "Calendar", icon: <Calendar />},
    { title: "Messages", icon: <Mail />},
    { title: "Community", icon: <Users />},
    { title: "Statistics", icon: <BarChart2 />},
    { title: "Settings", icon: <Settings />},
    { title: "Logout", icon: <LogOut />},
];

const imgStyle = { width: 30, height: 30, borderRadius: 10 };
const createMenuItem = (title, imgSrc) => ({
    title,
    icon: <img src={imgSrc} alt={title} style={imgStyle} />
});
export const rightMenuItems = [
    createMenuItem("Muhammed1", maleFace1),
    createMenuItem("Muhammed2", maleFace2),
    createMenuItem("Muhammed3", femaleFace1),
    createMenuItem("Muhammed4", femaleFace2),
    createMenuItem("Muhammed1", maleFace1),
    createMenuItem("Muhammed2", maleFace2),
    createMenuItem("Muhammed3", femaleFace1),
    createMenuItem("Muhammed4", femaleFace2),
];