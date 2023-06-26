import { useMemo, useState, useCallback, useEffect, useRef } from 'react';

import { useTranslation } from 'next-i18next';

import Chip from 'components/common/V2/Chip';
import TableV2 from 'components/common/V2/TableV2';
import AssetLogo from 'components/wallet/AssetLogo';
import DatePickerV2 from 'components/common/DatePicker/DatePickerV2';

import FetchApi from 'utils/fetch-api';
import { API_HISTORY_STAKING_DAILY_OVERVIEW, API_GET_COMMISSION_HISTORY_PARTNER } from 'redux/actions/apis';

import { formatNumber, formatTime } from 'redux/actions/utils';
import { useSelector } from 'react-redux';

import { useWindowSize } from 'react-use';
import { endOfDay, startOfDay, subDays, getTime, isValid } from 'date-fns';

import styled from 'styled-components';
import classNames from 'classnames';

const newDate = new Date();

const DATE_OPTIONS = [
    {
        title: { vi: 'Tất cả', en: 'All' },
        value: 'all',
        range: { startDate: null, endDate: null }
    },
    {
        title: { vi: '7 ngày', en: '7 days' },
        value: 7,
        range: { startDate: startOfDay(subDays(newDate, 6)), endDate: endOfDay(newDate) }
    },
    {
        title: { vi: '30 ngày', en: '30 days' },
        value: 30,
        range: { startDate: startOfDay(subDays(newDate, 29)), endDate: endOfDay(newDate) }
    },
    {
        title: { vi: '365 ngày', en: '365 days' },
        value: 365,
        range: { startDate: startOfDay(subDays(newDate, 364)), endDate: endOfDay(newDate) }
    }
];

const LIMIT = 10;
const RANGE_CUSTOM = 'custom';

const initState = {
    defaultAsset: 'VNDC',
    range: 'all',
    loading: false,
    page: 1,
    dataOverview: {
        totalProfit: { value: 0 }
    },
    dataHistory: {
        result: [],
        hasNext: false,
        go_next: true
    },
    filter: {
        range: {
            startDate: null,
            endDate: null,
            key: 'selection'
        }
    }
};

const HistoryStaking = ({ assetId }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const { width } = useWindowSize();
    const isMobile = width < 830;

    const assetConfigs = useSelector((state) => state.utils?.assetConfig) || [];
    const asset = useMemo(() => {
        return assetConfigs.find((asset) => asset.id === assetId);
    }, [assetConfigs, assetId]);

    const [loading, setLoading] = useState(initState.loading);
    const [page, setPage] = useState(initState.page);
    const [range, setRange] = useState(initState.range);
    const [dataOverview, setDataOverview] = useState(initState.dataOverview);
    const [dataHistory, setDataHistory] = useState(initState.dataHistory);

    const [filter, setFilter] = useState(initState.filter);

    const refAsset = useRef(initState.defaultAsset);

    useEffect(() => {
        // reset data change assetId (VNDC, USDT)
        if (refAsset.current !== assetId) {
            handleResetByAssetId();
        }
        const id = setTimeout(() => {
            handleOverviewAPI();
        }, 300);
        return () => clearTimeout(id);
    }, [assetId, range, filter?.range?.startDate, filter?.range?.endDate]);

    useEffect(() => {
        // reset data change assetId (VNDC, USDT)
        if (refAsset.current !== assetId) {
            handleResetByAssetId();
        }
        const id = setTimeout(() => {
            handleHistoryAPI();
        }, 300);

        return () => clearTimeout(id);
    }, [assetId, page, range, filter?.range?.startDate, filter?.range?.endDate]);

    // handle reset data
    const handleResetByAssetId = () => {
        setFilter(initState.filter);
        setRange(initState.range);
        setPage(initState.page);
        refAsset.current = assetId;
    };

    const handleOverviewAPI = async () => {
        try {
            const { data, message } = await FetchApi({
                url: API_HISTORY_STAKING_DAILY_OVERVIEW,
                options: {
                    method: 'GET'
                },
                params: {
                    assetId,
                    ...(filter.range.startDate && { from: getTime(new Date(filter.range.startDate)) }),
                    ...(filter.range.endDate && { to: getTime(new Date(filter.range.endDate)) })
                }
            });
            if (data) {
                setDataOverview({ ...data });
            } else {
                console.error(message, { cause: 'Error API Staking History Overview' });
            }
        } catch (error) {
            console.error(error, { cause: 'Error API Staking History Overview' });
        }
    };

    const handleHistoryAPI = async () => {
        try {
            setLoading(true);
            const { data, message } = await FetchApi({
                url: API_GET_COMMISSION_HISTORY_PARTNER,
                options: {
                    method: 'GET'
                },
                params: {
                    type: 'staking',
                    currency: assetId,
                    limit: LIMIT,
                    skip: (page - 1) * LIMIT,
                    ...(filter.range.startDate && { from: getTime(new Date(filter.range.startDate)) }),
                    ...(filter.range.endDate && { to: getTime(new Date(filter.range.endDate)) })
                }
            });
            if (data) {
                setDataHistory({ ...data });
            } else {
                console.error(message, { cause: 'Error API Staking History Transaction' });
            }
        } catch (error) {
            console.error(error, { cause: 'Error API Staking History Transaction' });
        } finally {
            setLoading(initState.loading);
        }
    };

    const totalProfit = useMemo(() => {
        return `${formatNumber(dataOverview.totalProfit?.value, asset?.assetDigit)} ${asset?.assetCode}`;
    }, [assetId, dataOverview.totalProfit?.value]);

    const handleChangeRanger = (item) => {
        setRange(item.value);
        setFilter((prev) => ({ ...prev, range: item.range }));
        setPage(initState.page);
    };

    const handleChangeDate = (e) => {
        const value = e?.selection || {};
        const startDate = value?.startDate ? getTime(new Date(value?.startDate)) : null;
        const endDate = value?.endDate ? getTime(new Date(value?.endDate)) : null;
        setFilter((prev) => ({
            ...prev,
            range: {
                startDate,
                endDate
            }
        }));
        if (startDate && endDate) {
            setRange(RANGE_CUSTOM);
            setPage(initState.page);
        }
    };

    const renderDateOptions = useMemo(() => {
        return DATE_OPTIONS.map((item) => {
            const isActive = item.value === range;
            return (
                <Chip onClick={() => handleChangeRanger(item)} selected={isActive} key={item.value}>
                    {item.title?.[language]}
                </Chip>
            );
        });
    }, [range]);

    const renderTable = useCallback(() => {
        const columns = [
            {
                key: 'currency',
                dataIndex: 'currency',
                title: t('staking:statics:history:columns.type'),
                align: 'left',
                width: 304,
                render: (value) => (
                    <section className="flex flex-row items-center">
                        <AssetLogo assetId={value} />
                        <span className="ml-2">{asset?.assetCode}</span>
                    </section>
                )
            },
            {
                key: 'money_use',
                dataIndex: 'money_use',
                title: t('staking:statics:history:columns.amount'),
                align: 'left',
                width: 304,
                render: (value) => <div>{formatNumber(value, asset?.assetDigit)}</div>
            },
            {
                key: 'created_at',
                dataIndex: 'created_at',
                title: t('staking:statics:history:columns.time'),
                align: 'left',
                width: 304,
                render: (value) => (
                    <div className="font-normal">{value && isValid(new Date(value)) ? formatTime(new Date(value), 'HH:mm:ss dd/MM/yyyy') : null}</div>
                )
            },
            {
                key: 'status',
                dataIndex: 'status',
                title: t('staking:statics:history:columns.status'),
                align: 'right',
                render: (value) => <div className="dark:text-green-2 text-green-3">{t('common:success')}</div>
            }
        ];

        return (
            <WrapperTable
                isMobile={isMobile}
                skip={0}
                useRowHover
                height={350}
                limit={LIMIT}
                loading={loading}
                columns={columns}
                scroll={{ x: true }}
                className="border-t border-divider dark:border-divider-dark"
                data={dataHistory?.result || []}
                rowKey={(item) => `${item?.key}`}
                pagingClassName="!border-0 !py-8"
                pagingPrevNext={{
                    page: page - 1,
                    hasNext: dataHistory?.hasNext,
                    onChangeNextPrev: (delta) => {
                        setPage(page + delta);
                    },
                    language: language
                }}
            />
        );
    }, [dataHistory?.result, loading]);

    return (
        <section>
            <h2 className="font-semibold text-2xl mt-[60px]">{t('staking:statics:history.title')}</h2>
            <section className="rounded-xl border border-divider dark:border-divider-dark bg-white dark:bg-transparent mt-8">
                <section className="flex flex-col lg:flex-row my-8 ml-6 mr-[21px] h-full lg:h-[62px] items-center">
                    <section className="w-full lg:w-2/5">
                        <div className=" text-txtSecondary dark:text-txtSecondary-dark ">{t('staking:statics:history.profit_received')}</div>
                        <div className="text-txtPrimary dark:text-txtPrimary-dark font-semibold mt-2 text-2xl">{totalProfit}</div>
                    </section>
                    <section className="w-full mt-2 lg:mt-0 lg:w-3/5 flex  lg:flex-nowrap flex-wrap flex-row items-center gap-2 lg:gap-x-2 justify-start lg:justify-end">
                        {renderDateOptions}
                        <DatePickerV2
                            hasShadow
                            position="right"
                            initDate={filter.range}
                            month={isMobile ? 1 : 2}
                            onChange={handleChangeDate}
                            text={
                                <Chip
                                    selected={range === RANGE_CUSTOM}
                                    className={classNames({
                                        'text-teal border-teal bg-teal/[.1] !font-semibold': range === RANGE_CUSTOM
                                    })}
                                >
                                    {t('reference:referral.custom')}
                                </Chip>
                            }
                        />
                    </section>
                </section>
                <section>{renderTable()}</section>
            </section>
        </section>
    );
};

const WrapperTable = styled(TableV2)`
    .rc-table-container {
        overflow: auto;
        .rc-table-content {
            width: ${(props) => (props.isMobile ? 'max-content' : '100%')};
        }
    }
`;

export default HistoryStaking;
