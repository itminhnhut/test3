import React from 'react';

const NaoFooter = () => {
    return (
        <div className="nao_footer min-h-[6.25rem] bg-nao-bg3 flex items-center mt-20">
            <div className="max-w-[72.5rem] w-full m-auto h-full flex flex-col md:flex-row  items-center justify-between flex-wrap">
                <div className="nao_footer_left text-nao-text font-medium gap-5 flex items-center flex-wrap">
                    <div>Term of Use</div>
                    <div>|</div>
                    <div>Privacy Policy</div>
                    <div>|</div>
                    <div>Cerdit Agreement</div>
                </div>
                <div className='nao_footer_center text-nao-text font-medium'>Copyright © 2020 Nami Corporation. All rights reserved.</div>
                <div className='nao_footer_right items-center gap-5 hidden sm:flex'>
                    <img src="/images/nao/ic_facebook.png" alt="" height={24} width={24} />
                    <img src="/images/nao/ic_twitter.png" alt="" height={24} width={24} />
                    <img src="/images/nao/ic_reddit.png" alt="" height={24} width={24} />
                    <img src="/images/nao/ic_gecko_ai.png" alt="" height={24} width={24} />
                </div>
            </div>
        </div>
    );
};

export default NaoFooter;