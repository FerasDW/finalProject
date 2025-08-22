import { ResponsiveBar } from '@nivo/bar'

const MyResponsiveBar = ({ data, colors, valueRange, colorMode = "array", axisLabel }) => {
    // Defensive check for data
    if (!data || data.length === 0) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>No data available for this chart.</div>;
    }

    // Use provided colors or fall back to calm beautiful defaults
    const defaultColors = [
      '#4ECDC4', // Turquoise
      '#45B7D1', // Sky Blue
      '#96CEB4', // Mint Green
      '#87CEEB', // Sky Blue Light
      '#20B2AA', // Light Sea Green
      '#5DADE2', // Light Blue
      '#58D68D', // Light Green
      '#85C1E9'  // Light Steel Blue
    ];
    
    // APPROACH 1: Colors from data property
    const getColorsFromData = () => {
        return { datum: 'data.color' };
    };

    // APPROACH 2: Color array (each bar gets next color in array)
    const getColorsFromArray = () => {
        return colors || defaultColors;
    };

    // APPROACH 3: Function-based colors (custom logic)
    const getColorsFromFunction = () => {
        return (bar) => {
            const colorArray = colors || defaultColors;
            return colorArray[bar.index % colorArray.length];
        };
    };

    // APPROACH 4: Value-based colors (calm performance colors)
    const getColorsFromValue = () => {
        return (bar) => {
            const value = bar.data.value;
            const maxValue = Math.max(...data.map(d => d.value));
            const percentage = value / maxValue;
            
            if (percentage > 0.8) return '#00CED1'; // High values - Dark Turquoise
            if (percentage > 0.6) return '#32CD32'; // Medium-high - Lime Green
            if (percentage > 0.4) return '#4169E1'; // Medium - Royal Blue
            if (percentage > 0.2) return '#20B2AA'; // Low-medium - Light Sea Green
            return '#5DADE2'; // Low values - Light Blue
        };
    };

    // APPROACH 5: Department name-based colors (calm & professional)
    const getColorsFromName = () => {
        const departmentColors = {
            'Computer Science': '#4ECDC4', // Turquoise
            'Mathematics': '#45B7D1',      // Sky Blue
            'Physics': '#96CEB4',          // Mint Green
            'Chemistry': '#87CEEB',        // Sky Blue Light
            'Biology': '#20B2AA',          // Light Sea Green
            'Engineering': '#5DADE2',      // Light Blue
            'Business': '#58D68D',         // Light Green
            'Arts': '#85C1E9',             // Light Steel Blue
            'Medicine': '#7FB3D3',         // Powder Blue
            'Psychology': '#76D7C4'        // Aqua Marine
        };
        
        return (bar) => {
            return departmentColors[bar.indexValue] || '#40E0D0'; // Turquoise as fallback
        };
    };

    // Choose color method based on colorMode prop
    let chartColors;
    switch (colorMode) {
        case 'data':
            chartColors = getColorsFromData();
            break;
        case 'function':
            chartColors = getColorsFromFunction();
            break;
        case 'value':
            chartColors = getColorsFromValue();
            break;
        case 'name':
            chartColors = getColorsFromName();
            break;
        case 'array':
        default:
            chartColors = getColorsFromArray();
            break;
    }
    
    // Calculate value scale with better range
    let valueScale = { type: 'linear' };
    if (valueRange) {
        // Add some extra padding for better visualization
        const padding = (valueRange.max - valueRange.min) * 0.1;
        valueScale = {
            type: 'linear',
            min: Math.max(0, valueRange.min - padding),
            max: valueRange.max + padding
        };
    }

    // Use the provided axis label or determine it automatically
    let yAxisLabel = axisLabel || 'Value';
    
    // If no explicit axis label provided, try to infer from data
    if (!axisLabel) {
        const sampleValue = data[0]?.value || 0;
        if (sampleValue > 0 && sampleValue <= 5) {
            yAxisLabel = 'GPA'; // Likely GPA data
        } else if (sampleValue > 5) {
            yAxisLabel = 'Enrollments'; // Likely enrollment data
        }
    }

    return (
        <ResponsiveBar
            data={data}
            keys={['value']}
            indexBy="name"
            margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={valueScale}
            indexScale={{ type: 'band', round: true }}
            
            // Use the selected color approach
            colors={chartColors}
            
            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Department',
                legendPosition: 'middle',
                legendOffset: 32,
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: yAxisLabel,
                legendPosition: 'middle',
                legendOffset: -40,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            legends={[]} 
            role="application"
            animate={true}
            motionStiffness={90}
            motionDamping={15}
        />
    )
}

export default MyResponsiveBar;