import BigCalendar from "../../View/Components/Calendar/BigCalendar";

import "./calendar.css"

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