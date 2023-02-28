// @ts-nocheck
import React, { useEffect, useState } from 'react';
import RefCard from 'components/screens/NewReference/RefCard';
import { FilterTabs } from 'components/screens/NewReference/mobile/index';
import FetchApi from 'utils/fetch-api';
import { API_NEW_REFERRAL_STATISTIC } from 'redux/actions/apis';
import { SmallCircle } from 'components/screens/NewReference/mobile/sections/Chart';
import ChartJS from 'components/screens/Portfolio/charts/ChartJS';
import baseColors from 'styles/colors';
import { formatNumber } from 'redux/actions/utils';
import DatePickerV2 from 'components/common/DatePicker/DatePickerV2';
import classNames from 'classnames';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

const Charts = ({
    t,
    id
}) => {
    const timeTabs = [
        {
            title: '1 ' + t('futures:day'),
            value: 'd',
            format: 'hh:mm',
            interval: '1h'
        },
        {
            title: '1 ' + t('futures:week'),
            value: 'w',
            format: 'dd/MM',
            interval: '1d'
        },
        {
            title: '1 ' + t('futures:month'),
            value: 'm',
            format: 'dd/MM',
            interval: '1d'
        }
        // { title: t('reference:referral.custom'), value: 'custom' },
    ];
    return (
        <div className='flex flex-col gap-8 w-full' id={id}>
            <RenderContent url={API_NEW_REFERRAL_STATISTIC + '-friend'} t={t} timeTabs={timeTabs} title={t('reference:referral.number_of_friends')} type='count' />
            <RenderContent url={API_NEW_REFERRAL_STATISTIC} t={t} timeTabs={timeTabs} title={t('reference:referral.total_commissions')} type='volume' />
        </div>
    );
};

export default Charts;

const RenderContent = ({
    t,
    timeTabs,
    title,
    url,
    type
}) => {
    const [currentTheme] = useDarkMode();
    const [timeTab, setTimeTab] = useState(timeTabs[0].value);
    const [dataSource, setDataSource] = useState({
        data: [],
        labels: []
    });
    const [filter, setFilter] = useState({
        range: {
            startDate: null,
            endDate: Date.now(),
            key: 'selection'
        }
    });
    // const [showCustom, setShowCustom] = useState(false)
    const colors = ['#e8bf56', '#7c99f7', '#a3f5c7', '#4ae17b'];

    const fetchChartData = _.debounce(() => {
        FetchApi({
            // @ts-ignore
            url,
            options: {
                method: 'GET'
            },
            params: {
                interval: timeTabs.find(e => e.value === timeTab)?.interval ?? '1d',
                from: filter?.range?.startDate,
                // from: 0,
                to: filter?.range?.endDate,
                format: timeTabs.find(e => e.value === timeTab)?.format ?? 'dd/MM'
            }
        })
            .then(({
                data,
                status
            }) => {
                if (status === 'ok') {
                    setDataSource(data);
                } else {
                    setDataSource({
                        data: [],
                        labels: []
                    });
                }
            });
    }, 300);

    useEffect(() => {
        if (!filter.range.startDate) return;
        fetchChartData();
    }, [filter]);
    useEffect(() => {
        if (timeTab !== 'custom') {
            const date = new Date();
            switch (timeTab) {
                case timeTabs[0].value:
                    date.setDate(date.getDate() - 1);
                    break;
                case timeTabs[1].value:
                    date.setDate(date.getDate() - 7);
                    break;
                case timeTabs[2].value:
                    date.setDate(date.getDate() - 31);
                    break;
                default:
                    break;
            }
            date.toLocaleDateString();
            setFilter({
                range: {
                    startDate: date.getTime(),
                    endDate: Date.now(),
                    key: 'selection'
                }
            });
            return;
        } else {
            setFilter({
                range: {
                    startDate: new Date(filter?.range?.startDate ?? null).getTime(),
                    endDate: new Date(filter?.range?.endDate ?? null).getTime(),
                    key: 'selection'
                }
            });
        }
    }, [timeTab]);

    const renderChart = () => {
        // const getData = (level) => dataSource.data.map(e => e[level - 1]?.[tab === tags[0].value ? 'count' : 'volume'] ?? [])
        const getData = (level) => dataSource?.data?.map(e => e[level - 1]?.[type]) ?? [];
        const data = {
            labels: dataSource?.labels || [],
            datasets: [{
                type: 'bar',
                label: 'level1',
                data: getData(1),
                backgroundColor: colors[0],
                borderColor: colors[0],
                maxBarThickness: 8,
                borderRadius: 2,
                barPercentage: 0.7,
                order: 1
            }, {
                type: 'bar',
                label: 'level2',
                data: getData(2),
                backgroundColor: colors[1],
                borderColor: colors[1],
                maxBarThickness: 8,
                borderRadius: 2,
                barPercentage: 0.7,
                order: 2
            }, {
                type: 'bar',
                label: 'level3',
                data: getData(3),
                backgroundColor: colors[2],
                borderColor: colors[2],
                maxBarThickness: 8,
                borderRadius: 2,
                barPercentage: 0.7,
                order: 3
            }, {
                type: 'bar',
                label: 'level4',
                data: getData(4),
                backgroundColor: colors[3],
                borderColor: colors[3],
                maxBarThickness: 8,
                borderRadius: 2,
                barPercentage: 0.7,
                order: 4
            }]
        };
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const index = context.dataIndex;
                            const datasetIndex = context.datasetIndex;
                            const data = dataSource.data[index][datasetIndex];
                            const level = t('reference:referral.level') + ': ' + data.level;
                            const friends = t('reference:referral.number_of_friends') + ': ' + data.count;
                            const commission = t('reference:referral.total_commissions') + ': ' + formatNumber(data.volume, 0) + ' VNDC';
                            if (!data.volume) return [level, friends];
                            return [level, friends, commission];
                        },
                        labelTextColor: function (context) {
                            return baseColors.gray[4];
                        }
                    },
                    backgroundColor: baseColors.dark.dark,
                    titleColor: baseColors.gray[4],
                    displayColors: false
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: baseColors.darkBlue5,
                        showLabelBackdrop: false
                    },
                    grid: {
                        display: false,
                        drawBorder: true,
                        borderColor: currentTheme === THEME_MODE.DARK ? baseColors.divider.dark : baseColors.divider.DEFAULT
                    },
                },
                y: {
                    ticks: {
                        color: baseColors.darkBlue5,
                    },
                    grid: {
                        borderDash: [1, 4],
                        // color: baseColors.divider.DEFAULT,
                        color: function (context) {
                            if (context.tick.value === 0) {
                                return 'rgba(0, 0, 0, 0)';
                            }
                            return currentTheme === THEME_MODE.DARK ? baseColors.divider.dark : baseColors.divider.DEFAULT;
                        },
                        drawBorder: false,
                    },

                    // ticks: {
                    //     callback: function(value) {
                    //         return value + 'k';
                    //     }
                    // }
                    // grid: {
                    //     color: 'magenta',
                    // },
                    // border: {
                    //     dash: [2, 4],
                    // },
                }
            }
        };
        return (
            <>
                <ChartJS type='bar' data={data} options={options} height='400px' />
            </>
        );
    };
    return (
        <RefCard wrapperClassName='!p-8 w-full h-auto bg-white dark:bg-dark-4' style={{ height: 'fit-content' }}>
            <div className='mb-6 flex justify-between w-full'>
                <div className='font-semibold text-[20px] leading-6'>
                    {title}
                </div>
                <div className='flex gap-3'>
                    {timeTabs.map(t => {
                        return <div
                            key={t.value}
                            onClick={() => setTimeTab(t.value)}
                            className={classNames('px-5 py-3 border rounded-full cursor-pointer font-normal', {
                                'text-txtSecondary dark:text-txtSecondary-dark border-divider dark:border-divider-dark': timeTab !== t.value,
                                'text-teal border-teal bg-teal/[.1] !font-semibold': timeTab === t.value,
                            })}
                        >{t.title}</div>;
                    })}
                    <DatePickerV2
                        initDate={filter.range}
                        onChange={e => setFilter({
                            range: {
                                startDate: new Date(e?.selection?.startDate ?? null).getTime(),
                                endDate: new Date(e?.selection?.endDate ?? null).getTime(),
                                key: 'selection'
                            }
                        })}
                        month={2}
                        hasShadow
                        position='right'
                        text={<div
                            onClick={() => setTimeTab('custom')}
                            className={classNames('px-5 py-3 border rounded-full cursor-pointer font-normal', {
                                'text-txtSecondary dark:text-txtSecondary-dark border-divider dark:border-divider-dark': timeTab !== 'custom',
                                'text-teal border-teal bg-teal/[.1] !font-semibold': timeTab === 'custom',
                            })}
                        >{t('reference:referral.custom')}</div>}
                    />
                </div>
            </div>
            <div>
                <div className='h-[350px]'>
                    {renderChart()}
                </div>
                <div className='px-2 mt-4 flex flex-wrap items-center gap-4'>
                    {colors.map((color, index) => (
                        <div className='flex items-center gap-2 leading-5 text-sm font-medium text-gray-1 min-w-[70px]'
                            key={index}>
                            <SmallCircle color={color} /> {t('reference:referral.level')} {index + 1}
                        </div>
                    ))}
                </div>
            </div>
        </RefCard>
    );
};
