import classNames from 'classnames';
import DatePickerV2 from 'components/common/DatePicker/DatePickerV2';
import Button from 'components/common/V2/ButtonV2/Button';
import InputV2 from 'components/common/V2/InputV2';
import NoData from 'components/common/V2/TableV2/NoData';
import CalendarIcon from 'components/svg/CalendarIcon';
import SvgFire from 'components/svg/Fire';
import SvgFilter from 'components/svg/SvgFilter';
import SvgTrophy from 'components/svg/Trophy';
import useIsomorphicLayoutEffect from 'hooks/useIsomorphicLayoutEffect';
import useQuery from 'hooks/useQuery';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { API_MARKETING_EVENTS } from 'redux/actions/apis';
import { formatTime, getEventImg } from 'redux/actions/utils';
import styled from 'styled-components';
import FetchApi from 'utils/fetch-api';

const STATUSES = {
    all: -1,
    upcoming: 0,
    ongoing: 1,
    ended: 2
};

const StatusFilter = styled.div`
    width: 100%;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    display: flex;
`;

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

/**
 * @param {{timeFilter: {start: Date | null, end: Date | null, status: number}, onSetTime: () => any}} props
 */
const DateFilter = ({ timeFilter, onSetTime }) => {
    const start = timeFilter?.start || undefined;
    const end = timeFilter?.end || undefined;
    const status = timeFilter?.status ?? STATUSES.all;

    return (
        <>
            <div className="space-x-4 hidden mb:flex">
                {/* <Calendar direction="horizontal" months={2} className="single-select" /> */}
                <div className="flex-1">
                    <label className="text-txtSecondary dark:text-txtSecondary-dark hidden mb:block mb-2 text-sm" htmlFor="">
                        Start at
                    </label>
                    <DatePickerV2
                        isCalendar
                        month={2}
                        hasShadow
                        wrapperClassname="!w-full !h-12"
                        colorX="#8694b2"
                        position={'left'}
                        onChange={(time) => onSetTime?.({ start: time })}
                        text={
                            <div className="relative py-3 px-3 flex items-center justify-between bg-gray-12 dark:bg-dark-2 rounded-md w-auto cursor-pointer">
                                {start ? formatTime(start, 'dd/MM/yyyy') : 'all'} <CalendarIcon color="currentColor" />
                            </div>
                        }
                        minDate={status > STATUSES.all && status === STATUSES.upcoming ? new Date() : undefined}
                        maxDate={status > STATUSES.all && status >= STATUSES.ongoing && !end ? new Date() : end}
                    />
                </div>
                <div className="flex-1">
                    <label className="text-txtSecondary dark:text-txtSecondary-dark hidden mb:block mb-2 text-sm" htmlFor="">
                        End at
                    </label>
                    <DatePickerV2
                        isCalendar
                        month={2}
                        hasShadow
                        wrapperClassname="!w-full !h-12"
                        colorX="#8694b2"
                        position={'left'}
                        onChange={(time) => onSetTime?.({ end: time })}
                        text={
                            <div className="relative py-3 px-3 flex items-center justify-between bg-gray-12 dark:bg-dark-2 rounded-md w-auto cursor-pointer">
                                {end ? formatTime(end, 'dd/MM/yyyy') : 'all'} <CalendarIcon color="currentColor" />
                            </div>
                        }
                        minDate={status > STATUSES.all && status <= STATUSES.ongoing && !start ? new Date() : start}
                        maxDate={status > STATUSES.all && status === STATUSES.ended ? new Date() : undefined}
                    />
                </div>
            </div>
            <div className="mb:hidden bg-gray-12 dark:bg-dark-2 p-4 rounded-md text-txtSecondary dark:text-txtSecondary-dark">
                <SvgFilter size={16} color="currentColor" className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
        </>
    );
};


const EventList = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [filter, setFilter] = useState({
        status: STATUSES.all,
        start: undefined,
        end: undefined,
        page: 1,
        search: ''
    });

    const { isLoading, data } = useQuery(
        ['Event list', filter],
        async ({ queryKey: [, filterQuery], signal }) => {
            const { status, start, end, page, search } = filterQuery;
            const res = await FetchApi({
                url: API_MARKETING_EVENTS,
                options: {
                    method: 'GET',
                    signal
                },
                params: {
                    status: status !== -1 ? status : undefined,
                    pageSize: 10,
                    'filters[startTime]': start,
                    'filters[endTime]': end,
                    currentPage: page,
                    search
                }

            });
            return res.data;
        },
        {
            persist: false,
            ttl: '2h'
        }
    );

    useIsomorphicLayoutEffect(() => {
        if (!router.isReady) {
            return;
        }

        const statusFilter = +router.query.status ?? STATUSES.all;
        if (statusFilter <= STATUSES.ended && statusFilter >= STATUSES.all) {
            setFilter((old) => ({ ...old, status: statusFilter, }));
        }
    }, [router.isReady, router.query]);

    const onFilterStatus = (status = -1) => {
        router.replace(
            {
                query: {
                    ...router.query,
                    status
                }
            },
            null,
            {
                shallow: true
            }
        );
    };

    const onSetTime = (time) => {
        setFilter((old) => ({ ...old, ...time }));
    };

    return (
        <div className="">
            <h1 className="font-semibold text-xl mb:text-4xl">{t('marketing_events:title')}</h1>
            <StatusFilter className="py-3 mb:py-6 space-x-2 mb:space-x-3 no-scrollbar">
                {Object.keys(STATUSES).map((status, idx) => (
                    <button
                        type="BUTTON"
                        className={classNames(
                            'flex space-x-1 justify-center h-full py-2 px-3 mb:px-4 text-sm sm:text-base rounded-md cursor-pointer whitespace-nowrap bg-gray-13 dark:bg-dark-4 dark:text-txtSecondary-dark text-txtSecondary capitalize',
                            { '!bg-teal/10 !text-teal font-semibold': filter.status === idx - 1 }
                        )}
                        key={status}
                        onClick={() => onFilterStatus(idx - 1)}
                    >
                        {idx - 1 === STATUSES.ongoing && <SvgFire />}
                        <span>{t(`marketing_events:${status}`)}</span>
                    </button>
                ))}
            </StatusFilter>
            <div className="flex -mx-1 mb:-mx-3 flex-wrap">
                <div className="flex items-end mb:order-2 order-1 flex-1 px-1 mb:px-3 space-x-4">
                    <div className="w-full">
                        <label className="text-txtSecondary dark:text-txtSecondary-dark hidden mb:block mb-2 text-sm" htmlFor="">
                            Search event
                        </label>
                        <InputV2 className="pb-0 w-full" placeholder="search" />
                    </div>
                    <Button className="hidden mb:block w-fit px-3 py-4"> Search </Button>
                </div>
                <div className="px-1 mb:px-3 mb:flex-1 mb:order-1 order-2">
                    <DateFilter timeFilter={filter} onSetTime={onSetTime} />
                </div>
            </div>
            <div className="py-4 mb:py-5">
                {data?.event?.length ? (
                    <>
                        {data?.events?.map((event) => (
                            <div className="relative flex mt-4 mb:mt-7 rounded-xl overflow-hidden flex-wrap mb:flex-nowrap bg-white dark:bg-dark-4 border dark:border-none border-divider shadow-card_light">
                                <div className="absolute bg-red text-white px-2 text-xs rounded-sm top-4 right-4 z-[1]">Ends in 12:00:00</div>
                                <ImageWrapper>
                                    <Image src={getEventImg(event.thumbnailImgEndpoint)} width={503} height={265} className="object-cover bg-gray" />
                                </ImageWrapper>
                                <div className="p-4 mb:px-7 mb:py-12 mb:w-7/12">
                                    <div className="flex flex-wrap gap-2 mb:gap-3 items-center text-txtSecondary dark:text-txtSecondary-dark text-xs mb:text-sm">
                                        <div className="bg-yellow-2/10 text-yellow-2 px-4 py-1 rounded-full">Ongoing</div>
                                        <span className="w-full mb:w-auto">
                                            {formatTime(event.startTime, 'HH:mm:ss dd/MM/yyyy')} - {formatTime(event.endTime, 'HH:mm:ss dd/MM/yyyy')}
                                        </span>
                                    </div>
                                    <div className="mt-2 mb:mt-3 font-semibold text-base mb:text-xl line-clamp-2">{event.title}</div>
                                    <div className="mt-4 mb:mt-5 flex items-center space-x-1 mb:space-x-2 font-semibold text-sm sm:text-base">
                                        <SvgTrophy />
                                        <span>Total prizes</span>
                                    </div>
                                    <div className="mt-2">
                                        {/* <div className="text-txtSecondary dark:text-txtSecondary-dark text-xs mb:text-sm line-through">{event.prize}</div> */}
                                        <div className="font-semibold text-sm mb:text-base">{event.prize}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        <div className="mt-6 py-[72px] px-[53px] flex items-center flex-col justify-center">
                            <NoData isAuth={true} isSearch />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default EventList;
