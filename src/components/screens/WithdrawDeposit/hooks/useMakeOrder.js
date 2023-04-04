import { PATHS } from 'constants/paths';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { ApiResultCreateOrder, ApiStatus } from 'redux/actions/const';
import { createNewOrder } from 'redux/actions/withdrawDeposit';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import toast from 'utils/toast';

const useMakeOrder = ({ setState, input }) => {
    const { partnerBank, accountBank, partner } = useSelector((state) => state.withdrawDeposit);
    const router = useRouter();
    const { t } = useTranslation();

    const { side, assetId } = router.query;

    const onMakeOrderSuccess = (order) => {
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

            if (orderResponse && (orderResponse.status === ApiStatus.SUCCESS || orderResponse.status === ApiResultCreateOrder.TOO_MUCH_REQUEST)) {
                if (orderResponse.data.remaining_time) {
                    setState({ showOtp: true, otpExpireTime: new Date().getTime() + orderResponse.data.remaining_time });
                } else {
                    onMakeOrderSuccess(orderResponse.data);
                    return;
                }
            } else {
                if (orderResponse?.status === ApiResultCreateOrder.INVALID_OTP) {
                    toast({ text: t('common:otp_verify_expired'), type: 'warning' });
                    setState({ loadingConfirm: false });
                    return orderResponse;
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
