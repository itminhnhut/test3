import React from 'react';
import { ButtonNao, CardNao } from 'components/screens/Nao/NaoStyle';
import { useTranslation } from 'next-i18next';

const ContesRules = () => {
    const { t } = useTranslation();

    return (
        <section className='contest_rules pt-[71px] flex justify-center md:justify-between flex-wrap relative text-center sm:text-left'>
            <div>
                <label className='text-[2.125rem] text-nao-white font-semibold leading-10'>{t('nao:contest:title')}</label>
                <div className='text-nao-text text-lg pt-3 sm:pt-[6px] leading-9'>{t('nao:contest:description')} <span className='text-nao-green font-semibold'>300,000,000 VNDC</span></div>
                <div className='gap-8 flex items-center pt-5 sm:pt-6 flex-wrap justify-center sm:justify-start'>
                    <ButtonNao className='py-2 px-[18px] text-sm font-semibold w-max !rounded-md'>{t('nao:contest:detail_rules')}</ButtonNao>
                    <CardNao noBg className="flex !flex-row !justify-center md:!justify-start !py-3 items-center gap-3 sm:!bg-none">
                        <div className='font-light text-sm sm:text-[1rem] text-nao-text'>{t('nao:contest:start_in')}</div>
                        <div className="text-lg sm:text-2xl flex space-x-1" dangerouslySetInnerHTML={{ __html: t('nao:contest:date', { days: 1, hours: 12, minutes: 39 }) }} ></div>
                    </CardNao>
                </div>
            </div>
            <div className='relative lg:-top-10 m-auto mt-4'>
                <img src="/images/nao/contest/ic_contest_info.png" alt="" width={300} height={292} />
            </div>
        </section>
    );
};

export default ContesRules;