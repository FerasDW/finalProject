import React from "react";
import BoxComponent from "./BoxComponentTest";
import '../../../../CSS/Dashboard/content.css';
import img from "../../../../Assets/Images/Logo/PNG/LogoMonogram.png";

const Content = () => {
  return (
    <div className="content">
      <div className="row">
        <BoxComponent title="Test" contentBox="This is a test1" image={img} gridColumn= "span 4" gridRow="span 8"/>
        <BoxComponent title="Test" contentBox="This is a test2" gridColumn= "span 4" gridRow="span 8"/>
        <BoxComponent title="Test" contentBox="This is a test3" gridColumn= "span 4" gridRow="span 8"/>
      </div>
      <div className="row">
        <BoxComponent title="Test" contentBox="This is a test1" image={img} gridColumn= "span 8" gridRow="span 13"/>
        <BoxComponent title="Test" contentBox="This is a test2" gridColumn= "span 4" gridRow="span 13"/>
      </div>
      <div className="row">
        <BoxComponent title="Test" contentBox="This is a test1" image={img} gridColumn= "span 4" gridRow="span 13"/>
        <BoxComponent title="Test" contentBox="This is a test2" image={img} gridColumn= "span 8" gridRow="span 13"/>
      </div>
    </div>
  );
};

export default Content;
