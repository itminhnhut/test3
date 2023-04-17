import React, { useMemo } from 'react';
import { ALLOWED_ASSET, DisputedType, MODE, ORDER_TYPES, TranferreredType } from '../constants';
import { ApiStatus, PartnerPersonStatus } from 'redux/actions/const';
import { formatBalance } from 'redux/actions/utils';
import { approveOrder, markOrder, rejectOrder, setPartnerModal } from 'redux/actions/withdrawDeposit';
import { useDispatch } from 'react-redux';
import { MODAL_TYPE } from 'redux/reducers/withdrawDeposit';
import { useRouter } from 'next/router';
import { PATHS } from 'constants/paths';
const useMarkOrder = ({ mode, toggleRefetch }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    console.log('router:', router)

    const setModalState = (key, state) => dispatch(setPartnerModal({ key, state }));

    const onMarkOrderHandler =
        (userStatus, statusType, { assetId, id, side, baseQty, assetCode }) =>
        async () => {
            let type, additionalData;
            let isRejected = false;
            const isApprove = statusType === TranferreredType[mode].TAKE;
            const amount = formatBalance(baseQty, assetId === 72 ? 0 : 4);

            switch (userStatus) {
                case PartnerPersonStatus.DISPUTED:
                    switch (statusType) {
                        case DisputedType.REPORT:
                            type = ORDER_TYPES.REPORT_SUCCESS;

                            break;
                        case DisputedType.REJECTED:
                            type = ORDER_TYPES.CANCEL_SUCCESS;
                            additionalData = {
                                displayingId: id,
                                side,
                                asset: assetCode,
                                amount
                            };
                            isRejected = true;
                            break;
                        default:
                            break;
                    }
                    break;
                case PartnerPersonStatus.TRANSFERRED:
                    type = ORDER_TYPES.TRANSFERRED_SUCCESS;
                    additionalData = { displayingId: id, amount, token: assetCode };
                    break;

                default:
                    break;
            }

            try {
                setModalState(MODAL_TYPE.CONFIRM, {
                    loading: true
                });
                const data = isRejected
                    ? await rejectOrder({ displayingId: id, mode })
                    : isApprove
                    ? await approveOrder({ displayingId: id, mode })
                    : await markOrder({ displayingId: id, userStatus, mode });
                if (data && data.status === ApiStatus.SUCCESS) {
                    // close confirm modal

                    if (mode === MODE.PARTNER && type === ORDER_TYPES.TRANSFERRED_SUCCESS && !router.asPath.includes(PATHS.PARNER_WITHDRAW_DEPOSIT.DETAILS)) {
                        router.push(PATHS.PARNER_WITHDRAW_DEPOSIT.DETAILS + '/' + id);
                    }

                    setModalState(MODAL_TYPE.CONFIRM, {
                        loading: false,
                        visible: false
                    });

                    // open after confirm modal
                    setModalState(MODAL_TYPE.AFTER_CONFIRM, {
                        visible: true,
                        type,
                        additionalData
                    });

                    toggleRefetch();
                } else {
                    setModalState(MODAL_TYPE.CONFIRM, {
                        loading: false,
                        visible: false
                    });
                    setModalState(MODAL_TYPE.AFTER_CONFIRM, {
                        visible: true,
                        type: ORDER_TYPES.ERROR,
                        additionalData: data?.status
                    });
                }
            } catch (error) {
                setModalState(MODAL_TYPE.CONFIRM, {
                    loading: false,
                    visible: false
                });
                setModalState(MODAL_TYPE.AFTER_CONFIRM, {
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
                        additionalData = { token: assetCode, amount: formatBalance(baseQty, assetCode === 72 ? 0 : 4), side, id };
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
        setModalState(MODAL_TYPE.CONFIRM, {
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

    return { onMarkWithStatus, setModalState };
};

export default useMarkOrder;
