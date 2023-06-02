import { useState, useEffect, useMemo } from 'react';
import React from 'react';
import {
    formatNumber,
    formatTime,
    formatNanNumber
} from 'redux/actions/utils';

import colors from 'styles/colors';
import { useTranslation } from 'next-i18next';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';
import TableV2 from 'components/common/V2/TableV2';
import NoData from 'components/common/V2/TableV2/NoData';
import HeaderTooltip from './HeaderTooltip';
import { API_FUTURES_STATISTIC_TOP_POSITIONS } from 'redux/actions/apis';
import FetchApi from 'utils/fetch-api';
import PriceChangePercent from 'components/common/PriceChangePercent';
import { ALLOWED_ASSET_ID } from '../WithdrawDeposit/constants';
import FuturesLeverage from 'components/common/FuturesLeverage';
import Skeletor from 'components/common/Skeletor';
import CollapseV2 from 'components/common/V2/CollapseV2';
import ModalV2 from 'components/common/V2/ModalV2';
import MCard from 'components/common/MCard';

const LIST_TABS = [
    { id: 1, localized: 'portfolio:highest' },
    { id: 2, localized: 'portfolio:lowest' }
];

const LIMIT_ROW = 5;

const TopPositionTable = ({ className = '', typeProduct, typeCurrency, filter, isMobile, isDark }) => {
    const { t } = useTranslation();
    // Data chart Pnl changing
    const [dataTopPosition, setDataTopPosition] = useState();
    const [loadingTopPosition, setLoadingTopPosition] = useState(false);
    const [curTab, setCurTab] = useState(LIST_TABS[0].id);
    const [dataTable, setDataTable] = useState([]);
    const [showDetails, setShowDetails] = useState(null);

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
        if (!filter?.range?.endDate) return;

        fetchTopPosition();
    }, [typeProduct, typeCurrency, filter]);

    const isVndc = typeCurrency === ALLOWED_ASSET_ID.VNDC;

    const columns = useMemo(
        () => [
            {
                key: 'closed_at',
                dataIndex: 'closed_at',
                title: t('common:time'),
                align: 'left',
                width: 210,
                render: (v) => <span className="whitespace-nowrap">{formatTime(v, 'HH:mm:ss dd/MM/yyyy')}</span>
            },
            {
                key: 'symbol',
                dataIndex: 'symbol',
                title: t('portfolio:trading_pair'),
                align: 'left',
                width: 200,
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
                title: t('portfolio:pnl'),
                align: 'left',
                width: 230,
                render: (v, item) => {
                    if (item.reason_close_code === 5) return '_';
                    const sign = v > 0 ? '+' : '';
                    return (
                        <div className="flex items-center gap-x-1">
                            <span className={v > 0 ? 'text-green-3 dark:text-green-2' : 'text-red-2'}>{sign + formatNanNumber(v, isVndc ? 0 : 4)}</span>
                            <PriceChangePercent priceChangePercent={v / item?.margin} className="!justify-start !text-base" />
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
                key: 'order_value',
                dataIndex: 'order_value',
                title: t('futures:order_table:volume'),
                align: 'right',
                width: 163,
                render: (v, item) => formatNumber(v, item?.decimalScalePrice, 0, true)
            },
            {
                key: 'displaying_id',
                dataIndex: 'displaying_id',
                title: t('portfolio:position_id'),
                align: 'right',
                width: 136,
                render: (v) => `ID #${v}`
            }
        ],
        [dataTable]
    );

    if (isMobile)
        return (
            <>
                <CollapseV2
                    className="w-full mt-12"
                    divLabelClassname="w-full justify-between"
                    chrevronStyled={{ size: 24, style: { marginRight: 16 }, color: isDark ? colors.gray['4'] : colors.gray['15'] }}
                    label={
                        <HeaderTooltip
                            isMobile
                            className="ml-4"
                            title={`Top ${LIMIT_ROW} vị thế`}
                            tooltipContent={'This is tooltip content'}
                            tooltipId="top_position_tooltip"
                        />
                    }
                    labelClassname="text-base font-semibold"
                >
                    <div className={`${className}`}>
                        <div className="relative flex tracking-normal">
                            <Tabs isMobile tab={curTab} className="mt-6 md:mt-0 md:px-6 gap-x-6 border-b border-divider dark:border-divider-dark">
                                {LIST_TABS.map((e) => {
                                    return (
                                        <TabItem
                                            isActive={e?.id === curTab}
                                            key={'top_position_tabs_' + e?.id}
                                            className="text-center w-1/2 px-0 first:ml-4 last:mr-4 !text-sm"
                                            value={e.id}
                                            onClick={() => setCurTab(e.id)}
                                        >
                                            {t(`${e.title ?? e.localized}`)}
                                        </TabItem>
                                    );
                                })}
                            </Tabs>
                        </div>
                        <div className="mt-6 mb-20 text-gray-1 dark:text-gray-7">
                            {loadingTopPosition ? (
                                Array(LIMIT_ROW)
                                    .fill()
                                    .map((_, i) => (
                                        <div
                                            className="px-4 last:border-none border-b border-divider dark:border-divider-dark py-4"
                                            key={'sekeletor_table_' + i}
                                        >
                                            <div className="flex justify-between items-center text-sm font-semibold">
                                                <Skeletor width={100} height={17} />
                                                <Skeletor width={140} height={17} />
                                            </div>
                                            <div className="flex justify-between items-center text-xs mt-2">
                                                <Skeletor width={110} height={12} />
                                                <Skeletor width={50} height={12} />
                                            </div>
                                        </div>
                                    ))
                            ) : dataTable.length > 0 ? (
                                dataTable.map((item) => {
                                    const { displaying_id, closed_at, symbol, leverage, profit, margin, side, type } = item;
                                    const sign = profit > 0 ? '+' : '';
                                    return (
                                        <div
                                            onClick={() => setShowDetails(item)}
                                            className="px-4 last:border-none cursor-pointer border-b border-divider dark:border-divider-dark py-4 hover:bg-gray-13 dark:hover:bg-hover-dark"
                                            key={'mobile_row_' + curTab + displaying_id}
                                        >
                                            <div className="flex justify-between items-center text-sm font-semibold">
                                                <div className="whitespace-nowrap flex items-center">
                                                    <span className="xt-gray-15 dark:text-gray-4">{symbol?.slice(0, -4)}</span>
                                                    <span className="mr-2">{`/${symbol?.slice(-4)}`}</span>
                                                    <FuturesLeverage className="text-[10px] leading-[12px]" value={leverage} />
                                                </div>
                                                <div className="flex items-center">
                                                    <span className={sign ? 'text-green-3 dark:text-green-2' : 'text-red-2'}>
                                                        {sign + formatNanNumber(profit, isVndc ? 0 : 4)}
                                                    </span>
                                                    <PriceChangePercent priceChangePercent={profit / margin} className="!justify-start !text-sm" />
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center text-xs mt-2">
                                                <span className="whitespace-nowrap">{formatTime(closed_at, 'HH:mm:ss dd/MM/yyyy')}</span>
                                                <span className={side?.toUpperCase() === 'BUY' ? 'text-green-3 dark:text-green-2' : 'text-red-2'}>
                                                    {t(`common:${side?.toLowerCase()}`)} / {t(`common:${type?.toLowerCase()}`)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <NoData className="mt-12" text={t('portfolio:no_position_recorded')} />
                            )}
                        </div>
                    </div>
                </CollapseV2>
                <ModalV2 isVisible={!!showDetails} onBackdropCb={() => setShowDetails(null)} wrapClassName="px-6" className="dark:bg-dark" isMobile={true}>
                    <h1 className="text-xl font-semibold text-gray-15 dark:text-gray-4">{t('portfolio:position_details')}</h1>
                    {showDetails && <ModalDetailsPosition value={showDetails} isVndc={isVndc} t={t} />}
                </ModalV2>
                {/* <ModalDetailsPosition isVisible={!!showDetails} onBackdropCb={() => setShowDetails(null)}  /> */}
            </>
        );

    return (
        <div className={`mt-12  ${isMobile ? '' : 'border border-divider dark:border-divider-dark rounded-xl'}  ${className}`}>
            <HeaderTooltip
                isMobile
                className={isMobile ? 'px-4' : 'px-6 py-8'}
                title={t('portfolio:top_position', { maxPosition: LIMIT_ROW })}
                tooltipContent={t('portfolio:top_position_tooltip')}
                tooltipId="top_position_tooltip"
            />
            <div className="relative flex tracking-normal">
                <Tabs isMobile tab={curTab} className="mt-6 md:mt-0 md:px-6 gap-x-6 border-b border-divider dark:border-divider-dark">
                    {LIST_TABS.map((e) => {
                        return (
                            <TabItem
                                isActive={e?.id === curTab}
                                key={'top_position_tabs_' + e?.id}
                                className={'text-left !px-0 !text-base !w-auto'}
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
                sort={['profit', 'margin', 'order_value']}
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
                tableStyle={{ fontSize: '16px', padding: '16px', rcTableContent: { 'padding-bottom': '46px' } }}
                textEmptyCustom={t('portfolio:no_position_recorded')}
                className="pb-1 rounded-b-xl border-t border-divider dark:border-divider-dark"
                // className="bg-white dark:bg-transparent pt-8 border border-divider dark:border-divider-dark rounded-xl"
            />
        </div>
    );
};

const ModalDetailsPosition = ({ value, isVndc, t }) => {
    if (!value) return;

    const { displaying_id, closed_at, symbol, leverage, profit, margin, side, type, decimalScalePrice, order_value } = value;
    const sign = profit > 0 ? '+' : '';

    return (
        <div>
            <div className="flex justify-between items-center text-sm font-semibold mt-6">
                <div className="whitespace-nowrap flex items-center">
                    <span className="xt-gray-15 dark:text-gray-4">{symbol?.slice(0, -4)}</span>
                    <span className="mr-2">{`/${symbol?.slice(-4)}`}</span>
                    <FuturesLeverage className="text-[10px] leading-[12px]" value={leverage} />
                </div>
                <div className="flex items-center">
                    <span className={sign ? 'text-green-3 dark:text-green-2' : 'text-red-2'}>{sign + formatNanNumber(profit, isVndc ? 0 : 4)}</span>
                    <PriceChangePercent priceChangePercent={profit / margin} className="!justify-start !text-sm" />
                </div>
            </div>
            <div className="flex justify-between items-center text-xs mt-2">
                <span className="whitespace-nowrap">{formatTime(closed_at, 'HH:mm:ss dd/MM/yyyy')}</span>
                <span className={side?.toUpperCase() === 'BUY' ? 'text-green-3 dark:text-green-2' : 'text-red-2'}>
                    {t(`common:${side?.toLowerCase()}`)} / {t(`common:${type?.toLowerCase()}`)}
                </span>
            </div>
            <MCard addClass={'mt-6 !p-4 !text-sm !font-semibold'}>
                <div className="flex justify-between items-center">
                    <div className="txtSecond-3">{t('futures:margin')}</div>
                    <div>{formatNumber(margin, decimalScalePrice, 0, true)}</div>
                </div>
                <div className="flex justify-between items-center mt-2.5">
                    <div className="txtSecond-3">{t('futures:order_table:volume')}</div>
                    <div>{formatNumber(order_value, decimalScalePrice, 0, true)}</div>
                </div>
                <div className="flex justify-between items-center mt-2.5">
                    <div className="txtSecond-3">{t('portfolio:position_id')}</div>
                    <div>{`ID #${displaying_id}`}</div>
                </div>
            </MCard>
        </div>
    );
};

export default TopPositionTable;
