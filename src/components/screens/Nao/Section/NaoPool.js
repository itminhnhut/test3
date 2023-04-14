import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
    TextLiner,
    CardNao,
    Divider,
    ButtonNao,
    Tooltip,
    SectionNao,
    Horizontal
} from 'components/screens/Nao/NaoStyle';
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import { useWindowSize } from 'utils/customHooks';
import styled from 'styled-components';
import { getS3Url, formatNumber, formatTime } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import fetchApi from 'utils/fetch-api';
import { API_POOL_INFO, API_GET_REFERENCE_CURRENCY, API_POOL_SHARE_HISTORIES } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import TableNoData from 'components/common/table.old/TableNoData';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import AssetLogo from 'components/wallet/AssetLogo';
import QuestionMarkIcon from 'components/svg/QuestionMarkIcon';
import colors from 'styles/colors';
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
        })
        return assets;
    }
);

const SubPrice = ({ price, digitsPrice = 3, isShowLabel = true }) =>  <span className="text-sm text-txtSecondary dark:text-txtSecondary-dark leading-6"> {isShowLabel ?``: null }${formatNumber(price, digitsPrice)}</span>

const NaoPool = ({ dataSource, assetNao }) => {
    const { t } = useTranslation();
    const sliderRef = useRef(null);
    const { width } = useWindowSize();
    const [referencePrice, setReferencePrice] = useState({})
    const [listHitory, setListHitory] = useState([]);
    const router = useRouter();
    const assetConfig = useSelector(state => getAssets(state));

    const onNavigate = (isNext) => {
        if (sliderRef.current) {
            sliderRef.current.swiper[isNext ? 'slideNext' : 'slidePrev']();
        }
    }

    const HistoryPriceItem = ({ s3Url, total, digitsTotal, usdPrice, digitsUsdPrice = 3, isUSDT = false, assetName, assetSymbol }) => (
        <div className="flex items-center w-full">
            {!isUSDT ? <img src={getS3Url(s3Url)} width={20} height={20} alt="" /> : <AssetLogo assetId={22} size={20} />}
            <div className="ml-2 flex-1">
                <div className="flex justify-between text-sm font-semibold">
                    <div className="">{assetSymbol}</div>
                    <div className="">{formatNumber(total, digitsTotal)}</div>
                </div>
                <div className="flex justify-between text-xs text-txtSecondary dark:text-txtSecondary-dark">
                    <div className="">{assetName}</div>
                    <SubPrice price={usdPrice} digitsPrice={digitsUsdPrice} isShowLabel={false} />
                </div>
            </div>
        </div>
    );

    const CardHistoryPrice = ({children, index}) => {
        return (
            <div key={index} className={'w-full'}>
                {children}
            </div>
        );
    }

    const renderSlide = () => {
        const size = 1;
        const page = Array.isArray(listHitory) && Math.ceil(listHitory.length / size)
        const result = [];
        const weekNumber = listHitory.length + 1;
        for (let i = 0; i < page; i++) {
            const dataFilter = listHitory.slice(i * size, (i + 1) * size);
            result.push(<SwiperSlide key={i}>
                <div className="flex  w-full">
                    {dataFilter.map((item, index) => {
                        const sumUSDT = Object.values(item.interestUSD).reduce((a, b) => a + b, 0);
                        weekNumber--;
                        return (
                            <CardHistoryPrice index={index}>
                                <div className='w-full'>
                                    <div className="flex flex-col w-full lg:w-auto">
                                        <span className="text-sm text-txtSecondary dark:text-txtSecondary-dark leading-6">
                                            {t('nao:pool:week', { value: weekNumber })} {formatTime(item.fromTime, 'dd/MM/yyyy')} - {formatTime(item.toTime, 'dd/MM/yyyy')}
                                        </span>
                                        <span className="text-sm text-txtSecondary dark:text-txtSecondary-dark leading-6">
                                            {t('nao:pool:equivalent')}: <SubPrice price={sumUSDT} digitsPrice={assetConfig[22]?.assetDigit ?? 3}/>
                                        </span>

                                    </div>
                                    <div className="mt-1">
                                        <div className="w-full my-2">
                                            <HistoryPriceItem
                                                s3Url={'/images/nao/ic_nao.png'}
                                                total={item?.interest?.[447]}
                                                digitsTotal={assetConfig[447]?.assetDigit ?? 8}
                                                usdPrice={item?.interestUSD?.[447]}
                                                assetName={assetConfig[447]?.assetName}
                                                assetSymbol={assetConfig[447]?.assetCode}
                                            />
                                        </div>
                                        <div className="w-full my-2">
                                            <HistoryPriceItem
                                                s3Url={'/images/nao/ic_vndc.png'}
                                                total={item?.interest?.[72]}
                                                digitsTotal={assetConfig[72]?.assetDigit ?? 0}
                                                usdPrice={item?.interestUSD?.[72]}
                                                assetName={assetConfig[72]?.assetName}
                                                assetSymbol={assetConfig[72]?.assetCode}
                                            />
                                        </div>
                                        <div className="w-full my-2">
                                            <HistoryPriceItem
                                                s3Url={`/images/coins/64/${1}.png`}
                                                total={item?.interest?.[1]}
                                                digitsTotal={assetConfig[1]?.assetDigit ?? 0}
                                                usdPrice={item?.interestUSD?.[1]}
                                                assetName={assetConfig[1]?.assetName}
                                                assetSymbol={assetConfig[1]?.assetCode}
                                            />
                                        </div>
                                        <div className="w-full my-2">
                                            <HistoryPriceItem
                                                s3Url={`/images/nao/ic_onus.png`}
                                                total={item?.interest?.[86]}
                                                digitsTotal={assetConfig[86]?.assetDigit ?? 0}
                                                usdPrice={item?.interestUSD?.[86]}
                                                assetName={assetConfig[86]?.assetName}
                                                assetSymbol={assetConfig[86]?.assetCode}
                                            />
                                        </div>
                                        <div className="w-full my-2">
                                            <HistoryPriceItem
                                                s3Url={`/images/nao/ic_onus.png`}
                                                total={item?.interest?.[22]}
                                                digitsTotal={assetConfig[22]?.assetDigit ?? 0}
                                                usdPrice={item?.interestUSD?.[22]}
                                                isUSDT
                                                assetName={assetConfig[22]?.assetName}
                                                assetSymbol={assetConfig[22]?.assetCode}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardHistoryPrice>
                        )
                    })}
                </div>
            </SwiperSlide>
            )
        }
        return result;
    }

    useEffect(() => {
        getRef();
        getListHistory();
    }, [])

    const getRef = async (day) => {
        try {
            const { data } = await fetchApi({
                url: API_GET_REFERENCE_CURRENCY,
                params: { base: 'VNDC,USDT', quote: 'USD' },
            });
            if (data) {
                setReferencePrice(data.reduce((acm, current) => {
                    return {
                        ...acm,
                        [current.base]: current.price,
                    }
                }, {}))
            }
        } catch (e) {
            console.log(e)
        } finally {

        }
    }

    const getListHistory = async () => {
        try {
            const { data, status } = await fetchApi({
                url: API_POOL_SHARE_HISTORIES,
            });
            if (status === ApiStatus.SUCCESS && Array.isArray(data) && data) {
                setListHitory(data);
            }
        } catch (e) {
            console.log(e)
        } finally {

        }
    }

    const data = useMemo(() => {
        const availableStakedVNDC = dataSource?.availableStakedVNDC ?? 0;
        const totalStakedVNDC = dataSource?.totalStakedVNDC ?? 0;
        const availableStaked = dataSource?.availableStaked ?? 0;
        const totalStaked = dataSource?.totalStaked ?? 0;
        const pool = availableStaked / totalStaked;
        const percent = (availableStaked / totalStaked) * 100;
        return {
            availableStakedVNDC: availableStakedVNDC,
            availableStaked: availableStaked,
            totalStaked: totalStaked,
            totalStakedVNDC: totalStakedVNDC,
            totalUsers: formatNumber(dataSource?.totalUser, 0),
            estimate: dataSource?.poolRevenueThisWeek,
            estimateUsd: dataSource?.poolRevenueThisWeekUSD,
        }
    }, [dataSource, assetNao])

    const PoolPriceItem = ({s3Url, price, usdPrice, digitsPrice, digitsUsdPrice= 3, isUSDT = false, assetName, assetSymbol}) => (
        <div className="flex items-center w-full">
            {!isUSDT ? <img src={getS3Url(s3Url)} width={20} height={20} alt="" /> : <AssetLogo assetId={22} size={20} />}
            <div className="ml-2 flex-1">
                <div className="flex justify-between text-sm font-semibold">
                    <div className="">{assetSymbol}</div>
                    <div className="">{formatNumber(price, digitsPrice)}</div>
                </div>
                <div className="flex justify-between text-xs text-txtSecondary dark:text-txtSecondary-dark">
                    <div className="">{assetName}</div>
                    <SubPrice price={usdPrice} digitsPrice={digitsUsdPrice} isShowLabel={false} />
                </div>
            </div>
        </div>
    )

    return (
        <section id="nao_pool" className="pt-10 sm:pt-20">
            <div className="flex items-center flex-wrap justify-between gap-4">
                <div>
                    <TextLiner className="normal-case !text-txtPrimary dark:!text-txtPrimary-dark">{t('nao:pool:title')}</TextLiner>
                    <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:pool:description')}</span>
                </div>
                <ButtonNao className="py-2 px-7 !rounded-md text-sm font-semibold leading-6" onClick={() => router.push('/nao/stake')}>
                    Stake NAO
                </ButtonNao>
            </div>
            <div className="mt-6 grid sm:grid-cols-2 gap-6">
                <CardNao className="sm:!min-w-[50%] sm:!px-10 sm:!py-12 sm:!flex-row sm:items-center !min-h-[124px] flex">
                    <label className="text-txtPrimary dark:text-txtPrimary-dark font-medium sm:text-lg">{t('nao:pool:nao_staked')}</label>
                    <div className="sm:text-right flex flex-col gap-1 mt-4 sm:mt-0">
                        <div className="text-[1.375rem] font-semibold flex items-center space-x-2">
                            <span className="leading-8">{formatNumber(data.totalStaked, assetNao?.assetDigit ?? 8)}</span>
                            <img src={getS3Url('/images/nao/ic_nao.png')} width={20} height={20} alt="" />
                        </div>
                        <span className="text-sm text-txtSecondary dark:text-txtSecondary-dark leading-6">
                            ${formatNumber(data.totalStakedVNDC * (referencePrice['VNDC'] ?? 1), 3)}
                        </span>
                    </div>
                </CardNao>
                <CardNao className="sm:!min-w-[50%] sm:!px-10 sm:!py-12 sm:!flex-row sm:items-center !min-h-[124px]">
                    <label className="text-txtPrimary dark:text-txtPrimary-dark font-medium sm:text-lg">{t('nao:pool:participants')}</label>
                    <div className="sm:text-right flex flex-col gap-1 mt-4 sm:mt-0">
                        <div className="text-[1.375rem] font-semibold leading-8">{data.totalUsers}</div>
                        <div
                            className="text-sm text-txtSecondary dark:text-txtSecondary-dark"
                            dangerouslySetInnerHTML={{ __html: t('nao:pool:participants_today', { value: dataSource?.totalUserToday ?? 0 }) }}
                        ></div>
                    </div>
                </CardNao>
                <CardNao className="sm:!min-w-[50%] sm:!p-10 sm:min-h-[344px] !justify-start">
                    <Tooltip id="tooltip-revenue-history" />
                    <div className="flex-col flex">
                        <div className="space-x-3 flex items-center ">
                            <span className="font-medium sm:text-lg">{t('nao:pool:estimated_revenue_share', { value: '(20%)' })}</span>
                            <div data-tip={t('nao:pool:tooltip_revenue_history')} data-for="tooltip-revenue-history">
                                <QuestionMarkIcon isFilled size={20} color={'currentColor'} />
                            </div>
                        </div>
                        <SubPrice price={Object.values(data?.estimateUsd || {}).reduce((a, b) => a + b, 0)} digitsPrice={assetConfig[22]?.assetDigit ?? 3} />
                    </div>
                    <div className="flex items-center w-full flex-wrap">
                        <div className="w-full my-2">
                            <PoolPriceItem
                                digitsPrice={assetConfig[447]?.assetDigit ?? 2}
                                s3Url={'/images/nao/ic_nao.png'}
                                price={data.estimate?.[447]}
                                usdPrice={data.estimateUsd?.[447]}
                                assetName={assetConfig[447]?.assetName}
                                assetSymbol={assetConfig[447]?.assetCode}
                            />
                        </div>
                        <div className="w-full my-2">
                            <PoolPriceItem
                                digitsPrice={assetConfig[72]?.assetDigit ?? 0}
                                s3Url={'/images/nao/ic_vndc.png'}
                                price={data.estimate?.[72]}
                                usdPrice={data.estimateUsd?.[72]}
                                assetName={assetConfig[72]?.assetName}
                                assetSymbol={assetConfig[72]?.assetCode}
                            />
                        </div>
                        <div className="w-full my-2">
                            <PoolPriceItem
                                digitsPrice={assetConfig[1]?.assetDigit ?? 0}
                                s3Url={`/images/coins/64/${1}.png`}
                                price={data.estimate?.[1]}
                                usdPrice={data.estimateUsd?.[1]}
                                assetName={assetConfig[1]?.assetName}
                                assetSymbol={assetConfig[1]?.assetCode}
                            />
                        </div>
                        <div className="w-full my-2">
                            <PoolPriceItem
                                digitsPrice={assetConfig[86]?.assetDigit ?? 0}
                                s3Url={'/images/nao/ic_onus.png'}
                                price={data.estimate?.[86]}
                                usdPrice={data.estimateUsd?.[86]}
                                assetName={assetConfig[86]?.assetName}
                                assetSymbol={assetConfig[86]?.assetCode}
                            />
                        </div>
                        <div className="w-full my-2">
                            <PoolPriceItem
                                digitsPrice={assetConfig[22]?.assetDigit ?? 0}
                                s3Url={'/images/nao/ic_onus.png'}
                                price={data.estimate?.[22]}
                                usdPrice={data.estimateUsd?.[22]}
                                isUSDT
                                assetName={assetConfig[22]?.assetName}
                                assetSymbol={assetConfig[22]?.assetCode}
                            />
                        </div>
                    </div>
                </CardNao>
                <CardNao className="sm:!min-w-[50%] sm:!p-10 sm:min-h-[344px] !justify-start">
                    <div className="flex items-center justify-between">
                        <label className="text-txtPrimary dark:text-txtPrimary-dark font-medium sm:text-lg">{t('nao:pool:revenue_history')}</label>
                        {listHitory.length > 0 && (
                            <div className="flex space-x-2 opacity-50">
                                <img
                                    onClick={() => onNavigate(false)}
                                    className="cursor-pointer"
                                    src={getS3Url('/images/nao/ic_chevron.png')}
                                    width={24}
                                    height={24}
                                    alt=""
                                />
                                <img
                                    onClick={() => onNavigate(true)}
                                    className="rotate-180 cursor-pointer"
                                    src={getS3Url('/images/nao/ic_chevron.png')}
                                    width={24}
                                    height={24}
                                    alt=""
                                />
                            </div>
                        )}
                    </div>
                    <div className="pt-4 sm:pt-5">
                        {listHitory.length > 0 ? (
                            <Swiper ref={sliderRef} loop={false} lazy grabCursor className={`mySwiper`} slidesPerView={1} spaceBetween={10}>
                                {renderSlide()}
                            </Swiper>
                        ) : (
                            <div className={`flex items-center justify-center flex-col m-auto`}>
                                <div className="hidden dark:block">
                                    <NoDataDarkIcon />
                                </div>
                                <div className="block dark:hidden">
                                    <NoDataLightIcon />
                                </div>
                                <div className="text-xs text-txtSecondary dark:text-txtSecondary-dark mt-1">{t('nao:pool:history_nodata')}</div>
                            </div>
                        )}
                    </div>
                </CardNao>
            </div>
        </section>
    );
};

export default NaoPool;
