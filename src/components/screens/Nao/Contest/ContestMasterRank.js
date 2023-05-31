import React, { useEffect, useState } from 'react';
import { capitalize, CardNao, Column, getColor, ImageNao, renderPnl, Table, TextLiner, Tooltip } from 'components/screens/Nao/NaoStyle';
import { useTranslation } from 'next-i18next';
import useWindowSize from 'hooks/useWindowSize';
import fetchApi from 'utils/fetch-api';
import { API_CONTEST_GET_MASTER_GROUP_PNL } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import { formatNumber, getS3Url } from 'redux/actions/utils';
import colors from 'styles/colors';
import Skeletor from 'components/common/Skeletor';
import TickFbIcon from 'components/svg/TickFbIcon';
import RePagination from 'components/common/ReTable/RePagination';
import { NoDataDarkIcon, NoDataLightIcon } from 'components/common/V2/TableV2/NoData';

const ContestMasterRank = ({ onShowDetail, previous, contest_id, minVolumeTeam, quoteAsset, lastUpdatedTime, sort, top_ranks_master }) => {
    const [tab, setTab] = useState(sort);
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const { width } = useWindowSize();
    const [dataSource, setDataSource] = useState([]);
    const [top3, setTop3] = useState([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const isMobile = width <= 640;

    useEffect(() => {
        setPage(1);
        setPageSize(10);
    }, [isMobile]);

    useEffect(() => {
        setLoading(true);
        getRanks(tab);
    }, [contest_id]);

    const rank = tab === 'pnl' ? 'current_rank_master_pnl' : 'current_rank_master_volume';
    const getRanks = async (tab) => {
        const _rank = tab === 'pnl' ? 'current_rank_master_pnl' : 'current_rank_master_volume';
        try {
            const { data: originalData, status } = await fetchApi({
                url: API_CONTEST_GET_MASTER_GROUP_PNL,
                params: { contest_id: contest_id }
            });
            let data = originalData?.groups;
            setTotal(data.length);
            if (data && status === ApiStatus.SUCCESS) {
                const dataFilter = data?.filter((rs) => rs?.[_rank] > 0 && rs?.[_rank] < 4);
                const sliceIndex = dataFilter?.length > 3 ? 3 : dataFilter?.length;
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

    const onReadMore = () => {
        setPageSize((old) => {
            const newSize = pageSize + 10;
            return newSize >= dataSource.length ? dataSource.length : newSize;
        });
    };

    const renderTeam = (data, item) => {
        return (
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-[50%] bg-hover dark:bg-hover-dark flex items-center justify-center">
                    <ImageNao
                        className="object-cover rounded-[50%] min-w-[1.5rem] min-h-[1.5rem] max-w-[1.5rem] max-h-[1.5rem]"
                        src={item?.avatar}
                        width="32"
                        height="32"
                        alt=""
                    />
                </div>
                <div>{data}</div>
                <TickFbIcon size={16} />
            </div>
        );
    };

    const renderLeader = (data) => {
        return capitalize(data);
    };

    const renderActions = (e) => {
        return <div className="text-teal text-xs sm:text-sm font-semibold cursor-pointer">{t('nao:contest:details')}</div>;
    };

    const renderRank = (data, item) => {
        const _rank = data || '-';
        return (
            <div className="w-6 h-6 flex-shrink-0 text-center relative font-SourceCodePro">
                {data && data <= top_ranks_master ? (
                    <>
                        <img
                            src={getS3Url("/images/nao/contest/ic_top_teal.png")}
                            className="w-6 h-6"
                            width="24"
                            height="24"
                            alt=""
                        />
                        <span className='font-bold text-[0.625rem] leading-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute text-white'>{item?.rowIndex + 4}</span>
                    </>
                ) : (
                    <span>{_rank}</span>
                )}
            </div>
        );
    };

    const showData = dataSource.slice((page - 1) * pageSize, page * pageSize);

    return (
        <section className="contest_individual_ranks py-6 sm:pb-14 text-sm sm:text-base">
            {minVolumeTeam && (
                <Tooltip
                    className="!px-3 !py-1 sm:min-w-[282px] sm:!max-w-[282px]"
                    backgroundColor={colors.nao.tooltip}
                    arrowColor="transparent"
                    id="tooltip-team-rank"
                >
                    <div
                        className="text-txtSecondary dark:text-txtSecondary-dark "
                        dangerouslySetInnerHTML={{
                            __html: minVolumeTeam?.isHtml ? t('nao:contest:tooltip_team', { value: minVolumeTeam[language] }) : minVolumeTeam[language]
                        }}
                    ></div>
                </Tooltip>
            )}
            <div className="flex justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                    <TextLiner>{t('nao:contest:master_ranking')}</TextLiner>
                    {minVolumeTeam && (
                        <img
                            data-tip={''}
                            data-for="tooltip-team-rank"
                            className="cursor-pointer"
                            src={getS3Url('/images/nao/ic_info.png')}
                            width="20"
                            height="20"
                            alt=""
                        />
                    )}
                </div>
                {/* <div className="flex items-center gap-3 text-sm">
                    <ButtonNao
                        onClick={() => onFilter('volume')}
                        className={`px-4 py-2 !rounded-md ${tab === 'volume' ? 'font-semibold' : '!bg-gray-12 dark:bg-dark-2'}`}>{t('nao:contest:volume')}</ButtonNao>
                    <ButtonNao
                        onClick={() => onFilter('pnl')}
                        className={`px-4 py-2 !rounded-md   ${tab === 'pnl' ? 'font-semibold' : '!bg-gray-12 dark:bg-dark-2'}`}>{t('nao:contest:per_pnl')}</ButtonNao>
                </div> */}
            </div>
            {top3.length > 0 && (
                <div className="flex flex-wrap gap-5 sm:sm:gap-6 mt-8 text-sm sm:text-base">
                    {top3.map((item, index) => (
                        <CardNao
                            onClick={() => onShowDetail(item, tab)}
                            key={index}
                            className="!p-5 !bg-transparent border border-divider dark:border-divider-dark"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="min-w-[4rem] min-h-[4rem] max-w-[4rem] max-h-[4rem] rounded-[50%] p-1 border-[1.5px] border-teal flex items-center">
                                    <ImageNao className="object-cover w-14 h-14 rounded-full" src={item?.avatar} alt="" />
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <label className="font-semibold capitalize">{capitalize(item?.name)}</label>
                                        <TickFbIcon size={16} />
                                    </div>
                                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{capitalize(item?.leader_name)}</div>
                                </div>
                            </div>
                            <div className="h-8"></div>
                            <div className="rounded-lg">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:volume')}</div>
                                    <span className="font-semibold leading-8">
                                        {formatNumber(item?.total_volume, 0)} {quoteAsset}
                                    </span>
                                </div>
                                {tab === 'pnl' ? (
                                    <div className="flex items-center justify-between gap-2 mt-3">
                                        <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:per_pnl')}</div>
                                        <span className={`font-semibold leading-8 ${getColor(item.pnl)}`}>
                                            {item?.pnl !== 0 && item?.pnl > 0 ? '+' : ''}
                                            {formatNumber(item?.pnl, 2, 0, true)}%
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between gap-2 mt-3">
                                        <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:total_trades')}</div>
                                        <span className={`font-semibold leading-8`}>{formatNumber(item?.total_order)}</span>
                                    </div>
                                )}
                            </div>
                        </CardNao>
                    ))}
                </div>
            )}
            {width <= 640 ? (
                <div className="mt-3 text-sm sm:text-base">
                    {Array.isArray(showData) && showData?.length > 0 ? (
                        showData.map((item, index) => {
                            return (
                                <CardNao onClick={() => onShowDetail(item, tab)} key={index} className="mt-5 !py-[1.125rem] !px-3">
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
                                                    <TickFbIcon size={16} />
                                                </div>
                                                <div className="text-txtSecondary dark:text-txtSecondary-dark">{capitalize(item?.leader_name)}</div>
                                            </div>
                                        </div>
                                        <div className="min-w-[31px] text-txtSecondary dark:text-txtSecondary-dark">
                                            {loading ? (
                                                <Skeletor width={24} height={24} circle />
                                            ) : item?.[rank] && item?.[rank] <= top_ranks_master ? (
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
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between pt-2">
                                            <label className="leading-6 text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:volume')}</label>
                                            <span className="text-right font-semibold">
                                                {formatNumber(item?.total_volume, 0)} {quoteAsset}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between pt-1">
                                            <label className="leading-6 text-txtSecondary dark:text-txtSecondary-dark">
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
                                            onClick={() => onShowDetail(item, tab)}
                                            className="font-semibold text-teal w-fit m-auto pt-4 cursor-pointer select-none"
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
            ) : (
                <Table
                    loading={loading}
                    noItemsMessage={t('nao:contest:no_rank')}
                    dataSource={showData}
                    onRowClick={(e) => onShowDetail(e, tab)}
                    classWrapper="text-sm sm:text-base"
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
                </Table>
            )}
            {/* <div className='mt-6 text-sm text-txtSecondary dark:text-txtSecondary-dark leading-6'>{t('nao:contest:last_updated_time')}: {formatTime(lastUpdatedTime, 'HH:mm:ss DD/MM/YYYY')}</div> */}
            {!isMobile && (
                <div className="w-full flex justify-center mt-6">
                    <RePagination onusMode total={total} current={page} pageSize={10} onChange={(page) => setPage(page)} name="" />
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

export default ContestMasterRank;
