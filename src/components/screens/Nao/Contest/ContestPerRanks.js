import React, { useState, useMemo, useEffect } from 'react';
import { TextLiner, CardNao, ButtonNao, Table, Column, getColor, renderPnl } from 'components/screens/Nao/NaoStyle';
import { useTranslation } from 'next-i18next';
import useWindowSize from 'hooks/useWindowSize';
import fetchApi from 'utils/fetch-api';
import { API_CONTEST_GET_RANK_MEMBERS_PNL, API_CONTEST_GET_RANK_MEMBERS_VOLUME } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import { formatNumber, getS3Url } from 'redux/actions/utils';

const ContestPerRanks = () => {
    const [tab, setTab] = useState('volume');
    const { t } = useTranslation();
    const { width } = useWindowSize()
    const [dataSource, setDataSource] = useState([]);
    const [top3, setTop3] = useState([]);

    useEffect(() => {
        getRanks();
    }, [])

    const rank = tab === 'pnl' ? 'individual_rank_pnl' : 'individual_rank_volume';

    const getRanks = async (tab) => {
        if (Date.now() > new Date('2022-07-07T17:00:00.000Z').getTime()) {
            return
        }
        try {
            const { data, status } = await fetchApi({
                url: tab === 'pnl' ? API_CONTEST_GET_RANK_MEMBERS_PNL : API_CONTEST_GET_RANK_MEMBERS_VOLUME,
            });
            if (data && status === ApiStatus.SUCCESS) {
                const sliceIndex = data[0]?.[rank] > 0 ? 3 : 0
                const _top3 = data.slice(0, sliceIndex);
                const _dataSource = data.slice(sliceIndex)
                setTop3(_top3);
                setDataSource(_dataSource);
            }
        } catch (e) {
            console.log(e)
        } finally {

        }
    }

    const onFilter = (key) => {
        if (tab === key) return;
        getRanks(key)
        setTab(key)
    }



    return (
        <section className="contest_individual_ranks pt-[70px]">
            <div className="flex justify-between flex-wrap gap-4">
                <TextLiner>{t('nao:contest:individual_ranking')}</TextLiner>
                <div className="flex items-center gap-3 text-sm">
                    <ButtonNao
                        onClick={() => onFilter('volume')}
                        className={`px-4 py-2 !rounded-md ${tab === 'volume' ? 'font-semibold' : '!bg-nao-bg3'}`}>{t('nao:contest:volume')}</ButtonNao>
                    <ButtonNao
                        onClick={() => onFilter('pnl')}
                        className={`px-4 py-2 !rounded-md   ${tab === 'pnl' ? 'font-semibold' : '!bg-nao-bg3'}`}>{t('nao:contest:per_pnl')}</ButtonNao>
                </div>
            </div>
            <div className="flex items-center flex-wrap gap-5 sm:gap-[22px] mt-8">
                {top3.map((item, index) => (
                    <CardNao key={index} className="!p-5 !bg-transparent border border-nao-border2">
                        <div className="flex items-center gap-[30px] sm:gap-6">
                            <TextLiner className="!text-[4.125rem] !leading-[100px] !pb-0" liner>#{index + 1}</TextLiner>
                            <div className="gap-1 flex flex-col">
                                <div className="text-lg font-semibold leading-8">{item?.name}</div>
                                <span className="text-nao-grey text-sm font-medium cursor-pointer">{item?.onus_user_id}</span>
                            </div>
                        </div>
                        <div className="rounded-lg mt-7">
                            <div className="flex items-center justify-between gap-2">
                                <div className="text-sm text-nao-text">{t('nao:contest:volume')}</div>
                                <span className="font-semibold leading-8">{formatNumber(item?.total_volume, 0)} VNDC</span>
                            </div>
                            <div className="h-[1px] bg-nao-grey/[0.2] w-full my-2"></div>
                            <div className="flex items-center justify-between gap-2">
                                <div className="text-sm text-nao-text">{t('nao:contest:per_pnl')}</div>
                                <span className={`font-semibold leading-8 ${getColor(item.pnl)}`}>
                                    {item?.pnl !== 0 && item?.pnl > 0 ? '+' : ''}{formatNumber(item?.pnl, 2, 0, true)}%
                                </span>
                            </div>
                        </div>
                    </CardNao>
                ))}
            </div>

            {width <= 640 ?
                <CardNao noBg className="mt-5 !py-[18px] !px-3">
                    <div className="flex mx-3 gap-6 text-nao-grey text-sm font-medium pb-2 border-b border-nao-grey/[0.2]">
                        <div className="min-w-[31px]">{t('nao:contest:rank')}</div>
                        <div>{t('nao:contest:information')}</div>
                    </div>
                    <div className="flex nao-table flex-col overflow-y-auto mt-3 pr-[10px]">
                        {Array.isArray(dataSource) && dataSource?.length > 0 ?
                            dataSource.map((item, index) => {
                                return (
                                    <div key={index} className={`flex gap-6 p-3 ${index % 2 !== 0 ? 'bg-nao/[0.15] rounded-lg' : ''}`}>
                                        <div className="min-w-[31px] text-nao-grey text-sm font-medium">{item?.[rank] || '-'}</div>
                                        <div className="text-sm flex-1">
                                            <label className="font-semibold leading-6">{item?.name}</label>
                                            <div className="text-nao-grey font-medium leading-6 cursor-pointer">ID: {item?.onus_user_id}</div>
                                            <div className="flex items-center font-medium justify-between pt-2">
                                                <label className="leading-6 text-nao-grey">{t('nao:contest:volume')}</label>
                                                <span className="text-right">{formatNumber(item?.total_volume, 0)} VNDC</span>
                                            </div>
                                            <div className="flex items-center font-medium justify-between pt-1">
                                                <label className="leading-6 text-nao-grey">{t('nao:contest:per_pnl')}</label>
                                                <span className={`text-right ${getColor(item?.pnl)}`}>
                                                    {`${item.pnl > 0 ? '+' : ''}${formatNumber(item.pnl, 2, 0, true)}%`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            :
                            <div className={`flex items-center justify-center flex-col m-auto`}>
                                <img src={getS3Url(`/images/icon/icon-search-folder_dark.png`)} width={100} height={100} />
                                <div className="text-xs text-nao-grey mt-1">{t('nao:contest:no_rank')}</div>
                            </div>
                        }
                    </div>
                </CardNao>
                :
                <Table noItemsMessage={t('nao:contest:no_rank')} dataSource={dataSource} >
                    <Column minWidth={100} className="text-nao-grey font-medium" title={t('nao:contest:rank')} fieldName={rank} cellRender={(data, item) => <div>{item?.[rank] || '-'}</div>} />
                    <Column minWidth={200} className="font-semibold capitalize" title={t('nao:contest:name')} fieldName="name" />
                    <Column minWidth={300} className="text-nao-text" title={'ID ONUS Futures'} fieldName="onus_user_id" />
                    <Column minWidth={200} align="right" className="font-medium" title={t('nao:contest:volume')} decimal={0} suffix="VNDC" fieldName="total_volume" />
                    <Column minWidth={200} align="right" className="font-medium" title={t('nao:contest:per_pnl')} fieldName="pnl" cellRender={renderPnl} />
                </Table>
            }
        </section>
    );
};

export default ContestPerRanks;
