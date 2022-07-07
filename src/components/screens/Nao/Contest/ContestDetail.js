import React, { useState, useEffect } from 'react';
import Portal from 'components/hoc/Portal';
import classNames from 'classnames';
import { TextLiner, CardNao, ButtonNao, Table, Column, getColor, renderPnl } from 'components/screens/Nao/NaoStyle';
import { useTranslation } from 'next-i18next';
import fetchApi from 'utils/fetch-api';
import { API_CONTEST_GET_GROUP_DETAIL } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import { getS3Url, formatNumber } from 'redux/actions/utils';

const ContestDetail = ({ visible = true, onClose, sortName = 'pnl' }) => {
    const { t } = useTranslation();
    const [dataSource, setDataSource] = useState(null)

    useEffect(() => {
        getDetail();
    }, [])

    const getDetail = async () => {
        try {
            const { data, status } = await fetchApi({
                url: API_CONTEST_GET_GROUP_DETAIL,
                params: {
                    displaying_id: '456788'
                }
            });
            if (data && status === ApiStatus.SUCCESS) {
                setDataSource(data);
            }
        } catch (e) {
            console.log(e)
        } finally {

        }
    }

    console.log(dataSource)
    const rank = sortName === 'pnl' ? 'current_rank_pnl' : 'current_rank_volume'

    return (
        <Portal portalId='PORTAL_MODAL'>
            <div
                className={classNames(
                    'flex justify-center items-center flex-col fixed top-0 right-0 h-full w-full z-[20] bg-nao-bgModal2/[0.9] overflow-hidden',
                    { invisible: !visible },
                    { visible: visible },
                )}
            >
                <div className="bg-[#0E1D32] px-10 py-11 rounded-xl mx-4">
                    <div className="flex items-center justify-between gap-20 flex-wrap sm:flex-row flex-col">
                        <div className="flex items-center gap-7">
                            <TextLiner className="!text-[4.125rem] !leading-[100px] !pb-0" liner>#{dataSource?.[rank]}</TextLiner>
                            <div className="flex flex-col">
                                <div className="text-[20px] leading-8">{dataSource?.name}</div>
                                <div className="text-sm text-nao-text leading-6 mt-[6px]">{dataSource?.leader_name}</div>
                            </div>
                        </div>
                        <CardNao className="!py-5 !px-[26px] !min-h-[92px] sm:flex-row">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-nao-text leading-6">{t('nao:contest:volume_ranking')}</label>
                                <span className="font-semibold">#{dataSource?.current_rank_volume}</span>
                            </div>
                            <div className="h-[1px] sm:h-auto w-full sm:w-[1px] bg-nao-grey/[0.2] mx-6"></div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-nao-text leading-6">{t('nao:contest:volume')}</label>
                                <span className="font-semibold">{formatNumber(dataSource?.total_volume, 0)} VNDC</span>
                            </div>
                            <div className="h-[1px] sm:h-auto w-full sm:w-[1px] bg-nao-grey/[0.2] mx-6"></div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-nao-text leading-6">{t('nao:contest:per_pnl')}</label>
                                <span className={`font-semibold ${getColor(dataSource?.pnl)}`}>
                                    {`${dataSource?.pnl > 0 ? '+' : ''}${formatNumber(dataSource?.pnl, 2, 0, true)}%`}
                                </span>
                            </div>
                            <div className="h-[1px] sm:h-auto w-full sm:w-[1px] bg-nao-grey/[0.2] mx-6"></div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-nao-text leading-6">{t('nao:contest:pnl_ranking')}</label>
                                <span className="font-semibold">#{dataSource?.current_rank_pnl}</span>
                            </div>
                        </CardNao>
                    </div>
                    <Table dataSource={dataSource?.members ?? []} >
                        <Column minWidth={100} className="text-nao-grey font-medium" title={t('nao:contest:no')} fieldName={"current_rank"} />
                        <Column minWidth={150} className="font-semibold" title={t('nao:contest:name')} fieldName="name" />
                        <Column minWidth={150} className="text-nao-text" title={'ID ONUS Futures'} fieldName="onus_user_id" />
                        <Column minWidth={100} align="right" className="font-medium" title={t('nao:contest:trades')} fieldName="total_order" />
                        <Column minWidth={200} align="right" className="font-medium" title={t('nao:contest:volume')} decimal={0} suffix="VNDC" fieldName="total_volume" />
                        <Column minWidth={150} align="right" className="font-medium" title={t('nao:contest:per_pnl')} fieldName="pnl" cellRender={renderPnl} />
                    </Table>
                    <div className="w-max mt-10 m-auto">
                        <ButtonNao className="py-2 px-11 !rounded-md">{t('common:close')}</ButtonNao>
                    </div>
                </div>
            </div>
        </Portal>
    );
};

export default ContestDetail;