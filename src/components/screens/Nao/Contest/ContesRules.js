import React from 'react';
import { ButtonNao, CardNao } from 'components/screens/Nao/NaoStyle';
import { useTranslation } from 'next-i18next';

import { getS3Url } from 'redux/actions/utils';
import Countdown from 'react-countdown';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const ContesRules = ({ inHome = false, previous, season, start, end, seasons, currentSeason }) => {
    const { t } = useTranslation();
    const router = useRouter();
    const renderCountDown = () => {
        const CONTEST_TIME = {
            START: new Date(start).getTime(),
            END: new Date(end).getTime()
        }
        const now = Date.now()
        if (now < CONTEST_TIME.START) {
            return <>
                <div className='font-light text-sm sm:text-[1rem] text-nao-text'>{t('nao:contest:start_in')}</div>
                <Countdown
                    date={CONTEST_TIME.START} // countdown 60s
                    renderer={({ formatted: {
                        days,
                        hours,
                        minutes,
                        seconds,
                    } }) => <div className="text-lg sm:text-2xl flex" dangerouslySetInnerHTML={{ __html: t('nao:contest:date', { days, hours, minutes }) }} ></div>}
                    onComplete={() => setIsLoadingEmail(false)}
                />
            </>
        } else if (now >= CONTEST_TIME.START && now < CONTEST_TIME.END) {
            return <>
                <div className='font-light text-sm sm:text-[1rem] text-nao-text'>{t('nao:contest:end_in')}</div>
                <Countdown
                    date={CONTEST_TIME.END} // countdown 60s
                    renderer={({ formatted: {
                        days,
                        hours,
                        minutes,
                        seconds,
                    } }) => <div className="text-lg sm:text-2xl flex" dangerouslySetInnerHTML={{ __html: t('nao:contest:date', { days, hours, minutes }) }} ></div>}
                    onComplete={() => setIsLoadingEmail(false)}
                />
            </>
        } else {
            return <>
                <div className='text-lg sm:text-2xl flex'>{t('nao:contest:ended')}</div>
            </>
        }
    }

    const seasonsFilter = seasons.filter(e => e.season !== season && e.season !== currentSeason?.season)
    return (
        <section className='contest_rules pt-[3.375rem] flex justify-center md:justify-between flex-wrap relative text-center sm:text-left'>
            <div>
                <label className='text-[1.75rem] text-nao-white font-semibold leading-10'>{t('nao:contest:title', { value: t(`nao:contest:${previous ? 'first' : 'second'}`) })}</label>
                <div className='text-nao-text text-sm pt-3 sm:pt-[6px] leading-6'>{t('nao:contest:description')} <span className='text-nao-green font-semibold'>300,000,000 VNDC</span></div>
                <div className='gap-4 flex items-center pt-6 flex-wrap justify-center sm:justify-start'>
                    {
                        inHome
                            ? <ButtonNao onClick={() => router.push('/contest')} className='px-[18px] text-sm font-semibold w-max !rounded-md'>{t('nao:contest:ranking')}</ButtonNao>
                            : <div className='flex items-center space-x-4'>
                                <ButtonNao onClick={() => router.push('https://goonus.io/dang-ky-tham-gia-dua-top-onus-futures-mua-dau-tien')} className='px-[18px] text-sm font-semibold w-max !rounded-md'>{t('nao:contest:detail_rules')}</ButtonNao>

                                {seasonsFilter.map((item, index) => (
                                    <Link key={index} href={`/contest/${item.season}`}>
                                        <a>
                                            <ButtonNao border className='px-[18px] text-sm font-semibold w-max !rounded-md'>{t(item?.title)}</ButtonNao>
                                        </a>
                                    </Link>
                                ))}
                            </div>
                    }
                    <CardNao customHeight={'sm:min-h-[40px] lg:min-h-[40] min-h-[50px]'} noBg className="flex !flex-row !justify-center md:!justify-start !py-3 items-center gap-3 sm:!bg-none flex-wrap">
                        {renderCountDown()}
                    </CardNao>
                </div>
            </div>
            <div className='relative xl:-top-10 sm:m-auto md:m-auto mt-4'>
                <img src={getS3Url("/images/nao/contest/ic_contest_info.png")} alt="" width={300} height={292} />
            </div>
        </section>
    );
};

export default ContesRules;
