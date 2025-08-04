import { ResponsiveLine } from "@nivo/line";

const LineChart = ({ data }) => {
  // --- FIX ---
  // Add a defensive check. If there's no data or the array is empty, don't render the chart.
  if (!data || data.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>No data available for this chart.</div>;
  }

  // --- FIX ---
  // Nivo Line charts expect data in a specific "series" format.
  // We transform our simple array [{ name: '2024', value: 4 }] into the format Nivo needs.
  const formattedData = [
    {
      id: "enrollment", // A unique ID for the data series
      data: data.map(item => ({
        x: item.name,   // 'name' from our API becomes the 'x' axis point
        y: item.value,  // 'value' from our API becomes the 'y' axis point
      })),
    },
  ];

  return (
    <ResponsiveLine
      data={formattedData} // Use the correctly formatted data
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Year",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "New Users",
        legendOffset: -40,
        legendPosition: "middle",
      }}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[]} // Removing legends for simplicity as we only have one line
    />
  );
};

export default LineChart;
