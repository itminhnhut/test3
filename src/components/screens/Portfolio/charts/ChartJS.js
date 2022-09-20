import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Filler,
    // Legend
);

import React, { memo } from 'react'

const ChartJS = memo(({ type, data, height = '100%', width = '100%', options = {
    responsive: true,
    maintainAspectRatio: false,
} }) => {
    let chart = <Line options={options} data={data} width={width} height={height} />

    switch (type) {
        case 'area':
            chart = <Line options={options} data={data} width={width} height={height} />
            break
        case 'stackedBar':
            chart = <Bar options={options} data={data} width={width} height={height} />
            break
    }

    return chart
})

export default ChartJS