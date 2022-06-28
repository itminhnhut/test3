import React, { useRef } from 'react';
import { TextLiner, CardNao } from 'components/screens/Nao/NaoStyle';
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';

const NaoSectionGov = () => {
    const sliderRef = useRef(null);
    const arr = [1, 2, 3, 4, 5, 6, 6, 6, 6]

    const onNavigate = (isNext) => {
        if (sliderRef.current) {
            sliderRef.current.swiper[isNext ? 'slideNext' : 'slidePrev']();
        }
    }

    const renderSlide = () => {
        const size = 4;
        const page = Array.isArray(arr) && Math.ceil(arr.length / size)
        const result = [];
        for (let i = 0; i < page; i++) {
            const dataFilter = arr.slice(i * size, (i + 1) * size);
            result.push(<SwiperSlide key={i}>
                <div className="flex w-full justify-between">
                    {dataFilter.map((item, index) => (
                        <>
                            {index !== 0 && <div className="bg-nao-grey/[0.15] h-[56px] w-[1px]" />}
                            <div >
                                <div className="text-nao-blue text-[1.125rem] font-semibold pb-2 flex items-center">
                                    <span className="mr-2">100,034,238</span>
                                    <img src="/images/nao/ic_nao.png" width={20} height={20} alt="" />
                                </div>
                                <span className="text-sm text-nao-grey">10/5/2022 - 17/5/2022</span>
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
        <section className="pt-20">
            <div className="flex items-center justify-between">
                <div>
                    <TextLiner>Governance Pool</TextLiner>
                    <span className="text-nao-grey">Lorem ipsum doren sitala ipsum doren sitala ipsum doren.</span>
                </div>
            </div>
            <div className="pt-6 flex items-center flex-wrap gap-[21px]">
                <CardNao>
                    <label className="text-nao-text font-medium text-lg">Staked</label>
                    <div className="pt-4">
                        <div className="text-nao-blue text-[1.125rem] font-semibold pb-2 flex items-center">
                            <span className="mr-2">2,034,238,000</span>
                            <img src="/images/nao/ic_nao.png" width={20} height={20} alt="" />
                        </div>
                        <span className="text-sm text-nao-grey">100,000 USDT</span>
                    </div>
                </CardNao>
                <CardNao>
                    <label className="text-nao-text font-medium text-lg">Trades</label>
                    <div className="pt-4">
                        <div className="text-nao-white text-[1.375rem] font-semibold pb-2">2,238,000</div>
                        <span className="text-sm text-nao-grey">(~ 1000 users per day)</span>
                    </div>
                </CardNao>
                <CardNao>
                    <label className="text-nao-text font-medium text-lg">Estimated Revenue</label>
                    <div className="pt-4">
                        <div className="text-nao-blue text-[1.125rem] font-semibold pb-2 flex items-center">
                            <span className="mr-2">100,034,238</span>
                            <img src="/images/nao/ic_nao.png" width={20} height={20} alt="" />
                        </div>
                        <span className="text-sm text-nao-grey">Next EPOSH</span>
                    </div>
                </CardNao>
            </div>
            <CardNao className="mt-5">
                <div className="flex items-center justify-between">
                    <label className="text-nao-text font-medium text-lg">History Revenue Sharing</label>
                    <div className="flex space-x-2">
                        <img onClick={() => onNavigate(false)} className="cursor-pointer" src="/images/nao/ic_chevron.png" width={24} height={24} alt="" />
                        <img onClick={() => onNavigate(true)} className="rotate-180 cursor-pointer" src="/images/nao/ic_chevron.png" width={24} height={24} alt="" />
                    </div>
                </div>
                <div className="pt-4 flex items-center justify-between">
                    <Swiper
                        ref={sliderRef}
                        loop={true}
                        lazy grabCursor
                        className={`mySwiper`}
                        slidesPerView={1}
                    >
                        {renderSlide()}

                    </Swiper>
                    {/* <div className="">
                        <div className="text-nao-blue text-[1.125rem] font-semibold pb-2 flex items-center">
                            <span className="mr-2">100,034,238</span>
                            <img src="/images/nao/ic_nao.png" width={20} height={20} alt="" />
                        </div>
                        <span className="text-sm text-nao-grey">Next EPOSH</span>
                    </div>
                    <div className="bg-nao-grey/[0.15] h-[56px] w-[1px]" />
                    <div className="">
                        <div className="text-nao-blue text-[1.125rem] font-semibold pb-2 flex items-center">
                            <span className="mr-2">100,034,238</span>
                            <img src="/images/nao/ic_nao.png" width={20} height={20} alt="" />
                        </div>
                        <span className="text-sm text-nao-grey">Next EPOSH</span>
                    </div>
                    <div className="bg-nao-grey/[0.15] h-[56px] w-[1px]" />
                    <div className="">
                        <div className="text-nao-blue text-[1.125rem] font-semibold pb-2 flex items-center">
                            <span className="mr-2">100,034,238</span>
                            <img src="/images/nao/ic_nao.png" width={20} height={20} alt="" />
                        </div>
                        <span className="text-sm text-nao-grey">Next EPOSH</span>
                    </div>
                    <div className="bg-nao-grey/[0.15] h-[56px] w-[1px]" />
                    <div className="">
                        <div className="text-nao-blue text-[1.125rem] font-semibold pb-2 flex items-center">
                            <span className="mr-2">100,034,238</span>
                            <img src="/images/nao/ic_nao.png" width={20} height={20} alt="" />
                        </div>
                        <span className="text-sm text-nao-grey">Next EPOSH</span>
                    </div> */}
                </div>
            </CardNao>
        </section>
    );
};

export default NaoSectionGov;