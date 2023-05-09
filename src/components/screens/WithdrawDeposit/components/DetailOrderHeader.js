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
        <div className="mb-12">
            <div className="flex justify-between items-start mb-6">
                {!side ? (
                    <Skeletor width="200px" />
                ) : (
                    <h2 className="text-2xl font-semibold">
                        {t(`dw_partner:${side?.toLowerCase()}_asset_from_partners.${mode}`, {
                            asset: assetCode
                        })}
                    </h2>
                )}
            </div>

            <Card className="border !border-divider dark:border-0 bg-white dark:bg-dark-4">
                <div className="flex flex-grow items-center justify-between">
                    <div className="flex items-center -m-5">
                        <div className="flex p-5">
                            <div className="">
                                <div className="mb-2">
                                    {!orderDetail ? (
                                        <Skeletor width="100px" />
                                    ) : (
                                        <TextCopyable className="gap-x-1 txtPri-1 " text={orderDetail?.displayingId} />
                                    )}
                                </div>
                                <div className="txtSecond-2 ">{formatTime(orderDetail?.createdAt, 'HH:mm:ss dd/MM/yyyy')}</div>
                            </div>
                        </div>

                        {/* <div className="flex justify-end text-right md:justify-start md:text-left p-2 w-1/2 md:w-1/4 ">
                        <div className="">
                            <div className="mb-2 capitalize txtPri-1">{orderDetail?.[`userMetadata`]?.name?.toLowerCase()}</div>
                            <div className="txtSecond-2 ">{orderDetail?.[`userMetadata`]?.code}</div>
                        </div>
                    </div> */}

                        <div className="flex p-5">
                            <div className="">
                                <div className="mb-2 txtPri-1">{t('dw_partner:rate')}</div>
                                <div className="txtSecond-2 ">
                                    1 {assetCode} ≈ {formatBalanceFiat(orderDetail?.price, 'VNDC')} VND
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex p-2 text-right ">
                        <div className="">
                            <div className="mb-2 txtPri-3 font-semibold">
                                {(side === SIDE.BUY && mode === MODE.USER) || (side === SIDE.SELL && mode === MODE.PARTNER) ? '+' : '-'}
                                {formatBalanceFiat(orderDetail?.baseQty, assetCode)} {assetCode}
                            </div>
                            <div className="txtSecond-2 ">{formatBalanceFiat(orderDetail?.quoteQty, 'VNDC')} VND</div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default DetailOrderHeader;
