import React from 'react';
import { TextLiner, CardNao } from 'components/screens/Nao/NaoStyle';
import { useTranslation } from 'next-i18next';

const ContestInfo = () => {
    const { t } = useTranslation();

    return (
        <section className="contest_info pt-9">
            <TextLiner>{t('nao:contest:infomation')}</TextLiner>
            <CardNao className="mt-8 !min-h-[136px] md:!flex-row flex-wrap gap-2">
                <div className=''>
                    <label className="text-lg font-semibold left-8">Nguyễn T. Văn Huy</label>
                    <div className="flex items-center text-nao-text text-sm font-medium leading-6 gap-2 mt-1">
                        <div>ID: 96110109278</div>
                        <span className="text-white-nao">•</span>
                        <div>QUNI Offical</div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row flex-wrap ">
                    <div>
                        <label className="text-nao-text text-sm leading-6">{t('nao:contest:trades')}</label>
                        <div className="font-semibold leading-8">100</div>
                    </div>
                    <div className="h-[1px] mx-0 md:h-full md:w-[1px] bg-nao-grey/[0.2] md:mx-10 my-6 md:my-0"></div>
                    <div>
                        <label className="text-nao-text text-sm leading-6">{t('nao:contest:total_pnl')}</label>
                        <div className="font-semibold leading-8">10,000,000,000 VNDC</div>
                    </div>
                    <div className="h-[1px] mx-0 md:h-full md:w-[1px] bg-nao-grey/[0.2] md:mx-10 my-6 md:my-0"></div>
                    <div>
                        <label className="text-nao-text text-sm leading-6">{t('nao:contest:per_pnl')}</label>
                        <div className="font-semibold leading-8 text-nao-green2">+6.74%</div>
                    </div>
                    <div className="h-[1px] mx-0 md:h-full md:w-[1px] bg-nao-grey/[0.2] md:mx-10 my-6 md:my-0"></div>
                    <div>
                        <label className="text-nao-text text-sm leading-6">{t('nao:contest:volume')}</label>
                        <div className="font-semibold leading-8">10,000,000,000 VNDC</div>
                    </div>
                </div>
            </CardNao>
        </section>
    );
};

export default ContestInfo;