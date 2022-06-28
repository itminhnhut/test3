import React from 'react';
import { TextLiner, CardNao } from 'components/screens/Nao/NaoStyle';

const NaoToken = () => {
    return (
        <section className="pt-20">
            <div className="flex items-center justify-between">
                <div>
                    <TextLiner>buy NAO Token</TextLiner>
                    <span className="text-nao-grey">Lorem ipsum doren sitala ipsum doren sitala ipsum doren.</span>
                </div>
            </div>
            <div className="pt-6 flex items-center flex-wrap gap-[21px]">
                <CardNao className="!flex-row items-center !justify-start">
                    <img src="/images/nao/ic_nao_large.png" alt="" width={60} height={60} />
                    <div className="flex flex-col pl-6">
                        <label className="text-sm text-nao-blue font-medium">NAO Token</label>
                        <div className="pt-3">
                            <div className="text-nao-white font-semibold text-2xl">1,000 VNDC</div>
                            <span className="text-sm text-nao-grey">0,025 USDT</span>
                        </div>
                    </div>
                </CardNao>
                <CardNao noBg className="!flex-row items-center flex-wrap w-full gap-4">
                    <div className="flex items-center gap-5">
                        <img src="/images/nao/ic_onus.png" alt="" width={90} height={90} />
                        <div className="text-[1.25rem] text-nao-text font-semibold">Get Onus App to buy NAO now!</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <img className="cursor-pointer" src="/images/nao/ic_app_store.png" alt="" width={152} height={50} />
                        <img className="cursor-pointer" src="/images/nao/ic_google_play.png" alt="" width={152} height={50} />
                    </div>
                </CardNao>
            </div>
        </section>
    );
};

export default NaoToken;