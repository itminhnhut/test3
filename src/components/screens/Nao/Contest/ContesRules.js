import React, { Fragment } from 'react';
import { ButtonNao, CardNao } from 'components/screens/Nao/NaoStyle';
import { useTranslation } from 'next-i18next';

import { getS3Url } from 'redux/actions/utils';
import Countdown from 'react-countdown';
import { useRouter } from 'next/router';
import { Popover, Transition } from '@headlessui/react';
import { Check } from 'react-feather';
import colors from 'styles/colors';

const ContesRules = ({ inHome = false, previous, season, start, end, seasons, title, rules, total_rewards, title_detail }) => {
    const { t, i18n: { language } } = useTranslation();
    const router = useRouter();
    const renderCountDown = () => {
        const CONTEST_TIME = {
            START: new Date(start).getTime(),
            END: new Date(end).getTime()
        };
        const now = Date.now();
        if (now < CONTEST_TIME.START) {
            return <>
                <div className="font-light text-sm sm:text-[1rem] text-nao-text">{t('nao:contest:start_in')}</div>
                <Countdown
                    date={CONTEST_TIME.START} // countdown 60s
                    renderer={({
                        formatted: {
                            days,
                            hours,
                            minutes,
                            seconds,
                        }
                    }) => <div className="text-lg sm:text-2xl flex" dangerouslySetInnerHTML={{
                        __html: t('nao:contest:date', {
                            days,
                            hours,
                            minutes
                        })
                    }}></div>}
                    onComplete={() => setIsLoadingEmail(false)}
                />
            </>;
        } else if (now >= CONTEST_TIME.START && now < CONTEST_TIME.END) {
            return <>
                <div className="font-light text-sm sm:text-[1rem] text-nao-text">{t('nao:contest:end_in')}</div>
                <Countdown
                    date={CONTEST_TIME.END} // countdown 60s
                    renderer={({
                        formatted: {
                            days,
                            hours,
                            minutes,
                            seconds,
                        }
                    }) => <div className="text-lg sm:text-2xl flex" dangerouslySetInnerHTML={{
                        __html: t('nao:contest:date', {
                            days,
                            hours,
                            minutes
                        })
                    }}></div>}
                    onComplete={() => setIsLoadingEmail(false)}
                />
            </>;
        } else {
            return <>
                <div className="text-lg sm:text-2xl flex">{t('nao:contest:ended')}</div>
            </>;
        }
    };

    const current = seasons[seasons.length - 1];
    // const seasonsFilter = seasons?.filter(e => e?.season !== current?.season);

    return (
        <section
            className="contest_rules pt-[3.375rem] flex justify-center md:justify-between flex-wrap relative text-center sm:text-left">
            <div>
                <label
                    className="text-[1.75rem] sm:text-[2.125rem] text-nao-white font-semibold leading-10">{title?.[language]}</label>
                <div
                    className="text-nao-text text-sm sm:text-lg pt-3 sm:pt-[6px] leading-6">{t('nao:contest:description')}
                    <span className="text-nao-green font-semibold">{total_rewards}</span></div>
                <div className="gap-4 flex items-center pt-9 sm:pt-6 flex-wrap justify-center sm:justify-start">
                    {
                        inHome
                            ? <ButtonNao onClick={() => router.push('/contest')}
                                className="px-[18px] text-sm font-semibold w-max !rounded-md">{t('nao:contest:ranking')}</ButtonNao>
                            :
                            <ButtonNao onClick={() => router.push(rules)} className='px-[18px] text-sm font-semibold w-max !rounded-md'>{t('nao:contest:detail_rules')}</ButtonNao>
                    }
                    <DropdownPreSeason t={t} language={language} seasonsFilter={seasons} router={router} season={season} />
                    <CardNao customHeight={'sm:min-h-[40px] lg:min-h-[40] min-h-[50px]'} noBg
                        className="flex !flex-row !justify-center md:!justify-start !py-3 items-center gap-3 sm:!bg-none flex-wrap">
                        {renderCountDown()}
                    </CardNao>
                </div>
            </div>
            <div className="relative xl:-top-10 sm:m-auto md:m-auto mt-4">
                <img src={getS3Url('/images/nao/contest/ic_contest_info.png')} alt="" width={300} height={292} />
            </div>
        </section>
    );
};


const DropdownPreSeason = ({ t, seasonsFilter, router, season, language }) => {
    return (
        <Popover className="relative flex">
            {({ open, close }) => (
                <>
                    <Popover.Button>
                        <ButtonNao border className="px-[18px] text-sm font-semibold w-max !rounded-md">
                            {t('nao:contest:season_details')}
                        </ButtonNao>
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel
                            className="absolute top-12 min-w-[18rem] sm:min-w-max right-0 sm:left-0 z-50 bg-nao-bg3 rounded-xl w-full">
                            <div
                                className="py-1 shadow-onlyLight font-medium text-sm flex flex-col rounded-xl overflow-hidden">
                                {seasonsFilter.map((item, index) => (
                                    <div onClick={() => {
                                        router.push(`/contest/${item.season}`)
                                        close()
                                    }} key={index} className="px-4 space-x-2 py-2 hover:bg-onus-bg2 cursor-pointer flex items-center justify-between">
                                        <span>{item?.title_detail?.[language]}</span>
                                        <span>{item.season === season && <Check size={14} color={colors.onus.base} />}</span>
                                    </div>
                                ))}
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    )
}

export default ContesRules;
