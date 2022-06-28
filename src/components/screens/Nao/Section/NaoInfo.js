import React from 'react';
import styled from 'styled-components';
const NaoInfo = () => {
    return (
        <section className="flex items-center justify-between pt-20 flex-wrap">
            <div className="flex items-center">
                <BackgroundImage>
                    <img src='/images/nao/ic_nao_large.png' height='80' width='80' alt="" />
                </BackgroundImage>
                <div className="flex flex-col justify-between leading-10">
                    <label className="text-nao-blue uppercase text-[1.25re] font-semibold">NAO Token</label>
                    <div>
                        <div className="text-[2rem] font-semibold">Project Information</div>
                        <div className="text-lg font-light">Nami frame futures</div>
                    </div>
                </div>
            </div>
            <div className="flex bg-nao-bg2 rounded-xl p-7">
                <div className="">
                    <label className="text-nao-text font-medium text-lg">Circulating Supply</label>
                    <div className="mt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center mr-8">
                                <span className="font-semibold mr-1">22,250,000</span>
                                <img src="/images/nao/ic_nao.png" width={16} height={16} alt="" />
                            </div>
                            <div className="text-nao-grey">100,000,000</div>
                        </div>
                        <div className="my-2">
                            <div className="w-full bg-[#000000] rounded-lg">
                                <Progressbar percent={(22250000 / 100000000) * 100} />
                            </div>
                        </div>
                        <div className="text-xs font-medium">{(22250000 / 100000000) * 100}%</div>
                    </div>
                </div>
                <div className="w-[1px] bg-nao-line mx-[39px]"></div>
                <div>
                    <label className="text-nao-text font-medium text-lg">Distributed Today</label>
                    <div className="mt-[45px]">
                        <div className="flex items-center mr-8">
                            <span className="font-semibold mr-2 text-lg">-</span>
                            <img src="/images/nao/ic_nao.png" width={28} height={28} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


const BackgroundImage = styled.div.attrs({
    className: 'w-[7.25rem] h-[7.25rem] rounded-[50%] flex justify-center items-center mr-6'
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