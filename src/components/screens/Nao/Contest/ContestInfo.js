import React from 'react';
import { TextLiner, CardNao } from 'components/screens/Nao/NaoStyle';
import { useTranslation } from 'next-i18next';

const ContestInfo = () => {
    const { t } = useTranslation();

    return (
        <section className="contest_info pt-[100px] sm:pt-9">
            <TextLiner>{t('nao:contest:personal')}</TextLiner>
            <div className="flex flex-col lg:flex-row flex-wrap gap-5 mt-8 ">
                <CardNao className="!min-h-[136px] !px-6 !py-9 lg:!max-w-[375px]">
                    <label className="text-2xl text-nao-green font-semibold left-8">Nguyễn T. Văn Huy</label>
                    <div className=" text-nao-grey2 text-sm font-medium mt-4 flex sm:flex-col items-center sm:items-start">
                        <div className="leading-6 mt-1">ID: 96110109278</div>
                        <span className="text-nao-white mx-2 sm:hidden">•</span>
                        <div className="flex text-nao-grey2 leading-6 ">Team:&nbsp;<span className="text-nao-green font-medium">QUNI Offical</span></div>
                    </div>
                </CardNao>
                <CardNao className="!min-h-[136px] !py-7 !px-[35px] w-full lg:w-max">
                    <div className="flex items-center justify-between md:space-x-[70px] flex-wrap md:flex-nowrap">
                        <div className="flex items-center justify-between w-full md:w-1/2">
                            <label className="text-nao-grey2 text-sm leading-6 ">{t('nao:contest:trades')}</label>
                            <div className="font-semibold leading-8 text-right">100</div>
                        </div>
                        <div className="h-[1px] bg-nao-grey/[0.2] w-full my-2 md:hidden"></div>
                        <div className="flex items-center justify-between w-full md:w-1/2">
                            <label className="text-nao-grey2 text-sm leading-6 ">{t('nao:contest:total_pnl')}</label>
                            <div className="font-semibold leading-8 text-right">10,000,000,000 VNDC</div>
                        </div>
                    </div>
                    <div className="h-[1px] bg-nao-grey/[0.2] w-full my-2 md:hidden"></div>
                    <div className="flex items-center justify-between md:space-x-[70px] flex-wrap md:flex-nowrap">
                        <div className="flex items-center justify-between w-full md:w-1/2">
                            <label className="text-nao-grey2 text-sm leading-6 ">{t('nao:contest:volume')}</label>
                            <div className="font-semibold leading-8 text-right">1,000,000,000 VNDC</div>
                        </div>
                        <div className="h-[1px] bg-nao-grey/[0.2] w-full my-2 md:hidden"></div>
                        <div className="flex items-center justify-between w-full md:w-1/2">
                            <label className="text-nao-grey2 text-sm leading-6 ">{t('nao:contest:per_pnl')}</label>
                            <div className="font-semibold leading-8 text-right text-nao-green2">+6.42%</div>
                        </div>
                    </div>
                    <div className="h-[1px] bg-nao-grey/[0.2] w-full my-2 md:hidden"></div>
                    <div className="flex items-center justify-between md:space-x-[70px] flex-wrap md:flex-nowrap">
                        <div className="flex items-center justify-between w-full md:w-1/2">
                            <label className="text-nao-grey2 text-sm leading-6 ">{t('nao:contest:volume_rank')}</label>
                            <div className="font-semibold leading-8 text-right">#100</div>
                        </div>
                        <div className="h-[1px] bg-nao-grey/[0.2] w-full my-2 md:hidden"></div>
                        <div className="flex items-center justify-between w-full md:w-1/2">
                            <label className="text-nao-grey2 text-sm leading-6 ">{t('nao:contest:pnl_rank')}</label>
                            <div className="font-semibold leading-8 text-right text-nao-green2">#12</div>
                        </div>
                    </div>
                </CardNao>
            </div>
        </section>
    );
};

export default ContestInfo;