import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import fetchApi from 'utils/fetch-api';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { API_GET_ORDER_DETAILS } from 'redux/actions/apis';
import { BxsInfoCircle, FutureSupportIcon } from 'components/svg/SvgIcon';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { PartnerOrderStatus, PartnerPersonStatus, ApiStatus, UserSocketEvent } from 'redux/actions/const';
import { getAssetCode } from 'redux/actions/utils';

import { SIDE } from 'redux/reducers/withdrawDeposit';
import { MODAL_KEY, REPORT_ABLE_TIME, DisputedType, TranferreredType, MODE } from './constants';
import useMarkOrder from './hooks/useMarkOrder';
import Countdown from 'react-countdown';
import classNames from 'classnames';
import { useBoolean } from 'react-use';
import ModalLoading from 'components/common/ModalLoading';

const ModalConfirm = ({ modalProps: { visible, type, loading, onConfirm, additionalData }, mode, onClose }) => {
    return <ModalOrder isVisible={visible} onClose={onClose} type={type} loading={loading} mode={mode} onConfirm={onConfirm} additionalData={additionalData} />;
};

const ReportButtonRender = ({ timeExpire, onMarkWithStatus, t }) => {
    return timeExpire ? (
        <Countdown date={new Date(timeExpire).getTime()} renderer={({ props, ...countdownProps }) => props.children(countdownProps)}>
            {(props) => {
                return (
                    <ButtonV2
                        disabled={props.total > REPORT_ABLE_TIME * 1000}
                        onClick={() => onMarkWithStatus(PartnerPersonStatus.DISPUTED, DisputedType.REPORT)}
                        className="px-6 disabled:!cursor-default"
                        variants="secondary"
                    >
                        {t('dw_partner:appeal')}
                    </ButtonV2>
                );
            }}
        </Countdown>
    ) : (
        <></>
    );
};

const GroupInforCard = dynamic(() => import('./GroupInforCard'), { ssr: false });
const ModalQr = dynamic(() => import('./components/ModalQr'), { ssr: false });
const ModalOrder = dynamic(() => import('./components/ModalOrder'));
const ModalUploadImage = dynamic(() => import('./components/ModalUploadImage', { ssr: false }));

const DetailOrder = ({ id, mode = MODE.USER }) => {
    const { t } = useTranslation();
    // const user = useSelector((state) => state.auth) || null;
    const userSocket = useSelector((state) => state.socket.userSocket);

    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const [state, set] = useState({
        orderDetail: null,
        isShowQr: false,
        isShowUploadImg: false,
        firstLoad: true
    });

    const [modalProps, setModalProps] = useState({
        [MODAL_KEY.CONFIRM]: { type: null, visible: false, loading: false, onConfirm: null, additionalData: null },
        [MODAL_KEY.AFTER_CONFIRM]: { type: null, visible: false, loading: false, onConfirm: null, additionalData: null }
    });

    const setState = (_state) => set((prev) => ({ ...prev, ..._state }));
    const [refetch, toggleRefetch] = useBoolean(false);
    const [isRefetchOrderDetailAfterCountdown, setIsRefetchOrderDetailAfterCountdown] = useState(false);

    const side = state.orderDetail?.side;
    const status = useMemo(
        () => ({
            status: state.orderDetail?.status,
            userStatus: state.orderDetail?.userStatus,
            partnerStatus: state.orderDetail?.partnerStatus
        }),
        [state.orderDetail]
    );

    const assetCode = getAssetCode(state.orderDetail?.baseAssetId);

    const setModalPropsWithKey = (key, props) =>
        setModalProps((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                ...props
            }
        }));

    const { onMarkWithStatus } = useMarkOrder({
        baseQty: state.orderDetail?.baseQty,
        id,
        assetCode,
        assetId: state.orderDetail?.baseAssetId,
        setModalPropsWithKey,
        side,
        mode
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
    }, [userSocket]);

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

        ({
            [SIDE.BUY]: {
                render: () => {
                    if (orderStatus === PartnerOrderStatus.PENDING) {
                        // partner logic
                        if (isPartner) {
                            //user chua chuyen tien
                            if (theirStatus === PartnerPersonStatus.PENDING) {
                                secondaryBtn = {
                                    function: () => onMarkWithStatus(PartnerPersonStatus.DISPUTED, DisputedType.REJECTED),
                                    text: t('cancel_order')
                                };
                            } else {
                                primaryBtn = {
                                    function: () => onMarkWithStatus(PartnerPersonStatus.TRANSFERRED, TranferreredType[mode].TAKE),
                                    text: t('dw_partner:take_money_already')
                                };
                                reportBtn = <ReportButtonRender onMarkWithStatus={onMarkWithStatus} timeExpire={state.orderDetail?.timeExpire} t={t} />;
                            }
                        }
                        // user logic
                        else {
                            if (theirStatus === PartnerPersonStatus.PENDING) {
                                // user chua chuyen tien
                                if (myStatus === PartnerPersonStatus.PENDING) {
                                    secondaryBtn = {
                                        function: () => onMarkWithStatus(PartnerPersonStatus.DISPUTED, DisputedType.REJECTED),
                                        text: t('common:cancel_order')
                                    };
                                    primaryBtn = {
                                        function: () => onMarkWithStatus(PartnerPersonStatus.TRANSFERRED, TranferreredType[mode].TRANSFERRED),
                                        text: t('dw_partner:transfer_already')
                                    };
                                    return;
                                }
                                // transferred
                                if (myStatus === PartnerPersonStatus.TRANSFERRED) {
                                    primaryBtn = {
                                        function: () => setState({ isShowUploadImg: true }),
                                        text: state.orderDetail?.userUploadImage ? t('dw_partner:upload_proof_again') : t('dw_partner:upload_proof')
                                    };
                                }
                            }
                        }
                    }
                }
            },
            [SIDE.SELL]: {
                render: () => {
                    if (orderStatus === PartnerOrderStatus.PENDING) {
                        //partner logic
                        if (isPartner) {
                            //partner chua chuyen tien
                            if (myStatus === PartnerPersonStatus.PENDING) {
                                secondaryBtn = {
                                    function: () => onMarkWithStatus(PartnerPersonStatus.DISPUTED, DisputedType.REJECTED),
                                    text: t('cancel_order')
                                };
                                primaryBtn = {
                                    function: () => onMarkWithStatus(PartnerPersonStatus.TRANSFERRED, TranferreredType[mode].TRANSFERRED),
                                    text: t('common:confirm')
                                };

                                return;
                            }

                            // transferred
                            if (myStatus === PartnerPersonStatus.TRANSFERRED) {
                                primaryBtn = {
                                    function: () => setState({ isShowUploadImg: true }),
                                    text: state.orderDetail?.partnerUploadImage ? t('dw_partner:upload_proof_again') : t('dw_partner:upload_proof')
                                };
                            }
                        } else {
                            // partner chua chuyen tien
                            if (theirStatus === PartnerPersonStatus.PENDING) {
                                secondaryBtn = {
                                    function: () => onMarkWithStatus(PartnerPersonStatus.DISPUTED, DisputedType.REJECTED),
                                    text: t('common:cancel_order')
                                };

                                return;
                            }
                            // partner transferred
                            if (theirStatus === PartnerPersonStatus.TRANSFERRED) {
                                primaryBtn = {
                                    function: () => onMarkWithStatus(PartnerPersonStatus.TRANSFERRED, TranferreredType[mode].TAKE),
                                    text: t('dw_partner:take_money_already')
                                };
                                reportBtn = <ReportButtonRender onMarkWithStatus={onMarkWithStatus} timeExpire={state.orderDetail?.timeExpire} t={t} />;
                            }
                        }
                    }
                }
            }
        }[side.toUpperCase()].render());

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
                {reportBtn}
            </div>
        );
    }, [mode, state?.orderDetail, t]);
    const notes = { __html: t('dw_partner:notes') };

    return (
        <div className="w-full h-full flex justify-center pt-20 pb-[120px] px-4">
            <div className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto text-base text-gray-15 dark:text-gray-4 tracking-normal w-full">
                <GroupInforCard
                    assetCode={assetCode}
                    t={t}
                    orderDetail={state.orderDetail}
                    side={side}
                    setModalQr={() => setState({ isShowQr: true })}
                    status={status}
                    refetchOrderDetail={() => {
                        toggleRefetch();
                        setIsRefetchOrderDetailAfterCountdown(true);
                    }}
                />
                {/* Lưu ý */}
                {side === SIDE.BUY && (
                    <div className="w-full rounded-md border border-divider dark:border-divider-dark py-4 px-6 mt-8">
                        <div className="flex font-semibold items-center space-x-2 ">
                            <BxsInfoCircle size={16} fill={'currentColor'} fillInside={'currentColor'} />
                            <span>{t('wallet:note')}</span>
                        </div>
                        <div className="txtSecond-2 mt-2">
                            <ul className="list-disc ml-6 marker:text-xs" dangerouslySetInnerHTML={notes} />
                        </div>
                    </div>
                )}
                {/* Actions */}

                <div className="flex items-center justify-between mt-8">
                    {renderButton()}

                    <div className="flex justify-end ">
                        <ButtonV2 onClick={onOpenChat} variants="text" className="!text-sm w-auto">
                            <FutureSupportIcon className="mr-2" isDark={isDark} />
                            {t('common:chat_with_support')}
                        </ButtonV2>
                    </div>
                </div>
            </div>

            {state.orderDetail && (
                <ModalQr
                    isVisible={state.isShowQr}
                    onClose={() => setState({ isShowQr: false })}
                    bank={state.orderDetail?.transferMetadata}
                    amount={state.orderDetail?.baseQty}
                    t={t}
                />
            )}
            {/*Modal confirm the order */}
            <ModalConfirm mode={mode} modalProps={modalProps[MODAL_KEY.CONFIRM]} onClose={() => setModalPropsWithKey(MODAL_KEY.CONFIRM, { visible: false })} />

            {/*Modal After confirm (success, error,...) */}
            <ModalConfirm
                mode={mode}
                modalProps={modalProps[MODAL_KEY.AFTER_CONFIRM]}
                onClose={() => setModalPropsWithKey(MODAL_KEY.AFTER_CONFIRM, { visible: false })}
            />

            <ModalUploadImage
                isVisible={state.isShowUploadImg}
                onClose={() => setState({ isShowUploadImg: false })}
                orderId={id}
                originImage={state?.orderDetail?.userUploadImage}
            />
            <ModalLoading isVisible={isRefetchOrderDetailAfterCountdown} onBackdropCb={() => setIsRefetchOrderDetailAfterCountdown(false)} />
        </div>
    );
};

export default DetailOrder;
