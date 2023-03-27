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
import { MODAL_KEY, REPORT_ABLE_TIME, DisputedType, TranferreredType } from './constants';
import useMarkOrder from './hooks/useMarkOrder';
import Countdown from 'react-countdown';

const ModalConfirm = ({ modalProps: { visible, type, loading, onConfirm, additionalData }, onClose }) => {
    return <ModalOrder isVisible={visible} onClose={onClose} type={type} loading={loading} onConfirm={onConfirm} additionalData={additionalData} />;
};

const GroupInforCard = dynamic(() => import('./GroupInforCard'), { ssr: false });
const ModalQr = dynamic(() => import('./components/ModalQr'), { ssr: false });
const ModalOrder = dynamic(() => import('./components/ModalOrder'));
const ModalUploadImage = dynamic(() => import('./components/ModalUploadImage', { ssr: false }));

const ReportButton = ({ timeExpire, onMarkWithStatus }) => {
    return timeExpire ? (
        <Countdown date={new Date(timeExpire).getTime()} renderer={({ props, ...countdownProps }) => props.children(countdownProps)}>
            {(props) => (
                <ButtonV2
                    disabled={props.total > REPORT_ABLE_TIME * 1000}
                    onClick={() => onMarkWithStatus(PartnerPersonStatus.DISPUTED, DisputedType.REPORT)}
                    className="px-6 disabled:!cursor-default"
                    variants="secondary"
                >
                    Khiếu nại 
                </ButtonV2>
            )}
        </Countdown>
    ) : (
        <></>
    );
};

const DetailOrder = ({ id }) => {
    const { t } = useTranslation();
    // const user = useSelector((state) => state.auth.user) || null;
    const userSocket = useSelector((state) => state.socket.userSocket);

    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const [state, set] = useState({
        orderDetail: null,
        isShowQr: false,
        isShowUploadImg: false
    });

    const [modalProps, setModalProps] = useState({
        [MODAL_KEY.CONFIRM]: { type: null, visible: false, loading: false, onConfirm: null, additionalData: null },
        [MODAL_KEY.AFTER_CONFIRM]: { type: null, visible: false, loading: false, onConfirm: null, additionalData: null }
    });

    const setState = (_state) => set((prev) => ({ ...prev, ..._state }));

    const side = useMemo(() => state.orderDetail?.side, [state.orderDetail]);
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

    const { onMarkWithStatus } = useMarkOrder({ baseQty: state.orderDetail?.baseQty, id, assetCode, setModalPropsWithKey, side });

    useEffect(() => {
        if (userSocket) {
            userSocket.on(UserSocketEvent.PARTNER_UPDATE_ORDER, (data) => {
                console.log('data:', data);
                setState({
                    orderDetail: data
                });
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
                    }
                } catch (error) {
                    console.log('error:', error);
                }
            }
        };
        fetchData(id);
    }, [id]);

    const onOpenChat = () => {
        if (window?.fcWidget?.isOpen()) return;
        window?.fcWidget?.open({ name: 'Inbox', replyText: '' });
    };

    const renderButton = useCallback(
        () =>
            side === SIDE.BUY ? (
                status?.status === PartnerOrderStatus.PENDING && status?.userStatus === PartnerPersonStatus.PENDING ? (
                    <>
                        <ButtonV2
                            onClick={() => onMarkWithStatus(PartnerPersonStatus.TRANSFERRED, TranferreredType.U_P.TRANSFERRED)}
                            className="!whitespace-nowrap px-[62.5px]"
                        >
                            {t('wallet:transfer_already')}{' '}
                        </ButtonV2>
                        <ButtonV2 onClick={() => onMarkWithStatus(PartnerPersonStatus.DISPUTED, DisputedType.REJECTED)} className="px-6" variants="secondary">
                            Huỷ giao dịch
                        </ButtonV2>
                    </>
                ) : (
                    status?.userStatus === PartnerPersonStatus.TRANSFERRED && (
                        <ButtonV2 onClick={() => setState({ isShowUploadImg: true })} className="!whitespace-nowrap min-w-[268px]">
                            {Boolean(state.orderDetail.userUploadImage) ? 'Chỉnh sửa hình ảnh' : 'Tải ảnh lên'}
                        </ButtonV2>
                    )
                )
            ) : status?.status === PartnerOrderStatus.PENDING && status?.partnerStatus === PartnerPersonStatus.PENDING ? (
                <ButtonV2 onClick={() => onMarkWithStatus(PartnerPersonStatus.DISPUTED, DisputedType.REJECTED)} className="px-6" variants="secondary">
                    Huỷ giao dịch
                </ButtonV2>
            ) : status?.partnerStatus === PartnerPersonStatus.TRANSFERRED ? (
                <>
                    <ButtonV2
                        onClick={() => onMarkWithStatus(PartnerPersonStatus.TRANSFERRED, TranferreredType.U_P.TAKE)}
                        className="!whitespace-nowrap px-[62.5px]"
                    >
                        {t('wallet:transfer_already')}
                    </ButtonV2>
                    <ReportButton timeExpire={state.orderDetail?.timeExpire} onMarkWithStatus={onMarkWithStatus} />
                </>
            ) : (
                <></>
            ),
        [side, state.orderDetail, status]
    );

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
                />
                {/* Lưu ý */}
                {side === SIDE.BUY && (
                    <div className="w-full rounded-md border border-divider dark:border-divider-dark py-4 px-6 mt-8">
                        <div className="flex font-semibold items-center space-x-2 ">
                            <BxsInfoCircle size={16} fill={'currentColor'} fillInside={'currentColor'} />
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
                    <div className={`flex gap-x-4 `}>{renderButton()}</div>

                    <div className="flex justify-end w-full">
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
                    qrCodeUrl={'awegawge'}
                    bank={state.orderDetail?.transferMetadata}
                    amount={state.orderDetail?.baseQty}
                />
            )}
            {/*Modal confirm the order */}
            <ModalConfirm modalProps={modalProps[MODAL_KEY.CONFIRM]} onClose={() => setModalPropsWithKey(MODAL_KEY.CONFIRM, { visible: false })} />

            {/*Modal After confirm (success, error,...) */}
            <ModalConfirm modalProps={modalProps[MODAL_KEY.AFTER_CONFIRM]} onClose={() => setModalPropsWithKey(MODAL_KEY.AFTER_CONFIRM, { visible: false })} />

            <ModalUploadImage
                isVisible={state.isShowUploadImg}
                onClose={() => setState({ isShowUploadImg: false })}
                orderId={id}
                originImage={state?.orderDetail?.userUploadImage}
            />
        </div>
    );
};

export default DetailOrder;
