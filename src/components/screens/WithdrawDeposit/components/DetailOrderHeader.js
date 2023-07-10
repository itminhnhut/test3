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
        <div className="">
            <div className="flex mb-6">
                {!side ? (
                    <Skeletor width="200px" />
                ) : (
                    <h2 className="text-2xl font-semibold">
                        {t(`dw_partner:${side?.toLowerCase()}_asset_from_partners.${mode}`, {
                            asset: assetCode
                        })}
                    </h2>
                )}
                <div className="ml-6">
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
            </div>

            <Card className="border !border-divider dark:border-0 bg-white dark:bg-dark-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-10 txtPri-1">
                        <div>
                            <div className="mb-2 txtSecond-3">Mã lệnh</div>
                            <div>
                                {!orderDetail ? <Skeletor width="100px" /> : <TextCopyable className="gap-x-1 txtPri-1" text={orderDetail?.displayingId} />}
                            </div>
                        </div>
                        <div>
                            <div className="mb-2 txtSecond-3">{t('dw_partner:rate')}</div>
                            <div>
                                1 {assetCode} = {formatBalanceFiat(orderDetail?.price, 'VNDC')} VND
                            </div>
                        </div>
                        <div>
                            <div className="mb-2 txtSecond-3">{t('common:time')}</div>
                            <div>{formatTime(orderDetail?.createdAt, 'HH:mm:ss dd/MM/yyyy')}</div>
                        </div>
                        {orderDetail?.fee ? (
                            <div>
                                <div className="mb-2 txtSecond-3">{t('dw_partner:partner_bonus')}</div>
                                <div>{formatBalanceFiat(orderDetail?.fee, 'VNDC')} VND</div>
                            </div>
                        ) : null}
                    </div>

                    <div className="flex text-right ">
                        <div className="">
                            <div className="mb-1 txtPri-3 font-semibold">
                                {(side === SIDE.BUY && mode === MODE.USER) || (side === SIDE.SELL && mode === MODE.PARTNER) ? '+' : '-'}
                                {formatBalanceFiat(orderDetail?.baseQty, assetCode)} {assetCode}
                            </div>
                            <div className="txtSecond-3">{formatBalanceFiat(orderDetail?.quoteQty, 'VNDC')} VND</div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default DetailOrderHeader;
