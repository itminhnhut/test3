import React, { useRef } from 'react';
import { TextLiner, CardNao, Divider } from 'components/screens/Nao/NaoStyle';
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';
import { useWindowSize } from 'utils/customHooks';
import styled from 'styled-components';
import { getS3Url } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';

const NaoPool = () => {
    const { t } = useTranslation();
    const sliderRef = useRef(null);
    const { width } = useWindowSize();
    const arr = [1, 2, 3, 4, 5, 6, 6, 6, 6]

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


    return (
        <section id="nao_pool" className="pt-10 sm:pt-20">
            <div className="flex items-center justify-between">
                <div>
                    <TextLiner>{t('nao:pool:title', { value: '(' + t('nao:coming_soon') + ')' })}</TextLiner>
                    {/* <span className="text-nao-grey">Lorem ipsum doren sitala ipsum doren sitala ipsum doren.</span> */}
                </div>
            </div>
            <div className="pt-6 flex items-center flex-wrap gap-[21px]">
                <CardNao className="!flex-row items-center !justify-start relative flex-wrap">
                    <div className="text-nao-grey sm:w-1/2">{t('nao:pool:description')}</div>
                    <div className="sm:absolute sm:right-0 lg:right-[76px] -bottom-7 sm:w-1/2 flex justify-end">
                        <img src={getS3Url("/images/nao/ic_nao_coming.png")} className="w-full h-full sm:w-[428px] sm:h-[292px]" alt="" />
                    </div>
                </CardNao>
                {/* <CardNao className="!p-10 sm:flex-none">
                    <div>
                        <label className="text-nao-text font-medium text-lg">NAO Staked</label>
                        <div className="pt-4">
                            <div className="text-nao-blue text-lg font-semibold pb-1 flex items-center">
                                <span className="mr-2">2,034,238,000</span>
                                <img src="/images/nao/ic_nao.png" width={20} height={20} alt="" />
                            </div>
                            <span className="text-sm text-nao-grey">100,000 USDT</span>
                        </div>
                    </div>
                    <div className="h-[1px] bg-nao-line my-8"></div>
                    <div>
                        <label className="text-nao-text font-medium text-lg">Participants</label>
                        <div className="pt-4">
                            <div className="text-nao-blue text-lg font-semibold pb-1 flex items-center">
                                <span className="mr-2">2,238,000</span>
                                <img src="/images/nao/ic_nao.png" width={20} height={20} alt="" />
                            </div>
                            <span className="text-sm text-nao-grey">+1,000 participants today</span>
                        </div>
                    </div>
                </CardNao>
                <CardNao className="!p-10">
                    <div className="flex items-center justify-between">
                        <label className="text-nao-blue text-lg font-medium">Estimated Revenue Shares in the next EPOSH</label>
                        <div className="text-nao-white text-xl font-semibold flex items-center leading-[18px]">
                            <span className="mr-2">2,238,000</span>
                            <img src="/images/nao/ic_nao.png" width={20} height={20} alt="" />
                        </div>
                    </div>
                    <div className="h-[1px] bg-nao-line my-8"></div>
                    <div className="flex items-center justify-between">
                        <label className="text-nao-text font-medium text-lg">Revenue Shares History</label>
                        <div className="flex space-x-2">
                            <img onClick={() => onNavigate(false)} className="cursor-pointer" src="/images/nao/ic_chevron.png" width={24} height={24} alt="" />
                            <img onClick={() => onNavigate(true)} className="rotate-180 cursor-pointer" src="/images/nao/ic_chevron.png" width={24} height={24} alt="" />
                        </div>
                    </div>
                    <div className="pt-5 flex items-center justify-between">
                        <Swiper
                            ref={sliderRef}
                            loop={true}
                            lazy grabCursor
                            className={`mySwiper`}
                            slidesPerView={1}
                        >
                            {renderSlide()}

                        </Swiper>
                    </div>
                </CardNao> */}
            </div>

        </section>
    );
};

export default NaoPool;