import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import dynamic from 'next/dynamic';
import React, { useMemo, useRef, useState } from 'react';
import { formatNumber } from 'redux/actions/utils';
import styled from 'styled-components';
import colors from 'styles/colors';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const parseData = (string) => string.split('\n').map((data) => +data);

const series = [
    {
        name: 'Series 1',
        data: [1, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, (1597 + 2584) / 2, 2584, 4181]
        // parseData(`
        // 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181`)
        // data: [45, 52, 38, 45, 19, 23, 2]
    }
];

const Wrapper = styled.div`
    .apexcharts-tooltip {
        display: none;
    }
    .apexcharts-xaxistooltip {
        display: none;
    }
`;

const APYInterestChart = () => {
    const [theme] = useDarkMode();
    const isDark = theme === THEME_MODE.DARK;

    const [hoverData, setHoverData] = useState({
        value: 0,
        index: 0
    });

    const options = useMemo(
        () => ({
            chart: {
                height: 280,
                type: 'area',
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: false
            },

            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [71, 204, 133],
                    gradientToColors: 'green'
                }
            },
            yaxis: {
                labels: {
                    show: false
                },
                axisBorder: {
                    show: true,
                    color: isDark ? colors.divider.dark : colors.divider.DEFAULT
                }
            },
            xaxis: {
                labels: {
                    show: false
                },

                crosshairs: {
                    show: false
                },

                axisBorder: {
                    show: true,
                    color: isDark ? colors.divider.dark : colors.divider.DEFAULT
                },

                axisTicks: {
                    show: false
                }
            },
            grid: {
                show: false,
                xaxis: {
                    lines: {
                        show: false
                    }
                }
            },
            tooltip: {
                x: {
                    formatter: (_, { series, seriesIndex, dataPointIndex }) => {
                        setHoverData({
                            index: dataPointIndex,
                            value: series?.[seriesIndex]?.[dataPointIndex]
                        });
                    }
                }
            },

            markers: {
                hover: {
                    size: 5
                },
                colors: colors.teal,
                strokeWidth: 0
            }
        }),
        [isDark]
    );

    return (
        typeof window !== 'undefined' && (
            <Wrapper className="relative">
                <div className="absolute left-10 top-10">
                    <div className="font-semibold text-sm mb-4">Sau {hoverData.index + 1} tháng bạn sẽ nhận được</div>
                    <div className=" mb-4">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark text-sm">Lãi suất</div>
                        <div className="font-semibold text-xl">{formatNumber(hoverData.value, 0)} VNDC</div>
                    </div>
                    <div className="mb-4">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark text-sm">Số dư cuối kỳ</div>
                        <div className="font-semibold text-xl">{formatNumber(hoverData.value, 0)} VNDC</div>
                    </div>
                </div>
                <Chart options={options} series={series} type="area" width="100%" />

                <div className="ml-5 pr-2 flex justify-between">
                    <div className="text-txtSecondary cursor-pointer dark:text-txtSecondary-dark text-sm rounded-md px-4 py-2 flex items-center border border-divider dark:border-divider-dark">
                        1 Tháng
                    </div>
                    <div className="text-txtSecondary cursor-pointer dark:text-txtSecondary-dark text-sm rounded-md px-4 py-2 flex items-center border border-divider dark:border-divider-dark">
                        12 Tháng
                    </div>
                    <div className="text-txtSecondary cursor-pointer dark:text-txtSecondary-dark text-sm rounded-md px-4 py-2 flex items-center border border-divider dark:border-divider-dark">
                        24 Tháng
                    </div>
                    <div className="text-txtSecondary cursor-pointer dark:text-txtSecondary-dark text-sm rounded-md px-4 py-2 flex items-center border border-divider dark:border-divider-dark">
                        36 Tháng
                    </div>
                    <div className="text-txtSecondary cursor-pointer dark:text-txtSecondary-dark text-sm rounded-md px-4 py-2 flex items-center border border-divider dark:border-divider-dark">
                        48 Tháng
                    </div>
                </div>
            </Wrapper>
        )
    );
};

export default React.memo(APYInterestChart);
