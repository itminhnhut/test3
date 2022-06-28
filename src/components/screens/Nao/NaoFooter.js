import React from 'react';
import { getS3Url } from 'redux/actions/utils';

const NaoFooter = () => {
    return (
        <div className="nao_footer min-h-[6.25rem] bg-nao-bg3 flex items-center mt-[100px] sm:mt-20 py-9 px-4 nao:p-0">
            <div className="max-w-[72.5rem] w-full m-auto h-full flex flex-col lg:flex-row  items-center justify-between text-center flex-wrap sm:gap-5">
                <div className="nao_footer_left text-nao-text font-medium gap-0 sm:gap-5 flex items-center sm:flex-row flex-col sm:w-auto w-full">
                    <div className="pb-3 border-b border-nao-line w-full sm:border-none whitespace-nowrap sm:p-0">Term of Use</div>
                    <div className="hidden sm:flex">|</div>
                    <div className="py-3 border-b border-nao-line w-full sm:border-none whitespace-nowrap sm:p-0">Privacy Policy</div>
                    <div className="hidden sm:flex">|</div>
                    <div className="py-3 border-b border-nao-line w-full sm:border-none whitespace-nowrap sm:p-0">Cerdit Agreement</div>
                </div>
                <div className='nao_footer_center text-nao-text font-medium pt-6 pb-4 sm:p-0 mx-11 sm:mx-0'>Copyright © 2020 Nami Corporation. All rights reserved.</div>
                <div className='nao_footer_right items-center gap-5 flex'>
                    <img src={getS3Url("/images/nao/ic_facebook.png")} alt="" height={24} width={24} />
                    <img src={getS3Url("/images/nao/ic_twitter.png")} alt="" height={24} width={24} />
                    <img src={getS3Url("/images/nao/ic_reddit.png")} alt="" height={24} width={24} />
                    <img src={getS3Url("/images/nao/ic_gecko_ai.png")} alt="" height={24} width={24} />
                </div>
            </div>
        </div>
    );
};

export default NaoFooter;