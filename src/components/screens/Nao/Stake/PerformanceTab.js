import React, { useState, useMemo, useEffect, Fragment } from 'react';
import { CardNao, TextLiner, ButtonNao, Divider, Progressbar, Tooltip } from 'components/screens/Nao/NaoStyle';
import { formatNumber, getS3Url, formatTime } from 'redux/actions/utils';
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

const getAssets = createSelector(
    [
        state => state.utils,
        (utils, params) => params
    ],
    (utils, params) => {
        const assets = {};
        const arr = [1, 72, 86, 447, 22];
        arr.map(id => {
            const asset = utils.assetConfig.find(rs => rs.id === id);
            if (asset) {
                assets[id] = {
                    assetCode: asset?.assetCode,
                    assetDigit: asset?.assetDigit,
                    assetName: asset?.assetName,
                };
            }
        });
        return assets;
    }
);

const PerformanceTab = ({
    isSmall,
    dataSource,
    assetNao,
    onShowLock
}) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const [listHitory, setListHitory] = useState([]);
    const assetConfig = useSelector(state => getAssets(state));
    const router = useRouter();
    const [tab, setTab] = useState(0);
    const [filter, setFilter] = useState({
        day: 'd',
        marginCurrency: WalletCurrency.VNDC
    });
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

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
            const {
                data,
                status
            } = await fetchApi({
                url: API_POOL_USER_SHARE_HISTORIES,
            });
            if (status === ApiStatus.SUCCESS && Array.isArray(data) && data) {
                setListHitory(data);
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
                date: dateValue,
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
        return {
            percent: percent || 0,
            estimate: dataSource?.poolRevenueThisWeek,
            estimateUSD: dataSource?.poolRevenueThisWeekUSD,
            totalStaked,
            availableStaked,
            totalProfit: dataSource?.totalProfit
        };
    }, [dataSource]);

    const EstimateInterest = ({
        assetId,
        logoPath
    }) => {
        return (
            <div className="flex items-center w-full">
                <img src={getS3Url(logoPath)} width={24} height={24} alt="" />
                <div className="ml-2 flex-1">
                    <div className="flex justify-between text-sm font-semibold">
                        <div className="">{assetConfig[assetId]?.assetCode}</div>
                        <div className="">
                            {formatNumber((data.estimate?.[assetId] || 0) * (data.percent / 100 || 0), assetConfig[assetId]?.assetDigit ?? 8)}
                        </div>
                    </div>
                    <div className="flex justify-between text-xs text-txtSecondary dark:text-txtSecondary-dark">
                        <div className="">{assetConfig[assetId]?.assetName}</div>
                        <div className="">${formatNumber((data.estimateUSD?.[assetId] || 0) * (data.percent / 100 || 0), 0)}</div>
                    </div>
                </div>
            </div>
        );
    };

    const HistoryInterest = ({
        assetId,
        item,
        logoPath
    }) => {
        return (
            <div>
                <div className="flex items-center w-full">
                    <img src={getS3Url(logoPath)} width={20} height={20} alt="" />
                    <div className="ml-2 flex-1">
                        <div className="flex justify-between text-sm font-semibold">
                            <div className="">{assetConfig[assetId]?.assetCode}</div>
                            <div className="">{formatNumber(item.interest?.[assetId] || 0, assetConfig[assetId]?.assetDigit ?? 8)}</div>
                        </div>
                        <div className="flex justify-between text-xs text-txtSecondary dark:text-txtSecondary-dark">
                            <div className="">{assetConfig[assetId]?.assetName}</div>
                            <div className=""> ${formatNumber(item.interestUSD?.[assetId] || 0, 0)}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    return (
        !dataSource?.isNewUser ?
            <>
                <div>
                    <TextLiner className="pb-1 text-txtPrimary dark:text-txtPrimary-dark">{t('nao:pool:per_overview')}</TextLiner>
                    <div className="text-txtSecondary dark:text-txtSecondary-dark text-sm">{t('nao:pool:per_description')}</div>
                    <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-between lg:justify-end mt-6 mb-8">
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
                    </div>
                    <CardNao className="mt-6 rounded-xl border border-divider dark:border-divider-dark">
                        <label className="text-txtPrimary dark:text-txtPrimary-dark font-medium leading-6 ">{t('nao:pool:total_staked')}</label>
                        <div className="mt-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center mr-8">
                                    <span
                                        className="font-semibold mr-1 leading-7">{formatNumber(data.availableStaked, assetNao?.assetDigit ?? 8)}</span>
                                    <img src={getS3Url('/images/nao/ic_nao.png')} width={16} height={16} alt=""/>
                                </div>
                                <div
                                    className="text-txtSecondary dark:text-txtSecondary-dark text-sm">{formatNumber(data.totalStaked, assetNao?.assetDigit ?? 8)}</div>
                            </div>
                            <div className="my-2">
                                <div className="w-full bg-gray-11 dark:bg-dark-1 rounded-xl">
                                    <Progressbar percent={Math.ceil(data.percent)}/>
                                </div>
                            </div>
                            <div
                                className="text-xs font-medium leading-6">{formatNumber(data.percent || 10, assetNao?.assetDigit ?? 8)}%
                            </div>
                        </div>
                    </CardNao>
                    <CardNao className="mt-6 rounded-xl border border-divider dark:border-divider-dark">
                        <label className="text-txtPrimary dark:text-txtPrimary-dark font-medium leading-6 ">{t('nao:pool:total_revenue')}</label>
                        <div className="flex items-center mt-4">
                            <div
                                className="text-[22px] font-semibold leading-8 mr-2">≈ {formatNumber(data.totalProfit, 0)} VNDC
                            </div>
                        </div>
                        <div className="text-xs mr-2">{t('nao:pool:equivalent')} ${formatNumber(data.totalProfit, 2)} </div>

                        <hr className='border-divider dark:border-divider-dark my-4' />

                        <Tooltip id="tooltip-est-this-week"/>
                        <div className="space-x-2 flex items-center">
                            <label
                                className="text-txtPrimary dark:text-txtPrimary-dark font-medium leading-6 ">{t('nao:pool:per_est_revenue')}</label>
                            <div data-tip={t('nao:pool:tooltip_est_this_week')} data-for="tooltip-est-this-week">
                                <QuestionMarkIcon size={20} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="w-full my-2">
                                <EstimateInterest assetId={447} logoPath="/images/nao/ic_nao.png"/>
                            </div>
                            <div className="w-full my-2">
                                <EstimateInterest assetId={72} logoPath="/images/nao/ic_vndc.png" />
                            </div>
                            <div className="w-full my-2">
                                <EstimateInterest assetId={1} logoPath={`/images/coins/64/${1}.png`}/>
                            </div>
                            <div className="w-full my-2">
                                <EstimateInterest assetId={86} logoPath={'/images/nao/ic_onus.png'}/>
                            </div>
                            <div className="w-full my-2">
                                <EstimateInterest assetId={22} logoPath={`/images/coins/64/${22}.png`}/>
                            </div>
                        </div>
                    </CardNao>
                </div>
                <div className="mt-10">
                    <TextLiner className="pb-1">{t('common:transaction_history')}</TextLiner>
                    <div className="text-txtSecondary dark:text-txtSecondary-dark text-sm">{t('nao:pool:history_description')}</div>
                    <Tabs tab={tab}>
                        <TabItem active={tab === 0} onClick={() => onSetTab(0)}>{t('nao:pool:profit')}</TabItem>
                        <TabItem active={tab === 1} onClick={() => onSetTab(1)}>Stake</TabItem>
                    </Tabs>
                    <TabContent active={tab === 0}>
                        {tab === 0 && (<>
                            {listHitory.length > 0 ?
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {listHitory.map((item, index) => {
                                        return (
                                            <CardNao key={index} className="rounded-xl border border-divider dark:border-divider-dark">
                                                <div className="text-txtSecondary dark:text-txtSecondary-dark text-sm">
                                                    {t('nao:pool:week', { value: listHitory.length - index })} {formatTime(item.fromTime, 'dd/MM/yyyy')} -{' '}
                                                    {formatTime(item.toTime, 'dd/MM/yyyy')}
                                                </div>
                                                <div className="mt-1">
                                                    <div className="w-full my-2">
                                                        <HistoryInterest item={item} assetId={447} logoPath="/images/nao/ic_nao.png" />
                                                    </div>
                                                    <div className="w-full my-2">
                                                        <HistoryInterest item={item} assetId={72} logoPath="/images/nao/ic_vndc.png" />
                                                    </div>
                                                    <div className="w-full my-2">
                                                        <HistoryInterest item={item} assetId={1} logoPath={`/images/coins/64/${1}.png`} />
                                                    </div>
                                                    <div className="w-full my-2">
                                                        <HistoryInterest item={item} assetId={86} logoPath={'/images/nao/ic_onus.png'} />
                                                    </div>
                                                    <div className="w-full my-2">
                                                        <HistoryInterest item={item} assetId={22} logoPath={`/images/coins/64/${22}.png`} />
                                                    </div>
                                                </div>
                                            </CardNao>
                                        );
                                    })}
                                </div>
                                :
                                <div className="mt-6 flex flex-col justify-center items-center">
                                    <div
                                        className={`flex items-center justify-center flex-col m-auto h-full min-h-[300px]`}>
                                        {isDark ? <NoDataDarkIcon /> : <NoDataLightIcon /> }
                                        <div className="text-xs text-txtSecondary dark:text-txtSecondary-dark mt-1">{t('nao:pool:history_nodata')}</div>
                                    </div>
                                </div>
                            }
                        </>)}

                    </TabContent>
                    <TabContent active={tab === 1}>
                        {tab === 1 && <StakeOrders assetConfig={assetConfig}/>}
                    </TabContent>
                </div>
            </>
            : <>
                <div className="relative flex flex-col justify-center items-center mt-20">
                    {isDark ? <NoDataDarkIcon /> : <NoDataLightIcon /> }
                    <div className="text-center mt-6">
                        <TextLiner
                            className="!text-lg !w-full !pb-0 !normal-case">{t('nao:pool:you_not_staked')}</TextLiner>
                        <div className="text-sm text-txtSecondary dark:text-txtSecondary-dark mt-4">{t('nao:pool:share_revenue_nodata')}</div>
                    </div>
                </div>
                <div className="w-full px-4 mt-12">
                    <ButtonNao onClick={onShowLock} className="font-semibold py-3 w-full">{t('nao:pool:stake_now')}</ButtonNao>
                </div>
            </>
    );
};

const Tabs = styled.div.attrs({
    className: 'bg-bgPrimary dark:bg-bgPrimary-dark rounded-xl mt-5 mb-7 flex items-center justify-between text-sm h-[42px] relative border border-divider dark:border-divider-dark after:bg-gray-12 dark:after:bg-dark-2'
})`
    &:after {
        content: "";
        position: absolute;
        height: 100%;
        transform: ${({ tab }) => `translate(${tab * 100}%,0)`};
        width: calc(100% / 2);
        transition: all 0.2s;
        border-radius: 12px;
    }

`;

const TabItem = styled.div.attrs(({ active }) => ({
    className: classnames(
        'py-2 leading-6 w-1/2 h-full flex items-center justify-center z-[2] capitalize ',
        { 'font-semibold text-txtPrimary dark:text-txtPrimary-dark': active },
        { 'text-txtSecondary dark:text-txtSecondary-dark font-medium': !active }
    )
}))`

`;

const TabContent = styled.div.attrs(({ active }) => ({
    className: classnames(
        'min-h-[calc(100vh-234px)]',
        { 'hidden': !active }
    )
}))`
`;

export default PerformanceTab;
