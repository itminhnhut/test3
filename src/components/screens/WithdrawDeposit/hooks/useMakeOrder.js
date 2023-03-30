import { PATHS } from 'constants/paths';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { ApiResultCreateOrder, ApiStatus } from 'redux/actions/const';
import { getAssetCode } from 'redux/actions/utils';
import { createNewOrder } from 'redux/actions/withdrawDeposit';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import toast from 'utils/toast';

const useMakeOrder = ({ setState, input }) => {
    const { partnerBank, accountBank, partner } = useSelector((state) => state.withdrawDeposit);
    const router = useRouter();
    const { t } = useTranslation();

    const { side, assetId } = router.query;
    const assetCode = getAssetCode(+assetId);

    const onMakeOrderSuccess = (assetCode, order) => {
        // toast({ text: `Bạn đã đặt thành công lệnh ${side.toLowerCase()} ${assetCode} #${order.displayingId} `, type: 'success' });
        router.push(PATHS.WITHDRAW_DEPOSIT.DETAIL + '/' + order.displayingId);
    };

    const onMakeOrderHandler = async (otp) => {
        try {
            setState({ loadingConfirm: true });
            const orderResponse = await createNewOrder({
                assetId,
                bankAccountId: side === SIDE.BUY ? partnerBank?._id : accountBank?._id,
                partnerId: partner?.partnerId,
                quantity: input,
                side,
                otp
            });

            if (orderResponse && orderResponse.status === ApiStatus.SUCCESS) {
                if (orderResponse.data.remaining_time) {
                    setState({ otpMode: 'email', showOtp: true, otpExpireTime: orderResponse.data.remaining_time });
                } else {
                    onMakeOrderSuccess(assetCode, orderResponse.data);
                }
            } else {
                if (orderResponse?.status === ApiResultCreateOrder.INVALID_OTP) {
                    toast({ text: t('common:otp_verify_expired'), type: 'warning' });
                    setState({ loadingConfirm: false });
                    return ApiResultCreateOrder.INVALID_OTP;
                } else {
                    if (orderResponse?.status === 'NOT_FOUND_PARTNER') {
                        toast({ text: t('dw_partner:error.not_found_partner'), type: 'warning' });
                    } else toast({ text: orderResponse?.status ?? t('common:global_notice.unknown_err'), type: 'warning' });
                }
            }
            setState({ loadingConfirm: false });
        } catch (error) {
            console.log('error:', error);
            setState({ loadingConfirm: false });
        }
    };

    return { onMakeOrderSuccess, onMakeOrderHandler };
};

export default useMakeOrder;
