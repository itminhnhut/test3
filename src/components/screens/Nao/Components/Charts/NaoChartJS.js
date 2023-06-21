import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Filler,
    // @ts-ignore
    Legend
} from 'chart.js';
import { Line, Bar, Doughnut, Bubble } from 'react-chartjs-2';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Filler, Legend);

import React, { memo } from 'react';

// @ts-ignore
const NaoChartJS = memo(
    ({
        type,
        data,
        height = '100%',
        width = '100%',
        plugins,
        options = {
            responsive: true,
            maintainAspectRatio: true
        }
    }) => {
        let chart = <Line options={options} data={data} width={width} height={height} />;
        switch (type) {
            case 'area':
                chart = <Line options={options} data={data} width={width} height={height} />;
                break;
            case 'bar':
                chart = <Bar options={options} data={data} width={width} height={height} plugins={plugins} redraw={true} />;
                break;
            case 'doughnut':
                chart = <Doughnut options={options} data={data} width={width} height={height} plugins={plugins} redraw={true} />;
                break;
            case 'bubble':
                chart = <Bubble options={options} data={data} width={width} height={height} />;
                break;
        }

        return chart;
    }
);

export default NaoChartJS;
