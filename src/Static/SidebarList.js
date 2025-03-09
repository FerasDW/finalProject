import { Home, BookOpen, Calendar, Mail, Users, BarChart2, Settings, LogOut } from "react-feather";
import maleFace1 from "../Assets/Images/Logo/PNG/maleFace1.png";
import maleFace2 from "../Assets/Images/Logo/PNG/maleFace2.png";
import femaleFace1 from "../Assets/Images/Logo/PNG/femaleFace1.png";
import femaleFace2 from "../Assets/Images/Logo/PNG/femaleFace2.png";

export const leftMenuItems = [
    {
    "1100":[
    { title: "Home", icon: <Home />},
    { title: "Courses", icon: <BookOpen />},
    { title: "Calendar", icon: <Calendar />},
    { title: "Messages", icon: <Mail />},
    { title: "Community", icon: <Users />},
    { title: "Statistics", icon: <BarChart2 />},
    { title: "Settings", icon: <Settings />},
    { title: "Logout", icon: <LogOut />}]
}
];

export const rightMenuItems = [
    { title: "Muhammed1", icon: <img src={maleFace1} alt="" style={{ width:30, height:30, borderRadius: 10}} />},
    { title: "Muhammed2", icon: <img src={maleFace2} alt="" style={{ width:30, height:30, borderRadius: 10}} />},
    { title: "Muhammed3", icon: <img src={femaleFace1} alt="" style={{ width:30, height:30, borderRadius: 10}} />},
    { title: "Muhammed4", icon: <img src={femaleFace2} alt="" style={{ width:30, height:30, borderRadius: 10}} />},    { title: "Muhammed", icon: <img src={maleFace1} alt="" style={{ width:30, height:30, borderRadius: 10}} />},
    { title: "Muhammed5", icon: <img src={maleFace2} alt="" style={{ width:30, height:30, borderRadius: 10}} />},
    { title: "Muhammed6", icon: <img src={femaleFace1} alt="" style={{ width:30, height:30, borderRadius: 10}} />},
    { title: "Muhammed7", icon: <img src={femaleFace2} alt="" style={{ width:30, height:30, borderRadius: 10}} />},
    { title: "Muhammed8", icon: <img src={femaleFace1} alt="" style={{ width:30, height:30, borderRadius: 10}} />},
    { title: "Muhammed9", icon: <img src={femaleFace2} alt="" style={{ width:30, height:30, borderRadius: 10}} />},
];