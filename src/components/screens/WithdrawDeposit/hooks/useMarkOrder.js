import React, { useMemo } from 'react';
import { ALLOWED_ASSET, DisputedType, MODE, ORDER_TYPES, TranferreredType } from '../constants';
import { ApiResultCreateOrder, ApiStatus, PartnerAcceptStatus, PartnerOrderStatus, PartnerPersonStatus } from 'redux/actions/const';
import { formatBalance } from 'redux/actions/utils';
import { processPartnerOrder, approveOrder, markOrder, rejectOrder, setPartnerModal, resolveDispute } from 'redux/actions/withdrawDeposit';
import { useDispatch } from 'react-redux';
import { MODAL_TYPE } from 'redux/reducers/withdrawDeposit';
import { useRouter } from 'next/router';
import { PATHS } from 'constants/paths';
const useMarkOrder = ({ mode, toggleRefetch }) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const setModalState = (key, state) => dispatch(setPartnerModal({ key, state }));

    const onMarkOrderHandler =
        (userStatus, statusType, { assetId, id, side, baseQty, assetCode, partnerAcceptStatus }) =>
        async () => {
            let type, additionalData;
            let isReject = false,
                isResolveDispute = false;
            const isApprove = statusType === TranferreredType[mode].TAKE;
            const isProcessOrderAction = mode === MODE.PARTNER && partnerAcceptStatus === PartnerAcceptStatus.PENDING;
            const amount = formatBalance(baseQty, assetId === 72 ? 0 : 4);

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
                                asset: assetCode,
                                amount,
                                assetId
                            };
                            isReject = true;
                            break;
                        case DisputedType.RESOLVE_DISPUTE:
                            isResolveDispute = true;
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
                const data = isResolveDispute
                    ? await resolveDispute({ displayingId: id, mode })
                    : isProcessOrderAction
                    ? await processPartnerOrder({ displayingId: id, status: userStatus })
                    : isReject
                    ? await rejectOrder({ displayingId: id, mode })
                    : isApprove
                    ? await approveOrder({ displayingId: id, mode })
                    : await markOrder({ displayingId: id, userStatus, mode });
                if (data && data.status === ApiStatus.SUCCESS) {
                    // close confirm modal

                    setModalState(MODAL_TYPE.CONFIRM, {
                        loading: false,
                        visible: false
                    });

                    // push to detail page when partner accept order on 'Opening Order' page
                    if (isProcessOrderAction && userStatus === PartnerAcceptStatus.ACCEPTED && !router.asPath.includes(PATHS.PARNER_WITHDRAW_DEPOSIT.DETAILS)) {
                        router.push(PATHS.PARNER_WITHDRAW_DEPOSIT.DETAILS + '/' + id);
                    }

                    // open after confirm modal
                    if (type && additionalData) {
                        // if it's partner accept order action
                        if (isProcessOrderAction && userStatus === PartnerAcceptStatus.ACCEPTED) {
                            // do nothing
                        } else {
                            setModalState(MODAL_TYPE.AFTER_CONFIRM, {
                                visible: true,
                                type,
                                additionalData
                            });
                        }
                    }

                    toggleRefetch(data.data);
                } else {
                    setModalState(MODAL_TYPE.CONFIRM, {
                        loading: false,
                        visible: false
                    });
                    if (data?.status === ApiResultCreateOrder.NOT_FOUND_ORDER) {
                        setModalState(MODAL_TYPE.AFTER_CONFIRM, {
                            visible: true,
                            type: ORDER_TYPES.ERROR_NOT_FOUND_ORDER,
                            additionalData: { displayingId: id }
                        });
                    } else {
                        setModalState(MODAL_TYPE.AFTER_CONFIRM, {
                            visible: true,
                            type: ORDER_TYPES.ERROR,
                            additionalData: data?.status
                        });
                    }
                }
            } catch (error) {
                console.log('error:', error);
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

    const onProcessOrder = async (partnerProcessStatus, statusType, orderDetail) => {
        const assetId = orderDetail?.baseAssetId;
        const id = orderDetail?.displayingId;
        const side = orderDetail?.side;
        const baseQty = orderDetail?.baseQty;
        const assetCode = ALLOWED_ASSET[+assetId];
        const partnerAcceptStatus = orderDetail?.partnerAcceptStatus;

        const onConfirm = onMarkOrderHandler(partnerProcessStatus, statusType, {
            assetId,
            id,
            side,
            baseQty,
            assetCode,
            partnerAcceptStatus
        });

        if (partnerProcessStatus === PartnerAcceptStatus.DENIED) {
            setModalState(MODAL_TYPE.CONFIRM, {
                visible: true,
                type: ORDER_TYPES.CANCEL_ORDER,
                additionalData: { token: assetCode, amount: formatBalance(baseQty, assetCode === 72 ? 0 : 4), side, id },
                onConfirm
            });
        }
        if (partnerProcessStatus === PartnerAcceptStatus.ACCEPTED) {
            onConfirm();
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
                    case DisputedType.RESOLVE_DISPUTE:
                        type = ORDER_TYPES.RESOLVE_DISPUTE;
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

    return { onMarkWithStatus, onProcessOrder, setModalState };
};

export default useMarkOrder;
