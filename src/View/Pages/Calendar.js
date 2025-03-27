import BigCalendar from "../../View/Components/Calendar/BigCalendar";
import EventCalendar from "../../View/Components/Calendar/EventCalendar";
import ScrollList from "../Components/Dashboard/ScrollList/ScrollList";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {upcomingAssignments} from "../../Static/dashboardData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DynamicTable from "../Components/Tables/Table";
import MediaUpload from "../Components/Forms/UploadFile";
import TextUpload from "../Components/Forms/inputForm";
import Chatbot from "../Components/Forms/ChatBot";


export default function Calendar() {
    return (
        // <div style={{ display: "flex" ,flexDirection:"row",width:"100%", justifyContent:"space-around",marginTop:"50px"}}>
        //     <div className="big-calendar" style={{width:"70%",height:"700px"}}> 
        //         <BigCalendar  />
        //     </div>
        //     <div className="event-schedule" style={{width:"20%",top:"0",display:"flex",flexDirection:"column",gap:"20px"}}> 
                
        //         <EventCalendar />

        //         <div style={{height:"250px"}}>
        //             <ScrollList
        //             icon={<FontAwesomeIcon icon={faPlus} />}
        //             title="Upcoming Assignments"
        //             data={upcomingAssignments}
        //             direction="column"
        //             type="calendar"
        //         />
        //       </div>
        //     </div>
            
        // </div>
        <div style={{ display: "flex" ,flexDirection:"column"  ,width:"100%", marginTop:"50px", justifyContent:"center",alignItems:"center"}}>
        <  TextUpload/>
        <DynamicTable data={upcomingAssignments}/>
        </div>
    );
}