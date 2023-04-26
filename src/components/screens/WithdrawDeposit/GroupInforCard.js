import React from 'react';
import CountdownTimer from '../../common/CountdownTimer';
import OrderStatusTag from 'components/common/OrderStatusTag';
import { formatTime, formatPhoneNumber, formatBalance, formatBalanceFiat, formatTimePartner } from 'redux/actions/utils';

import TextCopyable from 'components/screens/Account/TextCopyable';
import { BxsUserCircle, ContactIcon, OrderIcon, QrCodeScannIcon, TimerIcon } from 'components/svg/SvgIcon';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { DefaultAvatar, PartnerAcceptStatus, PartnerOrderStatus } from 'redux/actions/const';
import Skeletor from 'components/common/Skeletor';
import { MODE } from './constants';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import Divider from 'components/common/Divider';
import { useTranslation } from 'next-i18next';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { CountdownClock } from './components/common/CircleCountdown';
import TagV2, { TYPES } from 'components/common/V2/TagV2';
import { get } from 'lodash';

const RENDER_INFORMATION = [
    {
        key: 'phone',
        icon: <ContactIcon color="currentColor" size={16} />,
        mode: [MODE.PARTNER, MODE.USER],
        render: ({ data }) => (data ? formatPhoneNumber(data) : null)
    },
    {
        key: 'code',
        icon: <BxsUserCircle color="currentColor" size={16} />,
        mode: [MODE.PARTNER],
        render: ({ data }) => data || null
    },
    {
        key: 'analyticMetadata.count',
        icon: <OrderIcon color="currentColor" size={16} />,
        mode: [MODE.USER],
        render: ({ t, totalOrder, language }) => (
            <>
                {totalOrder} {`${t('dw_partner:order')}${language === LANGUAGE_TAG.EN && totalOrder > 1 ? 's' : ''}`}
            </>
        )
    },
    {
        key: 'analyticMetadata.avgTime',
        icon: <TimerIcon color="currentColor" size={16} />,
        mode: [MODE.USER],
        render: ({ t, data, totalOrder }) => (totalOrder > 0 ? formatTimePartner(t, data) : null)
    }
];

const GroupInforCard = ({ orderDetail, side, setModalQr, status, mode = MODE.USER }) => {
    const otherMode = mode === MODE.PARTNER ? MODE.USER : MODE.PARTNER;
    const totalOrder = orderDetail?.partnerMetadata?.analyticMetadata?.count || 0;
    const {
        t,
        i18n: { language }
    } = useTranslation();

    return (
        <div>
            <h1 className="text-[18px] font-semibold mb-6">{t('dw_partner:transaction_bank_receipt')}</h1>
            {/* Không hiển thị thông tin lệnh đôi với màn USER - BUY khi đối tác chưa accept */}
            {mode === MODE.USER &&
            side === SIDE.BUY &&
            status?.partnerAcceptStatus === PartnerAcceptStatus.PENDING &&
            status?.status === PartnerOrderStatus.PENDING ? null : (
                <div className="mb-6">
                    <div className="flex -m-3 flex-wrap items-stretch">
                        {/* Chi tiết giao dịch */}
                        <div className="w-full md:w-2/5 p-3">
                            <div className="flex  flex-col  min-h-full">
                                <div className="flex-1   overflow-auto rounded-xl bg-white dark:bg-dark-4 border border-divider dark:border-transparent p-6 flex flex-col">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="txtPri-1 ">{t(`dw_partner:${otherMode}`)}</div>

                                        {((side === SIDE.BUY && mode === MODE.USER) || (side === SIDE.SELL && mode === MODE.PARTNER)) && (
                                            <ButtonV2 onClick={setModalQr} className="!py-0 flex ml-auto items-center gap-x-2 w-auto" variants="text">
                                                <QrCodeScannIcon />
                                                QR Code
                                            </ButtonV2>
                                        )}
                                    </div>
                                    <div className="w-full flex flex-col items-center text-center ">
                                        {!orderDetail ? (
                                            <Skeletor circle width={80} height={80} />
                                        ) : (
                                            <img src={orderDetail?.[`${otherMode}Metadata`]?.avatar || DefaultAvatar} className="mb-6 object-cover w-20 h-20 rounded-full" />
                                        )}

                                        <div className="txtPri-1 capitalize font-semibold mb-3">
                                            {!orderDetail ? <Skeletor width={150} /> : orderDetail?.[`${otherMode}Metadata`]?.name?.toLowerCase()}
                                        </div>
                                        <div className="flex gap-2">
                                            {RENDER_INFORMATION.map((item) => {
                                                const renderData = item.render({
                                                    t,
                                                    language,
                                                    data: get(orderDetail, `${otherMode}Metadata.${item.key}`),
                                                    totalOrder
                                                });
                                                return item.mode.includes(mode) ? (
                                                    !orderDetail ? (
                                                        <Skeletor width={100} height={25} />
                                                    ) : renderData ? (
                                                        <TagV2 key={item.key} type={TYPES.DEFAULT} icon={false} className=" dark:!bg-divider-dark">
                                                            <div className="flex space-x-2 items-center">
                                                                {item.icon}
                                                                <div>{renderData}</div>
                                                            </div>
                                                        </TagV2>
                                                    ) : null
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Thông tin chuyển khoản */}
                        <div className="w-full md:w-3/5 p-3">
                            <div className="flex flex-col min-h-full">
                                <div className="flex-1 overflow-auto rounded-xl bg-white dark:bg-dark-4 border border-divider dark:border-transparent p-6">
                                    <div className="flex justify-between mb-4 items-center">
                                        <div className="txtPri-1">{t('dw_partner:payment_method')}</div>
                                    </div>

                                    {/* Phương thức nhận tiền */}
                                    <div className="flex flex-col gap-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="txtSecond-2">{t('dw_partner:transfer_description')}</span>
                                            {!orderDetail ? (
                                                <Skeletor width="100px" />
                                            ) : (
                                                <TextCopyable className="gap-x-1 txtPri-1 text-right" text={orderDetail?.transferMetadata?.note} />
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
                                                <TextCopyable className="gap-x-1 txtPri-1  text-right" text={orderDetail?.transferMetadata?.accountNumber} />
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="txtSecond-2">{t('dw_partner:beneficiary')}</span>
                                            {!orderDetail ? (
                                                <Skeletor width="100px" />
                                            ) : (
                                                <TextCopyable className="gap-x-1 txtPri-1 text-right" text={orderDetail?.transferMetadata?.accountName} />
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="txtSecond-2">{t('common:amount')}</span>
                                            {!orderDetail ? (
                                                <Skeletor width="100px" />
                                            ) : (
                                                <TextCopyable
                                                    className="gap-x-1 txtPri-1 text-right"
                                                    showingText={`${formatBalance(orderDetail?.quoteQty, 0)} VND`}
                                                    text={orderDetail?.quoteQty}
                                                />
                                            )}
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
