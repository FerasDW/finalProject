import React from "react";
import "../../../CSS/CoursePage/CourseDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGroup,
  faClock,
  faStar,
  faChalkboardUser,
  faBuilding,
  faLanguage,
  faTasks,
  faFlask,
  faPencilAlt,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import CourseDetailRow from "./Content/courseDetailRow";
import ProgressBar from "../Charts/Bar";

const CourseDetails = (props) => {
  return (
    <div className="course-details-container">
      <div className="course-description">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis
        incidunt dolorum excepturi illo consequatur? Aut, commodi in laboriosam
        ab animi nam pariatur officia labore optio voluptate mollitia delectus
        natus architecto. Accusamus dolores deleniti repudiandae explicabo quo
        sint nulla doloremque pariatur repellat dicta rem, dolor nam neque quis
        nisi eveniet saepe amet magnam cumque delectus sed provident fugiat
        officiis. Odio quidem facere hic in beatae quos laudantium maxime vitae,
        placeat asperiores iste commodi fugit magnam exercitationem voluptatem
        ducimus assumenda quibusdam? Aliquam obcaecati ullam reiciendis sint
        neque consequuntur temporibus explicabo eligendi eius amet nam
        accusantium, omnis vitae veniam iusto, assumenda minus est delectus
        totam qui necessitatibus nemo
        <div className="progress-bar">
          <ProgressBar progress={80} />
        </div>
      </div>
      <div className="divider"></div>
      <div className="course-data">
        <CourseDetailRow
          icon={<FontAwesomeIcon icon={faUserGroup} />}
          title="40 Students"
        />
        <CourseDetailRow
          icon={<FontAwesomeIcon icon={faClock} />}
          title="3h 45m"
        />
        <CourseDetailRow
          icon={<FontAwesomeIcon icon={faStar} />}
          title="3 points"
        />
        <CourseDetailRow
          icon={<FontAwesomeIcon icon={faChalkboardUser} />}
          title="Instructor: John Doe"
        />
        <CourseDetailRow
          icon={<FontAwesomeIcon icon={faBuilding} />}
          title="Faculty of Science"
        />
        <CourseDetailRow
          icon={<FontAwesomeIcon icon={faLanguage} />}
          title="Language: English"
        />
        <CourseDetailRow
          icon={<FontAwesomeIcon icon={faTasks} />}
          title="Assignments: 5 total"
        />
        <CourseDetailRow
          icon={<FontAwesomeIcon icon={faFlask} />}
          title="Type: Practical Lab"
        />

        <CourseDetailRow
          icon={<FontAwesomeIcon icon={faPencilAlt} />}
          title="Final Exam: Included"
        />
        <CourseDetailRow
          icon={<FontAwesomeIcon icon={faLink} />}
          title="Prerequisite: Intro to Biology"
        />
      </div>
    </div>
  );
};

export default CourseDetails;
