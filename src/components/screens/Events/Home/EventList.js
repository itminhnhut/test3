import classNames from 'classnames';
import DatePickerV2 from 'components/common/DatePicker/DatePickerV2';
import RePagination from 'components/common/ReTable/RePagination';
import Button from 'components/common/V2/ButtonV2/Button';
import InputV2 from 'components/common/V2/InputV2';
import NoData from 'components/common/V2/TableV2/NoData';
import CalendarIcon from 'components/svg/CalendarIcon';
import SvgFire from 'components/svg/Fire';
import SvgFilter from 'components/svg/SvgFilter';
import SvgTrophy from 'components/svg/Trophy';
import { BREAK_POINTS } from 'constants/constants';
import useIsomorphicLayoutEffect from 'hooks/useIsomorphicLayoutEffect';
import useQuery from 'hooks/useQuery';
import useWindowSize from 'hooks/useWindowSize';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { API_MARKETING_EVENTS } from 'redux/actions/apis';
import { formatTime } from 'redux/actions/utils';
import styled from 'styled-components';
import FetchApi from 'utils/fetch-api';
import ModalV2 from 'components/common/V2/ModalV2';
import MobileDatePicker from './MobileDatePicker';
import { X } from 'react-feather';
import { addDays } from 'date-fns';
import EventItem, { SkeletonEventItem } from '../EventItem/EventItem';

const PAGE_SIZE = 10;
export const STATUSES = {
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

const Flex = styled.div`
    display: flex;
`;

/**
 * @param {{timeFilter: {start: Date | null, end: Date | null, status: number}, onSetTime: () => any}} props
 */
const DateFilter = ({ timeFilter, onSetTime }) => {
    const start = timeFilter?.start || undefined;
    const end = timeFilter?.end || undefined;
    const status = timeFilter?.status ?? STATUSES.all;

    const [showDateFilterModal, setShowDateFilterModal] = useState(false);
    const { t } = useTranslation();

    return (
        <>
            <DateFilterModal timeFilter={timeFilter} onSetTime={onSetTime} isVisible={showDateFilterModal} onClose={() => setShowDateFilterModal(false)} />
            <div className="space-x-4 hidden mb:flex">
                {/* <Calendar direction="horizontal" months={2} className="single-select" /> */}
                <div className="flex-1">
                    <label className="text-txtSecondary dark:text-txtSecondary-dark hidden mb:block mb-2 text-sm" htmlFor="">
                        {t('marketing_events:filter:starts_in')}
                    </label>
                    <DatePickerV2
                        isCalendar
                        month={2}
                        hasShadow
                        wrapperClassname="!w-full !h-12"
                        colorX="#8694b2"
                        position="left"
                        onChange={(time) => onSetTime?.({ start: time })}
                        text={
                            <div className="relative py-3 px-3 flex items-center justify-between bg-gray-12 dark:bg-dark-2 rounded-md w-auto cursor-pointer text-txtSecondary dark:text-txtSecondary-dark">
                                {start ? <span className="text-txtPrimary dark:text-txtPrimary-dark">{formatTime(start, 'dd/MM/yyyy')}</span> : 'all'}
                                {start ? (
                                    <div className="" onClick={() => onSetTime?.({ start: undefined })}>
                                        <X size={16} color="#8694b2" />
                                    </div>
                                ) : (
                                    <CalendarIcon color="currentColor" />
                                )}
                            </div>
                        }
                        minDate={status > STATUSES.all && status === STATUSES.upcoming ? new Date() : undefined}
                        maxDate={status > STATUSES.all && status >= STATUSES.ongoing && !end ? new Date() : end}
                        ignoreAuth
                    />
                </div>
                <div className="flex-1">
                    <label className="text-txtSecondary dark:text-txtSecondary-dark hidden mb:block mb-2 text-sm" htmlFor="">
                        {t('marketing_events:filter:ends_in')}
                    </label>
                    <DatePickerV2
                        isCalendar
                        month={2}
                        hasShadow
                        wrapperClassname="!w-full !h-12"
                        colorX="#8694b2"
                        position="left"
                        onChange={(time) => onSetTime?.({ end: addDays(time, 1) })}
                        text={
                            <div className="relative py-3 px-3 flex items-center justify-between bg-gray-12 dark:bg-dark-2 rounded-md w-auto cursor-pointer text-txtSecondary dark:text-txtSecondary-dark">
                                {/* end date must be later than user's selected one for filtering */}
                                {/* eg: user select 20/06/2023 => using 12:00 AM 21/06/2023 */}
                                {end ? <span className="text-txtPrimary dark:text-txtPrimary-dark">{formatTime(addDays(end, -1), 'dd/MM/yyyy')}</span> : 'all'}
                                {end ? (
                                    <div className="" onClick={() => onSetTime?.({ end: undefined })}>
                                        <X size={16} color="#8694b2" />
                                    </div>
                                ) : (
                                    <CalendarIcon color="currentColor" />
                                )}
                            </div>
                        }
                        minDate={status > STATUSES.all && status <= STATUSES.ongoing && !start ? new Date() : start}
                        maxDate={status > STATUSES.all && status === STATUSES.ended ? new Date() : undefined}
                        ignoreAuth
                    />
                </div>
            </div>
            <div
                className="mb:hidden bg-gray-12 dark:bg-dark-2 p-4 rounded-md text-txtSecondary dark:text-txtSecondary-dark"
                onClick={() => setShowDateFilterModal(true)}
            >
                <SvgFilter size={16} color="currentColor" className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
        </>
    );
};

const EventList = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const searchRef = useRef(null);
    const { width } = useWindowSize();
    const [filter, setFilter] = useState({
        status: STATUSES.all,
        start: undefined,
        end: undefined,
        page: 1,
        pageSize: PAGE_SIZE,
        search: ''
    });

    const isMobile = width < BREAK_POINTS.mb;

    useEffect(() => {
        setFilter((old) => ({ ...old, page: 1, pageSize: PAGE_SIZE }));
    }, [isMobile]);

    const { isLoading, data } = useQuery(
        ['Event list', filter, router.locale],
        async ({ queryKey: [, filterQuery], signal }) => {
            const { status, start, end, page, search, pageSize } = filterQuery;
            const res = await FetchApi({
                url: API_MARKETING_EVENTS,
                options: {
                    method: 'GET',
                    signal
                },
                params: {
                    status: status !== -1 ? status : undefined,
                    locale: router.locale.toUpperCase(),
                    pageSize,
                    'filters[fromTime]': start,
                    'filters[toTime]': end,
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

    const hasNext = data?.total > filter.page * PAGE_SIZE;

    useIsomorphicLayoutEffect(() => {
        if (!router.isReady) {
            return;
        }

        const statusFilter = +router.query.status ?? STATUSES.all;
        if (statusFilter <= STATUSES.ended && statusFilter >= STATUSES.all) {
            setFilter((old) => ({ ...old, status: statusFilter }));
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

    const onSearch = (search) => {
        setFilter((old) => ({ ...old, search }));
    };

    return (
        <div className="">
            <h1 className="font-semibold text-xl mb:text-4xl">{t('marketing_events:title')}</h1>
            <StatusFilter className="py-3 mb:py-6 space-x-2 mb:space-x-3 no-scrollbar">
                {Object.keys(STATUSES).map((status) => (
                    <button
                        type="BUTTON"
                        className={classNames(
                            'flex space-x-1 justify-center h-full py-2 px-3 mb:px-4 text-sm sm:text-base rounded-md cursor-pointer whitespace-nowrap bg-gray-13 dark:bg-dark-4 dark:text-txtSecondary-dark text-txtSecondary capitalize',
                            { '!bg-teal/10 !text-teal font-semibold': filter.status === STATUSES[status] },
                            STATUSES[status] === STATUSES.all ? 'order-1' : STATUSES[status] === STATUSES.ongoing ? 'order-2' : 'order-3'
                        )}
                        key={status}
                        onClick={() => onFilterStatus(STATUSES[status])}
                    >
                        {STATUSES[status] === STATUSES.ongoing && <SvgFire />}
                        <span>{t(`marketing_events:${status}`)}</span>
                    </button>
                ))}
            </StatusFilter>
            <Flex className="-mx-1 mb:-mx-3">
                <Flex className="items-end mb:order-2 order-1 flex-1 px-1 mb:px-3 space-x-4">
                    <div className="w-full">
                        <label className="text-txtSecondary dark:text-txtSecondary-dark hidden mb:block mb-2 text-sm" htmlFor="">
                            {t('marketing_events:filter:search')}
                        </label>
                        <InputV2 classNameInput="w-full" className="pb-0 w-full" placeholder="search" ref={searchRef} onHitEnterButton={onSearch} />
                    </div>
                    <Button onClick={() => searchRef.current && onSearch(searchRef.current.value)} className="hidden mb:block w-fit px-3 whitespace-nowrap">
                        {t('common:search')}
                    </Button>
                </Flex>
                <div className="px-1 mb:px-3 mb:flex-1 mb:order-1 order-2">
                    <DateFilter timeFilter={filter} onSetTime={onSetTime} />
                </div>
            </Flex>
            <div className="py-4 mb:py-5">
                {!isLoading && (
                    <>
                        {data?.events?.length ? (
                            <>
                                {data.events?.map((event) => (
                                    <EventItem {...event} key={event['_id']} />
                                ))}
                                {isMobile ? (
                                    <>
                                        {hasNext && (
                                            <div
                                                className="mt-6 text-teal font-semibold text-sm text-center"
                                                onClick={() =>
                                                    setFilter((old) => ({
                                                        ...old,
                                                        pageSize: old.pageSize + PAGE_SIZE > data.total ? data.total : old.pageSize + PAGE_SIZE
                                                    }))
                                                }
                                            >
                                                {t('common:read_more')}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="max-w-[13rem] mt-8 mx-auto">
                                        <RePagination
                                            pagingPrevNext={{
                                                page: filter.page - 1,
                                                hasNext: hasNext,
                                                onChangeNextPrev: (offset) => setFilter((old) => ({ ...old, page: old.page + offset }))
                                            }}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="mt-6 py-[72px] px-[53px] flex items-center flex-col justify-center">
                                    <NoData isAuth={true} isSearch />
                                </div>
                            </>
                        )}
                    </>
                )}

                {isLoading && (
                    <>
                        <SkeletonEventItem />
                        <SkeletonEventItem />
                        <SkeletonEventItem />
                        <SkeletonEventItem />
                        <SkeletonEventItem />
                        <SkeletonEventItem />
                        <SkeletonEventItem />
                        <SkeletonEventItem />
                        <SkeletonEventItem />
                    </>
                )}
            </div>
        </div>
    );
};

/**
 * @param {{timeFilter: {start: Date | null, end: Date | null, status: number}, onSetTime: () => any, isVisible: boolean, onClose: () => any}} props
 */
const DateFilterModal = ({ timeFilter, onSetTime, isVisible, onClose }) => {
    const start = timeFilter?.start || undefined;
    const end = timeFilter?.end || undefined;
    const status = timeFilter?.status ?? STATUSES.all;

    const { t } = useTranslation();

    return (
        <ModalV2
            isVisible={isVisible}
            onBackdropCb={onClose}
            className="w-full !translate-x-0 !translate-y-0 !max-w-none !top-auto !left-0 !bottom-0 !rounded-none"
        >
            <h3 className="mb-4 text-xl font-semibold">{t('common:optional')}</h3>

            <div className="my-2">
                <label className="text-txtSecondary dark:text-txtSecondary-dark mb-2 text-xs" htmlFor="">
                    {t('marketing_events:filter:starts_in')}
                </label>
                <MobileDatePicker
                    months={1}
                    hasShadow
                    wrapperClassname="!w-full !h-12"
                    colorX="#8694b2"
                    position={'left'}
                    onChange={(time) => onSetTime?.({ start: time })}
                    text={
                        <div className="relative py-3 px-3 flex items-center justify-between bg-gray-12 dark:bg-dark-2 rounded-md w-auto cursor-pointer text-txtSecondary dark:text-txtSecondary-dark">
                            {start ? <span className="text-txtPrimary dark:text-txtPrimary-dark">{formatTime(start, 'dd/MM/yyyy')}</span> : 'all'}
                            {start ? (
                                <div className="" onClick={() => onSetTime?.({ start: undefined })}>
                                    <X size={16} color="#8694b2" />
                                </div>
                            ) : (
                                <CalendarIcon color="currentColor" />
                            )}
                        </div>
                    }
                    minDate={status > STATUSES.all && status === STATUSES.upcoming ? new Date() : undefined}
                    maxDate={status > STATUSES.all && status >= STATUSES.ongoing && !end ? new Date() : end}
                />
            </div>
            <div className="mt-2">
                <label className="text-txtSecondary dark:text-txtSecondary-dark mb-2 text-xs" htmlFor="">
                    {t('marketing_events:filter:ends_in')}
                </label>
                <MobileDatePicker
                    months={1}
                    hasShadow
                    wrapperClassname="!w-full !h-12"
                    colorX="#8694b2"
                    position={'left'}
                    onChange={(time) => onSetTime?.({ end: addDays(time, 1) })}
                    text={
                        <div className="relative py-3 px-3 flex items-center justify-between bg-gray-12 dark:bg-dark-2 rounded-md w-auto cursor-pointer text-txtSecondary dark:text-txtSecondary-dark">
                            {/* end date must be later than user's selected one for filtering */}
                            {/* eg: user select 20/06/2023 => using 12:00 AM 21/06/2023 */}
                            {end ? <span className="text-txtPrimary dark:text-txtPrimary-dark">{formatTime(addDays(end, -1), 'dd/MM/yyyy')}</span> : 'all'}
                            {end ? (
                                <div className="" onClick={() => onSetTime?.({ end: undefined })}>
                                    <X size={16} color="#8694b2" />
                                </div>
                            ) : (
                                <CalendarIcon color="currentColor" />
                            )}
                        </div>
                    }
                    minDate={status > STATUSES.all && status <= STATUSES.ongoing && !start ? new Date() : start}
                    maxDate={status > STATUSES.all && status === STATUSES.ended ? new Date() : undefined}
                />
            </div>
            <Button onClick={onClose} variants="primary" className="mt-8">
                {t('common:search')}
            </Button>
        </ModalV2>
    );
};

export default EventList;
