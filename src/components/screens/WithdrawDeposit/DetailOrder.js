import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import fetchApi from 'utils/fetch-api';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { API_GET_ORDER_DETAILS } from 'redux/actions/apis';
import { BxsInfoCircle, FutureSupportIcon } from 'components/svg/SvgIcon';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { PartnerOrderStatus, PartnerPersonStatus, ApiStatus, UserSocketEvent, PartnerAcceptStatus } from 'redux/actions/const';
import { getAssetCode } from 'redux/actions/utils';

import { MODAL_TYPE, SIDE } from 'redux/reducers/withdrawDeposit';
import { DisputedType, TranferreredType, MODE } from './constants';
import useMarkOrder from './hooks/useMarkOrder';
import classNames from 'classnames';
import { useBoolean } from 'react-use';
import ModalLoading from 'components/common/ModalLoading';
import AppealButton from './components/AppealButton';
import NeedLoginV2 from 'components/common/NeedLoginV2';
import ModalNeedKyc from 'components/common/ModalNeedKyc';
import DarkNote from 'components/common/DarkNote';
import DetailOrderHeader from './components/DetailOrderHeader';
import Skeletor from 'components/common/Skeletor';
import DetailLog from './components/DetailLog';

export const ModalConfirm = ({ modalProps: { visible, type, loading, onConfirm, additionalData }, mode, onClose }) => {
    return <ModalOrder isVisible={visible} onClose={onClose} type={type} loading={loading} mode={mode} onConfirm={onConfirm} additionalData={additionalData} />;
};

const GroupInforCard = dynamic(() => import('./GroupInforCard'), { ssr: false });
const ModalQr = dynamic(() => import('./components/ModalQr'), { ssr: false });
const ModalOrder = dynamic(() => import('./components/ModalOrder'));
const ModalRating = dynamic(() => import('./components/ModalRating', { ssr: false }));
const ModalUploadImage = dynamic(() => import('./components/ModalUploadImage', { ssr: false }));
const ModalPreviewProof = dynamic(() => import('./components/ModalPreviewProof', { ssr: false }));

const DetailOrder = ({ id, mode = MODE.USER }) => {
    const { t } = useTranslation();
    const userSocket = useSelector((state) => state.socket.userSocket);
    const { modal: modalProps } = useSelector((state) => state.withdrawDeposit);

    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const [state, set] = useState({
        orderDetail: null,
        isShowQr: false,
        isShowUploadImg: false,
        firstLoad: true,
        isShowRating: false,
        needRating: false,
        isShowProof: false
    });

    const setState = (_state) => set((prev) => ({ ...prev, ..._state }));
    const [refetch, toggleRefetch] = useBoolean(false);
    const [isRefetchOrderDetailAfterCountdown, setIsRefetchOrderDetailAfterCountdown] = useState(false);

    const side = state.orderDetail?.side;
    const status = useMemo(
        () => ({
            status: state.orderDetail?.status,
            userStatus: state.orderDetail?.userStatus,
            partnerStatus: state.orderDetail?.partnerStatus,
            partnerAcceptStatus: state.orderDetail?.partnerAcceptStatus
        }),
        [state.orderDetail]
    );

    const assetCode = getAssetCode(state.orderDetail?.baseAssetId);

    const refetchOrderDetailHandler = (data) => {
        toggleRefetch();
        if (mode === MODE.USER && data?.status === PartnerOrderStatus.SUCCESS && !data?.reasonDisputedCode) {
            if (data?.side === SIDE.BUY) {
                setState({
                    isShowRating: true
                });
            } else {
                setState({
                    needRating: true
                });
            }
        }
    };

    const { onMarkWithStatus, onProcessOrder, setModalState } = useMarkOrder({
        mode,
        toggleRefetch: refetchOrderDetailHandler
    });

    useEffect(() => {
        if (userSocket) {
            userSocket.on(UserSocketEvent.PARTNER_UPDATE_ORDER, (data) => {
                // make sure the socket displayingId is the current details/[id] page
                if (data && data.displayingId === id) {
                    setState({
                        orderDetail: data
                    });
                    setIsRefetchOrderDetailAfterCountdown(false);
                    if (mode === MODE.USER && data?.status === PartnerOrderStatus.SUCCESS && !data?.reasonDisputedCode) {
                        if (data?.side === SIDE.BUY) {
                            setState({
                                isShowRating: true
                            });
                        } else {
                            setState({
                                needRating: true
                            });
                        }
                    }
                }
            });
        }
        return () => {
            if (userSocket) {
                userSocket.removeListener(UserSocketEvent.PARTNER_UPDATE_ORDER, (data) => {
                    console.log('socket removeListener PARTNER_UPDATE_ORDER:', data);
                });
            }
        };
    }, [userSocket, mode]);

    useEffect(() => {
        const fetchData = async (id) => {
            if (id) {
                try {
                    const { status, data } = await fetchApi({
                        url: API_GET_ORDER_DETAILS,
                        options: { method: 'GET' },
                        params: {
                            displayingId: id
                        }
                    });

                    if (data && status === ApiStatus.SUCCESS) {
                        setState({
                            orderDetail: data
                        });
                        if (data?.status !== PartnerOrderStatus.PENDING) {
                            setIsRefetchOrderDetailAfterCountdown(false);
                        }
                    }
                } catch (error) {
                    console.log('error:', error);
                } finally {
                    setState({ firstLoad: false });
                }
            }
        };
        fetchData(id);
    }, [id, refetch]);

    const onOpenChat = () => {
        if (window?.fcWidget?.isOpen()) return;
        window?.fcWidget?.open({ name: 'Inbox', replyText: '' });
    };

    const renderButton = useCallback(() => {
        let primaryBtn = null,
            secondaryBtn = null,
            reportBtn = null;

        if (!state.orderDetail) return;

        const isPartner = mode === MODE.PARTNER;
        const side = state.orderDetail?.side;
        const myStatus = state.orderDetail[`${mode}Status`];
        const theirStatus = state.orderDetail[`${isPartner ? MODE.USER : MODE.PARTNER}Status`];
        const orderStatus = state.orderDetail?.status;
        const isPartnerAccepted = state.orderDetail?.partnerAcceptStatus === PartnerAcceptStatus.ACCEPTED;

        ({
            [SIDE.BUY]: {
                render: () => {
                    if (orderStatus === PartnerOrderStatus.PENDING) {
                        // partner logic
                        if (isPartner) {
                            if (!isPartnerAccepted) {
                                secondaryBtn = {
                                    function: () => onProcessOrder(PartnerAcceptStatus.DENIED, DisputedType.REJECTED, state.orderDetail),
                                    text: t('common:reject')
                                };
                                primaryBtn = {
                                    function: () => onProcessOrder(PartnerAcceptStatus.ACCEPTED, null, state.orderDetail),
                                    text: t('common:accept')
                                };
                            } else {
                                //user chua chuyen tien
                                if (theirStatus === PartnerPersonStatus.PENDING) {
                                    primaryBtn = {
                                        function: () => onMarkWithStatus(PartnerPersonStatus.TRANSFERRED, TranferreredType[mode].TAKE, state.orderDetail),
                                        text: t('dw_partner:take_money_already')
                                    };
                                } else {
                                    primaryBtn = {
                                        function: () => onMarkWithStatus(PartnerPersonStatus.TRANSFERRED, TranferreredType[mode].TAKE, state.orderDetail),
                                        text: t('dw_partner:take_money_already')
                                    };
                                    // reportBtn = (
                                    //     <AppealButton
                                    //         onMarkWithStatus={() => onMarkWithStatus(PartnerPersonStatus.DISPUTED, DisputedType.REPORT, state.orderDetail)}
                                    //         timeDispute={state?.orderDetail?.countdownTimeDispute}
                                    //         timeExpire={state.orderDetail?.timeExpire}
                                    //     />
                                    // );
                                }
                            }
                        }
                        // user logic
                        else {
                            if (!isPartnerAccepted) {
                                primaryBtn = {
                                    function: () => onMarkWithStatus(PartnerPersonStatus.DISPUTED, DisputedType.REJECTED, state.orderDetail),
                                    text: t('common:cancel_order')
                                };
                            } else {
                                if (theirStatus === PartnerPersonStatus.PENDING) {
                                    // user chua chuyen tien
                                    if (myStatus === PartnerPersonStatus.PENDING) {
                                        primaryBtn = {
                                            function: () =>
                                                onMarkWithStatus(PartnerPersonStatus.TRANSFERRED, TranferreredType[mode].TRANSFERRED, state.orderDetail),
                                            text: t('dw_partner:transfer_already')
                                        };
                                        return;
                                    }
                                }
                            }
                        }
                    }
                    // order status is PENDING or DISPUTED
                    if (orderStatus === PartnerOrderStatus.DISPUTED || orderStatus === PartnerOrderStatus.PENDING) {
                        // neu user da chuyen tien -> se luon hien button upload proof
                        if (myStatus === PartnerPersonStatus.TRANSFERRED) {
                            primaryBtn = {
                                function: () => setState({ isShowUploadImg: true }),
                                text: state.orderDetail?.userUploadImage ? t('dw_partner:upload_proof_again') : t('dw_partner:upload_proof')
                            };
                        }
                    }

                    // resolve dispute button for partner mode
                    if (orderStatus === PartnerOrderStatus.DISPUTED && isPartner) {
                        primaryBtn = {
                            function: () => onMarkWithStatus(PartnerPersonStatus.DISPUTED, DisputedType.RESOLVE_DISPUTE, state.orderDetail),
                            text: t('dw_partner:complete_dispute')
                        };
                    }
                }
            },
            [SIDE.SELL]: {
                render: () => {
                    if (orderStatus === PartnerOrderStatus.PENDING) {
                        //partner logic
                        if (isPartner) {
                            if (!isPartnerAccepted) {
                                secondaryBtn = {
                                    function: () => onProcessOrder(PartnerAcceptStatus.DENIED, DisputedType.REJECTED, state.orderDetail),
                                    text: t('common:reject')
                                };
                                primaryBtn = {
                                    function: () => onProcessOrder(PartnerAcceptStatus.ACCEPTED, null, state.orderDetail),
                                    text: t('common:accept')
                                };
                            } else {
                                //partner chua chuyen tien
                                if (myStatus === PartnerPersonStatus.PENDING) {
                                    primaryBtn = {
                                        function: () =>
                                            onMarkWithStatus(PartnerPersonStatus.TRANSFERRED, TranferreredType[mode].TRANSFERRED, state.orderDetail),
                                        text: t('dw_partner:transfer_already')
                                    };

                                    return;
                                }
                            }
                        } else {
                            if (!isPartnerAccepted) {
                                primaryBtn = {
                                    function: () => onMarkWithStatus(PartnerPersonStatus.DISPUTED, DisputedType.REJECTED, state.orderDetail),
                                    text: t('common:cancel_order')
                                };
                            } else {
                                // hiện "tôi đã nhận tiền" khi partner chưa chuyển tiền
                                if (theirStatus === PartnerPersonStatus.PENDING) {
                                    primaryBtn = {
                                        function: () => onMarkWithStatus(PartnerPersonStatus.TRANSFERRED, TranferreredType[mode].TAKE, state.orderDetail),
                                        text: t('dw_partner:take_money_already')
                                    };

                                    return;
                                }
                                // hiện "tôi đã nhận tiền" và "khiếu nại" khi partner đã TRANSFERRED
                                if (theirStatus === PartnerPersonStatus.TRANSFERRED) {
                                    primaryBtn = {
                                        function: () => onMarkWithStatus(PartnerPersonStatus.TRANSFERRED, TranferreredType[mode].TAKE, state.orderDetail),
                                        text: t('dw_partner:take_money_already')
                                    };
                                    // reportBtn = (
                                    //     <AppealButton
                                    //         onMarkWithStatus={() => onMarkWithStatus(PartnerPersonStatus.DISPUTED, DisputedType.REPORT, state.orderDetail)}
                                    //         timeDispute={state?.orderDetail?.countdownTimeDispute}
                                    //         timeExpire={state.orderDetail?.timeExpire}
                                    //     />
                                    // );
                                }
                            }
                        }
                    }
                    // order status is PENDING, DISPUTED
                    if (orderStatus === PartnerOrderStatus.DISPUTED || orderStatus === PartnerOrderStatus.PENDING) {
                        // neu partner da chuyen tien -> se luon hien button upload proof
                        if (isPartner && myStatus === PartnerPersonStatus.TRANSFERRED) {
                            primaryBtn = {
                                function: () => setState({ isShowUploadImg: true }),
                                text: state.orderDetail?.partnerUploadImage ? t('dw_partner:upload_proof_again') : t('dw_partner:upload_proof')
                            };
                        }
                    }

                    // resolve dispute button for user mode
                    if (orderStatus === PartnerOrderStatus.DISPUTED && !isPartner) {
                        primaryBtn = {
                            function: () => onMarkWithStatus(PartnerPersonStatus.DISPUTED, DisputedType.RESOLVE_DISPUTE, state.orderDetail),
                            text: t('dw_partner:complete_dispute')
                        };
                    }
                }
            }
        })[side.toUpperCase()].render();

        return (
            <div className="flex gap-x-4">
                {primaryBtn && (
                    <ButtonV2 onClick={primaryBtn?.function} className={classNames('min-w-[286px] px-6', primaryBtn?.class)}>
                        {/* //!whitespace-nowrap px-[62.5px] */}
                        {primaryBtn?.text}
                    </ButtonV2>
                )}

                {secondaryBtn && (
                    <ButtonV2 onClick={secondaryBtn?.function} className={classNames('px-6 !w-auto', secondaryBtn?.class)} variants="secondary">
                        {secondaryBtn?.text}
                    </ButtonV2>
                )}
                {/* update 09/05/2023 -> bỏ button khiếu nại*/}
                {/* {reportBtn} */}
            </div>
        );
    }, [mode, state?.orderDetail, t]);
    const notes = { __html: t('dw_partner:notes') };

    // Handle not Login or not KYC:
    const auth = useSelector((state) => state.auth.user) || null;

    if (!auth) {
        return (
            <div className="h-[480px] flex items-center justify-center">
                <NeedLoginV2 addClass="flex items-center justify-center" />
            </div>
        );
    }

    if (auth && auth?.kyc_status !== 2) return <ModalNeedKyc isOpenModalKyc={true} />;
    // End handle not Login || not KYC

    return (
        <div className="w-full h-full pt-20 pb-[120px] px-4">
            <div className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto text-base text-gray-15 dark:text-gray-4 tracking-normal w-full">
                <DetailOrderHeader
                    status={status}
                    refetchOrderDetail={() => {
                        toggleRefetch();
                        setIsRefetchOrderDetailAfterCountdown(true);
                    }}
                    orderDetail={state.orderDetail}
                    assetCode={assetCode}
                    side={side}
                    mode={mode}
                />
                <GroupInforCard
                    isDark={isDark}
                    mode={mode}
                    assetCode={assetCode}
                    orderDetail={state.orderDetail}
                    side={side}
                    setModalQr={() => setState({ isShowQr: true })}
                    status={status}
                />
                {/* Lưu ý */}
                {((side === SIDE.BUY && mode === MODE.USER) || (side === SIDE.SELL && mode === MODE.PARTNER)) && (
                    <div className="w-full rounded-md border border-divider dark:border-0 dark:bg-darkBlue-3 py-4 px-6">
                        <DarkNote title={t('wallet:note')} />
                        <div className="txtSecond-2 mt-2">
                            {status?.partnerAcceptStatus === PartnerAcceptStatus.PENDING && status?.status === PartnerOrderStatus.PENDING ? (
                                t('dw_partner:note_waiting_confirm')
                            ) : (
                                <ul className="list-disc ml-6 marker:text-xs" dangerouslySetInnerHTML={notes} />
                            )}
                        </div>
                    </div>
                )}
                {((side === SIDE.SELL && mode === MODE.USER) || (side === SIDE.BUY && mode === MODE.PARTNER)) &&
                    status?.status === PartnerOrderStatus.DISPUTED && (
                        <div className="w-full rounded-md border border-divider dark:border-0 dark:bg-darkBlue-3 py-4 px-6">
                            <DarkNote title={t('wallet:note')} />
                            <div className="txtSecond-2 mt-2">{t('dw_partner:note_complete_dispute')}</div>
                        </div>
                    )}

                <DetailLog orderDetail={state.orderDetail} mode={mode} onShowProof={() => setState({ isShowProof: true })} />

                {/* Actions */}

                <div className="flex items-center justify-between mt-8">
                    {renderButton()}

                    <div className="flex justify-end ">
                        <ButtonV2 onClick={onOpenChat} variants="text" className="w-auto">
                            <FutureSupportIcon className="mr-2" isDark={isDark} />
                            {t('common:chat_with_support')}
                        </ButtonV2>
                    </div>
                </div>
            </div>

            {state.orderDetail && (
                <ModalQr
                    orderId={state?.orderDetail?._id}
                    isVisible={state.isShowQr}
                    onClose={() => setState({ isShowQr: false })}
                    bank={state.orderDetail?.transferMetadata}
                    amount={state.orderDetail?.baseQty}
                    t={t}
                />
            )}
            {/*Modal confirm the order */}
            <ModalConfirm
                mode={mode}
                modalProps={modalProps[MODAL_TYPE.CONFIRM]}
                onClose={() =>
                    setModalState(MODAL_TYPE.CONFIRM, {
                        visible: false
                    })
                }
            />

            {/*Modal After confirm (success, error,...) */}
            <ModalConfirm
                mode={mode}
                modalProps={modalProps[MODAL_TYPE.AFTER_CONFIRM]}
                onClose={() => {
                    setModalState(MODAL_TYPE.AFTER_CONFIRM, {
                        visible: false
                    });

                    // show rating modal only if user is on SELL mode then after close AFTER_CONFIRM modal
                    if (state.needRating) {
                        setState({
                            isShowRating: true
                        });
                    }
                }}
            />

            <ModalUploadImage
                isVisible={state.isShowUploadImg}
                onClose={() => setState({ isShowUploadImg: false })}
                orderId={id}
                originImage={mode === MODE.USER ? state?.orderDetail?.userUploadImage : state?.orderDetail?.partnerUploadImage}
                mode={mode}
            />
            <ModalLoading isVisible={isRefetchOrderDetailAfterCountdown} onBackdropCb={() => setIsRefetchOrderDetailAfterCountdown(false)} />
            <ModalRating isVisible={state.isShowRating} onClose={() => setState({ isShowRating: false })} orderDetail={state.orderDetail} />
            <ModalPreviewProof
                mode={mode}
                orderDetail={state.orderDetail}
                t={t}
                isVisible={state.isShowProof}
                onClose={() => setState({ isShowProof: false })}
            />
        </div>
    );
};

export default DetailOrder;
