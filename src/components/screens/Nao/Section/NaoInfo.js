import React from 'react';
import styled from 'styled-components';
import { getS3Url } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';

const NaoInfo = () => {
    const { t } = useTranslation();
    const user = useSelector(state => state.auth.user) || null;

    return (
        <section id="nao_info" className="flex items-center justify-between pt-10 sm:pt-20 flex-wrap gap-8">
            <div className="flex items-center">
                <BackgroundImage>
                    <img src={getS3Url('/images/nao/ic_nao_large.png')} className='w-[62px] h-[62px] sm:w-[80px] sm:h-[80px]' alt="" />
                </BackgroundImage>
                <div className="flex flex-col justify-between leading-10">
                    <div>
                        <div className="text-2xl sm:text-[2.25rem] font-semibold text-nao-white">{t('nao:project_info')}</div>
                        <div className="text-lg sm:text-[1.25rem] flex items-center pt-1 flex-wrap">
                            <label className="text-nao-blue uppercase text-[1.25re] font-semibold">NAO</label>
                            <span className="mx-2">•</span>
                            <div className="font-light text-nao-white capitalize">Nami frame futures</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex bg-nao-bg2 rounded-xl p-6 sm:px-12 sm:py-[45px] flex-1 sm:flex-none flex-col sm:flex-row">
                <div className="">
                    <label className="text-nao-text font-medium sm:text-lg pb-1 leading-7">{t('nao:circulating_supply')}</label>
                    <div className="text-nao-blue uppercase text-sm font-medium leading-7">NAO TOKEN</div>
                </div>
                <div className="h-[1px] mx-0 sm:h-auto sm:w-0 bg-nao-line sm:mx-[33px] my-6 sm:my-0"></div>
                <div className="">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center mr-8">
                            <span className="font-semibold mr-1 leading-7">22,250,000</span>
                            <img src={getS3Url("/images/nao/ic_nao.png")} width={16} height={16} alt="" />
                        </div>
                        <div className="text-nao-grey text-sm">100,000,000</div>
                    </div>
                    <div className="my-2">
                        <div className="w-full bg-[#000000] rounded-lg">
                            <Progressbar percent={(22250000 / 100000000) * 100} />
                        </div>
                    </div>
                    <div className="text-xs font-medium leading-6">{(22250000 / 100000000) * 100}%</div>
                </div>
            </div>
        </section>
    );
};


const BackgroundImage = styled.div.attrs({
    className: 'min-w-[90px] w-[90px] h-[90px] sm:min-w-[116px] sm:w-[116px] sm:h-[116px] rounded-[50%] flex justify-center items-center mr-4 sm:mr-6'
})`
    background: linear-gradient(101.26deg, #00144E -5.29%, #003A33 113.82%);
`

const Progressbar = styled.div.attrs({
    className: 'h-[6px] rounded-lg transition-all'
})`
    background: linear-gradient(101.26deg, #093DD1 -5.29%, #49E8D5 113.82%);
    width:${({ percent }) => `${percent > 100 ? 100 : percent}%`};
`

export default NaoInfo;
