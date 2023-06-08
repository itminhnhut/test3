import React, { memo, useEffect, useRef, useState } from 'react';
import { CountdownClock } from '../components/common/CircleCountdown';
import TextCopyable from 'components/screens/Account/TextCopyable';
import { formatTime, formatBalanceFiat } from 'redux/actions/utils';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import TabV2 from 'components/common/V2/TabV2';
import { MODAL_TYPE, SIDE } from 'redux/reducers/withdrawDeposit';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { PATHS } from 'constants/paths';
import FetchApi from 'utils/fetch-api';
import { API_GET_HISTORY_DW_PARTNERS } from 'redux/actions/apis';
import { ApiStatus, PartnerAcceptStatus, PartnerOrderStatus, UserSocketEvent } from 'redux/actions/const';
import { DisputedType, MODE } from '../constants';
import useMarkOrder from '../hooks/useMarkOrder';
import { ModalConfirm } from '../DetailOrder';
import { useSelector } from 'react-redux';
import { useBoolean } from 'react-use';
import axios from 'axios';
import TagV2, { TYPES } from 'components/common/V2/TagV2';
import OrderStatusTag from 'components/common/OrderStatusTag';
import Card from '../components/common/Card';
import { find } from 'lodash';
import { ChevronLeft, ChevronRight } from 'react-feather';
import NoData from 'components/common/V2/TableV2/NoData';
import Skeletor from 'components/common/Skeletor';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import TextButton from 'components/common/V2/ButtonV2/TextButton';
import classNames from 'classnames';

const LIMIT_ROW = 5;

const OrderCard = memo(({ loadingProcessOrder, orderDetail, assetConfig, t, router, onProcessOrder }) => {
    const asset = find(assetConfig, { id: orderDetail?.baseAssetId });
    const assetCode = asset?.assetCode;

    return (
        <Card className={classNames('border-0 bg-white dark:bg-dark-4', {})}>
            <div className="flex items-center flex-wrap lg:flex-nowrap">
                <div className="flex-grow border-b pb-5 lg:border-r border-divider dark:border-divider-dark lg:pb-0 lg:pr-10 lg:border-b-0 ">
                    <div className="flex items-center mb-8">
                        <div className="txtPri-3 pr-6">
                            {t(`dw_partner:${orderDetail?.side?.toLowerCase()}_asset_from_partners.partner`, {
                                asset: assetCode
                            })}
                        </div>{' '}
                        <div className="flex -m-1 flex-wrap items-center">
                            <div className="p-1">
                                {orderDetail?.partnerAcceptStatus === PartnerAcceptStatus.PENDING && orderDetail?.status === PartnerOrderStatus.PENDING ? (
                                    <TagV2 type={TYPES.DEFAULT} className="!bg-divider dark:!bg-divider-dark">
                                        {t('dw_partner:wait_confirmation')}
                                    </TagV2>
                                ) : (
                                    <OrderStatusTag className="!ml-0" status={orderDetail?.status} />
                                )}
                            </div>

                            {orderDetail?.status === PartnerOrderStatus.PENDING && orderDetail?.timeExpire && (
                                <div className="p-1 w-[100px]">
                                    <CountdownClock countdownTime={orderDetail?.countdownTime} onComplete={() => {}} timeExpire={orderDetail?.timeExpire} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap -m-2 justify-between ">
                        <div className="flex gap-6 p-2 w-1/2 lg:w-1/4">
                            <div className="space-y-2">
                                <TextCopyable className="gap-x-1 txtPri-1" text={orderDetail?.displayingId} />
                                <div className="txtSecond-3">{formatTime(orderDetail?.createdAt, 'HH:mm:ss dd/MM/yyyy')}</div>
                            </div>
                        </div>

                        <div className="p-2 flex justify-end lg:justify-start w-1/2 lg:w-1/4">
                            <div className="space-y-2 text-right lg:text-left">
                                <div className="capitalize txtPri-1">{orderDetail?.userMetadata?.name?.toLowerCase()}</div>
                                <div className="txtSecond-3">{orderDetail?.userMetadata?.code}</div>
                            </div>
                        </div>

                        <div className="p-2 w-1/2 lg:w-1/4">
                            <div className="space-y-2">
                                <div className="txtPri-1">
                                    {orderDetail?.transferMetadata?.bankName}
                                    {/* {t('dw_partner:rate')} */}
                                    </div>
                                <div className="txtSecond-3">
                                    1 {assetCode} ≈ {formatBalanceFiat(orderDetail?.price, 'VNDC')} VND
                                </div>
                            </div>
                        </div>

                        <div className="p-2 space-y-2 w-1/2 lg:w-1/4 flex justify-end lg:justify-start">
                            <div className="text-right w-full">
                                <div className="txtPri-3 font-semibold">
                                    {`${orderDetail?.side === SIDE.SELL ? '+' : '-'}${formatBalanceFiat(orderDetail?.baseQty, assetCode)}`} {assetCode}
                                </div>
                                <div className="txtSecond-3 ">{formatBalanceFiat(orderDetail?.quoteQty, 'VNDC')} VND</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:ml-10 flex flex-col items-center lg:max-w-[164px] w-full gap-3">
                    {orderDetail?.partnerAcceptStatus === PartnerAcceptStatus.ACCEPTED ? (
                        <ButtonV2
                            onClick={() => router.push(`${PATHS.PARNER_WITHDRAW_DEPOSIT.DETAILS}/${orderDetail?.displayingId}`)}
                            variants="text"
                            className="!py-0 items-center"
                        >
                            <span className="font-semibold">{t('dw_partner:transaction_detail')}</span>
                            <ChevronRight color="currentColor" size={16} />
                        </ButtonV2>
                    ) : (
                        <>
                            <ButtonV2
                                loading={loadingProcessOrder}
                                className="!h-9 px-4 py-3"
                                onClick={() => onProcessOrder(PartnerAcceptStatus.ACCEPTED, null, orderDetail)}
                            >
                                {t('common:accept')}
                            </ButtonV2>
                            <ButtonV2
                                className="px-4 py-3 !h-9 disabled:!cursor-auto"
                                variants="secondary"
                                disabled={loadingProcessOrder}
                                onClick={() => onProcessOrder(PartnerAcceptStatus.DENIED, DisputedType.REJECTED, orderDetail)}
                            >
                                {t('common:reject')}
                            </ButtonV2>
                        </>
                    )}
                </div>
            </div>
        </Card>
    );
});

const OpenOrderTable = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const userSocket = useSelector((state) => state.socket.userSocket);
    const assetConfig = useSelector((state) => state.utils.assetConfig);
    const { modal: modalProps } = useSelector((state) => state.withdrawDeposit);

    const router = useRouter();
    const [state, set] = useState({
        data: [],
        params: {
            side: SIDE.BUY,
            page: 0,
            mode: 'partner',
            pageSize: LIMIT_ROW,
            status: PartnerOrderStatus.PENDING,
            sortBy: null,
            sortType: null
        },
        loading: false,
        hasNext: false
    });
    const [refetch, toggleRefetch] = useBoolean();

    const setState = (_state) => set((prev) => ({ ...prev, ..._state }));
    const dataRef = useRef([]);
    const currentSideRef = useRef(null);
    dataRef.current = [...state.data];
    currentSideRef.current = state.params.side;

    const { onProcessOrder, setModalState } = useMarkOrder({
        mode: MODE.PARTNER,
        toggleRefetch: () => {}
    });

    useEffect(() => {
        if (userSocket) {
            userSocket.on(UserSocketEvent.PARTNER_UPDATE_ORDER, (newOrder) => {
                const existedOrder = dataRef.current.find((order) => order.displayingId === newOrder.displayingId);
                // if newOrder is not in the current data sets -> refetch table
                if (!existedOrder && newOrder?.side === currentSideRef.current) {
                    toggleRefetch();
                    return;
                }

                // else replace the the existed obj with the newOrder obj
                const newOrderList = [...dataRef.current]
                    .map((order) => (order.displayingId === newOrder.displayingId ? newOrder : order))
                    .filter((order) => order.status === PartnerOrderStatus.PENDING);
                setState({ data: newOrderList });
                dataRef.current = newOrderList;
                return;
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
        const source = axios.CancelToken.source();
        let mounted = false;
        const fetchOpeningOrders = async () => {
            try {
                setState({ loading: true });
                const { data, status } = await FetchApi({
                    url: API_GET_HISTORY_DW_PARTNERS,
                    params: {
                        ...state.params
                    },
                    cancelToken: source.token
                });

                let hasNext = false,
                    orders = [];
                if (status === ApiStatus.SUCCESS) {
                    orders = data.orders;
                    hasNext = data.hasNext;
                }
                setState({
                    data: orders,
                    hasNext
                });
            } catch (error) {
            } finally {
                if (mounted) {
                    setState({ loading: true, hasNext: false });
                } else setState({ loading: false });
            }
        };
        fetchOpeningOrders();
        return () => {
            mounted = true;
            source.cancel();
        };
    }, [state.params, refetch]);

    return (
        <>
            {/* CONFIRM */}
            <ModalConfirm
                mode={MODE.PARTNER}
                modalProps={modalProps[MODAL_TYPE.CONFIRM]}
                onClose={() => setModalState(MODAL_TYPE.CONFIRM, { visible: false })}
            />
            {/* CONFIRM */}

            {/* AFTER_CONFIRM */}
            <ModalConfirm
                mode={MODE.PARTNER}
                modalProps={modalProps[MODAL_TYPE.AFTER_CONFIRM]}
                onClose={() =>
                    setModalState(MODAL_TYPE.AFTER_CONFIRM, {
                        visible: false
                    })
                }
            />
            {/* AFTER_CONFIRM */}

            <div>
                <div className="mb-6">
                    <TabV2
                        activeTabKey={state.params.side}
                        onChangeTab={(key) => {
                            setState({
                                params: {
                                    ...state.params,
                                    page: 0,
                                    side: key
                                }
                            });
                        }}
                        tabs={[
                            {
                                key: SIDE.BUY,
                                children: <div className="capitalize">{t('common:buy')}</div>
                            },
                            {
                                key: SIDE.SELL,
                                children: <div className="capitalize">{t('common:sell')}</div>
                            }
                        ]}
                    />
                </div>
                <div className="space-y-6 ">
                    {state.loading ? (
                        [...Array(LIMIT_ROW).keys()].map((row) => (
                            <Skeletor key={row} containerClassName="!block" className="!rounded-xl" width="100%" height={170} />
                        ))
                    ) : state.data.length ? (
                        state.data.map((order, i) => (
                            <OrderCard
                                loadingProcessOrder={modalProps[MODAL_TYPE.CONFIRM].loading}
                                onProcessOrder={onProcessOrder}
                                router={router}
                                assetConfig={assetConfig}
                                key={i}
                                orderDetail={order}
                                t={t}
                            />
                        ))
                    ) : (
                        <div className="mt-[60px]">
                            <NoData text={t('dw_partner:no_pending_transactions')} />
                        </div>
                    )}
                </div>
                {state.loading || state.data.length < LIMIT_ROW ? null : (
                    <div className="w-full flex items-center justify-center select-none gap-8 mt-8">
                        <TextButton
                            disabled={state.params.page <= 0}
                            className={`!text-base w-auto gap-2`}
                            onClick={() =>
                                setState({
                                    params: {
                                        ...state.params,
                                        page: state.params.page - 1
                                    }
                                })
                            }
                        >
                            <ChevronLeft size={16} />
                            {language === LANGUAGE_TAG.VI ? 'Trước đó' : 'Previous'}
                        </TextButton>
                        <TextButton
                            disabled={!state.hasNext}
                            className={`!text-base w-auto gap-2`}
                            onClick={() =>
                                setState({
                                    params: {
                                        ...state.params,
                                        page: state.params.page + 1
                                    }
                                })
                            }
                        >
                            {language === LANGUAGE_TAG.VI ? 'Kế tiếp' : 'Next'}
                            <ChevronRight size={16} />
                        </TextButton>
                    </div>
                )}
            </div>
        </>
    );
};

export default OpenOrderTable;
