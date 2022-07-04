import React, { useRef, useState, useEffect, useMemo } from 'react';
import { TextLiner, CardNao, Divider } from 'components/screens/Nao/NaoStyle';
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import { useWindowSize } from 'utils/customHooks';
import styled from 'styled-components';
import { getS3Url, formatNumber, formatTime } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import fetchApi from 'utils/fetch-api';
import { API_POOL_INFO, API_GET_REFERENCE_CURRENCY } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import TableNoData from 'components/common/table.old/TableNoData';
import Image from 'next/image'

const getAssetNao = createSelector(
    [
        state => state.utils.assetConfig,
        (utils, params) => params
    ],
    (assets, params) => {
        return assets.find(rs => rs.assetCode === params);
    }
);

const NaoPool = () => {
    const { t } = useTranslation();
    const sliderRef = useRef(null);
    const { width } = useWindowSize();
    const arr = [1, 2, 3, 4, 5, 6, 6, 6, 6]
    const assetNao = useSelector(state => getAssetNao(state, 'NAO'));
    const [dataSource, setDataSource] = useState([])
    const [referencePrice, setReferencePrice] = useState({})
    const [listHitory, setListHitory] = useState([]);

    const onNavigate = (isNext) => {
        if (sliderRef.current) {
            sliderRef.current.swiper[isNext ? 'slideNext' : 'slidePrev']();
        }
    }

    const renderSlide = () => {
        const size = 3;
        const page = Array.isArray(arr) && Math.ceil(arr.length / size)
        const result = [];
        for (let i = 0; i < page; i++) {
            const dataFilter = arr.slice(i * size, (i + 1) * size);
            result.push(<SwiperSlide key={i}>
                <div className="flex flex-col  w-full justify-between">
                    {dataFilter.map((item, index) => (
                        <>
                            {index !== 0 && <Divider />}
                            <div className='flex items-center justify-between'>
                                <span className="text-sm text-nao-grey">10/5/2022 - 17/5/2022</span>
                                <div className="text-nao-white text-lg font-semibold flex items-center">
                                    <span className="mr-2">100,034,238</span>
                                    <img src={getS3Url("/images/nao/ic_nao.png")} width={20} height={20} alt="" />
                                </div>
                            </div>
                        </>
                    ))}
                </div>
            </SwiperSlide>
            )
        }
        return result;
    }

    useEffect(() => {
        getStake();
        getRef();
    }, [])

    const getStake = async () => {
        try {
            const { data } = await fetchApi({
                url: API_POOL_INFO,
            });
            if (data) {
                setDataSource(data)
            }
        } catch (e) {
            console.log(e)
        } finally {
        }
    }

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

    const data = useMemo(() => {
        const availableStaked = dataSource?.availableStaked ?? 0;
        const totalStaked = dataSource?.totalStaked ?? 0;
        const pool = availableStaked / totalStaked;
        const percent = (availableStaked / totalStaked) * 100;
        return {
            totalStaked: totalStaked,
            totalUsers: formatNumber(dataSource?.totalUser, 0),
            estimate: formatNumber((dataSource?.estimateNextValue ?? 0) * pool, 0),
        }
    }, [dataSource])

    return (
        <section id="nao_pool" className="pt-10 sm:pt-20">
            <div className="flex items-center justify-between">
                <div>
                    <TextLiner className="normal-case">{t('nao:pool:title')}</TextLiner>
                    <span className="text-nao-grey">{t('nao:pool:description')}</span>
                </div>
            </div>
            <div className="pt-6 flex items-center flex-wrap gap-[21px]">
                {/* <CardNao className="!flex-row items-center !justify-start relative flex-wrap">
                    <div className="text-nao-grey sm:w-1/2">{t('nao:pool:description')}</div>
                    <div className="sm:absolute sm:right-0 lg:right-[76px] -bottom-7 sm:w-1/2 flex justify-end">
                        <img src={getS3Url("/images/nao/ic_nao_coming.png")} className="w-full h-full sm:w-[428px] sm:h-[292px]" alt="" />
                    </div>
                </CardNao> */}
                <CardNao className="!p-10 sm:flex-none">
                    <div>
                        <label className="text-nao-text font-medium text-lg capitalize">{t('nao:pool:nao_staked')}</label>
                        <div className="pt-4">
                            <div className="text-nao-blue text-lg font-semibold pb-1 flex items-center">
                                <span className="mr-2">{formatNumber(data.totalStaked, assetNao?.assetDigit ?? 8)}</span>
                                <img src="/images/nao/ic_nao.png" width={20} height={20} alt="" />
                            </div>
                            <span className="text-sm text-nao-grey">{formatNumber(data.totalStaked* (referencePrice['VNDC'] ?? 1), assetNao?.assetDigit ?? 8)} USDT</span>
                        </div>
                    </div>
                    <div className="h-[1px] bg-nao-line my-8"></div>
                    <div>
                        <label className="text-nao-text font-medium text-lg capitalize">{t('nao:pool:participants')}</label>
                        <div className="pt-4">
                            <div className="text-nao-blue text-lg font-semibold pb-1 flex items-center">
                                <span className="mr-2">{data.totalUsers}</span>
                            </div>
                            <span className="text-sm text-nao-grey">+{t('nao:pool:participants_today', { value: dataSource?.totalUserToday ?? 0 })}</span>
                        </div>
                    </div>
                </CardNao>
                <CardNao className="!p-10">
                    <div className="flex items-center justify-between">
                        <label className="text-nao-blue text-lg font-medium">{t('nao:pool:estimated_revenue_share', { value: '(20%)' })}</label>
                        <div className="text-nao-white text-xl font-semibold flex items-center leading-[18px]">
                            <span className="mr-2">{data.estimate}</span>
                            <img src="/images/nao/ic_nao.png" width={20} height={20} alt="" />
                        </div>
                    </div>
                    <div className="h-[1px] bg-nao-line my-8"></div>
                    <div className="flex items-center justify-between">
                        <label className="text-nao-text font-medium text-lg">{t('nao:pool:history_revenue')}</label>
                        {listHitory.length > 0 &&
                            <div className="flex space-x-2">
                                <img onClick={() => onNavigate(false)} className="cursor-pointer" src="/images/nao/ic_chevron.png" width={24} height={24} alt="" />
                                <img onClick={() => onNavigate(true)} className="rotate-180 cursor-pointer" src="/images/nao/ic_chevron.png" width={24} height={24} alt="" />
                            </div>
                        }
                    </div>
                    <div className="pt-5 flex items-center justify-between">
                        {listHitory.length > 0 ?
                            <Swiper
                                ref={sliderRef}
                                loop={true}
                                lazy grabCursor
                                className={`mySwiper`}
                                slidesPerView={1}
                            >
                                {renderSlide()}

                            </Swiper>
                            :
                            <div className={`flex items-center justify-center flex-col m-auto`}>
                                <Image src={getS3Url(`/images/icon/icon-search-folder_dark.png`)} width={100} height={100} />
                                <div className="text-xs text-nao-grey mt-1">{t('nao:pool:history_nodata')}</div>
                            </div>
                        }
                    </div>
                </CardNao>
            </div>

        </section>
    );
};

export default NaoPool;
