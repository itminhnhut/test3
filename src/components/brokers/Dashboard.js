import { Fragment, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Menu, Transition } from '@headlessui/react';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard/lib/Component';
import { IconArrowDownSlim } from 'src/components/common/Icons';
import { getBrokerDashboardChartData, getBrokerDashboardUserAnalytics } from 'src/redux/actions/broker';
import { endOfDay, format, getUnixTime, parseISO, startOfDay, subDays } from 'date-fns';
import { formatWallet } from 'src/redux/actions/utils';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const SelectTimeButton = ({ onTimeChange, timeOptions, selectedTime }) => {
    // const [selectedTime, setSelectedTime] = useState('Last 7 days');

    const handleClickTime = (time) => {
        // setSelectedTime(time);
        onTimeChange(time);
    };

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="flex items-center text-black-500 text-sm py-2 px-3">
                    <span className="mr-3">{selectedTime}</span>
                    <IconArrowDownSlim />
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items
                    className="absolute right-0 w-40 mt-2 origin-top-right bg-white divide-y divide-black-100 rounded-md shadow-lg border border-[#EEF2FA] z-10"
                >
                    {timeOptions.map((option, index) => (
                        <Menu.Item key={index}>
                            {({ active }) => (
                                <button
                                    type="button"
                                    className={`${active ? 'bg-violet-500 text-white' : 'text-gray-900'} group flex rounded-md items-center w-full px-3 py-2 text-sm`}
                                    onClick={() => handleClickTime(option)}
                                >
                                    {option}
                                </button>
                            )}
                        </Menu.Item>
                    ))}
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

const BrokerDashboard = () => {
    const { t } = useTranslation(['common', 'broker']);
    const timeOptions = [t('broker:filter_last_7_days'), t('broker:filter_last_14_days'), t('broker:filter_last_30_days'), t('broker:filter_last_60_days')];
    const [copied, setCopied] = useState(false);
    const user = useSelector(state => state.auth.user) || null;
    const quoteAsset = useSelector(state => state.user.quoteAsset) || 'USDT';

    const [userAnalytics, setUserAnalytics] = useState({});
    const [commissionBroker, setCommissionBroker] = useState({});
    const [commissionBrokerKyc, setCommissionBrokerKyc] = useState({});
    const [incomeData, setIncomeData] = useState([]);
    const [incomeByCategoryData, setIncomeByCategoryData] = useState([]);
    const [memberTradingData, setMemberTradingData] = useState([]);
    const [memberGrowthData, setMemberGrowthData] = useState([]);
    const [timeRange, setTimeRange] = useState(
        {
            startDate: startOfDay(subDays(new Date(), 6)),
            endDate: endOfDay(new Date()),
            key: 'selection',
        },
    );
    const [selectedTime, setSelectedTime] = useState(timeOptions[0]);
    const [exchangeRate, setExchangeRate] = useState(1);

    const fetchChartData = async () => {
        const data = await getBrokerDashboardChartData({
            from: getUnixTime(timeRange.startDate) * 1000,
            to: getUnixTime(timeRange.endDate) * 1000,
        });
        if (data) {
            const comBroker = data?.incomeByCategory.filter(cat => cat?.category === 'SPOT_COMMISSION_BROKER')?.[0];
            const comKyc = data?.incomeByCategory.filter(cat => cat?.category === 'SPOT_COMMISSION_BROKER_KYC')?.[0];
            const comBrokerVndc = comBroker?.vndc || 0;
            const comBrokerUsdt = comBroker?.usdt || 0;
            const comBrokerValue = comBroker?.value || 0;
            const comBrokerKyc = comKyc?.vndc || 0;
            const comBrokerKycValue = comKyc?.value || 0;
            setCommissionBrokerKyc(comBrokerKyc);
            setCommissionBroker({
                usdt: comBrokerUsdt,
                vndc: comBrokerVndc,
            });

            setIncomeByCategoryData([comBrokerValue, comBrokerKycValue]);
            setExchangeRate(data?.assetValues);
            setIncomeData(data?.income);
            setMemberTradingData(data?.spotVolume);
            setMemberGrowthData(data?.users);
        }
    };

    const fetchUserAnalytics = async () => {
        const data = await getBrokerDashboardUserAnalytics();
        if (data) {
            setUserAnalytics(data);
        }
    };

    useEffect(() => {
        if (user) {
            fetchChartData();
            fetchUserAnalytics();
        }
    }, [user, timeRange, quoteAsset]);

    const handleChangeTimeCommission = (time) => {
        setSelectedTime(time);
        switch (time) {
            case timeOptions[0]: {
                return setTimeRange({
                    startDate: startOfDay(subDays(new Date(), 6)),
                    endDate: endOfDay(new Date()),
                    key: 'selection',
                });
            }
            case timeOptions[1]: {
                return setTimeRange({
                    startDate: startOfDay(subDays(new Date(), 13)),
                    endDate: endOfDay(new Date()),
                    key: 'selection',
                });
            }
            case timeOptions[2]: {
                return setTimeRange({
                    startDate: startOfDay(subDays(new Date(), 29)),
                    endDate: endOfDay(new Date()),
                    key: 'selection',
                });
            }
            case timeOptions[3]: {
                return setTimeRange({
                    startDate: startOfDay(subDays(new Date(), 59)),
                    endDate: endOfDay(new Date()),
                    key: 'selection',
                });
            }

            default:
                break;
        }
    };

    const seriesIncome = [
        {
            name: 'Income',
            data: incomeData.sort((a, b) => parseISO(a.time) - parseISO(b.time)).map(data => (quoteAsset === 'USDT' ? data?.value : (data?.value / exchangeRate?.VNDC))),
        },
    ];

    const seriesPercentage = incomeByCategoryData;

    const seriesTradingVolume = [{
        name: 'Members Trading Volume',
        data: memberTradingData.sort((a, b) => parseISO(a.time) - parseISO(b.time)).map(data => (quoteAsset === 'USDT' ? data?.value : (data?.value / exchangeRate?.VNDC))),
    }];

    const seriesMembers = [{
        name: 'Members Growth',
        data: memberGrowthData.map(data => data?.value),
    }];

    const optionsChartIncome = {
        chart: {
            type: 'bar',
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 5,
                columnWidth: '12%',
                colors: {
                    ranges: [{
                        from: Number.NEGATIVE_INFINITY,
                        to: 0,
                        color: '#E95F67',
                    }, {
                        from: 0,
                        to: Number.POSITIVE_INFINITY,
                        color: '#05B169',
                    }],
                },
            },
        },
        legend: {
            show: false,
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
        },
        xaxis: {
            categories: incomeData.map(data => format(parseISO(data?.time), 'dd/MM')),
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                style: {
                    colors: '#8B8C9B',
                    fontSize: '12px',
                    fontFamily: 'Mark Pro',
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#8B8C9B',
                    fontSize: '12px',
                    fontFamily: 'Mark Pro',
                },
                formatter(value) {
                    return formatWallet(value, 2, true);
                },
            },
        },
        fill: {
            opacity: 1,
        },
        states: {
            normal: {
                filter: {
                    type: 'none',
                    value: 0,
                },
            },
            hover: {
                filter: {
                    type: 'none',
                    value: 0,
                },
            },
            active: {
                allowMultipleDataPointsSelection: false,
                filter: {
                    type: 'none',
                    value: 0,
                },
            },
        },
        tooltip: {
            style: {
                fontSize: '12px',
                fontFamily: 'Mark Pro',
            },
            y: {
                formatter(val) {
                    return `${formatWallet(val, 2, true)}`;
                },
            },
        },
        colors: ['#05B169', '#05B169'],
        grid: {
            borderColor: '#EEF2FA',
            strokeDashArray: 4,
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
    };

    const optionsPercentage = {
        labels: [t('broker:trading_commission'), t('broker:kyc_rewards')],
        dataLabels: {
            enabled: false,
        },
        plotOptions: {
            pie: {
                expandOnClick: false,
                donut: {
                    size: '80%',
                },
            },
        },
        tooltip: {
            style: {
                fontSize: '12px',
                fontFamily: 'Mark Pro',
            },
            y: {
                formatter(val) {
                    return `${formatWallet(val, 2, true)}`;
                },
            },
        },
        colors: ['#F2C4B8', '#4021D0'],
        stroke: {
            width: 5,
        },
        states: {
            normal: {
                filter: {
                    type: 'none',
                    value: 0,
                },
            },
            hover: {
                filter: {
                    type: 'none',
                    value: 0,
                },
            },
            active: {
                filter: {
                    type: 'none',
                    value: 0,
                },
            },
        },
        legend: {
            show: false,
        },
    };

    const optionsTradingVolume = {
        chart: {
            toolbar: {
                show: false,
            },
        },
        tooltip: {
            style: {
                fontSize: '12px',
                fontFamily: 'Mark Pro',
            },
            y: {
                formatter(val) {
                    return `${formatWallet(val, 2, true)}`;
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'straight',
            width: 2,
            colors: ['#4021D0'],
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#8B8C9B',
                    fontSize: '12px',
                    fontFamily: 'Mark Pro',
                },
                formatter(value) {
                    return formatWallet(value, 2, true);
                },
            },
        },
        legend: {
            show: false,
        },
        grid: {
            borderColor: '#EEF2FA',
            strokeDashArray: 4,
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        xaxis: {
            labels: {
                style: {
                    colors: '#8B8C9B',
                    fontSize: '12px',
                    fontFamily: 'Mark Pro',
                },
            },
            categories: memberTradingData.map(data => format(parseISO(data?.time), 'dd/MM')),
            tooltip: {
                enabled: false,
            },
        },
        plotOptions: {
            area: {
                fillTo: 'origin',
            },
        },
        fill: {
            colors: ['#4021d0'],
            type: 'gradient',
            gradient: {
                type: 'vertical',
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                stops: [0, 100],
            },
        },
    };

    const optionsMembers = {
        chart: {
            toolbar: {
                show: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'straight',
            width: 2,
            colors: ['#4021D0'],
        },
        yaxis: {},
        legend: {
            show: false,
        },
        grid: {
            borderColor: '#EEF2FA',
            strokeDashArray: 4,
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        xaxis: {
            categories: ['5/6', '6/6', '7/6', '8/6', '9/6', '10/6', '11/6', '12/6', '13/6'],
            tooltip: {
                enabled: false,
            },
        },
        plotOptions: {
            area: {
                fillTo: 'origin',
            },
        },
        fill: {
            colors: ['#4021d0'],
            type: 'gradient',
            gradient: {
                type: 'vertical',
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                stops: [0, 100],
            },
        },
    };

    const referralLink = () => {
        if (user) {
            return `${process.env.APP_URL}/register?ref=${user?.id}`;
        }
        return '';
    };

    const totalCommission = () => {
        const usdtRate = exchangeRate?.USDT || 0;
        const vndcRate = exchangeRate?.VNDC || 0;
        let total = 0;
        if (usdtRate > 0 && vndcRate > 0) {
            if (quoteAsset === 'USDT') {
                total = commissionBroker?.usdt + commissionBroker?.vndc * vndcRate + commissionBrokerKyc * vndcRate;
            } else {
                total = commissionBroker?.usdt / vndcRate + commissionBroker?.vndc + commissionBrokerKyc;
            }
        }
        return formatWallet(total);
    };

    return (
        <div className="card-body lg:!py-[60px] lg:!px-[70px]">
            <div className="grid grid-cols-5 gap-10">
                <div className="col-span-5 lg:col-span-3 panel">
                    <div className="panel-header">
                        <div className="pane-header-title">
                            <div className="panel-header-text">{t('broker:your_commission')}</div>
                            {/* <div className="panel-header-number up">
                                    <div className="panel-header-icon">Ion</div>
                                    <div className="panel-header-percentage">+32.6%</div>
                                </div> */}
                        </div>
                        <div className="panel-header-actions">
                            <SelectTimeButton
                                onTimeChange={handleChangeTimeCommission}
                                timeOptions={timeOptions}
                                selectedTime={selectedTime}
                            />
                        </div>
                    </div>
                    <div className="panel-body">
                        <div className="mt-4 flex items-center">
                            <span className="panel-body-number !text-5xl">
                                {totalCommission()}
                            </span>
                            <span className="panel-body-text !text-xl">
                                {quoteAsset}
                            </span>
                        </div>
                        <div className="my-10 h-[1px] bg-black-200" />
                        <div className="grid grid-cols-2">
                            <div>
                                <div className="panel-body-text mb-1">
                                    {t('broker:trading_commission')}
                                </div>
                                <div className="flex items-center">
                                    <span className="panel-body-number">
                                        {formatWallet(commissionBroker?.vndc)}
                                    </span>
                                    <span className="panel-body-text">
                                        VNDC
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <span className="panel-body-number">
                                        {formatWallet(commissionBroker?.usdt)}
                                    </span>
                                    <span className="panel-body-text">
                                        USDT
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className="panel-body-text mb-1">
                                    {t('broker:kyc_rewards')}
                                </div>
                                <div className="flex items-center">
                                    <span className="panel-body-number">
                                        {formatWallet(commissionBrokerKyc)}
                                    </span>
                                    <span className="panel-body-text">
                                        VNDC
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-5 lg:col-span-2 panel">
                    <div className="panel-header">
                        <div className="pane-header-title">
                            <div className="panel-header-text">{t('broker:your_member')}</div>
                        </div>
                    </div>
                    <div className="panel-body mt-8">
                        <div className="grid grid-cols-3 gap-x-2 mb-12 items-center">
                            <div>
                                <div className="panel-body-text mb-1">
                                    {t('broker:members')}
                                </div>
                                <div className="flex items-center">
                                    <span className="panel-body-number truncate">
                                        {userAnalytics?.registered || 0}
                                    </span>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <div className="text-xs mb-1">
                                    {t('broker:your_ref_url')}
                                </div>
                                <div className="bg-black-5 px-4 py-2.5 flex items-center rounded-md relative">
                                    <div className="truncate text-sm font-semibold">{referralLink()}</div>
                                    <CopyToClipboard
                                        text={referralLink()}
                                        className="cursor-pointer text-sm text-violet-700 font-semibold whitespace-nowrap absolute top-[10px] right-2 bg-black-5"
                                        onCopy={() => setCopied(true)}
                                    >
                                        <span
                                            className="whitespace-nowrap"
                                        >{copied ? t('referral:copied') : t('referral:copy')}
                                        </span>
                                    </CopyToClipboard>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-x-2">
                            <div>
                                <div className="panel-body-text mb-1 w-max">
                                    {t('broker:sign_up')}
                                </div>
                                <div className="flex items-center">
                                    <span className="panel-body-number truncate">
                                        {userAnalytics?.registered || 0}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className="panel-body-text mb-1 w-max">
                                    {t('broker:kyc')}
                                </div>
                                <div className="flex items-center">
                                    <span className="panel-body-number truncate">
                                        {userAnalytics?.kyc || 0}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className="panel-body-text mb-1 w-max">
                                    {t('broker:get_rewarded')}
                                </div>
                                <div className="flex items-center">
                                    <span className="panel-body-number truncate">
                                        {userAnalytics?.getRewarded || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-3 panel">
                    <div className="panel-header mb-8">
                        <div className="pane-header-title">
                            <div className="panel-header-text">{t('broker:income_statistic')}</div>
                        </div>
                        <div className="panel-header-actions">
                            <SelectTimeButton
                                onTimeChange={handleChangeTimeCommission}
                                timeOptions={timeOptions}
                                selectedTime={selectedTime}
                            />
                        </div>
                    </div>
                    <div className="panel-body">
                        <Chart
                            options={optionsChartIncome}
                            series={seriesIncome}
                            type="bar"
                            height={270}
                        />
                    </div>
                </div>
                <div className="col-span-2 panel">
                    <div className="panel-body">
                        <Chart
                            options={optionsPercentage}
                            series={seriesPercentage}
                            type="donut"
                            width="100%"
                        />
                        <div className="chart-legend grid grid-cols-2 w-[240px] mx-auto gap-x-6 mt-8">
                            <div>
                                <div className="w-[40px] h-[8px] bg-[#F2C4B8] mb-2" />
                                <div className="text-black font-semibold">{t('broker:trading_commission')}</div>
                            </div>
                            <div>
                                <div className="w-[40px] h-[8px] bg-[#4021D0] mb-2" />
                                <div className="text-black font-semibold">{t('broker:kyc_rewards')}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-5 panel">
                    <div className="panel-header">
                        <div className="pane-header-title">
                            <div className="panel-header-text">{t('broker:member_trading_volume')}</div>
                        </div>
                    </div>
                    <div className="panel-body">
                        <Chart
                            options={optionsTradingVolume}
                            series={seriesTradingVolume}
                            type="area"
                            width="100%"
                            height="270"
                        />
                    </div>
                </div>
                <div className="col-span-5 panel">
                    <div className="panel-header">
                        <div className="pane-header-title">
                            <div className="panel-header-text">{t('broker:member_growth')}</div>
                        </div>
                    </div>
                    <div className="panel-body">
                        <Chart
                            options={optionsMembers}
                            series={seriesMembers}
                            type="area"
                            width="100%"
                            height="270"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrokerDashboard;
