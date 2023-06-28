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
    Legend,
    TimeScale,
    LogarithmicScale
} from 'chart.js';
import { Line, Bar, Doughnut, Bubble } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    zoomPlugin,
    LogarithmicScale,
    TimeScale,
);

import React, { forwardRef, memo } from 'react';

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
        },
        chartRef
    }) => {
        let chart = <Line options={options} data={data} width={width} height={height} ref={(current) => chartRef && (chartRef.current = current)} />;
        switch (type) {
            case 'area':
                chart = <Line options={options} data={data} width={width} height={height} ref={(current) => chartRef && (chartRef.current = current)} />;
                break;
            case 'bar':
                chart = <Bar options={options} data={data} width={width} height={height} plugins={plugins} redraw={true} ref={(current) => chartRef && (chartRef.current = current)} />;
                break;
            case 'doughnut':
                chart = <Doughnut options={options} data={data} width={width} height={height} plugins={plugins} redraw={true} ref={(current) => chartRef && (chartRef.current = current)} />;
                break;
            case 'bubble':
                chart = <Bubble options={options} data={data} width={width} height={height} ref={(current) => chartRef && (chartRef.current = current)} />;
                break;
        }

        return chart;
    }
);

export default NaoChartJS;
