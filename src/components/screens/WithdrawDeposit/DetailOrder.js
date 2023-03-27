import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import fetchApi from 'utils/fetch-api';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { API_GET_ORDER_DETAILS } from 'redux/actions/apis';
import { BxsInfoCircle, FutureSupportIcon } from 'components/svg/SvgIcon';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { PartnerOrderStatus, PartnerPersonStatus, ApiStatus, UserSocketEvent } from 'redux/actions/const';
import { formatBalance } from 'redux/actions/utils';
import { ALLOWED_ASSET } from 'redux/reducers/withdrawDeposit';

import { ORDER_TYPES } from './components/ModalOrder';
import { markOrder, rejectOrder } from 'redux/actions/withdrawDeposit';

const ModalConfirm = ({ modalProps: { visible, type, loading, onConfirm, additionalData }, onClose }) => {
    return <ModalOrder isVisible={visible} onClose={onClose} type={type} loading={loading} onConfirm={onConfirm} additionalData={additionalData} />;
};

const MODAL_KEY = {
    CONFIRM: 'confirm',
    AFTER_CONFIRM: 'afterConfirm'
};

const GroupInforCard = dynamic(() => import('./GroupInforCard'), { ssr: false });
const ModalQr = dynamic(() => import('./components/ModalQr'), { ssr: false });
const ModalOrder = dynamic(() => import('./components/ModalOrder'));
const ModalUploadImage = dynamic(() => import('./components/ModalUploadImage', { ssr: false }));

const DetailOrder = ({ id }) => {
    const { t } = useTranslation();
    // const user = useSelector((state) => state.auth.user) || null;
    const userSocket = useSelector((state) => state.socket.userSocket);

    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;
    const [orderDetail, setOrderDetail] = useState(null);
    const [status, setStatus] = useState({});
    const [onShowQr, setOnShowQr] = useState(false);
    const side = orderDetail?.side;
    const [modalProps, setModalProps] = useState({
        [MODAL_KEY.CONFIRM]: { type: null, visible: false, loading: false, onConfirm: null, additionalData: null },
        [MODAL_KEY.AFTER_CONFIRM]: { type: null, visible: false, loading: false, onConfirm: null, additionalData: null }
    });

    const setModalPropsWithKey = (key, props) =>
        setModalProps((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                ...props
            }
        }));

    const assetCode = ALLOWED_ASSET[+orderDetail?.baseAsset];

    useEffect(() => {
        if (userSocket) {
            userSocket.on(UserSocketEvent.PARTNER_UPDATE_ORDER, (data) => {
                setOrderDetail(data);
                setStatus({ status: data?.status, userStatus: data?.userStatus, partnerStatus: data?.partnerStatus });
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
                            displayingId: id + ''
                        }
                    });

                    if (data && status === ApiStatus.SUCCESS) {
                        setOrderDetail(data);
                        setStatus({ status: data?.status, userStatus: data?.userStatus, partnerStatus: data?.partnerStatus });
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

    const onMarkOrderHandler = (userStatus) => async () => {
        const isRejected = userStatus === PartnerPersonStatus.DISPUTED;
        try {
            setModalPropsWithKey(MODAL_KEY.CONFIRM, {
                loading: true
            });
            const data = isRejected ? await rejectOrder({ displayingId: id }) : await markOrder({ displayingId: id, userStatus });
            if (data && data.status === ApiStatus.SUCCESS) {
                // close confirm modal
                setModalPropsWithKey(MODAL_KEY.CONFIRM, {
                    loading: false,
                    visible: false
                });

                // open after confirm modal
                setModalPropsWithKey(MODAL_KEY.AFTER_CONFIRM, {
                    visible: true,
                    type: isRejected ? ORDER_TYPES.CANCEL_SUCCESS : ORDER_TYPES.BUY_SUCCESS,
                    additionalData: isRejected
                        ? id
                        : {
                              displayingId: id,
                              amount: formatBalance(orderDetail?.baseQty, 0),
                              token: assetCode
                          }
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

    const onMarkWithStatus = (userStatus) => {
        let type, additionalData;
        switch (userStatus) {
            case PartnerPersonStatus.TRANSFERRED:
                type = ORDER_TYPES.CONFIRM_TRANSFERRED;
                break;
            case PartnerPersonStatus.DISPUTED:
                type = ORDER_TYPES.CANCEL_ORDER;
                additionalData = { token: assetCode, side: t(`payment-method:${side.toLowerCase()}`) };
                break;
            default:
                break;
        }
        setModalPropsWithKey(MODAL_KEY.CONFIRM, {
            visible: true,
            type,
            additionalData,
            onConfirm: onMarkOrderHandler(userStatus)
        });
    };

    const renderButton = useCallback(
        () =>
            status?.status === PartnerOrderStatus.PENDING && status?.userStatus === PartnerPersonStatus.PENDING ? (
                <>
                    <ButtonV2 onClick={() => onMarkWithStatus(PartnerPersonStatus.TRANSFERRED)} className="!whitespace-nowrap px-[62.5px]">
                        {t('wallet:transfer_already')}{' '}
                    </ButtonV2>
                    <ButtonV2 onClick={() => onMarkWithStatus(PartnerPersonStatus.DISPUTED)} className="px-6" variants="secondary">
                        Huỷ giao dịch
                    </ButtonV2>
                </>
            ) : (
                status?.userStatus === PartnerPersonStatus.TRANSFERRED && <ButtonV2 className="!whitespace-nowrap min-w-[268px]">Tải ảnh lên</ButtonV2>
            ),
        [status]
    );

    return (
        <div className="w-full h-full flex justify-center pt-20 pb-[120px] px-4">
            <div className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto text-base text-gray-15 dark:text-gray-4 tracking-normal w-full">
                <GroupInforCard t={t} orderDetail={orderDetail} side={side} setOnShowQr={setOnShowQr} status={status} />
                {/* Lưu ý */}
                {side === 'BUY' && (
                    <div className="w-full rounded-md border border-divider dark:border-divider-dark py-4 px-6 mt-8">
                        <div className="flex items-center gap-x-2 text-gray-1 dark:text-darkBlue-5">
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
                    <div className={`flex gap-x-4 ${side !== 'BUY' && 'hidden'}`}>{renderButton()}</div>

                    <div className="flex justify-end w-full">
                        <ButtonV2 onClick={onOpenChat} variants="text" className="!text-sm w-auto">
                            <FutureSupportIcon className="mr-2" isDark={isDark} />
                            {t('common:chat_with_support')}
                        </ButtonV2>
                    </div>
                </div>
            </div>
            {orderDetail && (
                <ModalQr
                    isVisible={onShowQr}
                    onClose={() => setOnShowQr(false)}
                    qrCodeUrl={'awegawge'}
                    bank={orderDetail?.transferMetadata}
                    amount={orderDetail?.baseQty}
                />
            )}
            {/*Modal confirm the order */}
            <ModalConfirm modalProps={modalProps[MODAL_KEY.CONFIRM]} onClose={() => setModalPropsWithKey(MODAL_KEY.CONFIRM, { visible: false })} />

            {/*Modal After confirm (success, error,...) */}
            <ModalConfirm modalProps={modalProps[MODAL_KEY.AFTER_CONFIRM]} onClose={() => setModalPropsWithKey(MODAL_KEY.AFTER_CONFIRM, { visible: false })} />
            {/* {orderDetail && ( */}
            <ModalQr
                isVisible={onShowQr}
                onClose={() => setOnShowQr(false)}
                qrCodeUrl={'awegawge'}
                bank={orderDetail?.transferMetadata}
                amount={orderDetail?.baseQty}
            />
            {/* )} */}
            <ModalUploadImage isVisible={false} />
        </div>
    );
};

export default DetailOrder;
