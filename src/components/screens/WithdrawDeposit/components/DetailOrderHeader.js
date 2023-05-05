import React from 'react';
import Card from './common/Card';
import { PartnerAcceptStatus, PartnerOrderStatus } from 'redux/actions/const';
import Skeletor from 'components/common/Skeletor';
import { formatBalanceFiat, formatTime } from 'redux/actions/utils';
import TextCopyable from 'components/screens/Account/TextCopyable';
import { useTranslation } from 'next-i18next';
import OrderStatusTag from 'components/common/OrderStatusTag';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import { MODE } from '../constants';
import { CountdownClock } from './common/CircleCountdown';
import TagV2, { TYPES } from 'components/common/V2/TagV2';

const DetailOrderHeader = ({ orderDetail, status, side, mode, assetCode, refetchOrderDetail }) => {
    const { t } = useTranslation();

    return (
        <Card className="mb-12 border !border-divider dark:border-0 bg-white dark:bg-dark-4">
            <div className="flex flex-wrap justify-between">
                <div className="w-1/2 md:w-1/3 ">
                    <div className="txtSecond-2 mb-3">{t('common:status')}</div>
                    <div className="flex -m-1 flex-wrap items-center">
                        <div className="p-1">
                            {!orderDetail ? (
                                <Skeletor width="150px" />
                            ) : status?.partnerAcceptStatus === PartnerAcceptStatus.PENDING && status?.status === PartnerOrderStatus.PENDING ? (
                                <TagV2 type={TYPES.DEFAULT} className="!bg-divider dark:!bg-divider-dark">
                                    {t('dw_partner:wait_confirmation')}
                                </TagV2>
                            ) : (
                                <OrderStatusTag className="!ml-0" status={status?.status} />
                            )}
                        </div>

                        {status?.status === PartnerOrderStatus.PENDING && orderDetail?.timeExpire && (
                            <div className="p-1">
                                <CountdownClock
                                    countdownTime={orderDetail?.countdownTime}
                                    onComplete={() => refetchOrderDetail()}
                                    timeExpire={orderDetail?.timeExpire}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex mt-6 md:mt-0 gap-12 justify-between md:justify-center order-3 md:order-2 w-full md:w-1/3 md:border-l md:border-r border-divider dark:border-divider-dark">
                    <div className="">
                        <div className="txtSecond-2 mb-3">{t('dw_partner:order_id')}</div>
                        {!orderDetail ? <Skeletor width="100px" /> : <TextCopyable className="gap-x-1 txtPri-1" text={orderDetail?.displayingId} />}
                    </div>
                    <div className="">
                        <div className="txtSecond-2 mb-3 text-right md:text-left">{t('common:time')}</div>
                        {!orderDetail ? (
                            <Skeletor width="100px" />
                        ) : (
                            <div className="txtPri-1 text-right md:text-left">{formatTime(orderDetail?.createdAt, 'HH:mm:ss dd/MM/yyyy')}</div>
                        )}
                    </div>
                </div>
                <div className="w-1/2  order-2 md:order-3 md:w-1/3 flex justify-end">
                    <div>
                        <div className="txtSecond-2 text-right mb-3">{t('dw_partner:amount')}</div>
                        <div className="mt-3 txtPri-3 font-semibold text-right ">
                            {!orderDetail ? (
                                <Skeletor width="200px" height="30px" />
                            ) : (
                                `${(side === SIDE.BUY && mode === MODE.USER) || (side === SIDE.SELL && mode === MODE.PARTNER) ? '+' : '-'}${formatBalanceFiat(
                                    orderDetail?.baseQty,
                                    assetCode
                                )} ${assetCode}`
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default DetailOrderHeader;
