import FilterTimeTabV2 from 'components/common/FilterTimeTabV2';
import Chip from 'components/common/V2/Chip';
import { BREAK_POINTS } from 'constants/constants';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import useQuery from 'hooks/useQuery';
import { useTranslation } from 'next-i18next';
import React, { useMemo, useState } from 'react';
import { useWindowSize } from 'utils/customHooks';
import colors from 'styles/colors';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';
import { Chart as ChartJs, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Filler } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Spiner from 'components/common/V2/LoaderV2/Spiner';
import classNames from 'classnames';
import styled from 'styled-components';
import { BxsInfoCircle } from 'components/svg/SvgIcon';
ChartJs.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Filler);

const COMMISSION_TYPE = {
    all: 'all',
    deposit: 'deposit',
    withdraw: 'withdraw',
    spot: 'spot',
    futures: 'futures',
    swap: 'swap',
    insurance: 'insurance'
};
const colorMap = {
    deposit: colors.green[6],
    withdraw: colors.purple[1],
    spot: colors.green[7],
    futures: colors.yellow[5],
    swap: colors.pink[1],
    insurance: colors.orange[1]
};

const Dot = styled.div`
    border-radius: 50%;
    width: 8px;
    height: 8px;
    background-color: ${({ color }) => color || 'none'};
`;

const CommissionStatistics = () => {
    const { t } = useTranslation();
    const [filter, setFilter] = useState();
    return (
        <div className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto px-4 v3:px-0">
            <h1 className="text-2xl md:text-4xl font-semibold">{t('commission:commission_statistics')}</h1>
            <TotalCommission />
            <Chart />
        </div>
    );
};

const TotalCommission = () => {
    const { t } = useTranslation();
    const [currentTheme] = useDarkMode();
    const { width } = useWindowSize();
    const isDark = currentTheme === THEME_MODE.DARK;
    const isMobile = width < BREAK_POINTS.md;

    const TIME_FILTER = [
        {
            localized: 'common:all',
            value: 'all'
        },
        {
            localized: 'dw_partner:filter.a_day',
            value: 'd',
            format: 'hh:mm',
            interval: '1h'
        },
        {
            localized: 'dw_partner:filter.a_week',
            value: 'w',
            format: 'dd/MM',
            interval: '1d'
        },
        {
            localized: 'dw_partner:filter.a_month',
            value: 'm',
            format: 'dd/MM',
            interval: '1d'
        }
    ];
    const [filter, setFilter] = useState({
        range: {
            startDate: undefined,
            endDate: undefined,
            key: 'selection'
        }
    });

    return (
        <>
            <div className="flex justify-between items-center flex-wrap mt-8 md:mt-12 gap-4">
                <h3 className="text-lg md:text-2xl font-semibold">{t('commission:total_commission')}</h3>
                <FilterTimeTabV2
                    filter={filter}
                    setFilter={setFilter}
                    timeFilter={TIME_FILTER}
                    isDark={isDark}
                    isMobile={isMobile}
                    chipClassName="bg-gray-12 dark:bg-dark-4"
                />
            </div>
            <div className="bg-white dark:bg-dark-4 rounded-xl p-4 md:p-8 flex flex-wrap items-center mt-8">
                <div className="md:p-6 md:pl-0 w-full md:w-1/2 md:border-r border-divider dark:border-divider-dark">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark text-xs md:text-sm">{t('commission:total_commission')}</div>
                    <div className="mt-2 md:mt-4 text-2xl md:text-4xl font-semibold">1,000,000,000 VNDC</div>
                </div>
                <div className="md:pl-6 md:pr-0 w-full md:w-1/2 flex flex-wrap items-center">
                    <div className="w-full md:w-1/2 mt-6 md:mt-0">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark text-xs md:text-sm">{t('commission:total_USDT_commission')}</div>
                        <div className="mt-2 md:mt-4 text-base md:text-lg font-semibold">719,000,000</div>
                    </div>
                    <div className="w-full md:w-1/2 mt-6 md:mt-0">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark text-xs md:text-sm">{t('commission:total_VNDC_commission')}</div>
                        <div className="mt-2 md:mt-4 text-base md:text-lg font-semibold">719,000,000</div>
                    </div>
                </div>
            </div>
        </>
    );
};

const defaultBar = {
    type: 'bar',
    borderWidth: 0,
    // barPercentage: 7,
    maxBarThickness: 12,
    borderSkipped: false,
    borderColor: colors.green[6],
    backgroundColor: colors.green[6],
    borderRadius: 2,
    fill: false,
    data: []
};

const Chart = () => {
    const { t } = useTranslation();
    const [currentTheme] = useDarkMode();
    const { width } = useWindowSize();
    const isDark = currentTheme === THEME_MODE.DARK;
    const isMobile = width < BREAK_POINTS.md;
    const TIME_FILTER = [
        {
            localized: 'common:all',
            value: 'all'
        },
        {
            localized: 'dw_partner:filter.a_day',
            value: 'd',
            format: 'hh:mm',
            interval: '1h'
        },
        {
            localized: 'dw_partner:filter.a_week',
            value: 'w',
            format: 'dd/MM',
            interval: '1d'
        },
        {
            localized: 'dw_partner:filter.a_month',
            value: 'm',
            format: 'dd/MM',
            interval: '1d'
        }
    ];
    const [filter, setFilter] = useState({
        range: {
            startDate: undefined,
            endDate: undefined,
            key: 'selection'
        }
    });
    const [commissionType, setCommissionType] = useState(COMMISSION_TYPE.all);
    const { data, isLoading } = useQuery(
        [filter.range],
        () => {
            const labels = ['03/06', '04/06', '05/06', '06/06', '07/06', '08/06', '09/06'];
            const deposit = {
                ...defaultBar,
                label: t('commission:variants:deposit'),
                data: [16552927, 10256982, 15630231, 3065014, 4084429, 7065144, 13450982],
                borderColor: colors.green[6],
                backgroundColor: colors.green[6]
            };
            const withdraw = {
                ...defaultBar,
                label: t('commission:variants:withdraw'),
                data: [16552927, 10256982, 15630231, 3065014, 4084429, 7065144, 13450982],
                borderColor: colors.purple[1],
                backgroundColor: colors.purple[1]
            };
            const spot = {
                ...defaultBar,
                label: t('commission:variants:spot'),
                data: [11289385, 9467057, 16405857, 10883530, 2299364, 8096331, 11357147],
                borderColor: colors.green[7],
                backgroundColor: colors.green[7]
            };
            const futures = {
                ...defaultBar,
                label: t('commission:variants:futures'),
                data: [17256133, 14348795, 12376145, 8388107, 6261284, 10432778, 718006],
                borderColor: colors.yellow[5],
                backgroundColor: colors.yellow[5]
            };
            const swap = {
                ...defaultBar,
                label: t('commission:variants:swap'),
                data: [6667014, 9539422, 18232784, 7015286, 4677494, 16307797, 10430998],
                borderColor: colors.pink[1],
                backgroundColor: colors.pink[1]
            };
            const insurance = {
                ...defaultBar,
                label: t('commission:variants:insurance'),
                data: [6766789, 2797715, 11699669, 4649970, 15993927, 16140796, 12793498],
                borderColor: colors.orange[1],
                backgroundColor: colors.orange[1]
            };
            return {
                labels,
                datasets: {
                    [COMMISSION_TYPE.all]: [deposit, spot, withdraw, swap, insurance, futures].reverse(),
                    [COMMISSION_TYPE.deposit]: [deposit],
                    [COMMISSION_TYPE.withdraw]: [withdraw],
                    [COMMISSION_TYPE.spot]: [spot],
                    [COMMISSION_TYPE.futures]: [futures],
                    [COMMISSION_TYPE.swap]: [swap],
                    [COMMISSION_TYPE.insurance]: [insurance]
                }
            };
        },
        {
            persist: false,
            ttl: '1h'
        }
    );

    const options = useMemo(() => {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: true,
                    // callbacks: {
                    //     label: (context) => {
                    //         useTooltip.current = true;
                    //         const index = context.dataIndex;
                    //         const datasetIndex = context.datasetIndex;
                    //         const data = dataSource.data[index][datasetIndex];
                    //         const level = t('reference:referral.level') + ': ' + data.level;
                    //         const friends = t('reference:referral.number_of_friends') + ': ' + data.count;
                    //         const commission = t('reference:referral.total_commissions') + ': ' + formatNumber(data.volume, 0) + ' VNDC';
                    //         if (!data.volume) return [level, friends];
                    //         return [level, friends, commission];
                    //     },
                    //     labelTextColor: (context) => {
                    //         return colors.gray[4];
                    //     }
                    // },
                    backgroundColor: isDark ? colors.dark[1] : colors.dark.dark,
                    titleColor: isDark ? colors.gray[4] : colors.white,
                    displayColors: false
                }
            },
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        drawTicks: false,
                        display: false,
                        color: isDark ? colors.divider.dark : colors.divider.DEFAULT,
                    },
                    ticks: {
                        color: isDark ? colors.gray[7] : colors.gray[1]
                    }
                },
                y: {
                    stacked: true,
                    grid: {
                        drawTicks: false,
                        drawBorder: false,
                        color: isDark ? colors.divider.dark : colors.divider.DEFAULT,
                        borderDash: [1, 2]
                    },
                    ticks: {
                        color: isDark ? colors.gray[7] : colors.gray[1]
                    }
                }
            }
        };
    }, [isDark]);

    return (
        <>
            <div className="flex justify-between items-center flex-wrap mt-12 md:mt-20 gap-4">
                <h3 className="text-lg md:text-2xl font-semibold">{t('commission:chart:title')}</h3>
            </div>
            <Tabs tab={commissionType} className="mt-6 md:mt-8 overflow-x-auto space-x-6 border-b border-divider dark:border-divider-dark">
                {Object.keys(COMMISSION_TYPE).map((type) => {
                    const active = commissionType === type;
                    return (
                        <TabItem
                            key={type}
                            value={type}
                            isActive={active}
                            className="!py-4 !px-2 text-sm md:text-base cursor-pointer"
                            onClick={() => setCommissionType(type)}
                        >
                            {t(`commission:variants:${type}`)}
                        </TabItem>
                    );
                })}
            </Tabs>
            <div className="bg-white dark:bg-dark-4 rounded-xl p-4 md:p-8 mt-6 md:mt-8">
                <div className="flex flex-wrap items-center justify-between gap-2 md:gap-4">
                    <div className="text-lg md:text-2xl font-semibold">{t(`commission:chart:${commissionType}`)}</div>
                    <FilterTimeTabV2 filter={filter} setFilter={setFilter} timeFilter={TIME_FILTER} isDark={isDark} isMobile={isMobile} />
                </div>
                <div className="mt-8 w-full min-h-[350px] flex items-center justify-center">
                    {isLoading ? (
                        <Spiner isDark={isDark} />
                    ) : (
                        <Bar options={options} data={{ labels: data?.labels || [], datasets: data?.datasets?.[commissionType] || defaultBar }} />
                    )}
                </div>
                <div className="mt-6 md:mt-8 flex flex-wrap gap-4 justify-between">
                    <div className="flex space-x-4 overflow-x-auto">
                        {commissionType === COMMISSION_TYPE.all &&
                            Object.keys(colorMap).map((key) => {
                                return (
                                    <div className="flex space-x-2 items-center" key={key}>
                                        <Dot color={colorMap[key]} />
                                        <span className="text-xs md:text-sm text-txtSecondary dark:text-txtSecondary-dark">
                                            {t(`commission:variants:${key}`)}
                                        </span>
                                    </div>
                                );
                            })}
                    </div>
                    <div className="flex space-x-2 items-center text-txtSecondary dark:text-txtSecondary-dark">
                        <BxsInfoCircle color="currentColor" size={16} />
                        <span>{t('commission:chart:note')}</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CommissionStatistics;
