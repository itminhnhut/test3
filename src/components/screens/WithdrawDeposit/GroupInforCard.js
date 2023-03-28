import React from 'react';
import CountdownTimer from '../../common/CountdownTimer';
import OrderStatusTag from 'components/common/OrderStatusTag';
import { formatNumber, formatTime, formatPhoneNumber, getS3Url, formatBalance } from 'redux/actions/utils';

import TextCopyable from 'components/screens/Account/TextCopyable';
import InfoCard from './components/common/InfoCard';
import { Clock } from 'react-feather';
import { QrCodeScannIcon } from 'components/svg/SvgIcon';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { PartnerOrderStatus, PartnerPersonStatus } from 'redux/actions/const';
import Countdown from 'react-countdown';
import { API_GET_ORDER_PRICE } from 'redux/actions/apis';
import useFetchApi from 'hooks/useFetchApi';
import Skeletor from 'components/common/Skeletor';

<<<<<<< Updated upstream
const GroupInforCard = ({ t, orderDetail, side, setModalQr, status, assetCode }) => {
=======
const INFOR_LIST = ['Nội dung chuyển khoản', 'Ngân hàng', 'Số tài khoản', 'Người thụ hưởng', 'Số lượng'];

const GroupInforCard = ({ t, orderDetail, side, setModalQr, status, assetCode, refetchOrderDetail }) => {
>>>>>>> Stashed changes
    const {
        data: rate,
        loading: loadingRate,
        error
    } = useFetchApi({ url: API_GET_ORDER_PRICE, params: { assetId: +orderDetail?.baseAssetId, side } }, Boolean(orderDetail?.baseAssetId) && Boolean(side), [
        side,
        orderDetail?.baseAssetId
    ]);

    return (
        <div className="flex gap-x-6 w-full items-stretch">
            {/* Chi tiết giao dịch */}
            <div className="flex flex-col flex-auto  min-h-full">
                <h1 className="text-2xl font-semibold">{t('dw_partner:transaction_detail')}</h1>
                <div className="flex-1   overflow-auto rounded-xl bg-white dark:bg-dark-4 border border-divider dark:border-transparent p-6 mt-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        {!side ? (
                            <Skeletor width="200px" />
                        ) : (
                            <h2 className="font-semibold">
                                {t(`dw_partner:${side?.toLowerCase()}_asset_from_partners`, {
                                    asset: assetCode
                                })}
                            </h2>
                        )}
                        {!orderDetail ? <Skeletor width="150px" /> : <OrderStatusTag status={status?.status} />}
                    </div>
                    <div>
                        <span className="txtSecond-2">{t('dw_partner:amount')}</span>
                        <div className="mt-3 text-2xl font-semibold">
                            {!orderDetail ? (
                                <Skeletor width="200px" height="30px" />
                            ) : (
                                `${side === 'BUY' ? '+' : '-'}${formatNumber(orderDetail?.baseQty)} ${assetCode}`
                            )}
                        </div>
                    </div>

                    <div className="flex items-end gap-x-6 justify-between">
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
                                <span className="txtSecond-2">{t('common:time')}</span>
                                {!orderDetail ? <Skeletor width="100px" /> : <span>{formatTime(orderDetail?.createdAt, 'HH:mm:ss dd/MM/yyyy')}</span>}
                            </div>
                        </div>
                        <div>
                            {status?.status === PartnerOrderStatus.PENDING && (
                                <Countdown
                                    date={new Date(orderDetail?.timeExpire).getTime()}
                                    renderer={({ props, ...countdownProps }) => props.children(countdownProps)}
                                    onComplete={() => refetchOrderDetail()}
                                >
                                    {(props) => <CountdownTimer {...props} />}
                                </Countdown>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Thông tin chuyển khoản */}
            <div className="flex flex-col flex-auto min-h-full">
                <h1 className="text-2xl font-semibold">{t('dw_partner:transaction_bank_receipt')}</h1>
                <div className="flex-1 overflow-auto rounded-xl bg-white dark:bg-dark-4 border border-divider dark:border-transparent p-6 mt-6">
                    <div className="flex justify-between items-start">
                        <InfoCard
                            loading={!orderDetail}
                            content={{
                                mainContent: orderDetail?.partnerMetadata?.name,
                                subContent: (
                                    <div className="flex items-center space-x-3">
                                        <span>{formatPhoneNumber(orderDetail?.partnerMetadata?.phone + '')}</span>
                                        <div className="flex space-x-1 items-center">
                                            <Clock size={12} />
                                            <span>{formatTime(Math.abs(orderDetail?.partnerMetadata?.analyticMetadata?.avgTime), 'mm:ss')}</span>
                                        </div>
                                    </div>
                                ),
                                imgSrc: orderDetail?.partnerMetadata?.avatar
                            }}
                        />
                        <ButtonV2 onClick={setModalQr} className="flex items-center gap-x-2 w-auto" variants="text">
                            <QrCodeScannIcon />
                            QR Code
                        </ButtonV2>
                    </div>
                    <div className="flex flex-col mt-6 gap-y-4">
                        <div className="flex items-center justify-between">
                            <span className="txtSecond-2">{t('wallet:transaction_detail')}</span>
                            {!orderDetail ? (
                                <Skeletor width="100px" />
                            ) : (
                                <TextCopyable className="gap-x-1 font-semibold" text={orderDetail?.transferMetadata?.note} />
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="txtSecond-2">{t('wallet:bank_name')}</span>
                            {!orderDetail ? (
                                <Skeletor width="100px" />
                            ) : (
                                <TextCopyable className="gap-x-1 font-semibold" text={orderDetail?.transferMetadata?.bankName} />
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="txtSecond-2">{t('wallet:account_number')}</span>
                            {!orderDetail ? (
                                <Skeletor width="100px" />
                            ) : (
                                <TextCopyable className="gap-x-1 font-semibold" text={orderDetail?.transferMetadata?.accountNumber} />
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
                            {loadingRate ? (
                                <Skeletor width="100px" />
                            ) : (
                                <TextCopyable
                                    className="gap-x-1 font-semibold"
                                    showingText={`${formatBalance(orderDetail?.baseQty * rate)} VND`}
                                    text={formatBalance(orderDetail?.baseQty * rate)}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupInforCard;
