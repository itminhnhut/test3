import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { TextLiner, CardNao, Table, Column, getColor, renderPnl, Tooltip, capitalize, ImageNao } from 'components/screens/Nao/NaoStyle';
import { useTranslation } from 'next-i18next';
import useWindowSize from 'hooks/useWindowSize';
import fetchApi from 'utils/fetch-api';
import { API_CONTEST_GET_RANK_WEEKLY_VOLUME } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import { formatNumber, getS3Url, formatTime } from 'redux/actions/utils';
import Skeletor from 'components/common/Skeletor';
import TickFbIcon from 'components/svg/TickFbIcon';
import { NoDataDarkIcon, NoDataLightIcon } from 'components/common/V2/TableV2/NoData';
import QuestionMarkIcon from 'components/svg/QuestionMarkIcon';
import RePagination from 'components/common/ReTable/RePagination';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';
import { addDays, endOfDay, endOfWeek } from 'date-fns';

const ContestWeekRanks = ({ previous, contest_id, total_weekly_rewards, quoteAsset: q, lastUpdated, top_ranks_week, userID, minVolumeInd, start, end }) => {
    const [tab, setTab] = useState(0);
    const [quoteAsset, setQuoteAsset] = useState(q);
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const { width } = useWindowSize();
    const [dataSource, setDataSource] = useState([]);
    const [top3, setTop3] = useState([]);
    const [loading, setLoading] = useState(false);
    const lastUpdatedTime = useRef(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(limit);
    const isMobile = width <= 640;
    const limit = isMobile ? 10 : 20;
    const rank = 'individual_rank_volume';

    useEffect(() => {
        setPage(1);
        setPageSize(limit);
    }, [isMobile]);

    useEffect(() => {
        getRanks(tab);
    }, [contest_id]);

    const onReadMore = () => {
        setPageSize((old) => {
            const newSize = pageSize + limit;
            return newSize >= dataSource.length ? dataSource.length : newSize;
        });
    };

    const getRanks = async (tab) => {
        try {
            const { data: originalData, status } = await fetchApi({
                url: API_CONTEST_GET_RANK_WEEKLY_VOLUME,
                params: { contestId: contest_id, quoteAsset, weekId: tab + 1 }
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

    const onFilter = (key) => {
        if (tab === key) return;
        setLoading(true);
        getRanks(key);
        setTab(key);
    };

    const renderName = (data, item) => {
        return (
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[50%] bg-hover dark:bg-hover-dark flex items-center justify-center">
                    <ImageNao
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
                            {item?.rowIndex + 4}
                        </span>
                    </>
                ) : (
                    <span>{_rank}</span>
                )}
            </div>
        );
    };

    function getWeeksInRange(startDate, endDate) {
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

    const weeks = useMemo(() => {
        return getWeeksInRange(new Date(start), new Date(end));
    }, [start]);

    const renderWeeksTab = useCallback(() => {
        let rs = [];
        const now = Date.now();
        for (let i = 0; i < weeks.numWeeks; i++) {
            const start = new Date(weeks.weeks[i].start).getTime();
            const end = new Date(weeks.weeks[i].end).getTime();
            if (now > start && now < end) {
                onFilter(i);
            }
            rs.push(
                <TabItem key={i} isActive={tab === i} V2 value={i} onClick={() => onFilter(i)} className="!px-0 space-x-1">
                    <span>{t('nao:contest:week', { value: i + 1 })}</span>
                    <span className="lowercase">({now < start ? t('nao:coming_soon_2') : now > start && now < end ? t('nao:going_on') : t('nao:ended')})</span>
                </TabItem>
            );
        }
        return rs;
    }, [weeks, tab]);

    const dataFilter = dataSource.slice((page - 1) * pageSize, page * pageSize);

    return (
        <section className="contest_individual_ranks pb-12 sm:pb-20">
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
            </div>

            <div className="pt-6 sm:pt-8 text-sm sm:text-base">
                <span className="font-semibold">{t('nao:contest:rules')}</span>:&nbsp;
                <span>{t('nao:contest:weekly_ranking_desc', { value: total_weekly_rewards })}</span>
            </div>

            <div className="border-b border-divider dark:border-divider-dark pt-8 sm:pt-12 mb-6 sm:mb-8 w-full">
                <Tabs tab={tab} className="text-sm sm:text-base space-x-6">
                    {renderWeeksTab()}
                </Tabs>
            </div>

            <div className="text-txtSecondary dark:text-txtSecondary-dark mb-6 sm:mb-8 text-sm sm:text-base">
                {t('common:time')}: {`${formatTime(weeks.weeks[tab].start, 'dd/MM/yyyy')} - ${formatTime(addDays(weeks.weeks[tab].end, 1), 'dd/MM/yyyy')}`}
            </div>

            {top3.length > 0 && (
                <div className="flex flex-wrap gap-3 sm:gap-6 text-sm sm:text-base">
                    {top3.map((item, index) => (
                        <CardNao key={index} className="!p-4 sm:!p-5">
                            <div className="flex items-center justify-between flex-1 gap-5">
                                <div className="flex items-center space-x-4">
                                    <div className="min-w-[4rem] min-h-[4rem] max-w-[4rem] max-h-[4rem] rounded-[50%] p-1 border-[1.5px] border-teal flex items-center">
                                        <ImageNao className="object-cover w-14 h-14 rounded-full" src={item?.avatar} alt="" />
                                    </div>
                                    <div className="sm:space-y-[2px] flex flex-col">
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
                                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:volume')}</div>
                                    <span className="font-semibold">
                                        {formatNumber(item?.total_volume, 0)} {quoteAsset}
                                    </span>
                                </div>
                                {!previous && (
                                    <div className="flex items-center justify-between gap-2 pt-2 sm:pt-4">
                                        <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('common:ext_gate:time')}</div>
                                        <span className="font-semibold">
                                            {formatNumber(item?.time, 2)} {t('common:hours')}
                                        </span>
                                    </div>
                                )}
                                {tab === 'pnl' ? (
                                    <div className="flex items-center justify-between gap-2 pt-2 sm:pt-4">
                                        <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:per_pnl')}</div>
                                        <span className={`font-semibold ${getColor(item.pnl)}`}>
                                            {item?.pnl !== 0 && item?.pnl > 0 ? '+' : ''}
                                            {formatNumber(item?.pnl, 2, 0, true)}%
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between gap-2 pt-2 sm:pt-4">
                                        <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:total_trades')}</div>
                                        <span className={`font-semibold`}>{formatNumber(item?.total_order)}</span>
                                    </div>
                                )}
                            </div>
                        </CardNao>
                    ))}
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
                                            <div className="min-w-[31px] text-txtSecondary dark:text-txtSecondary-dark">
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
                                                            {index + 4}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    item?.[rank] || '-'
                                                )}
                                            </div>
                                        </div>
                                        <div className="h-8"></div>
                                        <div className="flex items-center justify-between">
                                            <label className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:volume')}</label>
                                            <span className="text-right">
                                                {formatNumber(item?.total_volume, 0)} {quoteAsset}
                                            </span>
                                        </div>
                                        {!previous && (
                                            <div className="flex items-center justify-between pt-3">
                                                <label className="text-txtSecondary dark:text-txtSecondary-dark">{t('common:ext_gate:time')}</label>
                                                <span className="text-right">
                                                    {formatNumber(item?.time, 2)} {t('common:hours')}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between pt-3">
                                            <label className="text-txtSecondary dark:text-txtSecondary-dark">
                                                {t(`nao:contest:${tab === 'pnl' ? 'per_pnl' : 'total_trades'}`)}
                                            </label>
                                            {tab === 'pnl' ? (
                                                <span className={`text-right ${getColor(item?.pnl)}`}>
                                                    {`${item.pnl > 0 ? '+' : ''}${formatNumber(item.pnl, 2, 0, true)}%`}
                                                </span>
                                            ) : (
                                                <span className={`text-right`}>{formatNumber(item?.total_order)}</span>
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
                            title={`${t('nao:contest:volume')} (${quoteAsset})`}
                            decimal={0}
                            fieldName="total_volume"
                        />
                        <Column
                            minWidth={150}
                            visible={!previous}
                            align="right"
                            className=""
                            title={t('common:ext_gate:time')}
                            decimal={2}
                            fieldName="time"
                            suffix={t('common:hours')}
                        />
                        {tab === 'pnl' ? (
                            <Column
                                maxWidth={120}
                                minWidth={100}
                                align="right"
                                className=""
                                title={t('nao:contest:per_pnl')}
                                fieldName="pnl"
                                cellRender={renderPnl}
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

export default ContestWeekRanks;
