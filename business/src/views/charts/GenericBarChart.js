import React from 'react'

import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

  
  const default_data = [
    {
        "name": "Feb 5",
        "Average Sentiment": 0,
        "amt": 0,
        "count": 0
    },
    {
        "name": "Feb 6",
        "Average Sentiment": 0,
        "amt": 0,
        "count": 0
    },
    {
        "name": "Feb 7",
        "Average Sentiment": 0,
        "amt": 0,
        "count": 0
    },
    {
        "name": "Feb 8",
        "Average Sentiment": 0,
        "amt": 0,
        "count": 0
    },
    {
        "name": "Feb 9",
        "Average Sentiment": 0,
        "amt": 0,
        "count": 0
    },
    {
        "name": "Feb 10",
        "Average Sentiment": 0,
        "amt": 0,
        "count": 0
    },
    {
        "name": "Feb 11",
        "Average Sentiment": 0,
        "amt": 0,
        "count": 0
    },
    {
        "name": "Feb 12",
        "Average Sentiment": 0,
        "amt": 0,
        "count": 0
    },
    {
        "name": "Feb 13",
        "Average Sentiment": 0,
        "amt": 0,
        "count": 0
    },
    {
        "name": "Feb 14",
        "Average Sentiment": 0,
        "amt": 0,
        "count": 0
    },
    {
        "name": "Feb 15",
        "Average Sentiment": 0,
        "amt": 0,
        "count": 0
    },
    {
        "name": "Feb 16",
        "Average Sentiment": 0,
        "amt": 0,
        "count": 0
    },
    {
        "name": "Feb 17",
        "Average Sentiment": 0,
        "amt": 0,
        "count": 0
    },
    {
        "name": "Feb 18",
        "Average Sentiment": 0,
        "amt": 0,
        "count": 0
    },
    {
        "name": "Feb 19",
        "Average Sentiment": 0,
        "amt": 0,
        "count": 0
    },
    {
        "name": "Feb 20",
        "Average Sentiment": 0,
        "amt": 0,
        "count": 0
    },
    {
        "name": "Feb 21",
        "Average Sentiment": 0,
        "amt": 0,
        "count": 0
    },
    {
        "name": "Feb 22",
        "Average Sentiment": "58.9",
        "amt": 0,
        "count": 18
    }
]

function GenericBarChart ({data, keyName, comparisonName, baseColor, comparisonColor, heading}) {
    const [chartData, setChatData] = React.useState(data||default_data)

    React.useEffect(()=>{
      setChatData(data);
    },[data])

    return (
      <React.Fragment>
        {heading && <div className='heading'>
          <h4>{heading||"Untitled"}</h4>
        </div>}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={chartData}
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={keyName} fill="#73b627" activeBar={<Rectangle fill="pink" stroke="blue" />} />
          </BarChart>
        </ResponsiveContainer>
      </React.Fragment>
    )
}

export default GenericBarChart
