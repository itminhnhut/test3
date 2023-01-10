import React, { Fragment, useMemo } from 'react';

import Image from 'next/image';

import { ButtonNao, CardNao } from 'components/screens/Nao/NaoStyle';
import { useTranslation } from 'next-i18next';

import { getS3Url } from 'redux/actions/utils';
import Countdown from 'react-countdown';
import { useRouter } from 'next/router';
import { Popover, Transition } from '@headlessui/react';
import orderBy from 'lodash/orderBy';
import classNames from 'classnames';
const ContesRules = ({ inHome = false, previous, season, start, end, seasons, title, title_champion, rules, total_rewards, title_detail }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const router = useRouter();
    const renderCountDown = (classNameContainer, classNameCountdown) => {
        console.log(classNameContainer);
        const CONTEST_TIME = {
            START: new Date(start).getTime(),
            END: new Date(end).getTime()
        };
        const now = Date.now();
        if (now < CONTEST_TIME.START) {
            return (
                <>
                    <div className={classNames('font-light text-sm sm:text-[1rem] text-nao-text', classNameContainer)}>{t('nao:contest:start_in')}</div>
                    <Countdown
                        date={CONTEST_TIME.START} // countdown 60s
                        renderer={({ formatted: { days, hours, minutes, seconds } }) => (
                            <div
                                className={classNames('text-lg sm:text-2xl flex', classNameCountdown)}
                                dangerouslySetInnerHTML={{
                                    __html: t('nao:contest:date', {
                                        days,
                                        hours,
                                        minutes
                                    })
                                }}
                            ></div>
                        )}
                        onComplete={() => setIsLoadingEmail(false)}
                    />
                </>
            );
        } else if (now >= CONTEST_TIME.START && now < CONTEST_TIME.END) {
            return (
                <>
                    <div className={classNames('font-light text-sm sm:text-[1rem] text-nao-text', classNameContainer)}>{t('nao:contest:end_in')}</div>
                    <Countdown
                        date={CONTEST_TIME.END} // countdown 60s
                        renderer={({ formatted: { days, hours, minutes, seconds } }) => (
                            <div
                                className={classNames('text-lg sm:text-2xl flex', classNameCountdown)}
                                dangerouslySetInnerHTML={{
                                    __html: t('nao:contest:date', {
                                        days,
                                        hours,
                                        minutes
                                    })
                                }}
                            ></div>
                        )}
                        onComplete={() => setIsLoadingEmail(false)}
                    />
                </>
            );
        } else {
            return (
                <>
                    <div className="text-lg sm:text-2xl flex">{t('nao:contest:ended')}</div>
                </>
            );
        }
    };

    const array_move = (arr, old_index, new_index) => {
        if (new_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr;
    };

    const current = seasons[seasons.length - 1];
    const seasonsFilter = useMemo(() => {
        const dataFilter = orderBy(seasons, 'season', 'desc');
        const active = dataFilter.findIndex((rs) => rs.active);
        return array_move(dataFilter, active, 0);
    }, [seasons]);

    const teamp1 = () => {
        return (
            <section className="contest_rules pt-[3.375rem] flex justify-center md:justify-between flex-wrap relative text-center sm:text-left">
                <div>
                    <label className="text-[1.75rem] sm:text-[2.125rem] text-nao-white font-semibold leading-10">{title?.[language]}</label>
                    <div className="text-nao-text text-sm sm:text-lg pt-3 sm:pt-[6px] leading-6">
                        {t('nao:contest:description')}
                        <span className="text-nao-green font-semibold">{total_rewards}</span>
                    </div>
                    <div className="gap-4 flex items-center pt-9 sm:pt-6 flex-wrap justify-center sm:justify-start">
                        {inHome ? (
                            <ButtonNao onClick={() => router.push('/contest')} className="px-[18px] text-sm font-semibold w-max !rounded-md">
                                {t('nao:contest:ranking')}
                            </ButtonNao>
                        ) : (
                            <ButtonNao onClick={() => router.push(rules)} className="px-[18px] text-sm font-semibold w-max !rounded-md">
                                {t('nao:contest:detail_rules')}
                            </ButtonNao>
                        )}
                        <DropdownPreSeason t={t} language={language} seasonsFilter={seasonsFilter} router={router} season={season} />
                        <CardNao
                            customHeight={'sm:min-h-[40px] lg:min-h-[40] min-h-[50px]'}
                            noBg
                            className="flex !flex-row !justify-center md:!justify-start !py-3 items-center gap-3 sm:!bg-none flex-wrap"
                        >
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

    return (
        <section className="contest_rules pt-[3.375rem] w-full flex flex-col mb:flex-row mb:justify-between">
            <div className="text-center mb:text-left flex flex-col flex-wrap mb:block">
                <div className="font-semibold leading-[40px] mb:leading-[0px] text-[28px] mb:text-2xl mb:text-nao-green">{t('nao:contest:tournament')}</div>
                <div className="font-semibold text-[24px] sm:text-[34px] leading-[48px] pt-4">
                    <div>{title?.[language]}</div>
                    <div>{title_champion?.[language]}</div>
                </div>

                <div className="text-nao-text text-sm sm:text-mb pt-4 mb:pt-6 leading-9">
                    {t('nao:contest:description')}
                    <span className="text-nao-green font-semibold">{total_rewards}</span>
                </div>
                <div className="w-full border-[1px] border-dashed border-nao-grey rounded-[6px]  py-1 mt-4 mb:mt-3 flex flex-row items-center justify-center order-2">
                    {renderCountDown('!text-sm !font-normal leading-6 !mr-2', '!text-[16px] !font-semibold !leading-8')}
                </div>
                <div className="flex flex-row mt-9 mb:mt-12 justify-center mb:justify-start order-1 w-full">
                    {inHome ? (
                        <ButtonNao onClick={() => router.push('/contest')} className="px-[18px] text-sm font-semibold w-max !rounded-md mr-3">
                            {t('nao:contest:ranking')}
                        </ButtonNao>
                    ) : (
                        <ButtonNao onClick={() => router.push(rules)} className="px-[18px] text-sm font-semibold w-max !rounded-md mr-3">
                            {t('nao:contest:detail_rules')}
                        </ButtonNao>
                    )}
                    <DropdownPreSeason t={t} language={language} seasonsFilter={seasonsFilter} router={router} season={season} />
                </div>
            </div>
            <div className="mt-9 mb:mt-0 text-center">
                <Image
                    src={getS3Url('/images/contest/bg-contest.png')}
                    width="568px"
                    height="369px"
                    title={title_champion?.[language]}
                    alt={title_champion?.[language]}
                />
            </div>
        </section>
    );
};

const DropdownPreSeason = ({ t, seasonsFilter, router, season, language }) => {
    const progress = (item) => {
        const now = new Date().getTime();
        const start = new Date(item?.start).getTime();
        const end = new Date(item?.end).getTime();
        if (now < start && now < end) {
            return <div className="text-onus-orange bg-nao/[0.15] px-2 py-1 !pl-3 sm:!pl-2 rounded-[3px]">{t('nao:coming_soon_2')}</div>;
        } else if (now > start && now < end) {
            return (
                <div className="flex items-center space-x-1 bg-nao/[0.15] px-2 py-1 !pl-3 sm:!pl-2 rounded-[3px] w-max">
                    <img src={getS3Url('/images/nao/ic_nao_large.png')} width={16} height={16} />
                    <div className="text-nao-green ">{t('nao:going_on')}</div>
                </div>
            );
        } else {
            return <div className="text-onus-grey bg-nao/[0.15] px-2 py-1 !pl-3 sm:!pl-2 rounded-[3px]">{t('nao:ended')}</div>;
        }
    };

    return (
        <Popover className="relative flex">
            {({ open, close }) => (
                <>
                    <Popover.Button>
                        <ButtonNao border className="px-[18px] text-sm font-semibold w-max !rounded-md flex items-center space-x-2">
                            <span>{t('nao:contest:tournaments')}</span>
                            <DropDonwIcon className={`transition-all ${open ? '' : 'rotate-180'}`} />
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
                        <Popover.Panel className="absolute top-12 min-w-[90vw] sm:min-w-max translate-x-[calc(50%-70px)] sm:translate-x-0 right-1/2 sm:left-0 z-50 bg-nao-bg3 rounded-xl w-full">
                            <div className="py-1 shadow-onlyLight font-medium text-sm flex flex-col rounded-xl overflow-hidden text-left">
                                {seasonsFilter.map((item, index) => (
                                    <div
                                        onClick={() => {
                                            router.push(`/contest/${item.season}`);
                                            close();
                                        }}
                                        key={index}
                                        className="px-3 sm:px-4 sm:space-x-2 py-2 hover:bg-onus-bg2 cursor-pointer flex sm:items-center flex-col space-y-2 sm:space-y-0 sm:flex-row"
                                    >
                                        <div className="-ml-4 sm:ml-0 text-[10px] leading-[12px] font-semibold whitespace-nowrap w-max">{progress(item)}</div>
                                        <span className="leading-6">{item?.title_detail?.[language]} </span>
                                    </div>
                                ))}
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

const DropDonwIcon = ({ className = '' }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 6L12 10L4 10L8 6Z" fill="white" />
    </svg>
);

export default ContesRules;
