import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

import Skeletor from 'components/common/Skeletor';
import { TextLiner, CardNao, ButtonNao, Table, Column, getColor, renderPnl, Tooltip, capitalize, ImageNao } from 'components/screens/Nao/NaoStyle';
import { formatNumber, getS3Url } from 'redux/actions/utils';
import { formatTime } from 'utils/reference-utils';
import { truncate } from 'utils/helpers';

import useWindowSize from 'hooks/useWindowSize';

const CONFIG_RANK = {
    vol_5: {
        title: { vi: 'iPhone 14 ProMax 256GB', en: 'iPhone 14 ProMax 256GB' },
        des: { vi: 'KLGD tối thiểu', en: 'Minimum Volume' },
        total: '03',
        total_klgd: '500,000,000,000 VNDC',
        bg_champ: getS3Url('/images/contest/bg_first.png')
    },
    vol_3: {
        title: { vi: 'iPad Pro M2 11 inch WiFi', en: 'iPad Pro M2 11 inch WiFi' },
        des: { vi: 'KLGD tối thiểu', en: 'Minimum Volume' },
        total: '05',
        total_klgd: '300,000,000,000 VNDC',
        bg_champ: getS3Url('/images/contest/bg_second.png')
    },
    vol_2: {
        title: { vi: 'Apple Watch Series 7 LTE 41mm', en: 'Apple Watch Series 7 LTE 41mm' },
        des: { vi: 'KLGD tối thiểu', en: 'Minimum Volume' },
        total: '10',
        total_klgd: '200,000,000,000 VNDC',
        bg_champ: getS3Url('/images/contest/bg_three.png')
    },
    vol_1: {
        title: { vi: 'Apple Watch SE 2022 LTE 44mm', en: 'Apple Watch SE 2022 LTE 44mm' },
        des: { vi: 'KLGD tối thiểu', en: 'Minimum Volume' },
        total: '20',
        total_klgd: '100,000,000,000 VNDC',
        bg_champ: getS3Url('/images/contest/bg_four.png')
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
                <div className="absolute w-6 h-6">
                    <Image src={getS3Url('/images/contest/ic_avatar.png')} width="24px" height="24px" />
                </div>
                <div className="text-[#E6E6E6] font-semibold shadow-rank_id text-xs absolute flex w-6 justify-center">{data?.[type]?.rank}</div>
            </div>
        );
    };

    const renderTeam = (data) => {
        return (
            <div className="flex flex-row">
                <div className="w-6 h-6 rounded-full bg-[#273446] mr-6"></div>
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
            <div className={`pt-[148px] lg:pt-[172px] flex items-start justify-center flex-col m-auto`}>
                <div className="text-tiny font-medium text-nao-grey">{t('nao:contest:no_rank')}</div>
            </div>
        );
    };

    const renderListRanks = () => {
        return (
            <>
                {data?.users?.length > 0 ? (
                    <div className="pt-[148px] lg:pt-[172px] flex flex-row justify-between flex-wrap gap-y-6">
                        {data?.users?.map((item, index) => {
                            return (
                                <div key={index} className="sm:w-[48%] w-full lg:w-[346px] rounded-t-xl border-b-0 bg-rank bg-no-repeat bg-100%">
                                    <div className="sm:bg-cover sm:w-[100%] h-[74px] bg-rank-header relative flex items-center rounded-t-xl">
                                        <img
                                            className="rounded-full w-12 h-12 absolute left-4 bottom-0 translate-y-6"
                                            src={item?.avatar ? item?.avatar : getS3Url('/images/contest/img_name.png')}
                                        />
                                        <div className="text-[32px] font-semibold text-nao-green absolute right-4">#{index + 1}</div>
                                    </div>
                                    <div className="mt-8 px-4">
                                        <div className="leading-8">
                                            <div className="font-semibold">{item.name}</div>
                                        </div>
                                        <div className="text-nao-text font-normal text-sm ">{item.onus_user_id}</div>
                                        <div className="bg-rank-line h-[1px] my-6"></div>

                                        <div className="flex flex-row justify-between items-center">
                                            <div className="text-nao-grey font-normal leading-6 text-sm">{t('nao:contest:volume')}</div>
                                            <div className="font-semibold leading-8">{formatNumber(item?.total_volume, 0)}</div>
                                        </div>
                                        <div className="flex flex-row justify-between items-center mt-1">
                                            <div className="text-nao-grey font-normal leading-6 text-sm">{t('nao:contest:total_trades')}</div>
                                            <div className="text-nao-green font-semibold leading-8">{formatNumber(item?.total_order, 0)}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    empty()
                )}
                <div className="mt-6 text-xs text-nao-grey font-medium">
                    {t('nao:contest:last_updated_time')}: {formatTime(data?.last_time_update, 'HH:mm:ss DD/MM/YYYY')}
                </div>
            </>
        );
    };

    const renderLastUpdate = () => {
        return (
            <div className="mt-4 lg:mt-6 text-xs text-nao-grey font-medium">
                {t('nao:contest:last_updated_time')}: {formatTime(data?.last_time_update, 'HH:mm:ss DD/MM/YYYY')}
            </div>
        );
    };

    const renderTableDesktop = () => {
        return (
            <>
                <div className="lg:inline hidden">
                    {data?.users?.length > 0 ? (
                        <Table classWrapper="mt-[172px]" loading={loading} noItemsMessage={t('nao:contest:no_rank')} dataSource={data?.users || []}>
                            <Column
                                minWidth={90}
                                className="text-nao-grey font-medium"
                                title={t('nao:contest:rank')}
                                fieldName="special_rank_metadata"
                                cellRender={renderRank}
                            />
                            <Column minWidth={200} className="font-semibold uppercase" title={t('nao:contest:name')} fieldName="name" cellRender={renderTeam} />
                            <Column
                                title={t('nao:contest:id_onus_futures')}
                                minWidth={150}
                                sortable={true}
                                className="text-nao-text capitalize"
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
                    <CardNao noBg className="mt-[168px] !py-[1.125rem] !px-3 inline lg:hidden">
                        <div className="flex mx-3 gap-4 sm:gap-6 text-nao-grey text-sm font-medium pb-2 border-b border-nao-grey/[0.2]">
                            <div className="min-w-[31px]">{t('nao:contest:rank')}</div>
                            <div>{t('nao:contest:information')}</div>
                        </div>
                        <div className="mt-3">
                            {data?.users?.map((item, index) => {
                                return (
                                    <div key={index} className={`flex gap-4 sm:gap-6 p-3 cursor-pointer ${index % 2 !== 0 ? 'bg-nao/[0.15] rounded-lg' : ''}`}>
                                        <div className="mr-[20px] mt-3">{renderRank(item, index)}</div>
                                        <div className="w-full">
                                            <div className="flex flex-row justify-between">
                                                <div className="leading-6 text-sm">
                                                    <div className="font-semibold ">{item.name}</div>
                                                    <div className="text-nao-text font-medium">ID: {truncate(item.onus_user_id, 15)}</div>
                                                </div>
                                                <Image
                                                    className="!rounded-full"
                                                    width="44px"
                                                    height="44px"
                                                    src={`${item.avatar ? item.avatar : getS3Url('/images/nao/ic_nao_large.png')}`}
                                                />
                                            </div>
                                            <div className="mt-4 flex flex-row justify-between items-center text-sm leading-6 font-medium">
                                                <div className="text-nao-text ">{t('nao:contest:volume')}</div>
                                                <div className="">{formatNumber(item?.total_volume, 0)} VNDC</div>
                                            </div>
                                            <div className="mt-1 flex flex-row justify-between items-center text-sm leading-6 font-medium">
                                                <div className="text-nao-text ">{t('nao:contest:total_trades')}</div>
                                                <div className="text-right">{formatNumber(item?.total_order, 0)}</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardNao>
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
        <div className="w-full max-w-[1160px] h-full bg-nao-grey3 rounded-3xl px-3 py-3 lg:px-8 lg:pb-8 relative mt-[230px]">
            <div className="w-full h-[274px] absolute left-0 top-0 -translate-y-2/4">
                <div className="flex justify-center">
                    <Image src={config.bg_champ} width="306px" height="198px" />
                </div>
                <div className="flex flex-row font-semibold leading-8 mt-4 justify-center">
                    <span className="text-nao-green mr-1">{config?.total}</span> {config.title[language]}
                </div>
                <div className="text-nao-text text-sm font-normal text-center mt-1 leading-3">
                    {config.des[language]}: {config.total_klgd}
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
