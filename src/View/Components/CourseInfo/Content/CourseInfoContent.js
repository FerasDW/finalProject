import Box from "../../Dashboard/Content/Box";
import "../../../../CSS/Dashboard/Content.css";
const CourseInfoContent = () => {
  return (
    <div className="content">
      <div className="row">
        <Box
          title="Course Information"
          contentBox="This section contains detailed information about the course."
          gridcolumn="span 8"
        />
        <Box
          title="User Management"
          contentBox="Manage users and their permissions."
          boxLink="Go to user management"
          bgColor="#cffccc"
          gridcolumn="span 4"
        />
      </div>
      <div className="row">
        <Box
          title="Course Information"
          contentBox="This section contains detailed information about the course."
          gridcolumn="span 8"
        />
        <Box
          title="User Management"
          contentBox="Manage users and their permissions."
          boxLink="Go to user management"
          bgColor="#cffccc"
          gridcolumn="span 4"
        />
      </div>
      <div className="row">
        <Box
          title="User Management"
          contentBox="Manage users and their permissions."
          boxLink="Go to user management"
          bgColor="#cffccc"
          gridcolumn="span 4"
        />
        <Box
          title="User Management"
          contentBox="Manage users and their permissions."
          boxLink="Go to user management"
          bgColor="#cffccc"
          gridcolumn="span 4"
        />
        <Box
          title="User Management"
          contentBox="Manage users and their permissions."
          boxLink="Go to user management"
          bgColor="#cffccc"
          gridcolumn="span 2"
        />
      </div>
    </div>
  );
};
export default CourseInfoContent;
