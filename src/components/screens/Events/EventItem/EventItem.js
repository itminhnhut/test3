import SvgTrophy from 'components/svg/Trophy';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { STATUSES } from '../Home/EventList';
import { useTranslation } from 'next-i18next';
import Countdown from 'react-countdown';
import { formatTime, getEventImg } from 'redux/actions/utils';
import classNames from 'classnames';
import Image from 'next/image';

const ImageWrapper = styled.div`
    width: 100%;
    @media screen and (min-width: 820px) {
        width: 41.666667% !important;
    }
    > span {
        width: 100% !important;
        height: 100% !important;
    }
`;

const getStatus = (start, end) => {
    const now = Date.now();
    start = new Date(start).getTime();
    end = new Date(end).getTime();

    return start > now ? STATUSES.upcoming : end && end < now ? STATUSES.ended : STATUSES.ongoing;
};

/**
 *
 * @param {{ _id: string, thumbnailImgEndpoint?: string, bannerImgEndpoint?: string, title: string, startTime: string , endTime: string, anticipate: bool, prize: string, postLink: string, isHot: bool, creatorName: string, priority: number, isHidden: bool }} props
 */
const EventItem = (props) => {
    const { t } = useTranslation();
    const getStatusBadge = (start, end) => {
        const status = getStatus(start, end);

        return (
            <div
                className={classNames('px-4 py-1 rounded-full', {
                    'bg-green-2/10 text-green-2': status === STATUSES.upcoming,
                    'bg-yellow-2/10 text-yellow-2': status === STATUSES.ongoing,
                    'bg-divider dark:bg-divider-dark text-txtSecondary dark:text-txtSecondary-dark': status === STATUSES.ended
                })}
            >
                {t(`marketing_events:${Object.keys(STATUSES)[status + 1]}`)}
            </div>
        );
    };

    const timeRenderer = (format) => {
        if (format.days) {
            if (format.days === 1) {
                return `${format.days} ${t('common:day')}`;
            }
            return `${format.days} ${t('common:days')}`;
        }
        return `${format.hours}:${format.minutes}:${format.seconds}`;
    };
    const getUnfinishedBagde = (start, end) => {
        const status = getStatus(start, end);

        if (status === STATUSES.upcoming) {
            return (
                <div className="absolute bg-green-2 text-white px-2 text-xs rounded-sm top-4 right-4 z-[1]">
                    {t('marketing_events:starts_in')} <Countdown date={start} renderer={timeRenderer} />
                </div>
            );
        } else if (end && status === STATUSES.ongoing) {
            return (
                <div className="absolute bg-red-2 text-white px-2 text-xs rounded-sm top-4 right-4 z-[1]">
                    {t('marketing_events:ends_in')} <Countdown date={end} renderer={timeRenderer} />
                </div>
            );
        }

        return '';
    };

    return (
        <Link href={props.postLink || '#'}>
            <a className="relative flex mt-4 mb:mt-7 rounded-xl overflow-hidden flex-wrap mb:flex-nowrap bg-white dark:bg-dark-4 border dark:border-none border-divider shadow-card_light">
                {getUnfinishedBagde(props.startTime, props.endTime)}
                <ImageWrapper>
                    <Image src={getEventImg(props.thumbnailImgEndpoint)} width={503} height={265} className="object-cover bg-gray" />
                </ImageWrapper>
                <div className="p-4 mb:px-7 mb:py-12 mb:w-7/12">
                    <div className="flex flex-wrap gap-2 mb:gap-3 items-center text-txtSecondary dark:text-txtSecondary-dark text-xs mb:text-sm">
                        {getStatusBadge(props.startTime, props.endTime)}
                        <span className="w-full mb:w-auto">
                            {formatTime(props.startTime, 'HH:mm dd/MM/yyyy')} {props.endTime && `- ${formatTime(props.endTime, 'HH:mm dd/MM/yyyy')}`}
                        </span>
                    </div>
                    <div className="mt-2 mb:mt-3 font-semibold text-base mb:text-xl line-clamp-2">{props.title}</div>
                    <div className="mt-4 mb:mt-5 flex items-center space-x-1 mb:space-x-2 font-semibold text-sm sm:text-base">
                        <SvgTrophy />
                        <span>{t('marketing_events:total_prizes')}</span>
                    </div>
                    <div className="mt-2">
                        {/* <div className="text-txtSecondary dark:text-txtSecondary-dark text-xs mb:text-sm line-through">{props.prize}</div> */}
                        <div className="font-semibold text-sm mb:text-base">{props.prize}</div>
                    </div>
                </div>
            </a>
        </Link>
    );
};

export const SkeletonEventItem = () => {
    return (
        <div className="relative mt-4 mb:mt-7 rounded-xl bg-white dark:bg-dark-4 border dark:border-none border-divider shadow-card_light">
            <div className="animate-pulse overflow-hidden flex flex-wrap mb:flex-nowrap">
                <ImageWrapper>
                    <div className="w-full pt-[calc(55%)] relative">
                        <div className="absolute h-full w-full top-0 bg-gray-4 dark:bg-dark-2"></div>
                    </div>
                </ImageWrapper>
                <div className="p-4 mb:px-7 mb:py-12 mb:w-7/12">
                    <div className="flex items-center flex-wrap gap-2 mb:gap-3">
                        <div className="h-6 w-32 rounded-full bg-gray-4 dark:bg-dark-2"></div>
                        <div className="h-4 w-64 mb:w-72 rounded-full bg-gray-4 dark:bg-dark-2"></div>
                    </div>
                    <div className="mt-2 mb:mt-3 h-4 w-full rounded-full bg-gray-4 dark:bg-dark-2"></div>
                    <div className="mt-1 h-4 w-full rounded-full bg-gray-4 dark:bg-dark-2"></div>
                    <div className="mt-4 mb:mt-5 h-4 w-24 rounded-full bg-gray-4 dark:bg-dark-2"></div>
                    <div className="mt-2 h-4 w-full mb:w-96 rounded-full bg-gray-4 dark:bg-dark-2"></div>
                </div>
            </div>
        </div>
    );
};

export default EventItem;
