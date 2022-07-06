import React, { useState } from 'react';
import { TextLiner, CardNao, ButtonNao } from 'components/screens/Nao/NaoStyle';
import { useTranslation } from 'next-i18next';

const ContestPerRanks = () => {
    const [tab, setTab] = useState('volume');
    const { t } = useTranslation();

    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    const top3 = arr.slice(0, 3)

    return (
        <section className="contest_personal_ranks pt-[124px]">
            <div className="flex justify-between flex-wrap gap-2">
                <TextLiner>{t('nao:contest:personal_ranks')}</TextLiner>
                <div className="flex items-center gap-3 text-sm">
                    <ButtonNao
                        onClick={() => setTab('volume')}
                        className={`px-4 py-2 !rounded-md ${tab === 'volume' ? 'font-semibold' : '!bg-nao-bg3'}`}>{t('nao:contest:volume')}</ButtonNao>
                    <ButtonNao
                        onClick={() => setTab('pnl')}
                        className={`px-4 py-2 !rounded-md   ${tab === 'pnl' ? 'font-semibold' : '!bg-nao-bg3'}`}>{t('nao:contest:per_pnl')}</ButtonNao>
                </div>
            </div>
            <div className="flex items-center gap-[22px] mt-8">
                {top3.map(item => (
                    <CardNao key={item} className="!p-6">
                        <div className="absolute left-0 top-0 text-sm font-semibold bg-nao-blue2 px-[18px] rounded-lg py-[2px]">#1</div>
                        <div className="flex items-center justify-between mt-[10px]">
                            <div className="gap-2 flex flex-col">
                                <label className="text-lg font-semibold leading-8">Nguyễn T. Văn Huy</label>
                                <span className="text-nao-grey text-sm text-medium">96110109278</span>
                            </div>
                            <div className="bg-nao-white/[0.1] w-[92px] h-[92px] rounded-[50%] flex items-center justify-center">
                                <img src="/images/nao/contest/ic_diamond.png" alt="" width="65" height="38" />
                            </div>
                        </div>
                        <div className="bg-nao/[0.15] rounded-lg p-4 mt-5">
                            <div className="flex items-center justify-between gap-2">
                                <label className="text-sm text-nao-text">{t('nao:contest:volume')}</label>
                                <span className="font-semibold leading-8">100,000,000 VNDC</span>
                            </div>
                            <div className="h-[1px] bg-nao-grey/[0.2] w-full my-2"></div>
                            <div className="flex items-center justify-between gap-2">
                                <label className="text-sm text-nao-text">{t('nao:contest:per_pnl')}</label>
                                <span className="font-semibold leading-8 text-nao-green2">+6.42%</span>
                            </div>
                        </div>
                    </CardNao>
                ))}
            </div>
            <Table dataSource={arr} />
        </section>
    );
};


const Table = ({ dataSource }) => {
    return (
        <CardNao noBg className="mt-5 !p-6">
            ss
        </CardNao>
    )
}

export default ContestPerRanks;