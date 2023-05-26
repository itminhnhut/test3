import React, { useState, useRef, useEffect } from 'react';
import {
    TextLiner,
    CardNao,
    ButtonNao,
    Table,
    Column,
    getColor,
    renderPnl,
    Tooltip,
    capitalize,
    ImageNao,
    TabsNao,
    TabItemNao
} from 'components/screens/Nao/NaoStyle';
import { useTranslation } from 'next-i18next';
import useWindowSize from 'hooks/useWindowSize';
import fetchApi from 'utils/fetch-api';
import { API_CONTEST_GET_RANK_GROUP_PNL, API_CONTEST_GET_RANK_GROUP_VOLUME } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import { getS3Url, formatNumber } from 'redux/actions/utils';
import colors from 'styles/colors';
import Skeletor from 'components/common/Skeletor';
import { formatTime } from 'utils/reference-utils';
import { useRouter } from 'next/router';
import TickFbIcon from 'components/svg/TickFbIcon';
import RePagination from 'components/common/ReTable/RePagination';
import { NoDataDarkIcon, NoDataLightIcon } from 'components/common/V2/TableV2/NoData';
import QuestionMarkIcon from 'components/svg/QuestionMarkIcon';

const ContestTeamRanks = ({
    onShowDetail,
    previous,
    contest_id,
    minVolumeTeam,
    quoteAsset: q,
    lastUpdated,
    sort,
    top_ranks_team,
    showPnl,
    currencies,
    hasTabCurrency
}) => {
    const [tab, setTab] = useState(sort);
    const [quoteAsset, setQuoteAsset] = useState(q);
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const { width } = useWindowSize();
    const [dataSource, setDataSource] = useState([]);
    const [top3, setTop3] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const lastUpdatedTime = useRef(null);
    const mount = useRef(false);
    const isMobile = width <= 640;

    useEffect(() => {
        setPage(1);
        setPageSize(10);
    }, [isMobile]);

    useEffect(() => {
        setLoading(true);
        getRanks(sort);
        setTab(sort);
    }, [contest_id]);

    useEffect(() => {
        if (mount.current) getRanks(tab);
    }, [quoteAsset]);

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const individual = urlParams.get('individual') !== 'pnl' ? 'volume' : 'pnl';
        urlParams.set('individual', individual);
        urlParams.set('team', tab === 'pnl' ? 'pnl' : 'volume');
        const url = `/${router.locale}/contest${router.query.season ? '/' + router.query.season : ''}?${urlParams.toString()}`;
        window.history.pushState(null, null, url);
    }, [tab, router]);

    const rank = tab === 'pnl' ? 'current_rank_pnl' : 'current_rank_volume';
    const getRanks = async (tab) => {
        const _rank = tab === 'pnl' ? 'current_rank_pnl' : 'current_rank_volume';
        try {
            const { data: originalData, status } = await fetchApi({
                url: tab === 'pnl' ? API_CONTEST_GET_RANK_GROUP_PNL : API_CONTEST_GET_RANK_GROUP_VOLUME,
                params: { contest_id, quoteAsset }
            });
            let data = originalData?.groups;
            setTotal(data.length);
            if (data && status === ApiStatus.SUCCESS) {
                if (originalData?.last_time_update) lastUpdatedTime.current = originalData?.last_time_update;
                const dataFilter = data.filter((rs) => rs?.[_rank] > 0 && rs?.[_rank] < 4);
                const sliceIndex = dataFilter.length > 3 ? 3 : dataFilter.length;
                const _top3 = data.slice(0, sliceIndex);
                const _dataSource = data.slice(sliceIndex);
                setTop3(_top3);
                setDataSource(_dataSource);
            }
        } catch (e) {
            console.log(e);
        } finally {
            mount.current = true;
            setLoading(false);
        }
    };

    const onFilter = (key) => {
        if (tab === key) return;
        setLoading(true);
        getRanks(key);
        setTab(key);
    };

    const onReadMore = () => {
        setPageSize((old) => {
            const newSize = pageSize + 10;
            return newSize >= dataSource.length ? dataSource.length : newSize;
        });
    };

    const renderTeam = (data, item) => {
        return (
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[50%] bg-hover dark:bg-hover-dark flex items-center justify-center">
                    <ImageNao
                        className="object-cover rounded-[50%] min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px]"
                        src={item?.avatar}
                        width="32"
                        height="32"
                        alt=""
                    />
                </div>
                <div>{data}</div>
                {item?.is_group_master && <TickFbIcon size={16} />}
            </div>
        );
    };

    const renderLeader = (data) => {
        return capitalize(data);
    };

    const renderActions = (e) => {
        return <div className="text-teal font-semibold text-sm sm:text-base cursor-pointer">{t('nao:contest:details')}</div>;
    };

    const renderRank = (data, item) => {
        const _rank = data || '-';
        return (
            <div className="w-6 h-6 flex-shrink-0 text-center relative font-SourceCodePro">
                {data && data <= top_ranks_team ? (
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
    return (
        <section className="contest_individual_ranks pt-8">
            {minVolumeTeam && (
                <Tooltip className="!px-3 !py-1 sm:min-w-[282px] sm:!max-w-[282px]" arrowColor="transparent" id="tooltip-team-rank">
                    <div
                        className="text-sm"
                        dangerouslySetInnerHTML={{
                            __html: minVolumeTeam?.isHtml ? t('nao:contest:tooltip_team', { value: minVolumeTeam[language] }) : minVolumeTeam[language]
                        }}
                    ></div>
                </Tooltip>
            )}
            <div className="flex justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                    <TextLiner className="!text-txtPrimary dark:!text-txtPrimary-dark">{t('nao:contest:team_ranking')}</TextLiner>
                    {minVolumeTeam && (
                        <div className="text-txtPrimary dark:text-txtPrimary-dark cursor-pointer" data-tip={''} data-for="tooltip-team-rank">
                            <QuestionMarkIcon size={16} isFilled />
                        </div>
                        // <img
                        //     data-tip={''}
                        //     data-for="tooltip-team-rank"
                        //     className="cursor-pointer"
                        //     src={getS3Url('/images/nao/ic_info.png')}
                        //     width="20"
                        //     height="20"
                        //     alt=""
                        // />
                    )}
                </div>
                {showPnl && (
                    <div className="flex items-center gap-3 text-sm">
                        <ButtonNao
                            onClick={() => onFilter('volume')}
                            className={`px-4 py-2 !rounded-md ${
                                tab === 'volume'
                                    ? 'font-semibold'
                                    : '!bg-transparent border border-divider dark:border-divider-dark text-txtSemiPrimary dark:text-txtSecondary-dark'
                            }`}
                        >
                            {t('nao:contest:volume')}
                        </ButtonNao>
                        <ButtonNao
                            onClick={() => onFilter('pnl')}
                            className={`px-4 py-2 !rounded-md ${
                                tab === 'pnl'
                                    ? 'font-semibold'
                                    : '!bg-transparent border border-divider dark:border-divider-dark text-txtSemiPrimary dark:text-txtSecondary-dark'
                            }`}
                        >
                            {t('nao:contest:per_pnl')}
                        </ButtonNao>
                    </div>
                )}
            </div>
            {hasTabCurrency && (
                <TabsNao>
                    {currencies.map((rs) => (
                        <TabItemNao onClick={() => setQuoteAsset(rs.value)} active={quoteAsset === rs.value}>
                            {rs.label}
                        </TabItemNao>
                    ))}
                </TabsNao>
            )}
            {top3.length > 0 && (
                <div className="flex flex-wrap gap-3 sm:gap-6 sm:mt-6 mt-8 text-sm sm:text-base">
                    {top3.map((item, index) => (
                        <CardNao key={index} className="!p-4 sm:!p-5">
                            <div className="flex items-center justify-between flex-1 gap-5">
                                <div className="flex items-center space-x-4">
                                    <div className="min-w-[4rem] min-h-[4rem] max-w-[4rem] max-h-[4rem] rounded-[50%] p-1 border-[1.5px] border-teal flex items-center">
                                        <ImageNao className="object-cover w-14 h-14 rounded-full" src={item?.avatar} alt="" />
                                    </div>
                                    <div className="space-y-1 flex flex-col">
                                        <div className="flex items-center gap-2 font-semibold capitalize">
                                            <span>{capitalize(item?.name)}</span>
                                            {item?.is_group_master && <TickFbIcon size={18} />}
                                            {/* {item?.[rank] > 0 && <img src={getS3Url(`/images/nao/contest/ic_top_${index + 1}.png`)} width="24" height="24" alt="" />} */}
                                        </div>
                                        <span className="text-txtSecondary dark:text-txtSecondary-dark cursor-pointer capitalize">
                                            {capitalize(item?.leader_name)}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-5xl sm:text-6xl pb-0 font-semibold italic">{item?.[rank] > 0 ? `#${index + 1}` : '-'}</div>
                            </div>
                            <div className="h-8"></div>
                            <div className="rounded-lg">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:volume')}</div>
                                    <span className="font-semibold">
                                        {formatNumber(item?.total_volume, 0)} {quoteAsset}
                                    </span>
                                </div>
                                {tab === 'pnl' ? (
                                    <div className="flex items-center justify-between gap-2 mt-2 sm:mt-4">
                                        <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:per_pnl')}</div>
                                        <span className={`font-semibold ${getColor(item.pnl)}`}>
                                            {item?.pnl !== 0 && item?.pnl > 0 ? '+' : ''}
                                            {formatNumber(item?.pnl, 2, 0, true)}%
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between gap-2 mt-2 sm:mt-4">
                                        <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:total_trades')}</div>
                                        <span className={`font-semibold`}>{formatNumber(item?.total_order)}</span>
                                    </div>
                                )}
                            </div>
                            <div className="py-2 sm:py-3 text-teal font-semibold text-center">
                                <span onClick={() => onShowDetail(item, tab, quoteAsset)} className="cursor-pointer">
                                    {t('nao:contest:details')}
                                </span>
                            </div>
                        </CardNao>
                    ))}
                </div>
            )}
            {isMobile ? (
                <>
                    <div className="">
                        {Array.isArray(dataSource) && dataSource?.length > 0 ? (
                            dataSource?.slice((page - 1) * pageSize, page * pageSize).map((item, index) => {
                                return (
                                    <CardNao onClick={() => onShowDetail(item, tab, quoteAsset)} key={index} className="mt-3 !p-4">
                                        <div className="text-sm flex-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <ImageNao
                                                        className="rounded-[50%] object-cover w-9 h-9 flex-shrink-0"
                                                        src={item?.avatar}
                                                        width="36"
                                                        height="36"
                                                        alt=""
                                                    />
                                                    <span className="font-semibold">{item?.name} </span>
                                                    {item?.is_group_master && <TickFbIcon size={16} />}
                                                </div>
                                                <div className="text-txtSecondary dark:text-txtSecondary-dark text-sm ">
                                                    {loading ? (
                                                        <Skeletor width={24} height={24} circle />
                                                    ) : item?.[rank] && item?.[rank] <= top_ranks_team ? (
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
                                                <label className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:captain')}</label>
                                                <span className="text-right font-semibold capitalize">{capitalize(item?.leader_name)}</span>
                                            </div>
                                            <div className="flex items-center justify-between pt-3">
                                                <label className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:volume')}</label>
                                                <span className="text-right font-semibold">
                                                    {formatNumber(item?.total_volume, 0)} {quoteAsset}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between pt-3">
                                                <label className="text-txtSecondary dark:text-txtSecondary-dark">
                                                    {t(`nao:contest:${tab === 'pnl' ? 'per_pnl' : 'total_trades'}`)}
                                                </label>
                                                {tab === 'pnl' ? (
                                                    <span className={`text-right font-semibold ${getColor(item?.pnl)}`}>
                                                        {`${item.pnl > 0 ? '+' : ''}${formatNumber(item.pnl, 2, 0, true)}%`}
                                                    </span>
                                                ) : (
                                                    <span className={`text-right font-semibold`}>{formatNumber(item?.total_order)}</span>
                                                )}
                                            </div>
                                            <div
                                                onClick={() => onShowDetail(item, tab, quoteAsset)}
                                                className="text-sm font-semibold text-teal py-2 cursor-pointer select-none text-center"
                                            >
                                                {t('nao:contest:details')}
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
                                <div className="text-xs sm:text-sm text-txtSecondary dark:text-txtSecondary-dark mt-1">{t('nao:contest:no_rank')}</div>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="dark:bg-dark-4 rounded-xl">
                    <Table
                        loading={loading}
                        noItemsMessage={t('nao:contest:no_rank')}
                        dataSource={dataSource.slice((page - 1) * 10, page * 10)}
                        onRowClick={(e) => onShowDetail(e, tab, quoteAsset)}
                    >
                        <Column
                            minWidth={50}
                            className="text-txtSecondary dark:text-txtSecondary-dark"
                            title={t('nao:contest:rank')}
                            fieldName={rank}
                            cellRender={renderRank}
                        />
                        <Column minWidth={200} className="font-semibold uppercase" title={t('nao:contest:team')} fieldName="name" cellRender={renderTeam} />
                        <Column
                            minWidth={150}
                            className="text-txtPrimary dark:text-txtPrimary-dark capitalize"
                            title={t('nao:contest:captain')}
                            fieldName="leader_name"
                            cellRender={renderLeader}
                        />
                        <Column
                            minWidth={150}
                            align="right"
                            className=""
                            title={`${t('nao:contest:volume')} (${quoteAsset})`}
                            decimal={0}
                            fieldName="total_volume"
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
                        <Column maxWidth={100} minWidth={100} align="right" className="" title={''} cellRender={renderActions} />
                        {/* formatTime(lastUpdatedTime, 'HH:mm:ss DD/MM/YYYY') */}
                    </Table>
                    {total > 1 && (
                        <div className="w-full hidden sm:flex justify-center py-8">
                            <RePagination onusMode total={total} current={page} pageSize={10} onChange={(page) => setPage(page)} name="" />
                        </div>
                    )}
                </div>
            )}

            {lastUpdated && lastUpdatedTime.current && (
                <div className="mt-4 text-xs sm:text-sm text-txtSecondary dark:text-txtSecondary-dark">
                    {t('nao:contest:last_updated_time_dashboard', { minute: 60 })}: {formatTime(lastUpdatedTime.current, 'HH:mm:ss DD/MM/YYYY')}
                </div>
            )}
            {isMobile && pageSize < dataSource.length && (
                <div className="w-fit block sm:hidden m-auto text-teal font-semibold mt-6" onClick={onReadMore}>
                    {t('common:read_more')}
                </div>
            )}
        </section>
    );
};

export default ContestTeamRanks;
