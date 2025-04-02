import BigCalendar from "../../View/Components/Calendar/BigCalendar";
import EventCalendar from "../../View/Components/Calendar/EventCalendar";
import ScrollList from "../Components/Dashboard/ScrollList/ScrollList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {upcomingAssignments} from "../../Static/dashboardData.js";
import "./calendar.css"


export default function Calendar() {
    return (
        <div style={{ display: "flex" ,flexDirection:"row",width:"100%", justifyContent:"space-around",marginTop:"50px",height:"100vh"}}>
            <div className="big-calendar" style={{width:"70%",height:"auto"}}> 
                <BigCalendar  />
            </div>
            <div className="event-schedule" style={{width:"20%",top:"0",display:"flex",flexDirection:"column",gap:"20px"}}> 
                
                <EventCalendar />

                <div style={{height:"250px"}}>
                    <ScrollList
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    title="Upcoming Assignments"
                    data={upcomingAssignments}
                    direction="column"
                    type="calendar"
                />
              </div>
            </div>
            
        </div>
        
        
    );
}