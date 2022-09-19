import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    // Legend
);

import React, { memo } from 'react'

const ChartJS = memo(({ data }) => {
    const options = {
        responsive: true,
    };
    return (
        <Line options={options} data={data} height={'100%'} />
    )
    
})

export default ChartJS