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

const getAssets = createSelector(
    [
        state => state.utils,
        (utils, params) => params
    ],
    (utils, params) => {
        const assets = {};
        const arr = [1, 72, 86, 447];
        arr.map(id => {
            const asset = utils.assetConfig.find(rs => rs.id === id);
            if (asset) {
                assets[id] = {
                    assetCode: asset?.assetCode,
                    assetDigit: asset?.assetDigit
                };
            }
        })
        return assets;
    }
);

const SubPrice = ({ price, digitsPrice = 3, isShowLabel = true }) =>  <span className="text-sm text-nao-grey leading-6"> {isShowLabel ?`Equivalent: `: null }${formatNumber(price, digitsPrice)}</span>

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

    const HistoryPriceItem = ({s3Url, total, digitsTotal, usdPrice, digitsUsdPrice=3, isUSDT =  false}) => (
        <div className='flex-col flex-1 text-left lg:text-right gap-2'>
            <div className="text-nao-white font-semibold flex items-center lg:justify-end lg:min-w-[150px] leading-6">
                <span className="mr-2">{formatNumber(total, digitsTotal)}</span>
                { !isUSDT ? <img src={getS3Url(s3Url)} width={20} height={20} alt="" /> :
                    <AssetLogo assetId={22}  size={20} />
                }
            </div>
            <SubPrice price={usdPrice} digitsPrice={digitsUsdPrice} isShowLabel={false}/>
        </div>
   )

    const CardHistoryPrice = ({children, index}) => {
        if (width<992){
            return  <CardNao noBg className={'p-[.8rem]'}>
                {children}
            </CardNao>
        } else {
            return <div key={index} className={'w-full'}>
                {children}
            </div>
        }
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
                                {index !== 0 && width < 992 && <Divider className="my-4 sm:my-[10px]" />}
                                <div className='flex items-center w-full justify-between flex-wrap gap-[0.75rem] sm:gap-2 '>
                                    <div className="flex flex-col w-full lg:w-auto">
                                        <span className="text-sm text-nao-grey leading-6">
                                            {t('nao:pool:week', { value: weekNumber })} {formatTime(item.fromTime, 'dd/MM/yyyy')} - {formatTime(item.toTime, 'dd/MM/yyyy')}
                                        </span>
                                        <SubPrice price={formatNumber(sumUSDT, 3)} digitsPrice={assetConfig[22]?.assetDigit ?? 3}/>
                                        {width < 992 && <Divider/>}
                                    </div>
                                    <div className="flex items-center lg:gap-0 sm:gap-6 w-full lg:w-max flex-wrap">
                                         <div className="flex items-center sm:flex-1 lg:mb-0 mb-[.5rem] justify-start  w-full lg:w-max flex-wrap">
                                             <HistoryPriceItem
                                                s3Url={'/images/nao/ic_nao.png'}
                                                total={item?.interest?.[447]}
                                                digitsTotal={assetConfig[447]?.assetDigit ?? 8}
                                                usdPrice={item?.interestUSD?.[447]}
                                             />
                                             <HistoryPriceItem
                                                s3Url={'/images/nao/ic_vndc.png'}
                                                total={item?.interest?.[72]}
                                                digitsTotal={assetConfig[72]?.assetDigit ?? 0}
                                                usdPrice={item?.interestUSD?.[72]}
                                             />
                                         </div>
                                         <div className="flex items-center sm:flex-1 lg:mb-0 mb-[.5rem] justify-between  w-full lg:w-max flex-wrap">
                                             <HistoryPriceItem
                                                 s3Url={`/images/coins/64/${1}.png`}
                                                 total={item?.interest?.[1]}
                                                 digitsTotal={assetConfig[1]?.assetDigit ?? 0}
                                                 usdPrice={item?.interestUSD?.[1]}
                                             />
                                             <HistoryPriceItem
                                                 s3Url={`/images/nao/ic_onus.png`}
                                                 total={item?.interest?.[86]}
                                                 digitsTotal={assetConfig[86]?.assetDigit ?? 0}
                                                 usdPrice={item?.interestUSD?.[86]}
                                             />
                                         </div>
                                        <div className="flex items-center justify-between  w-full lg:w-max flex-wrap">
                                            <HistoryPriceItem
                                                s3Url={`/images/nao/ic_onus.png`}
                                                total={item?.interest?.[22]}
                                                digitsTotal={assetConfig[22]?.assetDigit ?? 0}
                                                usdPrice={item?.interestUSD?.[22]}
                                                isUSDT
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

    const PoolPriceItem = ({s3Url, price, usdPrice, digitsPrice, digitsUsdPrice= 3, isUSDT = false}) => (
        <div className='flex-col flex-1 text-left lg:text-right'>
            <div className="text-nao-white sm:text-lg font-semibold flex items-center lg:justify-end leading-6 space-x-2 lg:min-w-[150px]">
                <span>{formatNumber(price, digitsPrice)}</span>
                { !isUSDT ? <img src={getS3Url(s3Url)} width={20} height={20} alt="" /> :
                    <AssetLogo assetId={22}  size={20} />
                }
            </div>
            <SubPrice price={usdPrice} digitsPrice={digitsUsdPrice} isShowLabel={false} />
        </div>
    )

    return (
        <section id="nao_pool" className="pt-10 sm:pt-20">
            <div className="flex items-center flex-wrap justify-between gap-4">
                <div>
                    <TextLiner  className="normal-case lg:text-white">{t('nao:pool:title')}</TextLiner>
                    <span className="text-nao-grey">{t('nao:pool:description')}</span>
                </div>
                <ButtonNao className="py-2 px-7 !rounded-md text-sm font-semibold leading-6" onClick={() => router.push('/nao/stake')}>Stake NAO</ButtonNao>
            </div>
            <div className="pt-6 flex items-center flex-wrap gap-[21px]">
                <CardNao className="sm:!px-10 sm:!py-12 sm:!flex-row sm:items-center !min-h-[124px]">
                    <label className="text-nao-text font-medium sm:text-lg">{t('nao:pool:nao_staked')}</label>
                    <div className='sm:text-right flex flex-col gap-1 mt-4 sm:mt-0'>
                        <div className="text-[1.375rem] font-semibold flex items-center space-x-2">
                            <span className="leading-8">{formatNumber(data.totalStaked, assetNao?.assetDigit ?? 8)}</span>
                            <img src={getS3Url('/images/nao/ic_nao.png')} width={20} height={20} alt="" />
                        </div>
                        <span className="text-sm text-nao-grey leading-6">${formatNumber(data.totalStakedVNDC * (referencePrice['VNDC'] ?? 1), 3)}</span>
                    </div>
                </CardNao>
                <CardNao className="sm:!px-10 sm:!py-12 sm:!flex-row sm:items-center !min-h-[124px]">
                    <label className="text-nao-text font-medium sm:text-lg">{t('nao:pool:participants')}</label>
                    <div className='sm:text-right flex flex-col gap-1 mt-4 sm:mt-0'>
                        <div className="text-[1.375rem] font-semibold leading-8">
                            {data.totalUsers}
                        </div>
                        <div className="text-sm text-nao-grey" dangerouslySetInnerHTML={{ __html: t('nao:pool:participants_today', { value: dataSource?.totalUserToday ?? 0 }) }}></div>
                    </div>
                </CardNao>

            </div>
            <CardNao className="sm:!p-10 sm:min-h-[344px] !justify-start mt-5">
                <Tooltip id="tooltip-revenue-history" />
                <div className="flex items-center justify-between flex-wrap gap-[0.75rem]">
                    <div className="flex-col flex">
                        <div className='space-x-3 flex items-center '>
                            <span className="text-nao-blue font-medium sm:text-lg">{t('nao:pool:estimated_revenue_share', { value: '(20%)' })}</span>
                            <div data-tip={t('nao:pool:tooltip_revenue_history')} data-for="tooltip-revenue-history" >
                                <img className="min-w-[20px]" src={getS3Url('/images/nao/ic_help_blue.png')} height={20} width={20} />
                            </div>
                        </div>
                        <SubPrice price={Object.values(data?.estimateUsd||{}).reduce((a,b)=>a+b, 0)} digitsPrice={assetConfig[22]?.assetDigit ?? 3}/>
                    </div>
                    <div className="flex items-center lg:gap-0 sm:gap-6 w-full lg:w-max flex-wrap">
                        {/*  */}
                        <div className="flex items-center sm:flex-1 lg:mb-0 mb-[.5rem] justify-start w-full lg:w-max flex-wrap">
                            <PoolPriceItem
                                digitsPrice={assetConfig[447]?.assetDigit ?? 2}
                                s3Url={'/images/nao/ic_nao.png'}
                                price={data.estimate?.[447]}
                                usdPrice={data.estimateUsd?.[447]}
                            />
                            <PoolPriceItem
                                digitsPrice={assetConfig[72]?.assetDigit ?? 0}
                                s3Url={'/images/nao/ic_vndc.png'}
                                price={data.estimate?.[72]}
                                usdPrice={data.estimateUsd?.[72]}
                            />
                        </div>
                        {/*  */}
                        <div className="flex items-center sm:flex-1 lg:mb-0 mb-[.5rem] justify-start w-full lg:w-max flex-wrap">
                            <PoolPriceItem
                                digitsPrice={assetConfig[1]?.assetDigit ?? 0}
                                s3Url={`/images/coins/64/${1}.png`}
                                price={data.estimate?.[1]}
                                usdPrice={data.estimateUsd?.[1]}
                            />
                            <PoolPriceItem
                                digitsPrice={assetConfig[86]?.assetDigit ?? 0}
                                s3Url={'/images/nao/ic_onus.png'}
                                price={data.estimate?.[86]}
                                usdPrice={data.estimateUsd?.[86]}
                            />
                        </div>
                        {/*  */}
                        <div className="flex items-center justify-between gap-2 w-full lg:w-max flex-wrap">
                            <PoolPriceItem
                                digitsPrice={assetConfig[22]?.assetDigit ?? 0}
                                s3Url={'/images/nao/ic_onus.png'}
                                price={data.estimate?.[22]}
                                usdPrice={data.estimateUsd?.[22]}
                                isUSDT
                            />
                        </div>
                    </div>
                </div>
                <div className="h-[1px] bg-nao-line my-6 sm:my-8"></div>
                <div className="flex items-center justify-between">
                    <label className="text-nao-text font-medium sm:text-lg">{t('nao:pool:revenue_history')}</label>
                    {listHitory.length > 0 &&
                        <div className="flex space-x-2 opacity-50">
                            <img onClick={() => onNavigate(false)} className="cursor-pointer" src={getS3Url('/images/nao/ic_chevron.png')} width={24} height={24} alt="" />
                            <img onClick={() => onNavigate(true)} className="rotate-180 cursor-pointer" src={getS3Url('/images/nao/ic_chevron.png')} width={24} height={24} alt="" />
                        </div>
                    }
                </div>
                <div className="pt-4 sm:pt-5">
                    {listHitory.length > 0 ?
                        <Swiper
                            ref={sliderRef}
                            loop={false}
                            lazy grabCursor
                            className={`mySwiper`}
                            slidesPerView={1}
                            spaceBetween={10}
                        >
                            {renderSlide()}

                        </Swiper>
                        :
                        <div className={`flex items-center justify-center flex-col m-auto`}>
                            <img src={getS3Url(`/images/icon/icon-search-folder_dark.png`)} width={100} height={100} />
                            <div className="text-xs text-nao-grey mt-1">{t('nao:pool:history_nodata')}</div>
                        </div>
                    }
                </div>
            </CardNao>
        </section>
    );
};

export default NaoPool;
