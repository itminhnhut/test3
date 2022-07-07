import React, { useState, useEffect } from 'react';
import Portal from 'components/hoc/Portal';
import classNames from 'classnames';
import { TextLiner, CardNao, ButtonNao, Table, Column, getColor, renderPnl } from 'components/screens/Nao/NaoStyle';
import { useTranslation } from 'next-i18next';
import fetchApi from 'utils/fetch-api';
import { API_CONTEST_GET_GROUP_DETAIL } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import { getS3Url, formatNumber } from 'redux/actions/utils';
import useWindowSize from 'hooks/useWindowSize';
import Skeletor from 'components/common/Skeletor';

const ContestDetail = ({ visible = true, onClose, sortName = 'volume', rowData }) => {
    const { t } = useTranslation();
    const { width } = useWindowSize()
    const [dataSource, setDataSource] = useState(null)

    useEffect(() => {
        getDetail(rowData?.displaying_id);
    }, [rowData])

    const getDetail = async (id) => {
        try {
            const { data, status } = await fetchApi({
                url: API_CONTEST_GET_GROUP_DETAIL,
                params: {
                    displaying_id: id
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

    useEffect(() => {
        if (visible) {
            document.body.classList.add('overflow-hidden')
        }
        return () => {
            document.body.classList.remove('overflow-hidden')
        }
    }, [visible])

    const rank = sortName === 'pnl' ? 'current_rank_pnl' : 'current_rank_volume';

    return (
        <Portal portalId='PORTAL_MODAL'>
            <div
                className={classNames(
                    'flex justify-center items-center flex-col fixed top-0 right-0 h-full w-full z-[20] bg-nao-bgModal2/[0.9] overflow-hidden',
                    { invisible: !visible },
                    { visible: visible },
                )}
            >
                <div className="bg-[#0E1D32] px-5 py-7 sm:px-10 sm:py-11 rounded-xl w-[calc(100%-32px)] max-w-[979px] overflow-y-auto">
                    <div className="flex sm:items-center sm:justify-between gap-2 lg:gap-20 flex-wrap lg:flex-row flex-col">
                        <div className="flex items-center gap-7">
                            <TextLiner className="!text-[4.125rem] !leading-[100px] !pb-0" liner>#{dataSource?.[rank]}</TextLiner>
                            <div className="flex flex-col">
                                <div className="text-[20px] leading-8 font-semibold">
                                    {!dataSource ? <Skeletor width={120} height={20} /> : dataSource?.name}
                                </div>
                                <div className="text-sm text-nao-text leading-6 mt-[6px]">
                                    {!dataSource ? <Skeletor width={80} height={10} /> : dataSource?.leader_name}
                                </div>
                            </div>
                        </div>
                        <CardNao className="!py-5 !px-[26px] !min-h-[92px] sm:flex-row w-full">
                            <div className="flex sm:flex-col gap-1 justify-between sm:justify-start">
                                <label className="text-sm text-nao-text leading-6 whitespace-nowrap">{t('nao:contest:volume_ranking')}</label>
                                <span className="font-semibold">#{dataSource?.current_rank_volume}</span>
                            </div>
                            <div className="h-[1px] sm:h-auto w-full sm:w-[1px] bg-nao-grey/[0.2] sm:mx-6 my-2 sm:my-0 "></div>
                            <div className="flex sm:flex-col gap-1 justify-between sm:justify-start">
                                <label className="text-sm text-nao-text leading-6 whitespace-nowrap">{t('nao:contest:volume')}</label>
                                <span className="font-semibold">{formatNumber(dataSource?.total_volume, 0)} VNDC</span>
                            </div>
                            <div className="h-[1px] sm:h-auto w-full sm:w-[1px] bg-nao-grey/[0.2] sm:mx-6 my-2 sm:my-0 "></div>
                            <div className="flex sm:flex-col gap-1 justify-between sm:justify-start">
                                <label className="text-sm text-nao-text leading-6 whitespace-nowrap">{t('nao:contest:pnl_ranking')}</label>
                                <span className="font-semibold">#{dataSource?.current_rank_pnl}</span>
                            </div>
                            <div className="h-[1px] sm:h-auto w-full sm:w-[1px] bg-nao-grey/[0.2] sm:mx-6 my-2 sm:my-0 "></div>
                            <div className="flex sm:flex-col gap-1 justify-between sm:justify-start">
                                <label className="text-sm text-nao-text leading-6 whitespace-nowrap">{t('nao:contest:per_pnl')}</label>
                                <span className={`font-semibold ${getColor(dataSource?.pnl)}`}>
                                    {`${dataSource?.pnl > 0 ? '+' : ''}${formatNumber(dataSource?.pnl, 2, 0, true)}%`}
                                </span>
                            </div>
                        </CardNao>
                    </div>
                    {width <= 640 ?
                        <CardNao noBg className="mt-5 !py-3 !px-2">
                            <div className="flex mx-3 gap-4 sm:gap-6 text-nao-grey text-sm font-medium pb-2 border-b border-nao-grey/[0.2]">
                                <div className="min-w-[31px]">{t('nao:contest:no')}</div>
                                <div>{t('nao:contest:information')}</div>
                            </div>
                            <div className="flex nao-table flex-col overflow-y-auto mt-3 pr-[10px]">
                                {Array.isArray(dataSource?.members) && dataSource?.members?.length > 0 ?
                                    dataSource?.members.map((item, index) => {
                                        return (
                                            <div key={index} className={`flex gap-4 sm:gap-6 p-3 ${index % 2 !== 0 ? 'bg-nao/[0.15] rounded-lg' : ''}`}>
                                                <div className="min-w-[31px] text-nao-grey text-sm font-medium">{index + 1}</div>
                                                <div className="text-sm flex-1">
                                                    <div className="font-semibold leading-6">{item?.name}</div>
                                                    <div className='flex flex-col gap-1 mt-[6px]'>
                                                        <div className="font-medium leading-6 cursor-pointer flex justify-between items-center">
                                                            <div className="text-nao-grey ">ID: </div>
                                                            <div className="text-nao-text">{item?.onus_user_id}</div>
                                                        </div>
                                                        <div className="font-medium flex items-center justify-between pt-2">
                                                            <div className="leading-6 text-nao-grey">{t('nao:contest:trades')}</div>
                                                            <span className="text-right text-nao-text">{formatNumber(item?.total_order, 0)}</span>
                                                        </div>
                                                        <div className="font-medium flex items-center justify-between pt-2">
                                                            <div className="leading-6 text-nao-grey">{t('nao:contest:volume')}</div>
                                                            <span className="text-right">{formatNumber(item?.total_volume, 0)} VNDC</span>
                                                        </div>
                                                        <div className="font-medium flex items-center justify-between pt-1">
                                                            <div className="leading-6 text-nao-grey">{t('nao:contest:per_pnl')}</div>
                                                            <span className={`text-right ${getColor(item?.pnl)}`}>
                                                                {`${item.pnl > 0 ? '+' : ''}${formatNumber(item.pnl, 2, 0, true)}%`}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                    :
                                    <div className={`flex items-center justify-center flex-col m-auto`}>
                                        <img src={getS3Url(`/images/icon/icon-search-folder_dark.png`)} width={100} height={100} />
                                        <div className="text-xs text-nao-grey mt-1">{t('common:no_data')}</div>
                                    </div>
                                }
                            </div>
                        </CardNao>
                        :
                        <Table dataSource={dataSource?.members ?? []} >
                            <Column minWidth={70} className="text-nao-grey font-medium" title={t('nao:contest:no')} fieldName={"index"} />
                            <Column minWidth={200} className="font-semibold capitalize" title={t('nao:contest:name')} fieldName="name" />
                            <Column minWidth={200} ellipsis className="text-nao-text" title={'ID ONUS Futures'} fieldName="onus_user_id" />
                            <Column minWidth={100} className="font-medium" title={t('nao:contest:trades')} fieldName="total_order" />
                            <Column minWidth={150} align="right" className="font-medium" title={t('nao:contest:volume')} decimal={0} suffix="VNDC" fieldName="total_volume" />
                            <Column minWidth={100} align="right" className="font-medium" title={t('nao:contest:per_pnl')} fieldName="pnl" cellRender={renderPnl} />
                        </Table>
                    }

                    <div className="w-max mt-7 sm:mt-10 m-auto">
                        <ButtonNao onClick={onClose} className="py-2 px-11 !rounded-md font-semibold">{t('common:close')}</ButtonNao>
                    </div>
                </div>
            </div>
        </Portal>
    );
};

export default ContestDetail;
