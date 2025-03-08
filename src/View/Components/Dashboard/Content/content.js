import React from "react";
import Box from "./Box";
import '../../../../CSS/Dashboard/Content.css';
import img from "../../../../Assets/Images/Logo/PNG/LogoMonogram.png";

const Content = () => {
  return (
    <div className="content">
      <div className="row">
        <Box title="Test" contentBox="This is a test1" image={img}/>
        <Box title="Test" contentBox="This is a test2" image={img}/>
        <Box title="Test" contentBox="This is a test3" image={img}/>
      </div>
      <div className="row">
        <Box title="Test" contentBox="This is a test1" image={img} gridColumn= "span 8" gridRow="span 15"/>
        <Box title="Test" contentBox="This is a test2" image={img} gridRow="span 15"/>
      </div>
      <div className="row">
        <Box title="Test" contentBox="This is a test1" image={img}/>
        <Box title="Test" contentBox="This is a test2" image={img} gridColumn= "span 8"/>
      </div>
    </div>
  );
};

export default Content;
