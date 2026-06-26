import React from 'react'
import { 
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell 
} from 'recharts'
import CustomToolTip from './CustomToolTip';

export default function CustomBarChart({data}) {
    
    const getBarColor = (entry) => {
        switch(entry) {
            case 'Low':
                return '#00BCMD'
            case 'Medium':
                return '#FE9900'
            case 'High':
                return '#FF1F57'
            default:
                return '#00BC7D'
        }
    };

  return (
    <div className='bg-white mt-6'>
      <ResponsiveContainer width={"100%"} height={300}>
        <BarChart>
            <CartesianGrid stroke="none" />

            <XAxis
                dataKey={"priority"}
                tick={{ fontSize: 12, fill: "#555" }}
                stroke="none"
            />

            <YAxis
                tick={{ fontSize: 12, fill: "#555" }}
                stroke="none"
            />

            <Tooltip content={<CustomToolTip chartType={"BarChart"} />} cursor={{ fill: "transparent" }} />

            <Bar
                dataKey={"count"}
                nameKey={"priority"}
                fill='#FF8042'
                radius={[10, 10, 0, 0]}
                activeDot={{r: 8, fill: "yellow"}}
                activeStyle={{ fill: "green" }}
            >
                {data.map((entry, index) => (
                    <Cell key={index} fill={getBarColor(entry)} />
                ))}
            </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
