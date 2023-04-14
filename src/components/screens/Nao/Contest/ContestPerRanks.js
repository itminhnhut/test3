import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
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
import { API_CONTEST_GET_RANK_MEMBERS_PNL, API_CONTEST_GET_RANK_MEMBERS_VOLUME } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import { formatNumber, getS3Url, getLoginUrl } from 'redux/actions/utils';
import colors from 'styles/colors';
import Skeletor from 'components/common/Skeletor';
import { formatTime } from 'utils/reference-utils';
import { useRouter } from 'next/router';
import TickFbIcon from 'components/svg/TickFbIcon';

const ContestPerRanks = ({
    previous,
    contest_id,
    minVolumeInd,
    quoteAsset: q,
    lastUpdated,
    sort,
    params,
    top_ranks_per,
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
    const lastUpdatedTime = useRef(null);
    const mount = useRef(false);

    useEffect(() => {
        getRanks(sort);
        setTab(sort);
    }, [contest_id]);

    useEffect(() => {
        if (mount.current) getRanks(tab);
    }, [quoteAsset]);

    const rank = tab === 'pnl' ? 'individual_rank_pnl' : 'individual_rank_volume';

    const getRanks = async (tab) => {
        const _rank = tab === 'pnl' ? 'individual_rank_pnl' : 'individual_rank_volume';
        // if (Date.now() < new Date('2022-07-07T17:00:00.000Z').getTime()) {
        //     return
        // }
        try {
            const { data: originalData, status } = await fetchApi({
                url: tab === 'pnl' ? API_CONTEST_GET_RANK_MEMBERS_PNL : API_CONTEST_GET_RANK_MEMBERS_VOLUME,
                params: { contest_id, quoteAsset }
            });
            const data = originalData?.users;
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

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const team = urlParams.get('team') !== 'pnl' ? 'volume' : 'pnl';
        urlParams.set('individual', tab === 'pnl' ? 'pnl' : 'volume');
        urlParams.set('team', team);
        const url = `/${router.locale}/contest${router.query.season ? '/' + router.query.season : ''}?${urlParams.toString()}`;
        window.history.pushState(null, null, url);
    }, [tab, router]);

    const renderName = (data, item) => {
        return (
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[50%] bg-[#273446] flex items-center justify-center">
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
            <div className="min-w-[24px] text-center">
                {data && data <= top_ranks_per ? (
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

    return (
        <section className="contest_individual_ranks pt-[4.125rem]">
            {minVolumeInd && (
                <Tooltip
                    className="!px-3 !py-1 sm:min-w-[282px] sm:!max-w-[282px]"
                    backgroundColor={colors.nao.tooltip}
                    arrowColor="transparent"
                    id="tooltip-personal-rank"
                >
                    <div
                        className="font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark "
                        dangerouslySetInnerHTML={{
                            __html: minVolumeInd?.isHtml ? t('nao:contest:tooltip_personal', { value: minVolumeInd[language] }) : minVolumeInd[language]
                        }}
                    ></div>
                </Tooltip>
            )}
            <div className="flex justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                    <TextLiner>{t('nao:contest:individual_ranking')}</TextLiner>
                    {minVolumeInd && (
                        <img
                            data-tip={''}
                            data-for="tooltip-personal-rank"
                            className="cursor-pointer"
                            src={getS3Url('/images/nao/ic_info.png')}
                            width="20"
                            height="20"
                            alt=""
                        />
                    )}
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <ButtonNao
                        onClick={() => onFilter('volume')}
                        className={`px-4 py-2 !rounded-md ${tab === 'volume' ? 'font-semibold' : '!bg-gray-12 dark:bg-dark-2'}`}
                    >
                        {t('nao:contest:volume')}
                    </ButtonNao>
                    {showPnl && (
                        <ButtonNao
                            onClick={() => onFilter('pnl')}
                            className={`px-4 py-2 !rounded-md   ${tab === 'pnl' ? 'font-semibold' : '!bg-gray-12 dark:bg-dark-2'}`}
                        >
                            {t('nao:contest:per_pnl')}
                        </ButtonNao>
                    )}
                </div>
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
                <div className="flex flex-wrap gap-5 sm:gap-[22px] mt-[2.75rem]">
                    {top3.map((item, index) => (
                        <CardNao key={index} className="!p-5 !bg-transparent border border-nao-border2">
                            <div className="flex items-center justify-between flex-1 gap-5">
                                <div className="flex items-center space-x-4">
                                    <div className="w-[3rem] h-[3rem] rounded-[50%] relative">
                                        <ImageNao
                                            src={item?.avatar}
                                            className="min-w-[3rem] min-h-[3rem] max-w-[3rem] max-h-[3rem] rounded-[50%] object-cover"
                                            alt=""
                                        />
                                        {/*{item?.[rank] > 0 && <img className="absolute bottom-0 -translate-x-1/2 translate-y-3 left-1/2" src={getS3Url(`/images/nao/contest/ic_top_${index + 1}.png`)} width="24" height="24" alt="" />}*/}
                                    </div>
                                    <div className="sm:space-y-[2px] flex flex-col">
                                        <div className="flex items-center gap-2 text-lg font-semibold leading-8 capitalize">
                                            <span>{capitalize(item?.name)}</span>
                                            {item?.is_onus_master && <TickFbIcon size={16} />}
                                        </div>
                                        <span className="text-sm font-medium cursor-pointer text-txtSecondary dark:text-txtSecondary-dark">{item?.onus_user_id}</span>
                                    </div>
                                </div>
                                <TextLiner className="!text-[2.5rem] !leading-[50px] !pb-0" liner>
                                    {item?.[rank] > 0 ? `#${index + 1}` : '-'}
                                </TextLiner>
                            </div>
                            <div className="h-[1px] bg-nao-grey/[0.2] w-full my-6"></div>
                            <div className="flex flex-col mt-auto space-y-1 rounded-lg">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="text-sm text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:volume')}</div>
                                    <span className="font-semibold leading-8">
                                        {formatNumber(item?.total_volume, 0)} {quoteAsset}
                                    </span>
                                </div>
                                {!previous && (
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="text-sm text-txtSecondary dark:text-txtSecondary-dark">{t('common:ext_gate:time')}</div>
                                        <span className="font-semibold leading-8">
                                            {formatNumber(item?.time, 2)} {t('common:hours')}
                                        </span>
                                    </div>
                                )}
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
                <CardNao noBg className="mt-5 !py-[18px] !px-3">
                    <div className="flex mx-3 gap-4 sm:gap-6 text-txtSecondary dark:text-txtSecondary-dark text-sm font-medium pb-2 border-b border-nao-grey/[0.2]">
                        <div className="min-w-[31px]">{t('nao:contest:rank')}</div>
                        <div>{t('nao:contest:information')}</div>
                    </div>
                    <div className="mt-3">
                        {Array.isArray(dataSource) && dataSource?.length > 0 ? (
                            dataSource.map((item, index) => {
                                return (
                                    <div key={index} className={`flex gap-4 sm:gap-6 p-3 ${index % 2 !== 0 ? 'bg-nao/[0.15] rounded-lg' : ''}`}>
                                        <div className="min-w-[31px] text-txtSecondary dark:text-txtSecondary-dark text-sm font-medium">
                                            {loading ? (
                                                <Skeletor width={24} height={24} circle />
                                            ) : item?.[rank] && item?.[rank] <= top_ranks_per ? (
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
                                        <div className="flex-1 text-sm">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <label className="font-semibold leading-6 capitalize">{capitalize(item?.name)}</label>
                                                        {item?.is_onus_master && <TickFbIcon size={16} />}
                                                    </div>
                                                    <div className="font-medium leading-6 cursor-pointer text-txtSecondary dark:text-txtSecondary-dark">
                                                        ID: {item?.onus_user_id}
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <ImageNao
                                                        className="rounded-[50%] object-cover min-w-[2.75rem] min-h-[2.75rem] max-w-[2.75rem] max-h-[2.75rem]"
                                                        src={item?.avatar}
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-2 font-medium">
                                                <label className="leading-6 text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:volume')}</label>
                                                <span className="text-right">
                                                    {formatNumber(item?.total_volume, 0)} {quoteAsset}
                                                </span>
                                            </div>
                                            {!previous && (
                                                <div className="flex items-center justify-between pt-1 font-medium">
                                                    <label className="leading-6 text-txtSecondary dark:text-txtSecondary-dark">{t('common:ext_gate:time')}</label>
                                                    <span className="text-right">
                                                        {formatNumber(item?.time, 2)} {t('common:hours')}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between pt-1 font-medium">
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
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className={`flex items-center justify-center flex-col m-auto`}>
                                <img src={getS3Url(`/images/icon/icon-search-folder_dark.png`)} width={100} height={100} />
                                <div className="mt-1 text-xs text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:no_rank')}</div>
                            </div>
                        )}
                    </div>
                </CardNao>
            ) : (
                <Table loading={loading} noItemsMessage={t('nao:contest:no_rank')} dataSource={dataSource}>
                    <Column
                        minWidth={50}
                        className="font-medium text-txtSecondary dark:text-txtSecondary-dark"
                        title={t('nao:contest:rank')}
                        fieldName={rank}
                        cellRender={renderRank}
                    />
                    <Column minWidth={200} className="font-semibold capitalize" title={t('nao:contest:name')} fieldName="name" cellRender={renderName} />
                    <Column minWidth={150} className="text-txtPrimary dark:text-txtPrimary-dark" title={'ID NAO Futures'} fieldName="onus_user_id" />
                    <Column
                        minWidth={150}
                        align="right"
                        className="font-medium"
                        title={`${t('nao:contest:volume')} (${quoteAsset})`}
                        decimal={0}
                        fieldName="total_volume"
                    />
                    <Column
                        minWidth={150}
                        visible={!previous}
                        align="right"
                        className="font-medium"
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
                </Table>
            )}
            {lastUpdated && lastUpdatedTime.current && (
                <div className="mt-6 text-sm font-medium leading-6 text-txtSecondary dark:text-txtSecondary-dark">
                    {t('nao:contest:last_updated_time_dashboard', { minute: 60 })}: {formatTime(lastUpdatedTime.current, 'HH:mm:ss DD/MM/YYYY')}
                </div>
            )}
        </section>
    );
};

export default ContestPerRanks;
