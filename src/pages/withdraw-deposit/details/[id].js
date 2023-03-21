import React, { useState, useMemo, useRef } from 'react';
// import OrderDetailComponent from 'components/screens/Mobile/Futures/OrderDetail';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { API_ORDER_DETAIL, API_GET_ORDER_DETAILS } from 'redux/actions/apis';
import fetchApi from 'utils/fetch-api';
import { useEffect } from 'react';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LayoutMobile from 'components/common/layouts/LayoutMobile';
import { UserSocketEvent, ApiStatus, DepWdlStatus } from 'redux/actions/const';
import { getOrdersList } from 'redux/actions/futures';
import OrderDetailLoading from 'components/screens/Mobile/Futures/OrderDetailLoading';
import dynamic from 'next/dynamic';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
import CountdownTimer from 'components/common/CountdownTimer';
import TextCopyable from 'components/screens/Account/TextCopyable';
import StatusWithdraw from 'src/components/wallet/StatusWithdraw';
import TagV2 from 'components/common/V2/TagV2';
import InfoCard from 'components/screens/WithdrawDeposit/components/common/InfoCard';
import { Clock } from 'react-feather';
import { BxsInfoCircle, FutureSupportIcon } from 'components/svg/SvgIcon';
import colors from 'styles/colors';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import Axios from 'axios';

import { shortHashAddress, getAssetCode, formatTime, formatNumber, formatPhoneNumber } from 'redux/actions/utils';

const OrderDetailComponent = dynamic(() => import('components/screens/Mobile/Futures/OrderDetail'), { loading: () => <OrderDetailLoading /> });

const getStatusOrder = (status, t) =>
    ({
        [DepWdlStatus.Success]: (
            <TagV2 icon={true} className="ml-auto" type="success">
                {t('common:success')}
            </TagV2>
        ),
        [DepWdlStatus.Pending]: (
            <TagV2 icon={true} className="ml-auto" type="warning">
                {t('common:pending')}
            </TagV2>
        ),
        [DepWdlStatus.Declined]: (
            <TagV2 icon={true} className="ml-auto" type="failed">
                {t('common:declined')}
            </TagV2>
        )
    }[status]);

const OrderDetail = ({ id }) => {
    const { t } = useTranslation();
    const user = useSelector((state) => state.auth.user) || null;
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;
    const [orderDetail, setOrderDetail] = useState(null);
    const side = orderDetail?.side;

    console.log("orderDetail: '", orderDetail);
    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                const { status, data } = await fetchApi({
                    url: API_GET_ORDER_DETAILS,
                    options: { method: 'GET' },
                    params: {
                        displayingId: id + ''
                    }
                });

                if (data) {
                    setOrderDetail(data);
                }
            }
        };
        fetchData();
    }, [id]);

    const onOpenChat = () => {
        window?.fcWidget?.open({ name: 'Inbox', replyText: '' });
    };
    return (
        <MaldivesLayout>
            <div className="w-full h-full flex justify-center pt-20 pb-[120px] px-4">
                <div className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto text-base text-gray-15 dark:text-gray-4 tracking-normal w-full">
                    <div className="flex gap-x-6 w-full">
                        {/* Chi tiết giao dịch */}
                        <div className="flex-1">
                            <h1 className="text-2xl font-semibold">{t('payment-method:transaction_details')}</h1>
                            <div className="rounded-xl bg-white dark:bg-dark-4 border border-divider dark:border-transparent p-6 mt-6 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h2 className="font-semibold">
                                            {t('payment-method:depsit_from_partners', {
                                                asset: getAssetCode(orderDetail?.baseAssetId)
                                            })}
                                        </h2>
                                        <CountdownTimer />
                                    </div>
                                    <div>
                                        <span className="txtSecond-2">So luong</span>
                                        <div className="mt-3 text-2xl font-semibold">
                                            {side === 'BUY' ? '+' : '-'}
                                            {formatNumber(orderDetail?.baseQty)} VNDC
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-end mt-14 gap-x-6">
                                    <div className="flex flex-col gap-y-3">
                                        <span className="txtSecond-2">{t('common:transaction_id')}</span>
                                        <TextCopyable className="gap-x-1 font-semibold" text={orderDetail?.displayingId} />
                                    </div>
                                    <div className="flex flex-col gap-y-3">
                                        <span className="txtSecond-2">{t('common:time')}</span>
                                        <span>{formatTime(orderDetail?.createdAt, 'HH:mm:ss dd/MM/yyyy')}</span>
                                    </div>
                                    <div className="flex flex-col gap-y-3">
                                        <span className="txtSecond-2">{t('common:status')}</span>
                                        {getStatusOrder(orderDetail?.status, t)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Thông tin chuyển khoản */}
                        <div className="flex-1">
                            <h1 className="text-2xl font-semibold">{t('payment-method:transaction_details')}</h1>
                            <div className="rounded-xl bg-white dark:bg-dark-4 border border-divider dark:border-transparent p-6 mt-6">
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
                                    <div>QR Code</div>
                                </div>
                                <div className="flex flex-col mt-6 gap-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="txtSecond-2">{t('wallet:transaction_detail')}</span>
                                        <span>{orderDetail?.transferMetadata?.note}</span>
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
                    {/* Lưu ý */}

                    {side === 'BUY' && (
                        <div className="w-full rounded-md border border-divider dark:border-divider-dark py-4 px-6 mt-8">
                            <div className="flex items-center gap-x-2">
                                <BxsInfoCircle size={16} fill={isDark ? colors.darkBlue5 : colors.gray[1]} fillInside={'currentColor'} />
                                <span>{t('wallet:note')}</span>
                            </div>
                            <div className="txtSecond-2 mt-2">
                                Sử dụng mã QR hoặc sao chép thông tin để chuyển khoản:
                                <ul className="list-disc ml-6 marker:text-xs">
                                    <li>Đúng số tiền</li>
                                    <li>Đúng nội dung</li>
                                    <li>Thực hiện hành động chuyển khoản trong vòng 15 phút sau khi nhấn nút “Tôi đã chuyển khoản” để lệnh không bị huỷ.</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-8">
                        <div className={`flex gap-x-4 ${side !== 'BUY' && 'hidden'}`}>
                            <ButtonV2 className="!whitespace-nowrap px-[62.5px]">{t('wallet:transfer_already')} </ButtonV2>
                            <ButtonV2 onClick={() => console.log('Toi da chuyen khoan')} className="px-6" variants="secondary">
                                Huỷ giao dịch
                            </ButtonV2>
                        </div>
                        <div className="flex justify-end w-full">
                            <ButtonV2 onClick={onOpenChat} variants="text" className="!text-sm w-auto">
                                <FutureSupportIcon className="mr-2" isDark={isDark} />
                                {t('common:chat_with_support')}
                            </ButtonV2>
                        </div>
                    </div>
                </div>
            </div>
        </MaldivesLayout>
    );
};

export const getServerSideProps = async ({ locale, params }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'navbar', 'wallet', 'payment-method'])),
            id: params?.id
        }
    };
};
export default OrderDetail;
