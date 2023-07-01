import React from 'react';
import { formatPhoneNumber, formatBalance, formatTimePartner } from 'redux/actions/utils';

import TextCopyable from 'components/screens/Account/TextCopyable';
import { BxsUserCircle, ContactIcon, DwPartnerIconMulti, QrCodeScannIcon, TimerIcon } from 'components/svg/SvgIcon';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { DefaultAvatar } from 'redux/actions/const';
import Skeletor from 'components/common/Skeletor';
import { MODE } from './constants';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import { useTranslation } from 'next-i18next';
import TagV2, { TYPES } from 'components/common/V2/TagV2';
import { get } from 'lodash';
import { NoDataDarkIcon, NoDataLightIcon } from 'components/common/V2/TableV2/NoData';
import DWRelationIcon from 'components/common/DWRelationIcon';
import { isBoolean } from 'lodash';

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
    // {
    //     key: 'analyticMetadata.count',
    //     icon: <OrderIcon color="currentColor" size={16} />,
    //     mode: [MODE.USER],
    //     render: ({ t, totalOrder, language }) => (
    //         <>
    //             {totalOrder} {`${t('dw_partner:order')}${language === LANGUAGE_TAG.EN && totalOrder > 1 ? 's' : ''}`}
    //         </>
    //     )
    // },
    {
        key: 'analyticMetadata.avgTime',
        icon: <TimerIcon color="currentColor" size={16} />,
        mode: [MODE.USER],
        render: ({ t, data, totalOrder }) => (totalOrder > 0 ? formatTimePartner(t, data) : null)
    }
];

const DETAIL_PAYMENT_INFORMATION = [
    {
        title: 'dw_partner:bank',
        copyText: 'transferMetadata.bankName'
    },
    {
        title: 'wallet:account_number',
        copyText: 'transferMetadata.accountNumber'
    },
    {
        title: 'dw_partner:beneficiary',
        copyText: 'transferMetadata.accountName'
    },
    {
        title: 'common:amount',
        copyText: 'quoteQty',
        showingText: (data) => `${formatBalance(data, 0)} VND`
    },
    {
        title: 'dw_partner:transfer_description',
        copyText: 'transferMetadata.note'
    }
];

const GroupInforCard = ({ orderDetail, side, setModalQr, mode = MODE.USER, isDark, isHiddenBankInformation }) => {
    const otherMode = mode === MODE.PARTNER ? MODE.USER : MODE.PARTNER;
    const totalOrder = orderDetail?.partnerMetadata?.analyticMetadata?.count || 0;
    const {
        t,
        i18n: { language }
    } = useTranslation();

    return (
        <div className="">
            <h1 className="text-[18px] font-semibold mb-6">{t('dw_partner:transaction_bank_receipt')}</h1>

            <div className="mb-6">
                <div className="flex -m-3 flex-wrap items-stretch">
                    {/* Chi tiết giao dịch */}
                    <div className="w-full md:w-2/5 p-3">
                        <div className="flex  flex-col  min-h-full">
                            <div className="flex-1   overflow-auto rounded-xl bg-white dark:bg-dark-4 border border-divider dark:border-transparent p-6 flex flex-col">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="txtPri-1 ">{t(`dw_partner:${otherMode}`)}</div>

                                    {!isHiddenBankInformation &&
                                        ((side === SIDE.BUY && mode === MODE.USER) || (side === SIDE.SELL && mode === MODE.PARTNER)) && (
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
                                        <img
                                            src={orderDetail?.[`${otherMode}Metadata`]?.avatar || DefaultAvatar}
                                            className="mb-6 object-cover w-20 h-20 rounded-full"
                                        />
                                    )}

                                    <div className="flex items-center gap-x-2 txtPri-1 capitalize font-semibold mb-3">
                                        {!orderDetail ? (
                                            <Skeletor width={150} />
                                        ) : (
                                            <>
                                                <span>{orderDetail?.[`${otherMode}Metadata`]?.name?.toLowerCase()}</span>
                                                {isBoolean(orderDetail?.userIsPartner) && <DWRelationIcon userIsPartner={orderDetail?.userIsPartner}/>}
                                            </>
                                        )}
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
                                                    <Skeletor key={item.key} width={100} height={25} />
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
                            <div className="flex-1 flex flex-col overflow-auto rounded-xl bg-white dark:bg-dark-4 border border-divider dark:border-transparent p-6">
                                <div className="flex justify-between mb-4 items-center">
                                    <div className="txtPri-1">{t('dw_partner:payment_method')}</div>
                                </div>
                                {/* Phương thức nhận tiền */}

                                {isHiddenBankInformation ? (
                                    <div className="flex flex-col w-full flex-1 justify-center items-center">
                                        <div>{isDark ? <NoDataDarkIcon /> : <NoDataLightIcon />}</div>
                                        <div className="txtSecond-2">{t('dw_partner:only_show_when_confirm')}</div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-y-4">
                                        {DETAIL_PAYMENT_INFORMATION.map((detail) => {
                                            let fullContent;
                                            if (orderDetail?.tip && detail.copyText === 'quoteQty') {
                                                fullContent =
                                                    side === SIDE.SELL
                                                        ? mode === MODE.USER
                                                            ? orderDetail?.userQtyIn
                                                            : orderDetail?.partnerOut
                                                        : mode === MODE.USER
                                                        ? orderDetail?.userQtyOut
                                                        : orderDetail?.partnerIn;
                                            } else {
                                                fullContent = get(orderDetail, detail.copyText);
                                            }

                                            return (
                                                <div className="flex items-center justify-between">
                                                    <span className="txtSecond-2">{t(detail.title)}</span>
                                                    {!orderDetail ? (
                                                        <Skeletor width="100px" />
                                                    ) : (
                                                        <TextCopyable
                                                            className="gap-x-1 txtPri-1 text-right"
                                                            text={fullContent}
                                                            showingText={detail?.showingText && detail?.showingText(fullContent)}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                        {/* <div className="flex items-center justify-between">
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
                                                    showingText={`${formatBalance(amount, 0)} VND`}
                                                    text={amount}
                                                />
                                            )}
                                        </div> */}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* )} */}
        </div>
    );
};

export default GroupInforCard;
