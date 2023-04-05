import React, { useEffect, useState } from 'react';
import TableV2 from 'components/common/V2/TableV2';
import Countdown from 'react-countdown';
import CircleCountdown from '../components/common/CircleCountdown';
import TextCopyable from 'components/screens/Account/TextCopyable';
import { getAssetCode, formatTime, formatBalance } from 'redux/actions/utils';
import AssetLogo from 'components/wallet/AssetLogo';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import TagV2 from 'components/common/V2/TagV2';
import TabV2 from 'components/common/V2/TabV2';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { PATHS } from 'constants/paths';
import FetchApi from 'utils/fetch-api';
import { API_GET_HISTORY_DW_PARTNERS, API_GET_OPENING_ORDER } from 'redux/actions/apis';
import { ApiStatus, PartnerOrderStatus, PartnerPersonStatus, UserSocketEvent } from 'redux/actions/const';
import { MODAL_TYPE, MODE, TranferreredType } from '../constants';
import useMarkOrder from '../hooks/useMarkOrder';
import { ModalConfirm } from '../DetailOrder';
import { useSelector } from 'react-redux';
import { useBoolean } from 'react-use';

const getColumns = ({ t, onMarkWithStatus, toggleRefetch }) => [
    {
        key: 'timeExpire',
        dataIndex: 'timeExpire',
        title: t('common:status'),
        align: 'left',
        width: 107,
        render: (row) => <CircleCountdown onComplete={toggleRefetch} size={34} textSize={10} timeExpire={row} />
    },
    {
        key: 'displayingId',
        dataIndex: 'displayingId',
        title: t('common:transaction_id'),
        align: 'left',
        width: 124,
        render: (row) => <TextCopyable text={row} />
    },
    {
        key: 'baseAssetId',
        dataIndex: 'baseAssetId',
        title: t('common:asset'),
        align: 'left',
        width: 148,
        render: (row) => {
            const assetCode = getAssetCode(row);
            return (
                <div className="flex gap-2 items-center">
                    <AssetLogo assetCode={assetCode} size={32} useNextImg /> <div>{assetCode}</div>
                </div>
            );
        }
    },
    {
        key: 'createdAt',
        dataIndex: 'createdAt',
        title: t('common:time'),
        align: 'left',
        width: 196,
        render: (row) => {
            return formatTime(row, 'HH:mm:ss dd/MM/yyyy');
        }
    },
    {
        key: 'baseQty',
        dataIndex: 'baseQty',
        title: t('common:amount'),
        align: 'right',
        width: 152,
        render: (row) => {
            return formatBalance(row);
        }
    },
    {
        key: 'user',
        dataIndex: 'userMetadata',
        title: t('common:from'),
        align: 'left',
        width: 165,
        render: (row) => {
            return (
                <div>
                    <div className="">{row?.name}</div>
                    <div className="text-sm dark:text-txtSecondary-dark text-txtSecondary">{row?.code}</div>
                </div>
            );
        }
    },
    {
        key: 'partner',
        dataIndex: 'partnerMetadata',
        title: t('common:to'),
        align: 'left',
        width: 165,
        render: (row) => {
            return (
                <div>
                    <div className="">{row?.name}</div>
                    <div className="text-sm dark:text-txtSecondary-dark text-txtSecondary">{row?.code}</div>
                </div>
            );
        }
    },
    {
        key: 'action',
        dataIndex: '',
        title: '',
        align: 'left',
        width: 190,
        render: (order, item) => {
            const side = item.side;
            const btnText = side === SIDE.BUY ? t('dw_partner:take_money_already') : t('common:confirm');
            const btnDisabled =
                side === SIDE.BUY ? order?.userStatus !== PartnerPersonStatus.TRANSFERRED : order?.partnerStatus !== PartnerPersonStatus?.PENDING;
            return (
                <ButtonV2
                    disabled={btnDisabled}
                    onClick={(e) => {
                        e.stopPropagation();
                        return order.side === SIDE.BUY
                            ? onMarkWithStatus(PartnerPersonStatus.TRANSFERRED, TranferreredType['partner'].TAKE, order)
                            : onMarkWithStatus(PartnerPersonStatus.TRANSFERRED, TranferreredType['partner'].TRANSFERRED, order);
                    }}
                    variants="secondary"
                >
                    {btnText}
                </ButtonV2>
            );
        }
    }
];

const LIMIT_ROW = 10;

const OpenOrderTable = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const userSocket = useSelector((state) => state.socket.userSocket);

    const router = useRouter();
    const [state, set] = useState({
        data: [],
        params: {
            side: SIDE.BUY,
            page: 0,
            mode: 'partner',
            pageSize: LIMIT_ROW,
            status: PartnerOrderStatus.PENDING
        },
        loading: false,
        hasNext: false
    });
    const [refetch, toggleRefetch] = useBoolean();

    const [modalProps, setModalProps] = useState({
        [MODAL_TYPE.CONFIRM]: { type: null, visible: false, loading: false, onConfirm: null, additionalData: null },
        [MODAL_TYPE.AFTER_CONFIRM]: { type: null, visible: false, loading: false, onConfirm: null, additionalData: null }
    });

    const setState = (_state) => set((prev) => ({ ...prev, ..._state }));

    const setModalPropsWithKey = (key, props) =>
        setModalProps((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                ...props
            }
        }));

    const { onMarkWithStatus } = useMarkOrder({
        setModalPropsWithKey,
        mode: MODE.PARTNER,
        toggleRefetch: () => {}
    });

    useEffect(() => {
        if (userSocket) {
            userSocket.on(UserSocketEvent.PARTNER_UPDATE_ORDER, (data) => {
                toggleRefetch();
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
        const fetchOpeningOrders = async () => {
            try {
                setState({ loading: true });
                const { data, status } = await FetchApi({
                    url: API_GET_HISTORY_DW_PARTNERS,
                    params: {
                        ...state.params
                    }
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
                setState({ loading: false });
            }
        };
        fetchOpeningOrders();
    }, [state.params, refetch]);

    return (
        <>
            <ModalConfirm
                mode={MODE.PARTNER}
                modalProps={modalProps[MODAL_TYPE.CONFIRM]}
                onClose={() => setModalPropsWithKey(MODAL_TYPE.CONFIRM, { visible: false })}
            />{' '}
            <ModalConfirm
                mode={MODE.PARTNER}
                modalProps={modalProps[MODAL_TYPE.AFTER_CONFIRM]}
                onClose={() => setModalPropsWithKey(MODAL_TYPE.AFTER_CONFIRM, { visible: false })}
            />{' '}
            <div>
                <div className="mb-3">
                    <TabV2
                        activeTabKey={state.params.side}
                        onChangeTab={(key) => {
                            setState({
                                params: {
                                    ...state.params,
                                    side: key
                                }
                            });
                            // setFirstLoad(true);
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
                <TableV2
                    // sort={['baseQty']}
                    limit={LIMIT_ROW}
                    skip={0}
                    useRowHover
                    data={state.data}
                    columns={getColumns({ t, onMarkWithStatus, toggleRefetch: () => {} })}
                    rowKey={(item) => item?.key}
                    scroll={{ x: true }}
                    loading={state.loading}
                    onRowClick={(transaction) => router.push(PATHS.PARNER_WITHDRAW_DEPOSIT.DETAILS + '/' + transaction?.displayingId)}
                    height={404}
                    className="bg-white dark:bg-transparent border border-transparent dark:border-divider-dark rounded-lg pt-4"
                    tableStyle={{
                        fontSize: '16px',
                        padding: '16px',
                        headerFontStyle: { 'font-size': `14px !important` }
                    }}
                    pagingPrevNext={{
                        page: state.params.page,
                        hasNext: state.hasNext,
                        onChangeNextPrev: (e) =>
                            setState({
                                params: {
                                    ...state.params,
                                    page: state.params.page + e
                                }
                            }),
                        language
                    }}
                    emptyTextContent={t('common:no_data')}
                    // customSort={customSort}
                />
            </div>
        </>
    );
};

export default OpenOrderTable;
