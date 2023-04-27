import React from 'react';
import CountdownTimer from '../../common/CountdownTimer';
import OrderStatusTag from 'components/common/OrderStatusTag';
import { formatTime, formatPhoneNumber, formatBalance, formatBalanceFiat, formatTimePartner } from 'redux/actions/utils';

import TextCopyable from 'components/screens/Account/TextCopyable';
import InfoCard from './components/common/InfoCard';
import { BxsTimeIcon, OrderIcon, QrCodeScannIcon } from 'components/svg/SvgIcon';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { PartnerOrderStatus, PartnerPersonStatus } from 'redux/actions/const';
import Countdown from 'react-countdown';
import Skeletor from 'components/common/Skeletor';
import { MODE } from './constants';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import Divider from 'components/common/Divider';

const GroupInforCard = ({ t, orderDetail, side, setModalQr, status, assetCode, refetchOrderDetail, mode = MODE.USER }) => {
    const otherMode = mode === MODE.PARTNER ? MODE.USER : MODE.PARTNER;
    return (
        <div className="flex -m-3 flex-wrap items-stretch">
            {/* Chi tiết giao dịch */}
            <div className="w-full md:w-2/5 p-3">
                <div className="flex  flex-col  min-h-full">
                    <h1 className="text-2xl font-semibold">{t('dw_partner:transaction_detail')}</h1>
                    <div className="flex-1   overflow-auto rounded-xl bg-white dark:bg-dark-4 border border-divider dark:border-transparent p-6 mt-6 flex flex-col">
                        <div className="flex justify-between items-start">
                            {!side ? (
                                <Skeletor width="200px" />
                            ) : (
                                <h2 className="font-semibold">
                                    {t(`dw_partner:${side?.toLowerCase()}_asset_from_partners.${mode}`, {
                                        asset: assetCode
                                    })}
                                </h2>
                            )}
                            {!orderDetail ? <Skeletor width="150px" /> : <OrderStatusTag status={status?.status} />}
                        </div>
                        <div className="mt-14">
                            <span className="txtSecond-2">{t('dw_partner:amount')}</span>
                            <div className="mt-3 text-2xl font-semibold">
                                {!orderDetail ? (
                                    <Skeletor width="200px" height="30px" />
                                ) : (
                                    `${
                                        (side === SIDE.BUY && mode === MODE.USER) || (side === SIDE.SELL && mode === MODE.PARTNER) ? '+' : '-'
                                    }${formatBalanceFiat(orderDetail?.baseQty, assetCode)} ${assetCode}`
                                )}
                            </div>
                        </div>

                        <div className="flex items-end gap-x-6 justify-between mt-[36px]">
                            <div className="flex items-end gap-x-6">
                                <div className="flex flex-col gap-y-3">
                                    <span className="txtSecond-2">{t('common:transaction_id')}</span>
                                    {!orderDetail ? (
                                        <Skeletor width="100px" />
                                    ) : (
                                        <TextCopyable className="gap-x-1 font-semibold" text={orderDetail?.displayingId} />
                                    )}
                                </div>
                                <div className="flex flex-col gap-y-3">
                                    <span className="txtSecond-2 ">{t('common:time')}</span>
                                    {!orderDetail ? (
                                        <Skeletor width="100px" />
                                    ) : (
                                        <span className="font-semibold">{formatTime(orderDetail?.createdAt, 'HH:mm:ss dd/MM/yyyy')}</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                {status?.status === PartnerOrderStatus.PENDING && orderDetail?.timeExpire && (
                                    <Countdown
                                        date={new Date(orderDetail?.timeExpire).getTime()}
                                        renderer={({ props, ...countdownProps }) => props.children(countdownProps)}
                                        onComplete={() => refetchOrderDetail()}
                                    >
                                        {(props) => <CountdownTimer maxCountdown={orderDetail?.countdownTime} {...props} />}
                                    </Countdown>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Thông tin chuyển khoản */}
            <div className="w-full md:w-3/5 p-3">
                <div className="flex flex-col min-h-full">
                    <h1 className="text-2xl font-semibold">{t('dw_partner:transaction_bank_receipt')}</h1>
                    <div className="flex-1 overflow-auto rounded-xl bg-white dark:bg-dark-4 border border-divider dark:border-transparent p-6 mt-6">
                        {((side === SIDE.SELL && mode === MODE.USER) || (side === SIDE.BUY && mode === MODE.PARTNER)) && (
                            <div className="txtSecond-3 mb-4">{t(`dw_partner:${otherMode}`)}</div>
                        )}
                        <div className="flex justify-between items-start">
                            <InfoCard
                                loading={!orderDetail}
                                content={{
                                    mainContent: orderDetail && orderDetail?.[`${otherMode}Metadata`]?.name?.toLowerCase(),
                                    subContent: (
                                        <div className="flex items-center space-x-4 text-txtSecondary dark:text-txtSecondary-dark">
                                            <span>
                                                {orderDetail?.[`${otherMode}Metadata`]?.phone
                                                    ? formatPhoneNumber(orderDetail?.[`${otherMode}Metadata`]?.phone)
                                                    : orderDetail?.[`${otherMode}Metadata`]?.code}
                                            </span>

                                            {mode === MODE.USER && (
                                                <>
                                                    <div className="flex space-x-1 items-center">
                                                        <OrderIcon size={16} />
                                                        <span>
                                                            {orderDetail?.partnerMetadata?.analyticMetadata?.count || 0} {t('dw_partner:order')}
                                                        </span>
                                                    </div>
                                                    {orderDetail?.partnerMetadata?.analyticMetadata?.count ? (
                                                        <div className="flex space-x-1 items-center">
                                                            <BxsTimeIcon size={16} />
                                                            <span>{formatTimePartner(t, orderDetail?.partnerMetadata?.analyticMetadata?.avgTime)}</span>
                                                        </div>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    ),
                                    imgSrc: orderDetail?.[`${otherMode}Metadata`]?.avatar
                                }}
                            />
                            {(side === SIDE.BUY && mode === MODE.USER) ||
                                (side === SIDE.SELL && mode === MODE.PARTNER && (
                                    <ButtonV2 onClick={setModalQr} className="flex items-center gap-x-2 w-auto" variants="text">
                                        <QrCodeScannIcon />
                                        QR Code
                                    </ButtonV2>
                                ))}
                        </div>

                        {/* Divider */}
                        {((side === SIDE.SELL && mode === MODE.USER) || (side === SIDE.BUY && mode === MODE.PARTNER)) && (
                            <div>
                                <Divider className="w-full !my-4" />
                                <div className="txtSecond-3">{t('dw_partner:transaction_bank_receipt')}</div>
                            </div>
                        )}

                        {/* Phương thức nhận tiền */}
                        <div className="flex flex-col mt-6 gap-y-4">
                            <div className="flex items-center justify-between">
                                <span className="txtSecond-2">{t('dw_partner:transfer_description')}</span>
                                {!orderDetail ? (
                                    <Skeletor width="100px" />
                                ) : (
                                    <TextCopyable className="gap-x-1 font-semibold" text={orderDetail?.transferMetadata?.note} />
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="txtSecond-2">{t('dw_partner:bank')}</span>
                                {!orderDetail ? (
                                    <Skeletor width="100px" />
                                ) : (
                                    <TextCopyable className="gap-x-1 text-right font-semibold" text={orderDetail?.transferMetadata?.bankName} />
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="txtSecond-2">{t('wallet:account_number')}</span>
                                {!orderDetail ? (
                                    <Skeletor width="100px" />
                                ) : (
                                    <TextCopyable className="gap-x-1  font-semibold" text={orderDetail?.transferMetadata?.accountNumber} />
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="txtSecond-2">{t('dw_partner:beneficiary')}</span>
                                {!orderDetail ? (
                                    <Skeletor width="100px" />
                                ) : (
                                    <TextCopyable className="gap-x-1 font-semibold" text={orderDetail?.transferMetadata?.accountName} />
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="txtSecond-2">{t('common:amount')}</span>

                                <TextCopyable
                                    className="gap-x-1 font-semibold"
                                    showingText={`${formatBalance(orderDetail?.quoteQty, 0)} VND`}
                                    text={orderDetail?.quoteQty}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupInforCard;
