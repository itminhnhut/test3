import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

import Skeletor from 'components/common/Skeletor';
import { TextLiner, CardNao, ButtonNao, Table, Column, getColor, renderPnl, Tooltip, capitalize, ImageNao } from 'components/screens/Nao/NaoStyle';
import { formatNumber, getS3Url } from 'redux/actions/utils';
import { formatTime } from 'utils/reference-utils';
import { truncate } from 'utils/helpers';

import useWindowSize from 'hooks/useWindowSize';
import NoData from 'components/common/V2/TableV2/NoData';
import TickFbIcon from 'components/svg/TickFbIcon';

const CONFIG_RANK = {
    vol_5: {
        title: { vi: 'iPhone 14 ProMax 256GB', en: 'iPhone 14 ProMax 256GB' },
        des: { vi: 'KLGD tối thiểu', en: 'Minimum Volume' },
        total: '03',
        total_klgd: '500,000,000,000 VNDC',
        bg_champ: '/images/contest/bg_ip_14.png'
    },
    vol_3: {
        title: { vi: 'iPad Pro M2 11 inch WiFi', en: 'iPad Pro M2 11 inch WiFi' },
        des: { vi: 'KLGD tối thiểu', en: 'Minimum Volume' },
        total: '05',
        total_klgd: '300,000,000,000 VNDC',
        bg_champ: '/images/contest/bg_ipad.png'
    },
    vol_2: {
        title: { vi: 'Apple Watch Series 7 LTE 41mm', en: 'Apple Watch Series 7 LTE 41mm' },
        des: { vi: 'KLGD tối thiểu', en: 'Minimum Volume' },
        total: '10',
        total_klgd: '200,000,000,000 VNDC',
        bg_champ: '/images/contest/bg_watch_s7.png'
    },
    vol_1: {
        title: { vi: 'Apple Watch SE 2022 LTE 44mm', en: 'Apple Watch SE 2022 LTE 44mm' },
        des: { vi: 'KLGD tối thiểu', en: 'Minimum Volume' },
        total: '20',
        total_klgd: '100,000,000,000 VNDC',
        bg_champ: '/images/contest/bg_watch_se.png'
    }
};

const MAX_LENGTH = 9;

const ListRankings = ({ isList, type, data, loading }) => {
    const { width } = useWindowSize();

    const {
        t,
        i18n: { language }
    } = useTranslation();

    const config = CONFIG_RANK[type];

    const renderRank = (data, item) => {
        return (
            <div className="flex items-center relative">
                <img src={getS3Url('/images/nao/contest/ic_top_teal.png')} className="w-6 h-6" width="24" height="24" alt="" />
                <span className="font-bold text-[0.625rem] leading-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute text-white">
                    {data?.[type]?.rank}
                </span>
            </div>
        );
    };

    const renderTeam = (data) => {
        return (
            <div className="flex flex-row">
                <div className="w-6 h-6 rounded-full bg-hover dark:bg-hover-dark mr-6"></div>
                <div className="text-sm font-semibold leading-6">{data}</div>
            </div>
        );
    };

    const renderPnl = (total_order) => {
        return (
            <div className="flex items-center font-medium justify-between pt-1">
                <span className={`text-right`}>{formatNumber(total_order, 0, 0, true)}</span>
            </div>
        );
    };

    const empty = () => {
        return (
            <div className={`pt-12 sm:py-8`}>
                <NoData textClassName="!text-sm sm:!text-base" isAuth text={t('nao:contest:no_rank')} />
            </div>
        );
    };

    const renderListRanks = () => {
        return (
            <>
                {data?.users?.length > 0 ? (
                    <div className="pt-6 sm:pt-14 sm:pb-6 flex flex-row justify-between flex-wrap gap-3 sm:gap-6">
                        {data?.users?.map((item, index) => {
                            return (
                                <CardNao key={index} className="!p-4 sm:!p-6">
                                    <div className="flex items-center justify-between flex-1 gap-5">
                                        <div className="flex items-center space-x-4">
                                            <div className="min-w-[4rem] min-h-[4rem] max-w-[4rem] max-h-[4rem] rounded-[50%] p-1 border-[1.5px] border-teal flex items-center">
                                                <ImageNao
                                                    className="object-cover w-14 h-14 rounded-full"
                                                    src={item?.avatar ? item?.avatar : getS3Url('/images/contest/img_name.png')}
                                                    alt=""
                                                />
                                            </div>
                                            <div className="space-y-1 flex flex-col text-sm sm:text-base">
                                                <div className="flex items-center gap-2 font-semibold capitalize">
                                                    <span>{capitalize(item?.name)}</span>
                                                    {item?.is_group_master && <TickFbIcon size={18} />}
                                                </div>
                                                <span className="text-txtSecondary dark:text-txtSecondary-dark cursor-pointer">{item?.onus_user_id}</span>
                                            </div>
                                        </div>
                                        <div className="text-5xl sm:text-6xl pb-0 font-semibold italic">#{item?.special_rank_metadata?.[type]?.rank ?? 1}</div>
                                    </div>
                                    <div className="mt-7 text-sm sm:text-base">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:volume')}</div>
                                            <span className="font-semibold">{formatNumber(item?.total_volume, 0)} VNDC</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-2 mt-2 sm:mt-4">
                                            <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:total_trades')}</div>
                                            <span className={`font-semibold`}>{formatNumber(item?.total_order)}</span>
                                        </div>
                                    </div>
                                </CardNao>
                            );
                        })}
                    </div>
                ) : (
                    empty()
                )}
                <div className="mt-3 text-xs text-txtSecondary dark:text-txtSecondary-dark">
                    {t('nao:contest:last_updated_time_dashboard', { minute: 60 })}: {formatTime(data?.last_time_update, 'HH:mm DD/MM/YYYY')}
                </div>
            </>
        );
    };

    const renderLastUpdate = () => {
        return (
            <div className="mt-3 text-xs text-txtSecondary dark:text-txtSecondary-dark">
                {t('nao:contest:last_updated_time_dashboard', { minute: 60 })}: {formatTime(data?.last_time_update, 'HH:mm DD/MM/YYYY')}
            </div>
        );
    };

    const renderTableDesktop = () => {
        return (
            <>
                <div className="lg:inline hidden">
                    {data?.users?.length > 0 ? (
                        <Table classWrapper="mt-8" loading={loading} noItemsMessage={t('nao:contest:no_rank')} dataSource={data?.users || []}>
                            <Column
                                minWidth={90}
                                className="text-txtSecondary dark:text-txtSecondary-dark font-medium"
                                title={t('nao:contest:rank')}
                                fieldName="special_rank_metadata"
                                cellRender={renderRank}
                            />
                            <Column minWidth={200} className="font-semibold uppercase" title={t('nao:contest:name')} fieldName="name" cellRender={renderTeam} />
                            <Column
                                title={t('nao:contest:id_onus_futures')}
                                minWidth={150}
                                sortable={true}
                                className="text-txtPrimary dark:text-txtPrimary-dark capitalize"
                                fieldName="onus_user_id"
                            />
                            <Column
                                align="right"
                                title={`${t('nao:contest:volume')} `}
                                decimal={0}
                                minWidth={150}
                                className="font-medium"
                                fieldName="total_volume"
                            />
                            <Column
                                align="right"
                                title={`${t('nao:contest:total_trades')}`}
                                decimal={0}
                                minWidth={150}
                                className="font-medium"
                                fieldName="total_order"
                            />
                        </Table>
                    ) : (
                        empty()
                    )}
                </div>
                {renderLastUpdate()}
            </>
        );
    };

    const renderTableMobi = () => {
        return (
            <>
                {data?.users?.length > 0 ? (
                    <div className="mt-3 flex flex-col space-y-3">
                        {data?.users?.map((item, index) => {
                            return (
                                <CardNao key={index} className="!p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <Image
                                                className="!rounded-full"
                                                width="36"
                                                height="36"
                                                src={`${item.avatar ? item.avatar : getS3Url('/images/nao/ic_nao_large.png')}`}
                                            />
                                            <div className="space-y-1">
                                                <div className="font-semibold text-sm flex space-x-1">
                                                    <span>{item.name}</span>
                                                    {item?.is_group_master && <TickFbIcon size={18} />}
                                                </div>
                                                <div className="text-txtSecondary-dark text-xs">{item.onus_user_id}</div>
                                            </div>
                                        </div>
                                        <div className="">{renderRank(item?.special_rank_metadata, index)}</div>
                                    </div>
                                    <div className="w-full">
                                        <div className="mt-4 flex flex-row justify-between items-center text-sm leading-6 font-medium">
                                            <div className="text-txtSecondary-dark">{t('nao:contest:volume')}</div>
                                            <div className="">{formatNumber(item?.total_volume, 0)} VNDC</div>
                                        </div>
                                        <div className="mt-1 flex flex-row justify-between items-center text-sm leading-6 font-medium">
                                            <div className="text-txtSecondary-dark">{t('nao:contest:total_trades')}</div>
                                            <div className="text-right">{formatNumber(item?.total_order, 0)}</div>
                                        </div>
                                    </div>
                                </CardNao>
                            );
                        })}
                    </div>
                ) : (
                    empty()
                )}
                {renderLastUpdate()}
            </>
        );
    };

    const renderTable = () => {
        return width >= 1024 ? renderTableDesktop() : renderTableMobi();
    };

    return (
        <div className="w-full h-full mt-20 sm:mt-[120px] first:mt-12 sm:first:mt-20">
            <div className="w-full flex flex-col sm:flex-row items-center sm:space-x-20 sm:border-b dark:border-b-gray-7">
                <Image src={getS3Url(config.bg_champ)} width="390px" height="252px" />
                <div className="mt-4 sm:mt-0 text-center sm:text-left">
                    <div className="text-xl sm:text-6xl flex font-semibold justify-center space-x-1">
                        <span className="text-teal">{config?.total}</span>
                        <span>{config.title[language]}</span>
                    </div>
                    <div className="text-sm sm:text-base mt-2 dark:text-txtSecondary-dark">
                        {config.des[language]}: {config.total_klgd}
                    </div>
                </div>
            </div>

            {!isList ? renderListRanks() : renderTable()}
        </div>
    );
};

export default ListRankings;

ListRankings.defaultProps = {
    type: 'vol_5',
    isList: false
};
