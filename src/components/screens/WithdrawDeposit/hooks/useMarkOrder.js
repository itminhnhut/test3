import React, { useMemo } from 'react';
import { ALLOWED_ASSET, ALLOWED_ASSET_ID, DisputedType, MODAL_TYPE, MODE, ORDER_TYPES, TranferreredType } from '../constants';
import { ApiStatus, PartnerPersonStatus } from 'redux/actions/const';
import { formatBalance, getAssetCode } from 'redux/actions/utils';
import { approveOrder, markOrder, rejectOrder } from 'redux/actions/withdrawDeposit';
const useMarkOrder = ({ setModalPropsWithKey, mode, toggleRefetch }) => {
    const onMarkOrderHandler =
        (userStatus, statusType, { assetId, id, side, baseQty, assetCode }) =>
        async () => {
            let type, additionalData;
            let isRejected = false;
            const isApprove = statusType === TranferreredType[mode].TAKE;

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
                                displayingId: id,
                                side,
                                assetId
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
                setModalPropsWithKey(MODAL_TYPE.CONFIRM, {
                    loading: true
                });
                const data = isRejected
                    ? await rejectOrder({ displayingId: id, mode })
                    : isApprove
                    ? await approveOrder({ displayingId: id, mode })
                    : await markOrder({ displayingId: id, userStatus, mode });
                if (data && data.status === ApiStatus.SUCCESS) {
                    // close confirm modal
                    setModalPropsWithKey(MODAL_TYPE.CONFIRM, {
                        loading: false,
                        visible: false
                    });

                    // open after confirm modal
                    setModalPropsWithKey(MODAL_TYPE.AFTER_CONFIRM, {
                        visible: true,
                        type,
                        additionalData
                    });

                    toggleRefetch();
                } else {
                    setModalPropsWithKey(MODAL_TYPE.CONFIRM, {
                        loading: false,
                        visible: false
                    });
                    setModalPropsWithKey(MODAL_TYPE.AFTER_CONFIRM, {
                        visible: true,
                        type: ORDER_TYPES.ERROR,
                        additionalData: data?.status
                    });
                }
            } catch (error) {
                setModalPropsWithKey(MODAL_TYPE.CONFIRM, {
                    loading: false,
                    visible: false
                });
                setModalPropsWithKey(MODAL_TYPE.AFTER_CONFIRM, {
                    visible: true,
                    type: ORDER_TYPES.ERROR,
                    additionalData: error
                });
            }
        };

    const onMarkWithStatus = (userStatus, statusType, orderDetail) => {
        let type, additionalData;
        const assetId = orderDetail?.baseAssetId;
        const id = orderDetail?.displayingId;
        const side = orderDetail?.side;
        const baseQty = orderDetail?.baseQty;
        const assetCode = ALLOWED_ASSET[+assetId];
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
                        additionalData = { token: assetCode, side, id };
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
        setModalPropsWithKey(MODAL_TYPE.CONFIRM, {
            visible: true,
            type,
            additionalData,
            onConfirm: onMarkOrderHandler(userStatus, statusType, {
                assetId,
                id,
                side,
                baseQty,
                assetCode
            })
        });
    };

    return { onMarkWithStatus };
};

export default useMarkOrder;
