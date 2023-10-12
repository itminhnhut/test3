import React, { Fragment, useEffect, useMemo, useState, useRef } from 'react';
import Image from 'next/image';
import { ButtonNao, ButtonNaoVariants, CardNao } from 'components/screens/Nao/NaoStyle';
import { useTranslation } from 'next-i18next';
import { getS3Url } from 'redux/actions/utils';
import Countdown from 'react-countdown';
import { useRouter } from 'next/router';
import { Popover, Transition } from '@headlessui/react';
import orderBy from 'lodash/orderBy';
import classNames from 'classnames';
import { ArrowDropDownIcon } from 'components/svg/SvgIcon';
import Modal from 'components/common/ReModal';
import SvgCross from 'components/svg/Cross';
import { useWindowSize } from 'utils/customHooks';

const ContesRules = ({
    inHome = false,
    seasonConfig = '',
    previous,
    season,
    start,
    end,
    seasons,
    title,
    title_champion,
    rules,
    total_rewards,
    title_detail,
    top_ranks_team
}) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const router = useRouter();
    const { width } = useWindowSize();
    const isMobile = width && width <= 640;

    const renderTimer = (formatted) => (
        <div className="flex items-center space-x-2">
            {Object.keys(formatted).map((time, idx) => {
                return (
                    <div key={idx} className="rounded-lg min-w-[68px] px-2 py-4 flex flex-col items-center justify-center bg-gray-12 dark:bg-dark-4">
                        <span className="text-2xl font-semibold">{formatted[time]}</span>
                        <span className="text-sm uppercase">{t(`common:${time}`)}</span>
                    </div>
                );
            })}
        </div>
    );

    const renderCountDown = (classNameContainer, classNameCountdown) => {
        const CONTEST_TIME = {
            START: new Date(start).getTime(),
            END: new Date(end).getTime()
        };
        const now = Date.now();
        if (now < CONTEST_TIME.START) {
            return (
                <>
                    <div className={classNames('font-light text-sm sm:text-base text-txtSecondary dark:text-txtSecondary-dark', classNameContainer)}>
                        {t('nao:contest:start_in')}:
                    </div>
                    <Countdown
                        date={CONTEST_TIME.START} // countdown 60s
                        renderer={({ formatted }) => renderTimer(formatted)}
                    // onComplete={() => setIsLoadingEmail(false)}
                    />
                </>
            );
        } else if (now >= CONTEST_TIME.START && now < CONTEST_TIME.END) {
            return (
                <>
                    <div className={classNames('font-light text-sm sm:text-base text-txtSecondary dark:text-txtSecondary-dark', classNameContainer)}>
                        {t('nao:contest:end_in')}:
                    </div>
                    <Countdown
                        date={CONTEST_TIME.END} // countdown 60s
                        renderer={({ formatted }) => renderTimer(formatted)}
                    // onComplete={() => setIsLoadingEmail(false)}
                    />
                </>
            );
        } else {
            return (
                <div className="w-full sm:px-20 rounded-md bg-gray-12 dark:bg-dark-2 py-3">
                    <div className="text-sm sm:text-base text-center text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:ended')}</div>
                </div>
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

    const onRedirect = () => {
        router.push(typeof rules === 'object' ? rules[language] : rules);
    };

    const current = seasons[seasons.length - 1];
    const seasonsFilter = useMemo(() => {
        const dataFilter = orderBy(seasons, 'season', 'desc');
        const active = dataFilter.findIndex((rs) => rs.active);
        return array_move(dataFilter, active, 0);
    }, [seasons]);

    return (
        <section className="contest_rules pb-12 py-6 sm:py-20 w-full flex flex-col lg:flex-row sm:justify-between">
            <div className="items-center text-center lg:text-left lg:items-left flex flex-col flex-wrap sm:block">
                <div className="font-semibold text-xl sm:text-2xl text-teal">{t('nao:contest:tournament')}</div>
                <div className="font-semibold text-xl sm:text-6xl pt-3 sm:pt-4">
                    <div>{title?.[language]}</div>
                    <div className="whitespace-nowrap">{title_champion?.[language]}</div>
                </div>

                <div className="text-txtSecondary dark:text-txtSecondary-dark text-sm sm:text-base pt-6 sm:pt-8">
                    {t(`nao:contest:description${!!top_ranks_team ? '' : '_individual'}`)}
                    <span className="text-teal font-semibold">{total_rewards}</span>
                </div>
                <div className="w-full sm:w-max m-auto lg:m-0 flex flex-col items-center lg:items-start">
                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 mt-5 sm:mt-4 w-full">
                        {renderCountDown('!font-normal', '!font-semibold')}
                    </div>
                    <div className="flex flex-row mt-8 sm:mt-10 sm_only:w-full whitespace-nowrap">
                        {inHome ? (
                            <ButtonNao
                                onClick={() => router.push('/contest')}
                                className="!h-11 sm:h-12 px-6 text-sm sm:test-base font-semibold w-max !rounded-md mr-3 sm_only:flex-1 sm_only:px-1"
                                primary
                            >
                                {t('nao:contest:ranking')}
                            </ButtonNao>
                        ) : (
                            <ButtonNao
                                onClick={onRedirect}
                                className="!h-11 sm:h-12 px-6 text-sm sm:text-base font-semibold w-max !rounded-md mr-3 sm_only:flex-1"
                            >
                                {t('nao:contest:detail_rules')}
                            </ButtonNao>
                        )}
                        {isMobile ? (
                            <TournamentList t={t} language={language} seasonsFilter={seasonsFilter} router={router} season={season} />
                        ) : (
                            <DropdownPreSeason inHome={inHome} t={t} language={language} seasonsFilter={seasonsFilter} router={router} season={season} />
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-10 lg:mt-0 text-center">
                {season === seasonConfig ? (
                    <Image
                        src={getS3Url('/images/contest/bg_contest_v1.png')}
                        width="544px"
                        height="354px"
                        title={title_champion?.[language]}
                        alt={title_champion?.[language]}
                    />
                ) : (
                    <img
                        src={getS3Url(`/images/nao/contest/ic_contest${season >= 10 ? '.png' : '_info.webp'}`)}
                        className={`m-auto ${season >= 10 ? 'w-[320px] sm:w-[430px]' : 'w-[300px] sm:w-[400px]'}`}
                        title={title_champion?.[language]}
                        alt={title_champion?.[language]}
                    />
                )}
            </div>
        </section>
    );
};

const DropdownPreSeason = ({ t, seasonsFilter, router, season, language, inHome }) => {
    const [offset, setOffset] = useState(0);
    const progress = (item) => {
        const now = new Date().getTime();
        const start = new Date(item?.start).getTime();
        const end = new Date(item?.end).getTime();
        if (now < start && now < end) {
            return (
                <div className="text-yellow-2 bg-yellow-2/[0.15] px-2 py-1 !pl-3 sm:!pl-2  rounded-r-[80px] sm:rounded-[80px]">{t('nao:coming_soon_2')}</div>
            );
        } else if (now > start && now < end) {
            return (
                <div className="flex items-center space-x-1 bg-teal/[0.1] px-2 py-1 !pl-3 sm:!pl-2 rounded-r-[80px] sm:rounded-[80px] w-max">
                    <img src={getS3Url('/images/nao/ic_nao_large.png')} width={16} height={16} />
                    <div className="text-teal ">{t('nao:going_on')}</div>
                </div>
            );
        } else {
            return <div className="text-gray-7 bg-gray-7/[0.1] px-2 py-1 !pl-3 sm:!pl-2 rounded-r-[80px] sm:rounded-[80px]">{t('nao:ended')}</div>;
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setOffset(document.querySelector('.tournaments').clientWidth);
        }, 500);
    }, [seasonsFilter]);

    return (
        <Popover className="relative flex sm_only:flex-1 sm_only:flex-grow-[1.5]">
            {({ open, close }) => (
                <>
                    <Popover.Button className="w-full">
                        <ButtonNao
                            variant={ButtonNaoVariants.SECONDARY}
                            className="!h-11 sm:h-12 px-6 text-sm sm:test-base font-semibold w-full !rounded-md flex items-center space-x-2 tournaments sm_only:px-1"
                        >
                            <span className="whitespace-nowrap">{t('nao:contest:tournaments')}</span>
                            <ArrowDropDownIcon
                                size={16}
                                color="currentColor"
                                className={`transition-all dark:text-txtSecondary-dark  ${open ? 'rotate-180' : ''}`}
                            />
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
                            style={{
                                transform: `translateX(calc(-50% - ${offset / 3}px))`
                            }}
                            className={`absolute top-14 min-w-[90vw] overflow-hidden sm:min-w-max sm:!translate-x-0 left-1/2 sm:left-0 z-50 bg-gray-12 dark:bg-dark-2 rounded-xl w-full`}
                        >
                            <div
                                className={`${inHome ? 'sm:max-h-[250px]' : 'sm:max-h-[300px]'
                                    } py-1 shadow-onlyLight text-sm flex flex-col rounded-xl border border-divider dark:border-divider-dark text-left max-h-[400px] overflow-y-auto`}
                            >
                                {seasonsFilter.map((item, index) => (
                                    <div
                                        onClick={() => {
                                            router.push(`/contest/${item.season}`);
                                            close();
                                        }}
                                        key={index}
                                        className="px-3 sm:px-4 sm:space-x-2 py-2 hover:bg-hover-1 dark:hover:bg-hover-dark cursor-pointer flex sm:items-center flex-col space-y-2 sm:space-y-0 sm:flex-row"
                                    >
                                        <div className="-ml-4 sm:ml-0 text-[10px] leading-[12px] sm:text-sm whitespace-nowrap w-max">{progress(item)}</div>
                                        <span className="sm:text-base">{item?.title_detail?.[language]} </span>
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
        <path d="M8 6L12 10L4 10L8 6Z" fill="currentColor" />
    </svg>
);

// To do: continue styling
const TournamentList = ({ t, seasonsFilter, router, season, language }) => {
    const [showTournaments, setShowTournaments] = useState(false);

    const Progress = (item) => {
        const now = new Date().getTime();
        const start = new Date(item?.start).getTime();
        const end = new Date(item?.end).getTime();
        if (now < start && now < end) {
            return <div className="text-yellow-2 bg-yellow-2/[0.15] px-3 py-1 rounded-[80px] w-fit">{t('nao:coming_soon_2')}</div>;
        } else if (now > start && now < end) {
            return (
                <div className="flex items-center space-x-1 bg-teal/[0.1] px-3 py-1 rounded-[80px] w-fit">
                    <img src={getS3Url('/images/nao/ic_nao_large.png')} width={16} height={16} />
                    <div className="text-teal ">{t('nao:going_on')}</div>
                </div>
            );
        } else {
            return <div className="text-gray-7 bg-gray-7/[0.1] px-3 py-1 rounded-[80px] w-fit">{t('nao:ended')}</div>;
        }
    };

    return (
        <div className="relative flex sm_only:flex-1 sm_only:flex-grow-[1.5]">
            {showTournaments && (
                <Modal
                    onusMode={true}
                    isVisible={true}
                    onBackdropCb={() => setShowTournaments(false)}
                    onusClassName="!px-0 pb-[3.75rem] !overflow-hidden text-sm sm:text-base"
                    containerClassName="!bg-black-800/[0.6] dark:!bg-black-800/[0.8]"
                >
                    <SvgCross className="ml-auto mr-7" color="currentColor" size={24} onClick={() => setShowTournaments(false)} />
                    <div className="!px-6 mt-6 text-xl sm:text-2xl font-semibold">{t('nao:contest:tournaments')}</div>
                    <div className="scrollbar-nao form-team mt-8 overflow-y-auto max-h-[calc(100%-4rem)]">
                        {seasonsFilter.map((item, index) => (
                            <div
                                onClick={() => {
                                    router.push(`/contest/${item.season}`);
                                    setShowTournaments(false);
                                }}
                                key={index}
                                className="px-6 py-3 hover:bg-hover-1 dark:hover:bg-hover-dark cursor-pointer flex items-center space-x-3 sm:flex-row"
                            >
                                <div className="text-xs sm:text-sm whitespace-nowrap w-max min-w-[7rem]">{Progress(item)}</div>
                                <span className="">{item?.title_detail?.[language]} </span>
                            </div>
                        ))}
                    </div>
                </Modal>
            )}
            <ButtonNao
                variant={ButtonNaoVariants.SECONDARY}
                className="!h-11 sm:h-12 px-4 text-sm font-semibold w-full !rounded-md flex items-center space-x-2 tournaments sm_only:px-1"
                onClick={() => setShowTournaments(true)}
            >
                <span className="whitespace-nowrap">{t('nao:contest:tournaments')}</span>
                <ArrowDropDownIcon size={16} color="currentColor" className="text-txtSecondary dark:text-txtSecondary-dark" />
            </ButtonNao>
        </div>
    );
};

export default ContesRules;
