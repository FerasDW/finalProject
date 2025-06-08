import React from "react";
import BigCalendar from "../../../View/Components/Calendar/BigCalendar";
import EventCalendar from "../../../View/Components/Calendar/EventCalendar";
import ScrollList from "../../Components/Dashboard/ScrollList/ScrollList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {upcomingAssignments} from "../../../Static/dashboardData.js";
import "./calendar.css";

export default function Calendar() {
    return (
        <div className="calendar-page-container">
            <div className="big-calendar"> 
                <BigCalendar  />
            </div>
            <div className="event-schedule"> 
                
                <div>
                    <EventCalendar />
                </div>

                <div>
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