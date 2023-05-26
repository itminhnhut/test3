import { PATHS } from 'constants/paths';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { ApiResultCreateOrder, ApiStatus } from 'redux/actions/const';
import { getAssetCode } from 'redux/actions/utils';
import { createNewOrder, setPartnerModal } from 'redux/actions/withdrawDeposit';
import { MODAL_TYPE, SIDE } from 'redux/reducers/withdrawDeposit';
import toast from 'utils/toast';
import { ORDER_TYPES } from '../constants';

const useMakeOrder = ({ setState, input }) => {
    const { partnerBank, accountBank, partner } = useSelector((state) => state.withdrawDeposit);
    const router = useRouter();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { side, assetId } = router.query;
    const assetCode = getAssetCode(+assetId);

    const setModalState = (key, state) => dispatch(setPartnerModal({ key, state }));

    const onMakeOrderSuccess = (order) => {
        router.push(PATHS.WITHDRAW_DEPOSIT.DETAIL + '/' + order.displayingId);
    };

    const onMakeOrderHandler = async (otp, locale) => {
        try {
            setState({ loadingConfirm: true });

            const orderResponse = await createNewOrder({
                assetId,
                bankAccountId: side === SIDE.BUY ? partnerBank?._id : accountBank?._id,
                partnerId: partner?.partnerId,
                quantity: input,
                side,
                otp,
                locale
            });

            console.log("____orderResponse: ", orderResponse);

            if (orderResponse && (orderResponse.status === ApiStatus.SUCCESS || orderResponse.status === ApiResultCreateOrder.TOO_MUCH_REQUEST)) {
                // ____________here
                if(orderResponse.data.use_smart_otp) {
                    setState({showOtp: true, isUseSmartOtp: true })
                } else {
                    if (orderResponse.data.remaining_time) {
                        setState({ showOtp: true, otpExpireTime: new Date().getTime() + orderResponse.data.remaining_time, isUseSmartOtp: false });
                    } else {
                        onMakeOrderSuccess(orderResponse.data);
                        return;
                    }
                }
            } else {
                if (orderResponse?.status === ApiResultCreateOrder.INVALID_OTP) {
                    toast({ text: t('common:otp_verify_expired'), type: 'warning' });
                    setState({ loadingConfirm: false });
                    return orderResponse;
                } else {
                    if (orderResponse?.status === ApiResultCreateOrder.NOT_FOUND_PARTNER) {
                        toast({ text: t('dw_partner:error.not_found_partner'), type: 'warning' });
                    } else if (orderResponse?.status === ApiResultCreateOrder.NOT_ENOUGH_MONEY) {
                        toast({ text: t('dw_partner:error.not_enough_money'), type: 'warning' });
                    } else if (orderResponse?.status === ApiResultCreateOrder.INVALID_AMOUNT) {
                        toast({ text: t('dw_partner:error.reach_limit_withdraw', { asset: assetCode }), type: 'warning' });
                    } else if (orderResponse?.status === ApiResultCreateOrder.EXCEEDING_PERMITTED_LIMIT) {
                        setModalState(MODAL_TYPE.AFTER_CONFIRM, {
                            visible: true,
                            type: ORDER_TYPES.ERROR_EXCEEDING_LIMIT
                        });
                    } else if(orderResponse?.status === ApiResultCreateOrder.SECRET_INVALID) {
                        toast({ text: t('dw_partner:error.invalid_secret'), type: 'warning' });
                    } else if(orderResponse?.status === ApiResultCreateOrder.SOTP_INVALID) {
                        toast({ text: t('dw_partner:error.invalid_smart_otp', {timesErr: orderResponse?.data?.count ?? 1}), type: 'warning' });
                    } else if(orderResponse?.status === ApiResultCreateOrder.SOTP_INVALID_EXCEED_TIME) {
                        setState({ showAlertDisableSmartOtp: true })
                    } else toast({ text: orderResponse?.status ?? t('common:global_notice.unknown_err'), type: 'warning' });
                }
            }

            setState({ loadingConfirm: false });
            return orderResponse
            // sell;
        } catch (error) {
            console.log('error:', error);
            setState({ loadingConfirm: false });
        }
    };

    return { onMakeOrderSuccess, onMakeOrderHandler, setModalState };
};

export default useMakeOrder;
