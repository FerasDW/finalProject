import React from "react";
import Box from "./Box";
import BarChart from "../../Charts/barChart";
import PieChart from "../../Charts/pieCharts";
import LineChart from "../../Charts/lineChart";
import ScrollList from "../ScrollList/ScrollList";
import dashboardContentData from "../../../../Static/dashboardContentData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const DashboardContent = ({ userRole }) => {
  const content = dashboardContentData[userRole];

  if (!content) return <p>No content available for this role.</p>;

  return (
    <div className="content">
      <div className="row">
        {content.map((item, index) => {
          const { type, props } = item;

          if (type === "box") return <Box key={index} {...props} />;
          if (type === "chart") {
            let ChartComponent;
            if (props.chartType === "bar") ChartComponent = <BarChart data={props.chartData} />;
            else if (props.chartType === "pie") ChartComponent = <PieChart data={props.chartData} />;
            else if (props.chartType === "line") ChartComponent = <LineChart data={props.chartData} />;
            return <Box key={index} title={props.title} chart={ChartComponent} {...props} />;
          }
          if (type === "assignments") {
            return (
              <Box
                key={index}
                assignments={
                  <ScrollList
                    icon={<FontAwesomeIcon icon={faPlus} />}
                    title={props.title}
                    data={props.data}
                    direction="column"
                    type="list"
                  />
                }
                {...props}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default DashboardContent;
