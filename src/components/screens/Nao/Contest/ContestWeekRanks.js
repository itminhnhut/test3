import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
    TextLiner,
    CardNao,
    Table,
    Column,
    getColor,
    renderPnl,
    Tooltip,
    capitalize,
    ImageNao,
    VolumeTooltip,
    CPnl,
    ButtonNaoV2
} from 'components/screens/Nao/NaoStyle';
import { useTranslation } from 'next-i18next';
import useWindowSize from 'hooks/useWindowSize';
import fetchApi from 'utils/fetch-api';
import { API_CONTEST_GET_RANK_WEEKLY_PNL, API_CONTEST_GET_RANK_WEEKLY_VOLUME } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import { formatNumber, getS3Url, formatTime } from 'redux/actions/utils';
import Skeletor from 'components/common/Skeletor';
import TickFbIcon from 'components/svg/TickFbIcon';
import { NoDataDarkIcon, NoDataLightIcon } from 'components/common/V2/TableV2/NoData';
import QuestionMarkIcon from 'components/svg/QuestionMarkIcon';
import RePagination from 'components/common/ReTable/RePagination';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';
import { addDays, endOfDay, endOfWeek } from 'date-fns';
import useUpdateEffect from 'hooks/useUpdateEffect';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { debounce } from 'lodash';

const ContestWeekRanks = ({
    previous,
    contest_id,
    total_weekly_rewards,
    quoteAsset: q,
    lastUpdated,
    top_ranks_week,
    userID,
    minVolumeInd,
    weekly_contest_time: { start, end },
    showPnl,
    sort,
    converted_vol,
    isTotalPnl
}) => {
    const [filter, setFilter] = useState({
        weekly: 0,
        type: sort
    });
    const [quoteAsset, setQuoteAsset] = useState(q);
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const { width } = useWindowSize();
    const [dataSource, setDataSource] = useState([]);
    const [top3, setTop3] = useState([]);
    const [loading, setLoading] = useState(true);
    const lastUpdatedTime = useRef(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(limit);
    const isMobile = width <= 640;
    const limit = isMobile ? 10 : 20;
    const rank = 'individual_rank_volume';
    const checked = useRef(false);
    const router = useRouter();
    const timer = useRef();

    useEffect(() => {
        setPage(1);
        setPageSize(limit);
    }, [isMobile]);

    useEffect(() => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            getRanks();
        }, 100);
    }, [contest_id, filter]);

    const onReadMore = () => {
        setPageSize((old) => {
            const newSize = pageSize + limit;
            return newSize >= dataSource.length ? dataSource.length : newSize;
        });
    };

    const getRanks = async () => {
        try {
            const { data: originalData, status } = await fetchApi({
                url: filter.type === 'volume' ? API_CONTEST_GET_RANK_WEEKLY_VOLUME : API_CONTEST_GET_RANK_WEEKLY_PNL,
                params: { contestId: contest_id, quoteAsset, weekId: filter.weekly + 1 }
            });
            const data = originalData?.users;
            setTotal(data.length);
            if (data && status === ApiStatus.SUCCESS) {
                lastUpdatedTime.current = originalData?.last_time_update;
                const dataFilter = data.filter((rs) => rs?.[rank] > 0 && rs?.[rank] < 4);
                const sliceIndex = dataFilter.length > 3 ? 3 : dataFilter.length;
                const _top3 = data.slice(0, sliceIndex);
                const _dataSource = data.slice(sliceIndex);
                setTop3(_top3);
                setDataSource(_dataSource);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const onFilter = (key, value) => {
        setLoading(true);
        setFilter({ ...filter, [key]: value });
    };

    const renderName = (data, item) => {
        return (
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[50%] bg-hover dark:bg-hover-dark flex items-center justify-center">
                    <ImageNao
                        frame={item?.avatar_frame}
                        className="rounded-[50%] object-cover min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px]"
                        src={item?.avatar}
                        width="32"
                        height="32"
                        alt=""
                    />
                </div>
                <div>{capitalize(data)}</div>
                {item?.is_onus_master && <TickFbIcon size={16} />}
            </div>
        );
    };

    const renderRank = (data, item) => {
        const _rank = data || '-';
        return (
            <div className="w-6 h-6 flex-shrink-0 text-center relative font-SourceCodePro">
                {data && data <= top_ranks_week ? (
                    <>
                        <img src={getS3Url('/images/nao/contest/ic_top_teal.png')} className="w-6 h-6" width="24" height="24" alt="" />
                        <span className="font-bold text-[0.625rem] leading-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute text-white">
                            {_rank}
                        </span>
                    </>
                ) : (
                    <span>{_rank}</span>
                )}
            </div>
        );
    };

    useEffect(() => {
        if (previous) {
            checked.current = false;
            setFilter({ ...filter, weekly: 0, type: sort });
        }
    }, [previous, sort]);

    useUpdateEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        urlParams.set('weekly', filter.type === 'pnl' ? 'pnl' : 'volume');
        const url = `/${router.locale}/contest${router.query.season ? '/' + router.query.season : ''}?${urlParams.toString()}`;
        window.history.replaceState(null, null, url);
    }, [filter.type]);

    const weeks = useMemo(() => {
        return getWeeksInRange(new Date(start), new Date(end));
    }, [start]);

    const renderWeeksTab = useCallback(() => {
        let rs = [];
        const now = Date.now();
        for (let i = 0; i < weeks.numWeeks; i++) {
            const start = new Date(weeks.weeks[i].start).getTime();
            const end = new Date(weeks.weeks[i].end).getTime();
            if (now > start && now < end && !checked.current && !previous) {
                checked.current = true;
                onFilter('weekly', i);
            }
            rs.push(
                <TabItem key={i} isActive={filter.weekly === i} V2 value={i} onClick={() => onFilter('weekly', i)} className="!px-0 space-x-1">
                    <span>{t('nao:contest:week', { value: i + 1 })}</span>
                    <span className="lowercase">({now < start ? t('nao:coming_soon_2') : now > start && now < end ? t('nao:going_on') : t('nao:ended')})</span>
                </TabItem>
            );
        }
        return rs;
    }, [weeks, filter, previous]);

    const renderVolume = (item, className = '') => {
        return <VolumeTooltip item={item} className={className} tooltip={converted_vol} />;
    };

    const dataFilter = dataSource.slice((page - 1) * pageSize, page * pageSize);

    return (
        <section className="contest_individual_ranks pb-12 sm:pb-20 mt-[26px] md:mt-0">
            <Tooltip className="!px-3 !py-1 sm:min-w-[282px] sm:!max-w-[282px]" arrowColor="transparent" id="tooltip-weekly-rank">
                <div
                    className="text-sm"
                    dangerouslySetInnerHTML={{
                        __html: minVolumeInd?.isHtml ? t('nao:contest:tooltip_personal', { value: minVolumeInd[language] }) : minVolumeInd[language]
                    }}
                ></div>
            </Tooltip>
            <div className="flex justify-between flex-wrap gap-4 text-sm sm:text-base">
                <div className="flex items-center space-x-2">
                    <TextLiner className="!text-txtPrimary dark:!text-txtPrimary-dark">{t('nao:contest:weekly_ranking')}</TextLiner>
                    <div data-tip="" data-for="tooltip-weekly-rank" className="cursor-pointer">
                        <QuestionMarkIcon isFilled size={16} />
                    </div>
                </div>
                {showPnl && (
                    <div className="flex items-center space-x-2 text-sm">
                        <ButtonNaoV2 active={filter.type === 'volume'} onClick={() => onFilter('type', 'volume')}>
                            {t('nao:contest:volume')}
                        </ButtonNaoV2>
                        <ButtonNaoV2 active={filter.type === 'pnl'} onClick={() => onFilter('type', 'pnl')}>
                            {isTotalPnl ? t('nao:contest:pnl') : t('nao:contest:per_pnl')}
                        </ButtonNaoV2>
                    </div>
                )}
            </div>

            <div className="pt-6 sm:pt-8 text-sm sm:text-base">
                <span className="font-semibold">{t('nao:contest:rules')}</span>:&nbsp;
                <span>{t('nao:contest:weekly_ranking_desc', { value: total_weekly_rewards })}</span>
            </div>

            <div className="border-b border-divider dark:border-divider-dark pt-8 sm:pt-12 mb-6 sm:mb-8 w-full">
                <Tabs tab={filter.weekly} className="text-sm sm:text-base space-x-6">
                    {renderWeeksTab()}
                </Tabs>
            </div>

            <div className="text-txtSecondary dark:text-txtSecondary-dark mb-6 sm:mb-8 text-sm sm:text-base">
                {t('common:time')}:{' '}
                {`${formatTime(weeks.weeks[filter.weekly].start, 'dd/MM/yyyy')} - ${formatTime(addDays(weeks.weeks[filter.weekly].end, 1), 'dd/MM/yyyy')}`}
            </div>

            {top3.length > 0 && (
                <div className="flex flex-wrap gap-3 sm:gap-6 text-sm sm:text-base">
                    {top3.map((item, index) => {
                        return (
                            <CardNao key={index} className="!p-4 sm:!p-5">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center space-x-4">
                                        <div className="min-w-[4rem] min-h-[4rem] rounded-[50%] p-1 ring-[1.5px] ring-teal flex items-center justify-center">
                                            <ImageNao frame={item?.avatar_frame} className="object-cover w-14 h-14 rounded-full" src={item?.avatar} alt="" />
                                        </div>
                                        <div className="sm:space-y-[2px] flex flex-col" style={{ wordBreak: 'break-word' }}>
                                            <div className="flex items-center gap-2 text-lg font-semibold capitalize">
                                                <span>{capitalize(item?.name)}</span>
                                                {item?.is_onus_master && <TickFbIcon size={16} />}
                                            </div>
                                            <span className="cursor-pointer text-txtSecondary dark:text-txtSecondary-dark">{item?.[userID]}</span>
                                        </div>
                                    </div>
                                    <div className="text-5xl sm:text-6xl font-semibold pb-0 italic">{item?.[rank] > 0 ? `#${index + 1}` : '-'}</div>
                                </div>
                                <div className="h-0 w-full my-4"></div>
                                <div className="flex flex-col mt-auto space-y-1 rounded-lg">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="text-txtSecondary dark:text-txtSecondary-dark">
                                            {t('nao:contest:volume')} {quoteAsset}
                                        </div>
                                        {renderVolume(item)}
                                    </div>
                                    <div className="flex items-center justify-between gap-2 pt-2 sm:pt-4">
                                        <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('common:ext_gate:time')}</div>
                                        <span className="font-semibold">
                                            {formatNumber(item?.time, 2)} {t('common:hours')}
                                        </span>
                                    </div>
                                    {filter.type === 'pnl' ? (
                                        <div className="flex items-center justify-between gap-2 pt-2 sm:pt-4">
                                            <div className="text-txtSecondary dark:text-txtSecondary-dark">
                                                {isTotalPnl ? t('nao:contest:pnl') : t('nao:contest:per_pnl')}
                                            </div>
                                            <CPnl item={item} isTotal={isTotalPnl} />
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between gap-2 pt-2 sm:pt-4">
                                            <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:total_trades')}</div>
                                            <span className={`font-semibold`}>{formatNumber(item?.total_order)}</span>
                                        </div>
                                    )}
                                </div>
                            </CardNao>
                        );
                    })}
                </div>
            )}
            {width <= 640 ? (
                <>
                    {Array.isArray(dataSource) && dataSource?.length > 0 ? (
                        dataFilter.map((item, index) => {
                            return (
                                <CardNao key={index} className={`flex gap-4 sm:gap-6 p-4 mt-3`}>
                                    <div className="flex-1 text-sm sm:text-base">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <ImageNao
                                                    frame={item?.avatar_frame}
                                                    className="rounded-[50%] object-cover w-9 h-9 flex-shrink-0"
                                                    src={item?.avatar}
                                                    width="36"
                                                    height="36"
                                                    alt=""
                                                />
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <label className="font-semibold capitalize">{capitalize(item?.name)}</label>
                                                        {item?.is_onus_master && <TickFbIcon size={16} />}
                                                    </div>
                                                    <div className="cursor-pointer text-txtSecondary dark:text-txtSecondary-dark">ID: {item?.[userID]}</div>
                                                </div>
                                            </div>
                                            <div className="min-w-[1.5rem] text-txtSecondary dark:text-txtSecondary-dark">
                                                {loading ? (
                                                    <Skeletor width={24} height={24} circle />
                                                ) : item?.[rank] && item?.[rank] <= top_ranks_week ? (
                                                    <div className="w-6 h-6 flex-shrink-0 text-center relative font-SourceCodePro">
                                                        <img
                                                            src={getS3Url('/images/nao/contest/ic_top_teal.png')}
                                                            className="w-6 h-6"
                                                            width="24"
                                                            height="24"
                                                            alt=""
                                                        />
                                                        <span className="font-bold text-[0.625rem] leading-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute text-white">
                                                            {item?.[rank]}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    item?.[rank] || '-'
                                                )}
                                            </div>
                                        </div>
                                        <div className="h-8"></div>
                                        <div className="flex items-center justify-between">
                                            <label className="text-txtSecondary dark:text-txtSecondary-dark">
                                                {t('nao:contest:volume')} {quoteAsset}
                                            </label>
                                            {renderVolume(item, 'text-right')}
                                        </div>
                                        <div className="flex items-center justify-between pt-3">
                                            <label className="text-txtSecondary dark:text-txtSecondary-dark">{t('common:ext_gate:time')}</label>
                                            <span className="text-right font-semibold">
                                                {formatNumber(item?.time, 2)} {t('common:hours')}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between pt-3">
                                            <label className="text-txtSecondary dark:text-txtSecondary-dark">
                                                {t(`nao:contest:${filter.type === 'pnl' ? (isTotalPnl ? 'pnl' : 'per_pnl') : 'total_trades'}`)}
                                            </label>
                                            {filter.type === 'pnl' ? (
                                                <CPnl item={item} isTotal={isTotalPnl} className={'text-right'} />
                                            ) : (
                                                <span className={`text-right font-semibold`}>{formatNumber(item?.total_order)}</span>
                                            )}
                                        </div>
                                    </div>
                                </CardNao>
                            );
                        })
                    ) : (
                        <div className={`flex items-center justify-center flex-col m-auto pt-8`}>
                            <div className="block dark:hidden">
                                <NoDataLightIcon />
                            </div>
                            <div className="hidden dark:block">
                                <NoDataDarkIcon />
                            </div>
                            <div className="mt-1 text-xs sm:text-sm text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:no_rank')}</div>
                        </div>
                    )}
                </>
            ) : (
                <div className="dark:bg-dark-4 rounded-xl">
                    <Table loading={loading} noItemsMessage={t('nao:contest:no_rank')} dataSource={dataFilter} classWrapper="!text-sm sm:!text-base">
                        <Column
                            minWidth={50}
                            className="text-txtSecondary dark:text-txtSecondary-dark"
                            title={t('nao:contest:rank')}
                            fieldName={rank}
                            cellRender={renderRank}
                        />
                        <Column minWidth={280} className="font-semibold capitalize" title={t('nao:contest:name')} fieldName="name" cellRender={renderName} />
                        <Column minWidth={150} className="text-txtPrimary dark:text-txtPrimary-dark" title={'User ID'} fieldName={userID} />
                        <Column
                            minWidth={150}
                            align="right"
                            className=""
                            title={`${t('nao:contest:volume')} ${quoteAsset}`}
                            decimal={0}
                            fieldName="total_volume"
                            cellRender={(data, item) => renderVolume(item)}
                        />
                        <Column
                            minWidth={150}
                            align="right"
                            className=""
                            title={t('common:ext_gate:time')}
                            decimal={2}
                            fieldName="time"
                            suffix={t('common:hours')}
                        />
                        {filter.type === 'pnl' ? (
                            <Column
                                maxWidth={200}
                                minWidth={isTotalPnl ? 200 : 100}
                                align="right"
                                className=""
                                title={isTotalPnl ? t('nao:contest:pnl') : t('nao:contest:per_pnl')}
                                fieldName={isTotalPnl ? 'total_pnl' : 'pnl'}
                                cellRender={(data, item) => (isTotalPnl ? <CPnl item={item} isTotal /> : renderPnl(data))}
                            />
                        ) : (
                            <Column
                                maxWidth={120}
                                minWidth={100}
                                align="right"
                                className=""
                                title={t('nao:contest:total_trades')}
                                fieldName="total_order"
                                decimal={0}
                            />
                        )}
                    </Table>
                    {total > 1 && (
                        <div className="w-full hidden sm:flex justify-center py-8">
                            <RePagination onusMode total={total} current={page} pageSize={pageSize} onChange={(page) => setPage(page)} name="" />
                        </div>
                    )}
                </div>
            )}
            {lastUpdated && lastUpdatedTime.current ? (
                <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-txtSecondary dark:text-txtSecondary-dark">
                    {t('nao:contest:last_updated_time_dashboard', { minute: 60 })}: {formatTime(lastUpdatedTime.current, 'HH:mm:ss dd/MM/yyyy')}
                </div>
            ) : null}
            {isMobile && pageSize < dataSource.length && (
                <div className="w-fit block sm:hidden m-auto text-teal font-semibold mt-6" onClick={onReadMore}>
                    {t('common:read_more')}
                </div>
            )}
        </section>
    );
};

export function getWeeksInRange(startDate, endDate) {
    const day = 1000 * 60 * 60 * 24;

    // Calculate the number of days between the start and end dates
    const daysInRange = Math.ceil((endDate - startDate) / day);

    // Calculate the number of weeks and the remaining days
    const numWeeks = Math.floor(daysInRange / 7);
    const remainingDays = daysInRange % 7;

    // Initialize an array to hold the start and end dates of each week
    const weeks = [];

    // Loop through each week and calculate the start and end dates
    for (let i = 0; i < numWeeks; i++) {
        const _startOfWeek = addDays(new Date(startDate), i * 7);
        const _endOfWeek = endOfWeek(_startOfWeek, { weekStartsOn: 1 });
        weeks.push({ start: _startOfWeek, end: _endOfWeek });
    }

    // If there are remaining days, calculate the start and end dates for the final week
    if (remainingDays > 0) {
        const startOfFinalWeek = addDays(new Date(startDate), numWeeks * 7);
        const endOfFinalWeek = endOfDay(addDays(startOfFinalWeek, remainingDays - 1));
        weeks.push({ start: startOfFinalWeek, end: endOfFinalWeek });
    }

    // Return the number of weeks and the array of week start and end dates
    return { numWeeks: weeks.length, weeks };
}

export default ContestWeekRanks;
