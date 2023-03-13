import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import Button from '../../common/Button';
import ExchangePortfolio from './ExchangePortfolio';
import FuturePortfolio from './FuturePortfolio';
import { ComponentTabWrapper, ComponentTabItem, ComponentTabUnderline } from './styledPortfolio';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';
import FetchApi from 'utils/fetch-api';
import { API_GET_VIP, API_PORTFOLIO_OVERVIEW, API_PORTFOLIO_ACCOUNT } from 'redux/actions/apis';
import { formatPrice, formatTime, getLoginUrl, walletLinkBuilder } from 'src/redux/actions/utils';
import { Progressbar } from 'components/screens/NewReference/mobile/sections/Info';
import { FEE_TABLE } from 'constants/constants';
import SvgAddCircle from 'components/svg/SvgAddCircle';
import colors from 'styles/colors';
import router from 'next/router';
import { WalletType } from 'redux/actions/const';
import { EXCHANGE_ACTION } from 'pages/wallet';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

import 'react-loading-skeleton/dist/skeleton.css';
import Skeletor from 'components/common/Skeletor';
import TextButton from 'components/common/V2/ButtonV2/TextButton';
import PriceChangePercent from 'components/common/PriceChangePercent';
import ChartLayout from './charts/ChartLayout';
import ChartJS from './charts/ChartJS';
import { indexOf } from 'lodash';
const { subDays } = require('date-fns');

const Portfolio = () => {
    const [type, setType] = useState(1);
    const [currency, setCurrency] = useState('VNDC');
    const { t } = useTranslation();
    const user = useSelector((state) => state?.auth?.user);

    const renderHeader = () => {
        return (
            <div className="w-full h-fit flex justify-between mt-6 mb-8">
                <div className="text-2xl leading-10 font-semibold">Nami Future Portfolio</div>
                <div className="flex h-9">
                    <Button
                        className="px-4 py-[6px] mr-3"
                        onClick={() => setCurrency(currency === 'USDT' ? 'VNDC' : 'USDT')}
                        title="VNDC"
                        type={currency === 'VNDC' && 'primary'}
                        style={currency !== 'VNDC' && { color: '#718096' }}
                        componentType="button"
                    />
                    <Button
                        className="px-4 py-[6px]"
                        onClick={() => setCurrency(currency === 'USDT' ? 'VNDC' : 'USDT')}
                        title="USDT"
                        type={currency === 'USDT' && 'primary'}
                        style={currency !== 'USDT' && { color: '#718096' }}
                        componentType="button"
                    />
                </div>
            </div>
        );
    };

    const renderContent = () => {
        return type === 1 ? (
            <FuturePortfolio currency={currency} />
        ) : (
            // <ExchangePortfolio />
            <div>Coming soon...</div>
        );
    };

    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    // Handle for Header tab:
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        console.log('_________here');
        FetchApi({
            url: API_PORTFOLIO_OVERVIEW,
            options: {
                method: 'GET'
            },
            params: {
                currency: currency === 'VNDC' ? 72 : 22
            }
        }).then(async ({ data, status }) => {
            if (status === 200) {
                const res = await FetchApi({
                    url: API_GET_VIP,
                    options: {
                        method: 'GET'
                    }
                });
                if (res.data) setUserData({ ...data[0], nami: res.data });
                else setUserData({ ...data[0] });
            } else {
                setUserData(null);
            }
        });
    }, [currency]);

    const level = +userData?.nami?.level || 0;
    const nextLevel = level >= 9 ? 9 : level + 1;

    // console.log('___here: ', user);
    // console.log('___here 2: ', FEE_TABLE[nextLevel]?.nami_holding);

    const handleDepositIconBtn = useCallback(() => {
        if (!auth) {
            router.push(getLoginUrl('sso', 'login'));
        } else {
            router.push(walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.DEPOSIT, { type: 'crypto', asset: currency || 'USDT' }));
        }
    }, [currency]);

    const [curOverviewFilter, setCurOverviewFilter] = useState(listTimeFilter[0].value);
    const [curPnlFilter, setCurPnlFilter] = useState(listTimeFilter[0].value);

    // Hanlde for Chart Bien dong loi nhuan:
    const [pnlLabels, setPnlLabels] = useState([]);
    useEffect(() => {
        const curDate = new Date();
        const newLabels = [formatTime(curDate, 'dd/MM')];
        switch (curPnlFilter) {
            case 1: // 1 Tuan
                for (let i = 1; i < 7; i++) {
                    // Lấy ngày hôm trước i ngày
                    const pastDay = subDays(new Date(), 1);

                    // Định dạng ngày theo format 'dd/MM'
                    newLabels.push(formatTime(pastDay, 'dd/MM'));
                }
                break;
            case 2: // 1 Thang
                break;
            case 3: // all
                break;
            default:
                break;
        }
        setPnlLabels(newLabels);
    }, [curPnlFilter]);

    const pnlChartData = {
        labels: pnlLabels,
        datasets: [
            {
                fill: false,
                label: false,
                data: Array.from({ length: pnlLabels.length }, () => [2, Math.floor(Math.random() * (100 - 2 + 1)) + 2]),
                backgroundColor: colors.green[6],
                stack: 'pnl'
                // lineTension: 0.2,
                // borderColor: isDark ? colors.teal : colors.green[6],
                // borderWidth: 1.5,
                // pointRadius: 0,
                // pointBackgroundColor: colors.teal
            },
            {
                fill: false,
                label: false,
                data: Array.from({ length: pnlLabels.length }, () => [-2, Math.floor(Math.random() * (-2 - -100 + 1)) + -100]),
                backgroundColor: colors.red[2],
                stack: 'pnl'
                // borderSkipped: false,
                // categoryPercentage: 0.2,
                // barPercentage: 0.2
                // lineTension: 0.2
                // borderColor: '#80FFEA',
                // borderWidth: 1.5,
                // pointRadius: 0,
                // pointBackgroundColor: '#80FFEA'
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'x',
        // categorySpacing: 5,
        barPercentage: 0.15,
        borderRadius: 4,
        borderSkipped: false,
        plugins: {
            tooltip: {
                // callbacks: {
                //     label: function (context) {
                //         const descriptions = {
                //             1: 'Mức PNL: ',
                //             2: ['Tài sản :', 'Vốn: '],
                //             3: ['Lượng tiền nạp: ', 'Lượng tiền rút: '],
                //             4: ['Tài sản: ', 'Vốn: ']
                //         };
                //         const index = context.dataIndex;
                //         const text1 =
                //             descriptions[chart5Config.tab] + (chartData[0][index] >= 0 ? '+' : '') + formatPrice(chartData[0][index], 0) + ' ' + props.currency;
                //         if (chart5Config.tab === 1) return text1;
                //         const text2 = descriptions[chart5Config.tab][0] + formatPrice(chartData[0][index], 0) + ' ' + props.currency ?? null;
                //         const text3 = descriptions[chart5Config.tab][1] + formatPrice(chartData[1][index], 0) + ' ' + props.currency ?? null;
                //         return [text2, text3];
                //     },
                //     // filter: function (context) {
                //     //     return context.datasetIndex === 0
                //     // },
                //     labelTextColor: function (context) {
                //         return colors.darkBlue;
                //     }
                // },
                // backgroundColor: colors.white,
                // displayColors: false,
                // titleColor: colors.gray[2]
            }
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: colors.darkBlue5,
                    showLabelBackdrop: false
                },
                grid: {
                    display: false,
                    drawBorder: false
                    // borderColor: currentTheme === THEME_MODE.DARK ? colors.divider.dark : colors.divider.DEFAULT
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: colors.darkBlue5
                },
                grid: {
                    borderDash: [1, 4],
                    borderDashOffset: 1,
                    // color: currentTheme === THEME_MODE.DARK ? colors.divider.dark : colors.divider.DEFAULT,
                    // borderDash: [1, 4],
                    // // color: colors.divider.DEFAULT,
                    color: function (context) {
                        if (context.tick.value === 0) {
                            return 'rgba(0, 0, 0, 0)';
                        }
                        return currentTheme === THEME_MODE.DARK ? colors.divider.dark : colors.divider.DEFAULT;
                    },
                    drawBorder: false
                }
            }
        }
    };

    const plugins = [
        {
            id: 'middleText',
            afterDatasetsDraw(chart, args, options) {
                const { ctx } = chart;
                ctx.save();

                var xAxe = chart.config.options.scales.x;
                var xScale = chart.scales[xAxe.axis];
                var yAxe = chart.config.options.scales.y;
                var yScale = chart.scales[yAxe.axis];

                // You can define the color here
                ctx.strokeStyle = isDark ? colors.divider.dark : colors.divider.DEFAULT;

                var center =
                    yScale.bottom +
                    ((yScale.top - yScale.bottom) / (yScale.ticks.length - 1)) *
                        indexOf(
                            yScale.ticks,
                            yScale.ticks.find((item) => item?.value === 0)
                        );
                console.log('___ here 3: ', center, (yScale.top + yScale.bottom) / 2);

                ctx.beginPath();

                // The line is drawn from the bottom left ..
                // ctx.moveTo(xScale.left + 0.5, yScale.bottom);
                ctx.moveTo(xScale.left + 0.5, center);

                // .. to the top left ('+ 0.5' is more or less a fix but it is not essential)
                // ctx.lineTo(xScale.left + 0.5, yScale.top);
                ctx.lineTo(xScale.right + 0.5, center);

                ctx.stroke();
            }
        }
    ];

    return (
        <div className="w-full h-full bg-white dark:bg-dark text-gray-15 dark:text-gray-4 font-normal tracking-normal">
            {/* {renderTabs(mainTabs, type, setType)} */}

            {/* Banner infor */}
            <div
                style={{
                    backgroundImage: `url(/images/screen/portfolio/banner.png)`
                }}
                className="w-full bg-dark-6 px-28 bg-cover bg-center"
            >
                <div className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto">
                    <div className="h-full py-20 text-gray-4 font-semibold">
                        <span className="text-[32px] leading-[38px]">Futures Portfolio</span>
                        {/* Avatar div */}
                        <div className="flex mt-10">
                            <div className="w-[120px] h-[120px] relative">
                                {user?.avatar ? (
                                    <img className="w-full h-auto rounded-full" src={user?.avatar} />
                                ) : (
                                    <Skeletor circle width={120} height={120} containerClassName="avatar-skeleton" />
                                )}
                            </div>
                            <div className="ml-8 flex flex-col items-start justify-center gap-y-2">
                                <span className="text-2xl">{user?.name ?? user?.username ?? user?.email ?? t('common:unknown')}</span>
                                <div className="flex items-center text-base">
                                    <span className="text-green-2">VIP {level}</span>
                                    <div className="w-1 h-1 rounded-full bg-gray-7 mx-2"></div>
                                    {user?.code}
                                </div>
                                <div className="flex items-center text-base">
                                    <span className="mr-2 font-normal text-gray-7">Giao dịch từ:</span>
                                    {userData?.trading_from
                                        ? formatTime(new Date(userData.trading_from * 1000), 'dd/MM/yyyy').toString()
                                        : 'Chưa thực hiện giao dịch'}{' '}
                                    {userData?.trading_exp && `(${Math.round(userData.trading_exp / 3600).toString()} giờ)`}
                                </div>
                            </div>
                        </div>

                        {/* Progress div */}
                        <div className="max-w-[548px]">
                            <div className="border-b border-divider-dark h-6 mb-6"></div>
                            <div className="flex justify-between w-full">
                                <span className="font-normal text-gray-7">Số dư Nami</span>
                                <div className="text-green-2 flex gap-2">
                                    Mua NAMI
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleDepositIconBtn();
                                        }}
                                    >
                                        <SvgAddCircle size={13.3} color={colors.teal} className="cursor-pointer" />
                                    </button>
                                </div>
                            </div>
                            <div className="w-full h-2 my-3 flex justify-between items-center bg-white rounded-xl">
                                <Progressbar
                                    background={colors.green[3]}
                                    percent={((userData?.nami?.metadata?.namiBalance || 0) / FEE_TABLE[nextLevel]?.nami_holding) * 100}
                                    height={8}
                                    className={'rounded-xl'}
                                />
                            </div>
                            <div className="flex justify-between w-full text-green-2 font-normal">
                                <span>{`VIP ${level}: ${formatPrice(userData?.nami?.metadata?.namiBalance || 0, 0)} NAMI / ${Math.round(
                                    ((userData?.nami?.metadata?.namiBalance || 0) / FEE_TABLE[nextLevel]?.nami_holding) * 100
                                )}%`}</span>
                                <span>{`VIP ${nextLevel}: ${formatPrice(FEE_TABLE[nextLevel]?.nami_holding || 0, 0)} NAMI`}</span>
                            </div>
                        </div>

                        {/* Group button currency */}
                        <div className="flex mt-[50px]">
                            <button
                                onClick={() => setCurrency('VNDC')}
                                className={`border border-divider-dark rounded-l-md px-9 py-3 ${
                                    currency === 'VNDC' ? 'font-semibold bg-dark-2 ' : 'text-gray-7 border-r-none'
                                }`}
                            >
                                VNDC
                            </button>
                            <button
                                onClick={() => setCurrency('USDT')}
                                className={`border border-divider-dark rounded-r-md px-9 py-3 ${
                                    currency === 'USDT' ? 'font-semibold bg-dark-2 ' : 'text-gray-7 border-l-none'
                                }`}
                            >
                                USDT
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="w-full px-28">
                <div className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto pt-20 pb-[120px]">
                    {/* Chi so noi bat */}
                    <div>
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-semibold">Chỉ số nổi bật</div>
                            <GroupFilterTime curFilter={curOverviewFilter} setCurFilter={setCurOverviewFilter} GroupKey="Overview" t={t} />
                        </div>
                        <div className="mt-8 border border-divider dark:border-transparent rounded-xl flex px-6 py-3 bg-transparent dark:bg-dark-4">
                            <div className="flex-auto px-6 py-4">
                                <span className="txtSecond-2">Tổng KLGD</span>
                                <div className="txtPri-3 mt-4">4,567,890,234</div>
                                <div className="txtSecond-2 mt-2">12,008 USDT</div>
                            </div>
                            {/* Divider */}
                            <div className="w-[1px] h-auto bg-divider dark:bg-divider-dark mx-6"></div>

                            {/* Card 2 */}
                            <div className="flex-auto px-6 py-4">
                                <span className="txtSecond-2">Tổng lợi nhuận</span>
                                <div className="text-green-3 dark:text-green-2 font-semibold text-2xl mt-4">+200,000,000</div>
                                <PriceChangePercent priceChangePercent={1.93} className="!justify-start !text-base mt-2" />
                            </div>

                            {/* Divider */}
                            <div className="w-[1px] h-auto bg-divider dark:bg-divider-dark mx-6"></div>

                            {/* Card 3 */}
                            <div className="flex-auto px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <span className="txtSecond-2">Tổng ký quỹ</span>
                                    <div>
                                        <span className="font-semibold">4,567,890</span>
                                        <span className="txtSecond-2">{` (12,008 USDT)`}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="txtSecond-2">Tổng số vị thế</span>
                                    <div>
                                        <span className="font-semibold">180</span>
                                        <span className="txtSecond-2">{` (90 mua - 90 bán)`}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="txtSecond-2">Đòn bẩy trung bình</span>
                                    <span className="font-semibold">10x</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bien dong loi nhuan */}
                    <div className="mt-12 p-8 border border-divider dark:border-transparent rounded-xl bg-transparent dark:bg-dark-4">
                        <div className="flex items-center justify-between w-full">
                            <div className="text-2xl font-semibold">Biến động lợi nhuận</div>
                            <GroupFilterTime curFilter={curPnlFilter} setCurFilter={setCurPnlFilter} GroupKey="Profit_changing" t={t} />
                        </div>
                        <div className="flex w-full max-h-[600px] items-center justify-center mt-8">
                            <ChartJS type="bar" data={pnlChartData} options={options} plugins={plugins} height="450px" />
                        </div>
                    </div>
                </div>
            </div>

            {/* {renderHeader()} */}
            {/* {renderContent()} */}
        </div>
    );
};

export default Portfolio;

const listTimeFilter = [
    { localized: 'common:global_label:time:week', value: 1 },
    { localized: 'common:global_label:time:1month', value: 2 },
    { localized: 'common:global_label:time:all', value: 3 }
];

const GroupFilterTime = ({ curFilter = listTimeFilter[0]?.value, setCurFilter, GroupKey, t }) => {
    return (
        <div className="flex items-center gap-4 text-base font-normal text-gray-1 dark:text-gray-7">
            {listTimeFilter.map((item) => (
                <button
                    key={GroupKey + 'filter_' + item?.value}
                    onClick={() => setCurFilter(item?.value)}
                    className={curFilter === item?.value && 'text-green-3 dark:text-green-2 font-semibold'}
                >
                    {t(`${item.localized ? item.localized : item.title}`)}
                </button>
            ))}
        </div>
    );
};

export const renderTabs = (tabs, tabType, setTabType, haveUnderline = true) => {
    return (
        <ComponentTabWrapper haveUnderline={haveUnderline}>
            {tabs.map((tab) => (
                <div>
                    <ComponentTabItem active={tabType === tab.value} onClick={() => setTabType(tab.value)}>
                        {tab.content}
                        {tabType === tab.value && <ComponentTabUnderline></ComponentTabUnderline>}
                    </ComponentTabItem>
                </div>
            ))}
        </ComponentTabWrapper>
    );
};

export const renderApexChart = (data, { height = '100%', width }) => (
    <Chart key="nami" options={data.options} series={data.series} type={data.type} height={height} width="100%" />
);
