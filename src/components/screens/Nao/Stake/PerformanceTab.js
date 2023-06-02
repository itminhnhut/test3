import React, { useState, useMemo, useEffect, Fragment, useCallback, useRef } from 'react';
import { CardNao, TextLiner, ButtonNao, Divider, Progressbar, Tooltip } from 'components/screens/Nao/NaoStyle';
import { formatNumber, getS3Url, formatTime, RefCurrency } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import TableNoData from 'components/common/table.old/TableNoData';
import fetchApi from 'utils/fetch-api';
import { API_POOL_USER_SHARE_HISTORIES, API_POOL_STAKE_ORDER } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import styled from 'styled-components';
import classnames from 'classnames';
import colors from 'styles/colors';
import StakeOrders from 'components/screens/Nao/Stake/StakeOrders';
import QuestionMarkIcon from 'components/svg/QuestionMarkIcon';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useRouter } from 'next/router';
import { WalletCurrency } from 'utils/reference-utils';
import { days, RangePopover } from '../Section/NaoPerformance';
import classNames from 'classnames';
import { NoDataDarkIcon, NoDataLightIcon } from 'components/common/V2/TableV2/NoData';
import { ArrowRight } from '../Section/NaoPool';
import { Swiper, SwiperSlide } from 'swiper/react';
// const mock = [
//     {
//         _id: '6459c1bc9401d9667b650cf0',
//         interest: {
//             1: 222,
//             22: 0.2006470868551077,
//             72: 42135.88823957262,
//             86: 0,
//             447: 2.006470868551077
//         },
//         fromTime: '2023-04-30T17:00:00.000Z',
//         toTime: '2023-05-07T16:59:59.999Z',
//         interestUSD: {
//             1: 2.5994871794871792,
//             22: 0,
//             72: 1.8006789845971205,
//             86: 0,
//             447: 0.09054842893974092
//         }
//     },
//     {
//         _id: '6459c1bc9401d9667b650cf1',
//         interest: {
//             1: 222,
//             22: 0.2006470868551077,
//             72: 42135.88823957262,
//             86: 0,
//             447: 2.006470868551077
//         },
//         fromTime: '2023-05-07T17:00:00.000Z',
//         toTime: '2023-05-14T16:59:59.999Z',
//         interestUSD: {
//             1: 2.5994871794871792,
//             22: 0,
//             72: 1.8006789845971205,
//             86: 0,
//             447: 0.09054842893974092
//         }
//     },
//     {
//         _id: '6459c1bc9401d9667b650cf2',
//         interest: {
//             1: 222,
//             22: 0.2006470868551077,
//             72: 42135.88823957262,
//             86: 0,
//             447: 2.006470868551077
//         },
//         fromTime: '2023-05-14T17:00:00.000Z',
//         toTime: '2023-05-21T16:59:59.999Z',
//         interestUSD: {
//             1: 2.5994871794871792,
//             22: 0,
//             72: 1.8006789845971205,
//             86: 0,
//             447: 0.09054842893974092
//         }
//     },
//     {
//         _id: '6459c1bc9401d9667b650cf3',
//         interest: {
//             1: 222,
//             22: 0.2006470868551077,
//             72: 42135.88823957262,
//             86: 0,
//             447: 2.006470868551077
//         },
//         fromTime: '2023-05-28T17:00:00.000Z',
//         toTime: '2023-06-05T16:59:59.999Z',
//         interestUSD: {
//             1: 2.5994871794871792,
//             22: 0,
//             72: 1.8006789845971205,
//             86: 0,
//             447: 0.09054842893974092
//         }
//     }
// ];

const DeskStakingHistoryWrapper = styled.div`
    height: ${(props) => `${props.height || 0}px`};
`

const getAssets = createSelector([(state) => state.utils, (utils, params) => params], (utils, params) => {
    const assets = {};
    const arr = [1, 72, 86, 447, 22];
    arr.map((id) => {
        const asset = utils.assetConfig.find((rs) => rs.id === id);
        if (asset) {
            assets[id] = {
                assetCode: asset?.assetCode,
                assetDigit: asset?.assetDigit,
                assetName: asset?.assetName
            };
        }
    });
    return assets;
});

const PerformanceTab = ({ isSmall, dataSource, assetNao, onShowLock }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const [listHistory, setListHistory] = useState([]);
    const assetConfig = useSelector((state) => getAssets(state));
    const router = useRouter();
    const [tab, setTab] = useState(0);
    const [filter, setFilter] = useState({
        day: 'd',
        marginCurrency: WalletCurrency.VNDC
    });
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const [actIdx, setActIdx] = useState(0);
    const sliderRef = useRef(null);
    const deskProfitRef = useRef(null);
    const onNavigate = (isNext) => {
        if (sliderRef.current) {
            sliderRef.current.swiper[isNext ? 'slideNext' : 'slidePrev']();
        }
    };

    useEffect(() => {
        const { date } = router.query;
        if (date) {
            setFilter({
                ...filter,
                day: date
            });
        }
    }, [router.isReady]);

    useEffect(() => {
        getListHistory();
    }, []);

    const getListHistory = async () => {
        try {
            const { data, status } = await fetchApi({
                url: API_POOL_USER_SHARE_HISTORIES
            });
            if (status === ApiStatus.SUCCESS && Array.isArray(data) && data) {
                setListHistory(data);
            }
        } catch (e) {
            console.log(e);
        } finally {
        }
    };

    const updateDateRangeUrl = (dateValue) => {
        router.push({
            pathname: router.pathname,
            query: {
                date: dateValue
            }
        });
    };

    const handleChangeMarginCurrency = (currency) => {
        setFilter({
            ...filter,
            marginCurrency: currency
        });
    };

    const handleChangeDateRange = (day) => {
        if (day !== filter.day) {
            setFilter({
                ...filter,
                day
            });
            updateDateRangeUrl(day);
        }
    };

    const onSetTab = (key) => {
        setTab(key);
    };

    const data = useMemo(() => {
        const availableStaked = dataSource?.availableStaked ?? 0;
        const totalStaked = dataSource?.totalStaked ?? 0;
        const pool = availableStaked / totalStaked;
        const percent = (availableStaked / totalStaked) * 100;
        const totalEstUSDT = Object.values(dataSource?.poolRevenueThisWeekUSD ?? {}).reduce((a, b) => a + b, 0);
        return {
            percent: percent || 0,
            estimate: dataSource?.poolRevenueThisWeek,
            estimateUSD: dataSource?.poolRevenueThisWeekUSD,
            totalEstUSDT: totalEstUSDT * (percent / 100 || 0),
            totalStaked,
            availableStaked,
            totalProfit: dataSource?.totalProfit
        };
    }, [dataSource]);

    const EstimateInterest = ({ assetId, logoPath }) => {
        return (
            <div className="flex items-center w-full">
                <div className="mb:w-8 mb:h-8 w-6 h-6 flex-shrink-0">
                    <img src={getS3Url(logoPath)} width={32} height={32} alt="" />
                </div>
                <div className="ml-3 flex-1">
                    <div className="flex justify-between text-sm mb:text-base font-semibold">
                        <div className="">{assetConfig[assetId]?.assetCode}</div>
                        <div className="">
                            {formatNumber((data.estimate?.[assetId] || 0) * (data.percent / 100 || 0), assetConfig[assetId]?.assetDigit ?? 8)}
                        </div>
                    </div>
                    <div className="flex justify-between text-xs mb:text-sm text-txtSecondary dark:text-txtSecondary-dark">
                        <div className="">{assetConfig[assetId]?.assetName}</div>
                        <div className="">${formatNumber((data.estimateUSD?.[assetId] || 0) * (data.percent / 100 || 0), 4)}</div>
                    </div>
                </div>
            </div>
        );
    };

    const HistoryInterest = ({ assetId, item, logoPath }) => {
        return (
            <div>
                <div className="flex items-center w-full">
                    <img src={getS3Url(logoPath)} width={20} height={20} alt="" />
                    <div className="ml-3 flex-1">
                        <div className="flex justify-between text-sm font-semibold">
                            <div className="">{assetConfig[assetId]?.assetCode}</div>
                            <div className="">{formatNumber(item.interest?.[assetId] || 0, assetConfig[assetId]?.assetDigit ?? 8)}</div>
                        </div>
                        <div className="flex justify-between text-xs text-txtSecondary dark:text-txtSecondary-dark">
                            <div className="">{assetConfig[assetId]?.assetName}</div>
                            <div className=""> ${formatNumber(item.interestUSD?.[assetId] || 0, 4)}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderEstInterest = () => {
        return (
            <>
                <div
                    className="flex items-center space-x-2 text-txtPrimary dark:text-txtPrimary-dark font-semibold mb:text-lg leading-6 w-fit border-b mb:border-b-0 border-gray-1 dark:border-gray-7 border-dashed"
                    data-tip={t('nao:pool:tooltip_est_this_week')}
                    data-for="tooltip-est-this-week"
                >
                    <span>{t('nao:pool:per_est_revenue')}</span>
                    <div className="hidden mb:block">
                        <QuestionMarkIcon isFilled color="currentColor" size={16} />
                    </div>
                </div>

                <div className="text-xs mb:text-base text-txtSecondary dark:text-txtSecondary-dark pt-2">
                    {t('nao:pool:equivalent')} ${formatNumber(data.totalEstUSDT, 4)}
                </div>
                <div className="mt-4 mb:mt-6">
                    <div className="-m-2 mb:-mx-8 mb:-my-3 flex flex-wrap items-center">
                        <div className="w-full mb:w-1/2 p-2 mb:px-8 mb:py-3">
                            <EstimateInterest assetId={447} logoPath="/images/nao/ic_nao.png" />
                        </div>
                        <div className="w-full mb:w-1/2 p-2 mb:px-8 mb:py-3">
                            <EstimateInterest assetId={72} logoPath="/images/nao/ic_vndc.png" />
                        </div>
                        <div className="w-full mb:w-1/2 p-2 mb:px-8 mb:py-3">
                            <EstimateInterest assetId={1} logoPath={`/images/coins/64/${1}.png`} />
                        </div>
                        {data.estimate?.[86] && data.estimate?.[86] > 0 ? (
                            <div className="w-full mb:w-1/2 p-2 mb:px-8 mb:py-3">
                                <EstimateInterest assetId={86} logoPath={'/images/nao/ic_onus.png'} />
                            </div>
                        ) : null}
                        <div className="w-full mb:w-1/2 p-2 mb:px-8 mb:py-3">
                            <EstimateInterest assetId={22} logoPath={`/images/coins/64/${22}.png`} />
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const renderSlide = () => {
        const size = 1;
        const page = Array.isArray(listHistory) && Math.ceil(listHistory.length / size);
        const result = [];
        const weekNumber = listHistory.length + 1;
        for (let i = 0; i < page; i++) {
            const dataFilter = listHistory.slice(i * size, (i + 1) * size);
            result.push(
                <SwiperSlide key={i}>
                    <div className="flex w-full">
                        {dataFilter.map((item, index) => {
                            const sumUSDT = Object.values(item.interestUSD).reduce((a, b) => a + b, 0);
                            weekNumber--;
                            return (
                                <div className="w-full" key={item["_id"] || index}>
                                    <div className="flex text-txtSecondary dark:text-txtSecondary-dark">
                                        <div className="">
                                            {t('nao:pool:week', { value: listHistory.length - index })} {formatTime(item.fromTime, 'dd/MM/yyyy')} -{' '}
                                            {formatTime(item.toTime, 'dd/MM/yyyy')}
                                        </div>
                                        <div className="ml-8">
                                            {t('nao:pool:equivalent')} ${formatNumber(sumUSDT, 4)}
                                        </div>
                                    </div>
                                    <div className="pt-6 mb:pt-8 flex flex-col space-y-4 mb:space-y-6">
                                        <div className="w-full mb:p-0.5">
                                            <HistoryInterest item={item} assetId={447} logoPath="/images/nao/ic_nao.png" />
                                        </div>
                                        <div className="w-full mb:p-0.5">
                                            <HistoryInterest item={item} assetId={72} logoPath="/images/nao/ic_vndc.png" />
                                        </div>
                                        <div className="w-full mb:p-0.5">
                                            <HistoryInterest item={item} assetId={1} logoPath={`/images/coins/64/${1}.png`} />
                                        </div>
                                        {item.interest?.[86] && item.interest?.[86] > 0 ? (
                                            <div className="w-full  mb:p-0.5">
                                                <HistoryInterest item={item} assetId={86} logoPath={'/images/nao/ic_onus.png'} />
                                            </div>
                                        ) : null}
                                        <div className="w-full mb:p-0.5">
                                            <HistoryInterest item={item} assetId={22} logoPath={`/images/coins/64/${22}.png`} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SwiperSlide>
            );
        }
        return result;
    };

    return !dataSource?.isNewUser ? (
        <>
            <div>
                <TextLiner className="mb-2 !text-xl mb:!text-2xl text-txtPrimary dark:text-txtPrimary-dark">{t('nao:pool:per_overview')}</TextLiner>
                <div className="text-txtSecondary dark:text-txtSecondary-dark text-sm flex items-center justify-between">
                    <span className="text-sm mb:text-base">{t('nao:pool:per_description')}</span>
                    <RangePopover
                        language={language}
                        active={days.find((d) => d.value === filter.day)}
                        onChange={handleChangeDateRange}
                        className="flex order-last"
                        popoverClassName={'lg:mr-2 '}
                        btnClassName="!h-auto"
                    />
                </div>
                {/* <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-between lg:justify-end mt-6 mb-8">
                    <RangePopover
                        language={language}
                        active={days.find((d) => d.value === filter.day)}
                        onChange={handleChangeDateRange}
                        className="flex order-last"
                        popoverClassName={'lg:mr-2 '}
                    />
                    <div className="order-first gap-2 flex gap-last">
                        <button
                            type="BUTTON"
                            className={classNames(
                                'flex flex-col justify-center h-full px-4 text-sm rounded-[800px] border-[1px] border-divider dark:border-divider-dark cursor-pointer whitespace-nowrap dark:text-txtSecondary-dark text-txtSecondary',
                                { '!border-teal bg-teal bg-opacity-10 !text-teal font-semibold': filter.marginCurrency === WalletCurrency.VNDC }
                            )}
                            onClick={() => handleChangeMarginCurrency(WalletCurrency.VNDC)}
                        >
                            Futures VNDC
                        </button>
                        <button
                            type="BUTTON"
                            className={classNames(
                                'flex flex-col justify-center h-full px-4 text-sm rounded-[800px] border-[1px] border-divider dark:border-divider-dark cursor-pointer whitespace-nowrap dark:text-txtSecondary-dark text-txtSecondary',
                                { '!border-teal bg-teal bg-opacity-10 !text-teal font-semibold': filter.marginCurrency === WalletCurrency.USDT }
                            )}
                            onClick={() => handleChangeMarginCurrency(WalletCurrency.USDT)}
                        >
                            Futures USDT
                        </button>
                    </div>
                </div> */}
                <div className="mt-6 ">
                    <div className="flex flex-col-reverse flex-wrap -m-2 mb:-m-3 mb:flex-row ">
                        <div className="w-full p-2 mb:w-1/2 mb:p-3 ">
                            <CardNao className="!p-4 mb:!p-8 rounded-xl border mb:justify-start border-divider dark:border-none h-full">
                                <label className="text-txtPrimary dark:text-txtPrimary-dark font-semibold leading-6 mb:text-lg">
                                    {t('nao:pool:total_revenue')}
                                </label>
                                <div className="flex items-center mt-6 mb:mt-8">
                                    <div className="text-xl mb:text-2xl font-semibold">≈ {formatNumber(data.totalProfit, 0)} VNDC</div>
                                </div>
                                <div className="text-xs mb:text-base text-txtSecondary dark:text-txtSecondary-dark mt-0.5 mb:mt-2">
                                    <span>{t('nao:pool:equivalent')}</span>&nbsp;
                                    <RefCurrency price={data.totalProfit} quoteAsset={'VNDC'} />
                                </div>

                                <Tooltip
                                    id="tooltip-est-this-week"
                                    className="!max-w-[300px] mb_only:!mx-4 mb_only:after:!left-12"
                                    overridePosition={({ top, left }) => {
                                        if (window?.innerWidth < 820) {
                                            // 640 is the breakpoint of small devices
                                            return {
                                                top,
                                                left: 0
                                            };
                                        }

                                        return { top, left };
                                    }}
                                />

                                <hr className="mb:hidden border-divider dark:border-divider-dark my-4" />
                                <div className="mb:hidden">{renderEstInterest()}</div>
                            </CardNao>
                        </div>
                        <div className="w-full p-2 mb:w-1/2 mb:p-3 ">
                            <CardNao className="!p-4 mb:!p-8 rounded-xl border mb:justify-start border-divider dark:border-none">
                                <label className="text-txtPrimary dark:text-txtPrimary-dark font-semibold leading-6 mb:text-lg  ">
                                    {t('nao:pool:total_staked')}
                                </label>
                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center mr-8">
                                            <span className="font-semibold mr-1 leading-7">
                                                {formatNumber(data.availableStaked, assetNao?.assetDigit ?? 8)}
                                            </span>
                                            <img src={getS3Url('/images/nao/ic_nao.png')} width={16} height={16} alt="" />
                                        </div>
                                        <div className="text-txtSecondary dark:text-txtSecondary-dark text-sm">
                                            {formatNumber(data.totalStaked, assetNao?.assetDigit ?? 8)}
                                        </div>
                                    </div>
                                    <div className="">
                                        <div className="w-full bg-gray-11 dark:bg-dark-1 rounded-xl">
                                            <Progressbar percent={Math.ceil(data.percent)} />
                                        </div>
                                    </div>
                                    <div className="text-xs text-txtSecondary dark:text-txtSecondary-dark mb:text-base leading-6">
                                        {formatNumber(data.percent || 0, assetNao?.assetDigit ?? 8)}%
                                    </div>
                                </div>
                            </CardNao>
                        </div>
                        <div className="w-full p-2 mb:p-3">
                            <CardNao className="!p-6 hidden mb:block border border-divider dark:border-none">{renderEstInterest()}</CardNao>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-12 mb:mt-20">
                <TextLiner className="pb-2 mb:!text-2xl !text-xl">{t('common:transaction_history')}</TextLiner>
                <div className="text-txtSecondary dark:text-txtSecondary-dark text-sm">{t('nao:pool:history_description')}</div>
                <div className="mt-8 hidden mb:block">
                    <div className="flex -m-3">
                        <div className="w-1/2 p-3">
                            <CardNao className="!p-6 w-full" ref={deskProfitRef}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-txtPrimary dark:text-txtPrimary-dark text-lg font-semibold">{t('nao:pool:profit')}</div>

                                    <div className="flex space-x-2">
                                        <ArrowRight
                                            onClick={() => onNavigate(false)}
                                            disabled={actIdx === 0}
                                            className={classNames('rotate-180 cursor-pointer')}
                                        />
                                        <ArrowRight
                                            onClick={() => onNavigate(true)}
                                            disabled={listHistory.length === 0 || actIdx === listHistory.length - 1}
                                            className={classNames('cursor-pointer')}
                                        />
                                    </div>
                                </div>
                                <Swiper
                                    onSlideChange={({ activeIndex }) => setActIdx(activeIndex)}
                                    ref={sliderRef}
                                    loop={false}
                                    lazy
                                    grabCursor
                                    className={`mySwiper`}
                                    slidesPerView={1}
                                    spaceBetween={10}
                                >
                                    {renderSlide()}
                                </Swiper>
                            </CardNao>
                        </div>
                        <div className="w-1/2 p-3">
                            <CardNao className="!py-6 h-full flex flex-col justify-between !px-2">
                                <div className="text-txtPrimary dark:text-txtPrimary-dark text-lg font-semibold px-4">Staking</div>
                                <DeskStakingHistoryWrapper
                                    // height={deskProfitRef?.current ? deskProfitRef.current.offsetHeight - 114 : 0}
                                    height={264}
                                    className="overflow-y-auto px-4"
                                >
                                    <StakeOrders assetConfig={assetConfig} />
                                </DeskStakingHistoryWrapper>
                            </CardNao>
                        </div>
                    </div>
                </div>
                <div className="mb:hidden">
                    <Tabs tab={tab} className="divide-x divide-divider dark:divide-divider-dark">
                        <TabItem active={tab === 0} onClick={() => onSetTab(0)}>
                            {t('nao:pool:profit')}
                        </TabItem>
                        <TabItem active={tab === 1} onClick={() => onSetTab(1)}>
                            Stake
                        </TabItem>
                    </Tabs>
                    <TabContent active={tab === 0}>
                        {tab === 0 &&
                            (listHistory.length > 0 ? (
                                <div className="grid mb:grid-cols-2 gap-3">
                                    {listHistory.map((item, index) => {
                                        const sumUSDT = Object.values(item.interestUSD).reduce((a, b) => a + b, 0);
                                        return (
                                            <CardNao key={index} className="rounded-xl border border-divider dark:border-none">
                                                <div className="text-txtSecondary dark:text-txtSecondary-dark text-sm">
                                                    {t('nao:pool:week', { value: listHistory.length - index })} {formatTime(item.fromTime, 'dd/MM/yyyy')} -{' '}
                                                    {formatTime(item.toTime, 'dd/MM/yyyy')}
                                                </div>
                                                <div className="text-txtSecondary dark:text-txtSecondary-dark text-sm pt-1 mb-6">
                                                    {t('nao:pool:equivalent')} ${formatNumber(sumUSDT, 4)}
                                                </div>
                                                <div className="mt-1 flex flex-col space-y-4">
                                                    <div className="w-full py-0.5">
                                                        <HistoryInterest item={item} assetId={447} logoPath="/images/nao/ic_nao.png" />
                                                    </div>
                                                    <div className="w-full py-0.5">
                                                        <HistoryInterest item={item} assetId={72} logoPath="/images/nao/ic_vndc.png" />
                                                    </div>
                                                    <div className="w-full py-0.5">
                                                        <HistoryInterest item={item} assetId={1} logoPath={`/images/coins/64/${1}.png`} />
                                                    </div>
                                                    {item.interest?.[86] && item.interest?.[86] > 0 ? (
                                                        <div className="w-full py-0.5">
                                                            <HistoryInterest item={item} assetId={86} logoPath={'/images/nao/ic_onus.png'} />
                                                        </div>
                                                    ) : null}
                                                    <div className="w-full py-0.5">
                                                        <HistoryInterest item={item} assetId={22} logoPath={`/images/coins/64/${22}.png`} />
                                                    </div>
                                                </div>
                                            </CardNao>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="mt-6 flex flex-col justify-center items-center">
                                    <div className={`flex items-center justify-center flex-col m-auto h-full min-h-[300px]`}>
                                        {isDark ? <NoDataDarkIcon /> : <NoDataLightIcon />}
                                        <div className="text-xs text-txtSecondary dark:text-txtSecondary-dark mt-1">{t('nao:pool:history_nodata')}</div>
                                    </div>
                                </div>
                            ))}
                    </TabContent>
                </div>
                <TabContent active={tab === 1}>{tab === 1 && <StakeOrders assetConfig={assetConfig} />}</TabContent>
            </div>
        </>
    ) : (
        <>
            <div className="relative flex flex-col justify-center items-center mt-14">
                <div className="block dark:hidden">
                    <NoDataLightIcon />
                </div>
                <div className="hidden dark:block">
                    <NoDataDarkIcon />
                </div>
                <div className="text-center mt-6">
                    <TextLiner className="!text-lg !w-full !pb-0 !normal-case">{t('nao:pool:you_not_staked')}</TextLiner>
                    <div className="text-sm text-txtSecondary dark:text-txtSecondary-dark mt-4">{t('nao:pool:share_revenue_nodata')}</div>
                </div>
            </div>
            <div className="w-full px-4 mt-12">
                <ButtonNao onClick={onShowLock} className="font-semibold py-3 w-full">
                    {t('nao:pool:stake_now')}
                </ButtonNao>
            </div>
        </>
    );
};

const Tabs = styled.div.attrs({
    className:
        'bg-bgPrimary dark:bg-bgPrimary-dark rounded my-6 flex items-center justify-between text-sm relative border border-divider dark:border-divider-dark after:bg-gray-12 dark:after:bg-dark-2'
})`
    &:after {
        content: '';
        position: absolute;
        height: 100%;
        transform: ${({ tab }) => `translate(${tab * 100}%,0)`};
        width: calc(100% / 2);
        transition: all 0.2s;
        border-radius: ${({ tab }) => (!tab ? `4px 0 0 4px` : '0 4px 4px 0')};
    }
`;

const TabItem = styled.div.attrs(({ active }) => ({
    className: classnames(
        'py-2 text-sm w-1/2 h-full flex items-center justify-center z-[2] capitalize ',
        { 'font-semibold text-txtPrimary dark:text-txtPrimary-dark': active },
        { 'text-txtSecondary dark:text-txtSecondary-dark': !active }
    )
}))``;

const TabContent = styled.div.attrs(({ active }) => ({
    className: classnames('min-h-[calc(100vh-234px)]', { hidden: !active })
}))``;

export default PerformanceTab;
