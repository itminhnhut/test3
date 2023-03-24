import React from 'react';
import CountdownTimer from '../../common/CountdownTimer';
import OrderStatusTag from 'components/common/OrderStatusTag';
import { shortHashAddress, getAssetCode, formatTime, formatNumber, formatPhoneNumber, getS3Url } from 'redux/actions/utils';
import TextCopyable from 'components/screens/Account/TextCopyable';
import InfoCard from './components/common/InfoCard';
import { Clock } from 'react-feather';
import { QrCodeScannIcon } from 'components/svg/SvgIcon';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { PartnerOrderStatus, PartnerPersonStatus } from 'redux/actions/const';

const GroupInforCard = ({ t, orderDetail, side, setOnShowQr, status }) => {
    return (
        <div className="flex gap-x-6 w-full items-stretch">
            {/* Chi tiết giao dịch */}
            <div className="flex flex-col flex-auto min-h-full">
                <h1 className="text-2xl font-semibold">{t('payment-method:transaction_details')}</h1>
                <div className="flex-1 overflow-auto rounded-xl bg-white dark:bg-dark-4 border border-divider dark:border-transparent p-6 mt-6 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <h2 className="font-semibold">
                                {t('payment-method:depsit_from_partners', {
                                    asset: getAssetCode(orderDetail?.baseAssetId)
                                })}
                            </h2>
                            <OrderStatusTag status={orderDetail?.status} />
                        </div>
                        <div>
                            <span className="txtSecond-2">So luong</span>
                            <div className="mt-3 text-2xl font-semibold">
                                {side === 'BUY' ? '+' : '-'}
                                {formatNumber(orderDetail?.baseQty)} VNDC
                            </div>
                        </div>
                    </div>
                    <div className="flex items-end mt-14 gap-x-6 justify-between">
                        <div className="flex items-end gap-x-6">
                            <div className="flex flex-col gap-y-3">
                                <span className="txtSecond-2">{t('common:transaction_id')}</span>
                                <TextCopyable className="gap-x-1 font-semibold" text={orderDetail?.displayingId} />
                            </div>
                            <div className="flex flex-col gap-y-3">
                                <span className="txtSecond-2">{t('common:time')}</span>
                                <span>{formatTime(orderDetail?.createdAt, 'HH:mm:ss dd/MM/yyyy')}</span>
                            </div>
                        </div>
                        <div>{status?.status === PartnerOrderStatus.PENDING && <CountdownTimer timeExpire={orderDetail?.timeExpire} />}</div>

                        {/* <div className="flex flex-col gap-y-3">
                        <span className="txtSecond-2">{t('common:status')}</span>
                        {getStatusOrder(orderDetail?.status, t)}
                    </div> */}
                    </div>
                </div>
            </div>
            {/* Thông tin chuyển khoản */}
            <div className="flex flex-col flex-auto min-h-full">
                <h1 className="text-2xl font-semibold">{t('payment-method:transaction_details')}</h1>
                <div className="flex-1 overflow-auto rounded-xl bg-white dark:bg-dark-4 border border-divider dark:border-transparent p-6 mt-6">
                    <div className="flex justify-between items-start">
                        <InfoCard
                            content={{
                                mainContent: orderDetail?.partnerMetadata?.name,
                                subContent: (
                                    <div className="flex items-center space-x-3">
                                        <span>{formatPhoneNumber(orderDetail?.partnerMetadata?.phone + '')}</span>
                                        <div className="flex space-x-1 items-center">
                                            <Clock size={12} />
                                            <span>1 Phút</span>
                                        </div>
                                    </div>
                                ),
                                imgSrc: orderDetail?.partnerMetadata?.avatar
                            }}
                        />
                        <ButtonV2 onClick={() => setOnShowQr((prev) => !prev)} className="flex items-center gap-x-2 w-auto" variants="text">
                            <QrCodeScannIcon />
                            QR Code
                        </ButtonV2>
                    </div>
                    <div className="flex flex-col mt-6 gap-y-4">
                        <div className="flex items-center justify-between">
                            <span className="txtSecond-2">{t('wallet:transaction_detail')}</span>
                            <TextCopyable className="gap-x-1 font-semibold" text={orderDetail?.transferMetadata?.note} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="txtSecond-2">{t('wallet:bank_name')}</span>
                            <TextCopyable className="gap-x-1 font-semibold" text={orderDetail?.transferMetadata?.bankName} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="txtSecond-2">{t('wallet:account_number')}</span>
                            <TextCopyable className="gap-x-1 font-semibold" text={orderDetail?.transferMetadata?.accountNumber} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="txtSecond-2">Người thụ hưởng</span>
                            <TextCopyable className="gap-x-1 font-semibold" text={orderDetail?.transferMetadata?.accountName} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="txtSecond-2">{t('common:amount')}</span>
                            <TextCopyable className="gap-x-1 font-semibold" text={formatNumber(orderDetail?.baseQty)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupInforCard;
