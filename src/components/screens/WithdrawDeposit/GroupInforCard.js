import React from 'react';
import CountdownTimer from '../../common/CountdownTimer';
import OrderStatusTag from 'components/common/OrderStatusTag';
import { formatTime, formatPhoneNumber, formatBalance, formatBalanceFiat, formatTimePartner } from 'redux/actions/utils';

import TextCopyable from 'components/screens/Account/TextCopyable';
import { ContactIcon, OrderIcon, QrCodeScannIcon, TimerIcon } from 'components/svg/SvgIcon';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { DefaultAvatar, PartnerAcceptStatus } from 'redux/actions/const';
import Skeletor from 'components/common/Skeletor';
import { MODE } from './constants';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import Divider from 'components/common/Divider';
import { useTranslation } from 'next-i18next';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { CountdownClock } from './components/common/CircleCountdown';
import TagV2, { TYPES } from 'components/common/V2/TagV2';

const GroupInforCard = ({ orderDetail, side, setModalQr, status, assetCode, refetchOrderDetail, mode = MODE.USER }) => {
    const otherMode = mode === MODE.PARTNER ? MODE.USER : MODE.PARTNER;
    const totalOrder = orderDetail?.partnerMetadata?.analyticMetadata?.count || 0;
    const {
        t,
        i18n: { language }
    } = useTranslation();

    return (
        <div>
            <h1 className="text-[18px] font-semibold mb-6">{t('dw_partner:transaction_bank_receipt')}</h1>
            {/* Không hiển thị thông tin lệnh đôi với màn USER khi đối tác chưa accept */}
            {mode === MODE.USER && status?.partnerAcceptStatus === PartnerAcceptStatus.PENDING ? null : (
                <div className="mb-6">
                    <div className="flex -m-3 flex-wrap items-stretch">
                        {/* Chi tiết giao dịch */}
                        <div className="w-full md:w-2/5 p-3">
                            <div className="flex  flex-col  min-h-full">
                                <div className="flex-1   overflow-auto rounded-xl bg-white dark:bg-dark-4 border border-divider dark:border-transparent p-6 flex flex-col">
                                    {/* {((side === SIDE.BUY && mode === MODE.USER) || (side === SIDE.SELL && mode === MODE.PARTNER)) && ( */}
                                    <div className="txtPri-1 mb-4">{t(`dw_partner:${otherMode}`)}</div>
                                    {/* )} */}
                                    <div className="w-full flex flex-col items-center text-center ">
                                        {!orderDetail ? (
                                            <Skeletor circle width={80} height={80} />
                                        ) : (
                                            <img src={orderDetail?.[`${otherMode}Metadata`]?.avatar || DefaultAvatar} className="mb-6 w-20 h-20 rounded-full" />
                                        )}

                                        <div className="txtPri-1 capitalize font-semibold mb-3">
                                            {orderDetail && orderDetail?.[`${otherMode}Metadata`]?.name?.toLowerCase()}
                                        </div>
                                        <div className="flex gap-2">
                                            {/* hiện namiId hoặc phone */}
                                            {!orderDetail ? (
                                                <Skeletor width={80} />
                                            ) : (
                                                <TagV2 type={TYPES.DEFAULT} icon={false} className="dark:!bg-divider-dark">
                                                    <div className="flex space-x-2 items-center">
                                                        {orderDetail?.[`${otherMode}Metadata`]?.phone ? (
                                                            <>
                                                                <ContactIcon color="currentColor" size={16} />
                                                                <div>{formatPhoneNumber(orderDetail?.[`${otherMode}Metadata`]?.phone)}</div>
                                                            </>
                                                        ) : (
                                                            orderDetail?.[`${otherMode}Metadata`]?.code
                                                        )}
                                                    </div>
                                                </TagV2>
                                            )}
                                            {/* hiện tên hoặc phone */}

                                            {/* hien số lương orders và avg time chỉ giành cho màn hình user  */}
                                            {mode === MODE.USER && (
                                                <>
                                                    {!orderDetail ? (
                                                        <Skeletor width={80} />
                                                    ) : (
                                                        <TagV2 icon={false} type={TYPES.DEFAULT} className="dark:!bg-divider-dark">
                                                            <div className="flex gap-2 items-center">
                                                                <OrderIcon size={16} />
                                                                <span>
                                                                    {totalOrder}{' '}
                                                                    {`${t('dw_partner:order')}${language === LANGUAGE_TAG.EN && totalOrder > 1 ? 's' : ''}`}
                                                                </span>
                                                            </div>
                                                        </TagV2>
                                                    )}
                                                    {totalOrder > 0 ? (
                                                        <TagV2 icon={false} type={TYPES.DEFAULT} className="dark:!bg-divider-dark">
                                                            <div className="flex gap-2 items-center">
                                                                <TimerIcon size={16} />
                                                                <span>{formatTimePartner(t, orderDetail?.partnerMetadata?.analyticMetadata?.avgTime)}</span>
                                                            </div>
                                                        </TagV2>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </>
                                            )}
                                            {/* hien số lương orders và avg time chỉ giành cho màn hình user  */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Thông tin chuyển khoản */}
                        <div className="w-full md:w-3/5 p-3">
                            <div className="flex flex-col min-h-full">
                                {/* <h1 className="text-2xl font-semibold">{t('dw_partner:transaction_bank_receipt')}</h1> */}
                                <div className="flex-1 overflow-auto rounded-xl bg-white dark:bg-dark-4 border border-divider dark:border-transparent p-6">
                                    {/* {((side === SIDE.SELL && mode === MODE.USER) || (side === SIDE.BUY && mode === MODE.PARTNER)) && (
                                    <div className="txtSecond-3 mb-4">{t(`dw_partner:${otherMode}`)}</div>
                                )} */}
                                    <div className="flex justify-between mb-4 items-center">
                                        <div className="txtPri-1">{t('dw_partner:payment_method')}</div>
                                        {/* <InfoCard
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
                                                                    {orderDetail?.partnerMetadata?.analyticMetadata?.count > 1 && language === LANGUAGE_TAG.EN
                                                                        ? 's'
                                                                        : ''}
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
                                    /> */}

                                        {((side === SIDE.BUY && mode === MODE.USER) || (side === SIDE.SELL && mode === MODE.PARTNER)) && (
                                            <ButtonV2 onClick={setModalQr} className="flex ml-auto items-center gap-x-2 w-auto" variants="text">
                                                <QrCodeScannIcon />
                                                QR Code
                                            </ButtonV2>
                                        )}
                                    </div>

                                    {/* Divider */}
                                    {/* {((side === SIDE.SELL && mode === MODE.USER) || (side === SIDE.BUY && mode === MODE.PARTNER)) && (
                                    <div>
                                        <Divider className="w-full !my-4" />
                                        <div className="txtSecond-3">{t('dw_partner:transaction_bank_receipt')}</div>
                                    </div>
                                )} */}

                                    {/* Phương thức nhận tiền */}
                                    <div className="flex flex-col gap-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="txtSecond-2">{t('dw_partner:transfer_description')}</span>
                                            {!orderDetail ? (
                                                <Skeletor width="100px" />
                                            ) : (
                                                <TextCopyable className="gap-x-1 txtPri-1 " text={orderDetail?.transferMetadata?.note} />
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="txtSecond-2">{t('dw_partner:bank')}</span>
                                            {!orderDetail ? (
                                                <Skeletor width="100px" />
                                            ) : (
                                                <TextCopyable className="gap-x-1 txtPri-1 text-right " text={orderDetail?.transferMetadata?.bankName} />
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="txtSecond-2">{t('wallet:account_number')}</span>
                                            {!orderDetail ? (
                                                <Skeletor width="100px" />
                                            ) : (
                                                <TextCopyable className="gap-x-1 txtPri-1  " text={orderDetail?.transferMetadata?.accountNumber} />
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="txtSecond-2">{t('dw_partner:beneficiary')}</span>
                                            {!orderDetail ? (
                                                <Skeletor width="100px" />
                                            ) : (
                                                <TextCopyable className="gap-x-1 txtPri-1 " text={orderDetail?.transferMetadata?.accountName} />
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="txtSecond-2">{t('common:amount')}</span>

                                            <TextCopyable
                                                className="gap-x-1 txtPri-1 "
                                                showingText={`${formatBalance(orderDetail?.quoteQty, 0)} VND`}
                                                text={orderDetail?.quoteQty}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupInforCard;
