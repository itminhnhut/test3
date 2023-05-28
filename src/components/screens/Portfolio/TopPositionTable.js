import { useState, useEffect, useCallback, useMemo } from 'react';
import GroupTextFilter, { listTimeFilter } from 'components/common/GroupTextFilter';
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
    formatCurrency,
    formatNanNumber
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
import HeaderTooltip from './HeaderTooltip';
import { API_FUTURES_STATISTIC_TOP_POSITIONS } from 'redux/actions/apis';
import FetchApi from 'utils/fetch-api';
import PriceChangePercent from 'components/common/PriceChangePercent';
import { ALLOWED_ASSET_ID } from '../WithdrawDeposit/constants';
import FuturesLeverage from 'components/common/FuturesLeverage';

const LIST_TABS = [
    { id: 1, localized: 'common:position:max_profit' },
    { id: 2, localized: 'common:position:min_profit' }
];

const LIMIT_ROW = 5;

const TopPositionTable = ({ typeProduct, typeCurrency, filter }) => {
    const { t } = useTranslation();
    // Data chart Pnl changing
    const [dataTopPosition, setDataTopPosition] = useState();
    const [loadingTopPosition, setLoadingTopPosition] = useState(false);
    const [curTab, setCurTab] = useState(LIST_TABS[0].id);
    const [dataTable, setDataTable] = useState([]);

    useEffect(() => {
        setDataTable(curTab === LIST_TABS[0].id ? dataTopPosition?.top5Profit || [] : dataTopPosition?.top5Loss || []);
    }, [curTab, dataTopPosition]);

    const fetchTopPosition = async () => {
        try {
            setLoadingTopPosition(true);
            const { data } = await FetchApi({
                url: API_FUTURES_STATISTIC_TOP_POSITIONS,
                params: {
                    currency: typeCurrency,
                    product: typeProduct,
                    from: filter?.range?.startDate,
                    to: filter?.range?.endDate
                }
            });
            setDataTopPosition(data);
        } catch (error) {
        } finally {
            setLoadingTopPosition(false);
        }
    };

    useEffect(() => {
        fetchTopPosition();
    }, [typeProduct, typeCurrency, filter]);

    const isVndc = typeCurrency === ALLOWED_ASSET_ID.VNDC;

    const columns = useMemo(
        () => [
            {
                key: 'opened_at',
                dataIndex: 'opened_at',
                title: t('futures:order_table:open_at'),
                align: 'left',
                width: 210,
                render: (v) => <span className="whitespace-nowrap">{formatTime(v, 'HH:mm:ss dd/MM/yyyy')}</span>
            },
            {
                key: 'symbol',
                dataIndex: 'symbol',
                title: t('common:pair'),
                align: 'left',
                width: 160,
                render: (v, item) => (
                    <div className="whitespace-nowrap font-semibold flex items-center">
                        <span className="txtPri-1">{v?.slice(0, -4)}</span>
                        <span className="txtSecond-2 !font-semibold mr-2">{`/${v?.slice(-4)} `}</span>
                        <FuturesLeverage value={item?.leverage} />
                    </div>
                )
            },
            {
                key: 'side',
                dataIndex: 'side',
                title: t('common:type'),
                align: 'left',
                width: 170,
                render: (v, item) => (
                    <span className={v?.toUpperCase() === 'BUY' ? 'text-green-3 dark:text-green-2' : 'text-red-2'}>
                        {t(`common:${v?.toLowerCase()}`)} / {t(`common:${item?.type?.toLowerCase()}`)}
                    </span>
                )
            },
            {
                key: 'profit',
                dataIndex: 'profit',
                title: 'PNL (ROE%)',
                align: 'left',
                width: 230,
                render: (v, item) => {
                    if (item.reason_close_code === 5) return '_';
                    const sign = v > 0 ? '+' : '';
                    return (
                        <div className="flex items-center gap-x-1">
                            <span className={v > 0 ? 'text-green-3 dark:text-green-2' : 'text-red-2'}>{sign + formatNanNumber(v, isVndc ? 0 : 4)}</span>
                            <PriceChangePercent priceChangePercent={v / item?.margin} className="!justify-start text-base" />
                        </div>
                    );
                    // return (
                    //     <OrderProfit
                    //         className="w-full"
                    //         key={item.displaying_id}
                    //         order={item}
                    //         initPairPrice={item.close_price}
                    //         setShareOrderModal={() => setShareOrder(item)}
                    //         decimal={isVndc ? item?.decimalSymbol : item?.decimalSymbol + 2}
                    //         isTabHistory
                    //     />
                    // );
                }
            },
            {
                key: 'margin',
                dataIndex: 'margin',
                title: t('futures:margin'),
                align: 'right',
                width: 163,
                render: (v, item) => formatNumber(v, item?.decimalScalePrice, 0, true)
            },
            {
                key: 'volume',
                dataIndex: 'volume',
                title: t('futures:order_table:volume'),
                align: 'right',
                width: 163,
                render: (_row, item) => formatNumber(item?.order_value, item?.decimalScalePrice, 0, true)
            },
            {
                key: 'displaying_id',
                dataIndex: 'displaying_id',
                title: t('futures:mobile:transaction_histories:id'),
                align: 'right',
                width: 136,
                fixed: 'right',
                render: (v) => `ID #${v}`
            }
        ],
        [dataTable]
    );

    return (
        <div className="mt-12 border border-divider dark:border-divider-dark rounded-xl">
            <HeaderTooltip
                className="px-6 py-8"
                title={`Top ${LIMIT_ROW} vị thế`}
                tooltipContent={'This is tooltip content'}
                tooltipId="top_position_tooltip"
            />
            <div className="relative flex tracking-normal">
                <Tabs isMobile tab={curTab} className="gap-6 border-b border-divider dark:border-divider-dark px-6">
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
                sort={['profit', 'margin', 'volume']}
                loading={loadingTopPosition}
                useRowHover
                data={dataTable || []}
                columns={columns}
                rowKey={(item) => `${item?.key}`}
                scroll={{ x: true }}
                limit={LIMIT_ROW}
                skip={0}
                pagingClassName="border-none"
                height={350}
                tableStyle={{ fontSize: '16px', padding: '16px' }}
                className="pb-1 rounded-b-xl border-t border-divider dark:border-divider-dark"
                // className="bg-white dark:bg-transparent pt-8 border border-divider dark:border-divider-dark rounded-xl"
            />
        </div>
    );
};

export default TopPositionTable;
