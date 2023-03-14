import React from 'react';
import { useState, useEffect } from 'react';
import { formatPrice, formatTime, formatPercentage } from 'src/redux/actions/utils';
import colors from 'styles/colors';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useTranslation } from 'next-i18next';
import Note from 'components/common/Note';
import GroupFilterTime, { listTimeFilter } from 'components/common/GroupFilterTime';
import ChartJS from './ChartJS';
import { indexOf } from 'lodash';
const { subDays } = require('date-fns');

// note: white always in the tail of list <=> Others
const listDoughnutColorsLight = [colors.green[6], colors.purple[1], colors.green[7], colors.yellow[5], colors.gray[12]];
const listDoughnutColorsDark = [colors.green[6], colors.purple[1], colors.green[7], colors.yellow[5], '#fff'];

const TradingPair = () => {
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const [labels, setLabels] = useState([]);
    const { t } = useTranslation();
    const [curFilter, setCurFilter] = useState(listTimeFilter[0].value);

    useEffect(() => {
        switch (curFilter) {
            case 1: // 1 Tuan
                break;
            case 2: // 1 Thang
                break;
            case 3: // all
                break;
            default:
                break;
        }
        setLabels(['BTC/VNDC', 'ETH/VNDC', 'BNB/VNDC', 'SOL/VNDC', 'Khác']);
    }, [curFilter]);

    const minDuong = 500;
    const maxDuong = 30000;
    const minAm = -30000;
    const maxAm = -500;

    // mock data
    const n = labels.length;
    let arr = [];
    let sum = 0;
    for (let i = 0; i < n - 1; i++) {
        let num = Math.floor(Math.random() * 99) + 1;
        arr.push(num);
        sum += num;
    }
    arr.push(100 - sum);

    const mockData = {
        labels: labels,
        datasets: [
            {
                label: 'Trading Pair Volumns',
                data: arr,
                backgroundColor: isDark ? listDoughnutColorsDark.slice(0, labels.length) : listDoughnutColorsLight.slice(0, labels.length),
                borderWidth: 0
                // hoverOffset: 4
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '85%'
        // plugins: {
        //     tooltip: {
        //         callbacks: {
        //             label: function (context) {
        //                 return context.label + formatPrice(context.raw, 2) + '%';
        //             },
        //             labelTextColor: function (context) {
        //                 return colors.darkBlue;
        //             }
        //         },
        //         backgroundColor: colors.white,
        //         displayColors: false
        //     }
        // }
    };

    // Const handle draw chart custom:
    let temp;
    const sumMockdata = arr.reduce((prev, item, idx) => {
        if (labels[idx] === 'BTC/VNDC') temp = item;
        return prev + item;
    }, 0);
    const percent = formatPercentage(temp / sumMockdata, 4, true) * 100 + '%';
    const percentColor = isDark ? colors.gray[4] : colors.gray[15];

    const secondaryColor = isDark ? colors.gray[7] : colors.gray[1];

    const plugins = [
        {
            id: 'middleText',
            afterDatasetsDraw(chart, args, options) {
                const {
                    ctx,
                    chartArea: { left, right, top, bottom, width, height }
                } = chart;
                ctx.save();

                // draw Primary text
                ctx.font = '600 32px SF-Pro';
                ctx.fillStyle = percentColor;
                ctx.textAlign = 'center';

                ctx.fillText(percent, width / 2, height / 2 + top);

                // draw Secondary text
                ctx.font = 'normal 16px SF-Pro';
                ctx.fillStyle = secondaryColor;
                ctx.textAlign = 'center';
                ctx.fillText('BTC/VNDC', width / 2, height / 2 + 32);
            }
        }
    ];

    return (
        <div className="p-8 border border-divider dark:border-transparent rounded-xl bg-transparent dark:bg-dark-4">
            <div className="flex items-center justify-between w-full">
                <div className="text-2xl font-semibold">Cặp giao dịch</div>
                <GroupFilterTime curFilter={curFilter} setCurFilter={setCurFilter} GroupKey="Trading_pair" t={t} />
            </div>
            <div className="flex items-center justify-center w-full">
                <div className="min-w-[352px] mt-8">
                    <ChartJS type="doughnut" data={mockData} options={options} plugins={plugins} />
                </div>
            </div>
            {/* Chu thich */}
            <div className="flex items-center gap-x-4 mt-9 py-1 justify-center">
                {labels.map((label, idx) => (
                    <Note style={{ backgroundColor: isDark ? listDoughnutColorsDark[idx] : listDoughnutColorsLight[idx] }} title={label} />
                ))}
            </div>
        </div>
    );
};

export default TradingPair;
