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
                <TickFbIcon size={16} />
            </div>
        );
    };

    const renderLeader = (data) => {
        return capitalize(data);
    };

    const renderActions = (e) => {
        return <div className="text-txtSecondary dark:text-txtSecondary-dark underline text-xs cursor-pointer">{t('nao:contest:details')}</div>;
    };

    const renderRank = (data, item) => {
        const _rank = data || '-';
        return (
            <div className="min-w-[24px] text-center">
                {data && data <= top_ranks_master ? (
                    <img
                        src={getS3Url(`/images/nao/contest/ic_top_${item?.rowIndex + 4}.png`)}
                        className="min-w-[24px] min-h-[24px]"
                        width="24"
                        height="24"
                        alt=""
                    />
                ) : (
                    <span>{_rank}</span>
                )}
            </div>
        );
    };

    const showData = dataSource.slice((page - 1) * 10, page * 10);

    return (
        <section className="contest_individual_ranks pt-[4.125rem]">
            {minVolumeTeam && (
                <Tooltip
                    className="!px-3 !py-1 sm:min-w-[282px] sm:!max-w-[282px]"
                    backgroundColor={colors.nao.tooltip}
                    arrowColor="transparent"
                    id="tooltip-team-rank"
                >
                    <div
                        className="font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark "
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
                <div className="flex flex-wrap gap-5 sm:gap-[1.375rem] mt-[2.75rem]">
                    {top3.map((item, index) => (
                        <CardNao onClick={() => onShowDetail(item, tab)} key={index} className="!p-5 !bg-transparent border border-divider dark:border-divider-dark">
                            <div className="flex items-center justify-between flex-1 gap-5">
                                <div className="flex items-center space-x-4">
                                    <div className="w-[3rem] h-[3rem] rounded-[50%] relative">
                                        <ImageNao
                                            src={item?.avatar}
                                            className="min-w-[3rem] min-h-[3rem] max-w-[3rem] max-h-[3rem] rounded-[50%] object-cover"
                                            alt=""
                                        />
                                    </div>
                                    <div className="sm:space-y-[2px] flex flex-col">
                                        <div className="flex items-center gap-2 text-lg font-semibold leading-8 capitalize">
                                            <span>{capitalize(item?.name)}</span>
                                            <TickFbIcon size={18} />
                                        </div>
                                        <span className="text-txtSecondary dark:text-txtSecondary-dark text-sm font-medium cursor-pointer capitalize">
                                            {capitalize(item?.leader_name)}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-5xl font-semibold pb-0">
                                    {item?.[rank] > 0 ? `#${index + 1}` : '-'}
                                </div>
                            </div>
                            <div className="h-[1px] bg-nao-grey/[0.2] w-full my-6"></div>
                            <div className="rounded-lg">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="text-sm text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:volume')}</div>
                                    <span className="font-semibold leading-8">
                                        {formatNumber(item?.total_volume, 0)} {quoteAsset}
                                    </span>
                                </div>
                                {tab === 'pnl' ? (
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="text-sm text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:per_pnl')}</div>
                                        <span className={`font-semibold leading-8 ${getColor(item.pnl)}`}>
                                            {item?.pnl !== 0 && item?.pnl > 0 ? '+' : ''}
                                            {formatNumber(item?.pnl, 2, 0, true)}%
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="text-sm text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:total_trades')}</div>
                                        <span className={`font-semibold leading-8`}>{formatNumber(item?.total_order)}</span>
                                    </div>
                                )}
                            </div>
                        </CardNao>
                    ))}
                </div>
            )}
            {width <= 640 ? (
                <CardNao noBg className="mt-5 !py-[1.125rem] !px-3">
                    <div className="flex mx-3 gap-4 sm:gap-6 text-txtSecondary dark:text-txtSecondary-dark text-sm font-medium pb-2 border-b border-divider dark:border-divider-dark">
                        <div className="min-w-[31px]">{t('nao:contest:rank')}</div>
                        <div>{t('nao:contest:information')}</div>
                    </div>
                    <div className="mt-3">
                        {Array.isArray(showData) && showData?.length > 0 ? (
                            showData.map((item, index) => {
                                return (
                                    <div
                                        onClick={() => onShowDetail(item, tab)}
                                        key={index}
                                        className={`flex gap-4 sm:gap-6 p-3 cursor-pointer ${index % 2 !== 0 ? 'bg-nao/[0.15] rounded-lg' : ''}`}
                                    >
                                        <div className="min-w-[31px] text-txtSecondary dark:text-txtSecondary-dark text-sm font-medium ">
                                            {loading ? (
                                                <Skeletor width={24} height={24} circle />
                                            ) : item?.[rank] && item?.[rank] <= top_ranks_master ? (
                                                <img
                                                    src={getS3Url(`/images/nao/contest/ic_top_${index + 4}.png`)}
                                                    className="min-w-[24px] min-h-[24px]"
                                                    width="24"
                                                    height="24"
                                                    alt=""
                                                />
                                            ) : (
                                                item?.[rank] || '-'
                                            )}
                                        </div>
                                        <div className="text-sm flex-1">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold leading-6 uppercase flex items-center space-x-2">
                                                        <span>{item?.name} </span>
                                                        <TickFbIcon size={16} />
                                                    </div>
                                                    <div className="text-txtSecondary dark:text-txtSecondary-dark font-medium leading-6 cursor-pointer capitalize">
                                                        {capitalize(item?.leader_name)}
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <ImageNao
                                                        className="rounded-[50%] object-cover min-w-[2.275rem] min-h-[2.275rem] max-w-[2.275rem] max-h-[2.275rem]"
                                                        src={item?.avatar}
                                                        width="24"
                                                        height="24"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center font-medium justify-between pt-2">
                                                <label className="leading-6 text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:volume')}</label>
                                                <span className="text-right">
                                                    {formatNumber(item?.total_volume, 0)} {quoteAsset}
                                                </span>
                                            </div>
                                            <div className="flex items-center font-medium justify-between pt-1">
                                                <label className="leading-6 text-txtSecondary dark:text-txtSecondary-dark">
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
                                            <div
                                                onClick={() => onShowDetail(item, tab)}
                                                className="underline text-sm font-medium text-txtSecondary dark:text-txtSecondary-dark pt-1 cursor-pointer select-none"
                                            >
                                                {t('nao:contest:details')}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className={`flex items-center justify-center flex-col m-auto`}>
                                <div className="block dark:hidden">
                                    <NoDataLightIcon />
                                </div>
                                <div className="hidden dark:block">
                                    <NoDataDarkIcon />
                                </div>
                                <div className="text-xs text-txtSecondary dark:text-txtSecondary-dark mt-1">{t('nao:contest:no_rank')}</div>
                            </div>
                        )}
                    </div>
                </CardNao>
            ) : (
                <Table loading={loading} noItemsMessage={t('nao:contest:no_rank')} dataSource={showData} onRowClick={(e) => onShowDetail(e, tab)}>
                    <Column
                        minWidth={50}
                        className="text-txtSecondary dark:text-txtSecondary-dark font-medium"
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
                        className="font-medium"
                        title={`${t('nao:contest:volume')} (${quoteAsset})`}
                        decimal={0}
                        fieldName="total_volume"
                    />

                    {tab === 'pnl' ? (
                        <Column
                            maxWidth={120}
                            minWidth={100}
                            align="right"
                            className="font-medium"
                            title={t('nao:contest:per_pnl')}
                            fieldName="pnl"
                            cellRender={renderPnl}
                        />
                    ) : (
                        <Column
                            maxWidth={120}
                            minWidth={100}
                            align="right"
                            className="font-medium"
                            title={t('nao:contest:total_trades')}
                            fieldName="total_order"
                            decimal={0}
                        />
                    )}
                    <Column maxWidth={100} minWidth={100} align="right" className="font-medium" title={''} cellRender={renderActions} />
                </Table>
            )}
            {/* <div className='mt-6 text-sm text-txtSecondary dark:text-txtSecondary-dark font-medium leading-6'>{t('nao:contest:last_updated_time')}: {formatTime(lastUpdatedTime, 'HH:mm:ss DD/MM/YYYY')}</div> */}
            <div className="w-full flex justify-center mt-6">
                <RePagination total={total} current={page} pageSize={10} onChange={(page) => setPage(page)} name="" />
            </div>
        </section>
    );
};

export default ContestMasterRank;
