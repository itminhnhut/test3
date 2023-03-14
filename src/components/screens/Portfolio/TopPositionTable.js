import { useState, useEffect, useCallback, useMemo } from 'react';
import GroupFilterTime, { listTimeFilter } from 'components/common/GroupFilterTime';
import React from 'react';
import {
    formatPrice,
    formatNumber,
    formatTime,
    formatPercentage,
    formatSwapRate,
    formatWallet,
    getDecimalScale,
    getLoginUrl,
    countDecimals,
    walletLinkBuilder,
    safeToFixed,
    formatCurrency
} from 'redux/actions/utils';

import colors from 'styles/colors';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useTranslation } from 'next-i18next';
import Note from 'components/common/Note';
import { indexOf } from 'lodash';
const { subDays } = require('date-fns');
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';
import { PATHS } from 'constants/paths';
import SvgWalletFutures from 'components/svg/SvgWalletFutures';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import TableV2 from 'components/common/V2/TableV2';
import HideSmallBalance from 'components/common/HideSmallBalance';
import SearchBoxV2 from 'components/common/SearchBoxV2';
import EstBalance from 'components/common/EstBalance';
import NoData from 'components/common/V2/TableV2/NoData';
import OrderProfit from 'components/screens/Futures/TradeRecord/OrderProfit';

const LIST_TABS = [
    { id: 1, localized: 'common:position:max_profit' },
    { id: 2, localized: 'common:position:min_profit' }
];

const LIMIT_ROW = 5;

const TopPositionTable = () => {
    const [loading, setLoading] = useState(false);
    const [curFilter, setCurFilter] = useState(listTimeFilter[0].value);
    const [curTab, setCurTab] = useState(LIST_TABS[0].id);
    const [tableData, setTableData] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        const mockData = [];

        for (let i = 1; i <= 5; i++) {
            mockData.push({
                displaying_id: i * 5,
                id: i,
                _b: false,
                created_at: '2022-11-22T09:30:45.005Z',
                fee: 458874.42840854183,
                fee_currency: 72,
                fee_data: {
                    place_order: {
                        72: 243000
                    },
                    close_order: {
                        72: 215874.4284085418
                    }
                },
                fee_metadata: {
                    place_order: {
                        value: 112500,
                        currency: 72
                    },
                    close_order: {
                        value: 215874.4284085418,
                        currency: 72
                    }
                },
                hold_quantity: 0,
                leverage: 100,
                liquidity_broker: 'NAMI',
                margin: 4800000,
                margin_currency: 72,
                metadata: {
                    dca_order_metadata: {
                        dca_order: [
                            {
                                displaying_id: 26,
                                status: 2
                            },
                            {
                                displaying_id: 27,
                                status: 2
                            },
                            {
                                displaying_id: 28,
                                status: 2
                            }
                        ],
                        is_main_order: true
                    },
                    partial_close_metadata: {
                        partial_close_orders: [
                            {
                                displaying_id: 31,
                                close_type: 'Market',
                                status: 2,
                                close_volume: 135000000
                            }
                        ],
                        is_main_order: true,
                        total_open_fee: 161251.78416886023
                    }
                },
                open_price: 524249986,
                opened_at: '2023-03-07T10:44:27.526Z',
                order_value: 405000000,
                order_value_currency: 72,
                origin_order_value: 250000000,
                price: 524403493,
                promotion_category: 1,
                quantity: 0.7725322086109989,
                request_id: {
                    place: 'Req_81JXS7',
                    close: 'Req_MHC78T'
                },
                side: 'Buy',
                sl: 520085328,
                status: 2,
                symbol: 'BTCVNDC',
                tp: 529526167,
                transfer_quantity: 0,
                type: 'Market',
                updated_at: '2023-03-10T09:14:40.005Z',
                user_category: 0,
                user_id: 1823,
                volume_data: {
                    place_order: {
                        72: 405000000
                    },
                    close_order: {
                        72: 405000000
                    }
                },
                _m: 0,
                close_limit_price: 0,
                close_mode: 0,
                close_order_value: 359790714.0142364,
                funding_fee: {
                    total: -10,
                    balance: -10,
                    margin: 0
                },
                open_limit_price: 0,
                open_mode: 0,
                open_order_value: 0,
                pending_swap: 0,
                profit: -4800000,
                promote_program: 0,
                raw_profit: -4341125.57159146,
                retry_modify_limit_count: 0,
                retry_transfer_count: 0,
                swap: 0,
                transfer_error: 0,
                close_price: 465729079,
                closed_at: '2023-03-10T09:14:38.720Z',
                reason_close: 'Normal',
                reason_close_code: 0,
                initial_margin: 5400000,
                decimalSymbol: 0,
                decimalScalePrice: 0,
                quoteAsset: 'VNDC',
                hashIdx: '0x00' + i
            });
        }

        setTableData(mockData);
    }, [curTab, curFilter]);

    const columns = useMemo(
        () => [
            {
                key: 'opened_at',
                dataIndex: 'opened_at',
                title: t('futures:order_table:open_at'),
                align: 'left',
                width: 192,
                render: (v) => <span className="whitespace-nowrap">{formatTime(v, 'HH:mm:ss dd/MM/yyyy')}</span>
            },
            {
                key: 'pair',
                dataIndex: 'symbol',
                title: t('common:pair'),
                align: 'left',
                width: 224,
                render: (v, item) => (
                    <div className="whitespace-nowrap font-semibold">
                        <span className="txtPri-1">{v.slice(0, -item.quoteAsset.length)}</span>
                        <span className="txtSecond-2 !font-semibold">{`/${item.quoteAsset} `}</span>
                        <span className="txtPri-1">{item?.leverage}x</span>
                    </div>
                )
            },
            {
                key: 'side',
                dataIndex: 'side',
                title: t('common:type'),
                align: 'left',
                width: 88,
                render: (v) => (
                    <span className={v.toUpperCase() === 'BUY' ? 'text-green-3 dark:text-green-2' : 'text-red-2'}>{t(`common:${v.toLowerCase()}`)}</span>
                )
            },
            {
                key: 'pnl',
                title: 'PNL (ROE%)',
                align: 'right',
                width: 169,
                render: (_row, item) => {
                    const isVndc = item?.symbol?.indexOf('VNDC') !== -1;
                    if (item.reason_close_code === 5) return '_';
                    return (
                        <OrderProfit
                            className="w-full"
                            key={item.displaying_id}
                            order={item}
                            initPairPrice={item.close_price}
                            setShareOrderModal={() => setShareOrder(item)}
                            decimal={isVndc ? item?.decimalSymbol : item?.decimalSymbol + 2}
                            isTabHistory
                        />
                    );
                }
            },
            {
                key: 'margin',
                dataIndex: 'order_value',
                title: t('futures:margin'),
                align: 'right',
                width: 138,
                render: (v, item) => formatNumber(v, item?.decimalScalePrice, 0, true)
            },
            {
                key: 'volume',
                dataIndex: 'order_value',
                title: t('futures:order_table:volume'),
                align: 'right',
                width: 138,
                render: (_row, item) => formatNumber(item?.order_value, item?.decimalScalePrice, 0, true)
            },
            {
                key: 'open_price',
                dataIndex: 'open_price',
                title: t('futures:order_table:open_price'),
                align: 'right',
                width: 138,
                render: (_row, item) => formatNumber(item?.open_price, item?.decimalScalePrice, 0, true)
            }
            // {
            //     key: 'close_price',
            //     dataIndex: 'close_price',
            //     title: t('futures:order_table:close_price'),
            //     align: 'right',
            //     width: 138,
            //     render: (_row, item) => formatNumber(item?.close_price, item?.decimalScalePrice, 0, true)
            // }
            // {
            //     key: 'hashIdx',
            //     dataIndex: 'hashIdx',
            //     title: t('futures:mobile:transaction_histories:id'),
            //     align: 'right',
            //     width: 128,
            //     render: (v) => v
            // }
        ],
        [tableData]
    );

    return (
        <div className="mt-12 border border-divider dark:border-transparent rounded-xl bg-transparent dark:bg-dark-4">
            <div className="flex items-center justify-between w-full p-8">
                <div className="text-2xl font-semibold">Top {LIMIT_ROW} vị thế</div>
                <GroupFilterTime curFilter={curFilter} setCurFilter={setCurFilter} GroupKey="Profit_changing" t={t} />
            </div>
            <div className="relative flex tracking-normal">
                <Tabs isMobile tab={curTab} className="gap-6 border-b border-divider dark:border-divider-dark px-8">
                    {LIST_TABS.map((e) => {
                        return (
                            <TabItem
                                key={'top_position_tabs_' + e?.id}
                                className={`text-left !px-0 !text-base !w-auto first:ml-4 md:first:ml-0`}
                                value={e.id}
                                onClick={() => setCurTab(e.id)}
                            >
                                {t(`${e.title ?? e.localized}`)}
                            </TabItem>
                        );
                    })}
                </Tabs>
            </div>
            <TableV2
                sort
                defaultSort={{ key: 'opened_at', direction: 'desc' }}
                loading={loading}
                useRowHover
                data={tableData || []}
                columns={columns}
                rowKey={(item) => `${item?.key}`}
                scroll={{ x: true }}
                limit={LIMIT_ROW}
                skip={0}
                // isSearch={!!state.search}
                pagingClassName="border-none"
                height={350}
                // pagingPrevNext={{ page: state.page, hasNext: state.histories?.length, onChangeNextPrev: onChangePagination, language }}
                tableStyle={{ fontSize: '16px', padding: '16px' }}
            />
        </div>
    );
};

export default TopPositionTable;
