import React from 'react';
import { DisputedType, MODAL_KEY, MODE, ORDER_TYPES, TranferreredType } from '../constants';
import { ApiStatus, PartnerPersonStatus } from 'redux/actions/const';
import { formatBalance } from 'redux/actions/utils';
import { markOrder, rejectOrder } from 'redux/actions/withdrawDeposit';
import { useTranslation } from 'next-i18next';
const useMarkOrder = ({ id, assetCode, setModalPropsWithKey, side, baseQty, mode }) => {
    const { t } = useTranslation();
    const onMarkOrderHandler = (userStatus, statusType) => async () => {
        let type, additionalData;
        let isRejected = false;
        const isPartner = mode === MODE.PARTNER;

        switch (userStatus) {
            case PartnerPersonStatus.DISPUTED:
                switch (statusType) {
                    case DisputedType.REPORT:
                        type = ORDER_TYPES.REPORT_SUCCESS;
                        additionalData = {
                            displayingId: id
                        };
                        break;
                    case DisputedType.REJECTED:
                        type = ORDER_TYPES.CANCEL_SUCCESS;
                        additionalData = {
                            displayingId: id
                        };
                        isRejected = true;
                        break;
                    default:
                        break;
                }
                break;
            case PartnerPersonStatus.TRANSFERRED:
                type = ORDER_TYPES.TRANSFERRED_SUCCESS;
                additionalData = { displayingId: id, amount: formatBalance(baseQty, 0), token: assetCode };
                break;

            default:
                break;
        }

        try {
            setModalPropsWithKey(MODAL_KEY.CONFIRM, {
                loading: true
            });
            const data = isRejected ? await rejectOrder({ displayingId: id, mode }) : await markOrder({ displayingId: id, userStatus, mode });
            if (data && data.status === ApiStatus.SUCCESS) {
                // close confirm modal
                setModalPropsWithKey(MODAL_KEY.CONFIRM, {
                    loading: false,
                    visible: false
                });

                // open after confirm modal
                setModalPropsWithKey(MODAL_KEY.AFTER_CONFIRM, {
                    visible: true,
                    type,
                    additionalData
                });
            } else {
                setModalPropsWithKey(MODAL_KEY.CONFIRM, {
                    loading: false,
                    visible: false
                });
                setModalPropsWithKey(MODAL_KEY.AFTER_CONFIRM, {
                    visible: true,
                    type: ORDER_TYPES.ERROR,
                    additionalData: data?.status
                });
            }
        } catch (error) {
            setModalPropsWithKey(MODAL_KEY.CONFIRM, {
                loading: false,
                visible: false
            });
            setModalPropsWithKey(MODAL_KEY.AFTER_CONFIRM, {
                visible: true,
                type: ORDER_TYPES.ERROR,
                additionalData: error
            });
        }
    };

    const onMarkWithStatus = (userStatus, statusType) => {
        let type, additionalData;
        switch (userStatus) {
            case PartnerPersonStatus.TRANSFERRED:
                switch (statusType) {
                    case TranferreredType[mode].TAKE:
                        type = ORDER_TYPES.CONFIRM_TAKE_MONEY;
                        break;
                    case TranferreredType[mode].TRANSFERRED:
                        type = ORDER_TYPES.CONFIRM_TRANSFERRED;
                        break;
                    default:
                        break;
                }
                break;
            case PartnerPersonStatus.DISPUTED:
                switch (statusType) {
                    case DisputedType.REPORT:
                        type = ORDER_TYPES.REPORT;
                        additionalData = { displayingId: id };
                        break;
                    case DisputedType.REJECTED:
                        type = ORDER_TYPES.CANCEL_ORDER;
                        additionalData = { token: assetCode, side: t(`payment-method:${side.toLowerCase()}`) };
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
        setModalPropsWithKey(MODAL_KEY.CONFIRM, {
            visible: true,
            type,
            additionalData,
            onConfirm: onMarkOrderHandler(userStatus, statusType)
        });
    };

    return { onMarkWithStatus };
};

export default useMarkOrder;
