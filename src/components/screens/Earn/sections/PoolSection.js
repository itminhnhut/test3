import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import debounce from 'lodash/debounce';
import CheckBox from 'components/common/CheckBox';
import InputV2 from 'components/common/V2/InputV2';
import NoData from 'components/common/V2/TableV2/NoData';
import { Search } from 'react-feather';
import ChevronDown from 'components/svg/ChevronDown';
import classNames from 'classnames';
import ExpandableTable from 'components/common/V2/TableV2/ExpandableTable';
import { WalletCurrency, formatNumber } from 'utils/reference-utils';
import AssetLogo from 'components/wallet/AssetLogo';
import { useSelector } from 'react-redux';
import { useEarnCtx } from '../context/EarnContext';
import { getAssetFromCode, getLoginUrl } from 'redux/actions/utils';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Button from 'components/common/V2/ButtonV2/Button';

const Token = ({ symbol, balance }) => {
    const isGroup = typeof balance !== 'undefined' && balance !== null;
    const assetInfo = getAssetFromCode(symbol)

    return (
        <div className="flex space-x-2 items-center">
            <AssetLogo assetId={WalletCurrency[symbol]} size={32} />
            <div className="">
                <div className={classNames(isGroup && 'font-semibold')}>{symbol}</div>
                {typeof balance === 'number' ? (
                    <div className="text-txtSecondary dark:text-txtSecondary-dark text-xs">
                        {formatNumber(balance, assetInfo?.assetDigit || 0)} {symbol}
                    </div>
                ) : (
                    <div className="text-txtSecondary dark:text-txtSecondary-dark text-xs">
                        {balance}
                    </div>
                )}
            </div>
        </div>
    );
};

const showRange = ({ min = 0, max = 0, postFix = { plural: '', singular: '' }, separator = '-' }) => {
    const epsilon = 0.01;
    const showMax = Math.abs(max - min) > epsilon;
    return showMax
        ? `${min}${min <= 1 ? postFix.singular : postFix.plural} ${separator} ${max}${postFix.plural}`
        : `${min}${min <= 1 ? postFix.singular : postFix.plural}`;
};

const includes = (str1 = '', str2 = '') => {
    return str1?.toLowerCase().includes(str2.toLowerCase());
};

const PoolSection = ({ pool_list }) => {
    const [onlyUserAssets, setOnlyUserAssets] = useState(false);
    const [filter, setFilter] = useState('');
    const [debouncedFilter, setDebouncedFilter] = useState('');
    const [expandedRows, setExpandedRows] = useState({});
    const { user: auth } = useSelector((state) => state.auth) || null;
    const { setPoolInfo } = useEarnCtx();
    const { t } = useTranslation();
    const router = useRouter();
    const userAssets = useSelector((state) => state?.wallet?.SPOT) || {};
    const toTableRow = (pool) => {
        return {
            key: pool.id,
            period: `${pool.duration} ${pool.duration > 1 ? t('common:days') : t('common:day')}`,
            APR: `${+(pool.apr * 100).toFixed(2)}%`,
            coin: (
                <div className="ml-12 flex space-x-4 items-center">
                    <span className="text-base font-semibold">{t('earn:receive')}</span>
                    <Token symbol={pool.rewardAsset} />
                </div>
            ),
            raw: pool
        };
    };

    const columns = [
        {
            title: <div className="font-semibold text-txtPrimary dark:text-txtPrimary-dark text-sm md:text-base">{t('earn:table:coin')}</div>,
            dataIndex: 'coin',
            key: 'coin',
            width: 384,
            align: 'left'
        },
        {
            title: <div className="font-semibold text-txtPrimary dark:text-txtPrimary-dark text-sm md:text-base">{t('earn:table:apr')}</div>,
            dataIndex: 'APR',
            key: 'APR',
            width: 'auto',
            align: 'left',
            render: (val) => <div className="font-semibold text-teal">{val}</div>
        },
        {
            title: <div className="font-semibold text-txtPrimary dark:text-txtPrimary-dark text-sm md:text-base">{t('earn:table:period')}</div>,
            dataIndex: 'period',
            key: 'period',
            width: 'auto',
            align: 'left',
            render: (val) => <div className="font-semibold">{val}</div>
        },
        {
            title: <div className="font-semibold text-txtPrimary dark:text-txtPrimary-dark text-sm md:text-base">{t('earn:table:action')}</div>,
            dataIndex: 'action',
            key: 'action',
            width: 174,
            align: 'center'
        }
    ];

    const debounceSearch = debounce(setDebouncedFilter, 300);
    const onSearch = useCallback((search) => {
        setFilter(search);
        debounceSearch(search);
    }, []);

    const openDepositModal = (pool) => {
        setPoolInfo(pool);
    };

    const filteredAssets = useMemo(() => {
        const dataTable = pool_list.reduce((list, asset) => {
            const isMatch = includes(asset.asset, debouncedFilter);
            const userBalance = auth ? (userAssets?.[WalletCurrency[asset.asset]]?.value || 0) - (userAssets?.[WalletCurrency[asset.asset]]?.locked_value || 0) : `- ${asset.asset}`;
            const shouldShow = !onlyUserAssets || userBalance > 0;
            if (!shouldShow) {
                return list;
            }


            const pools = isMatch
                ? asset.projects?.map(toTableRow)
                : asset.projects?.reduce((_list, pool) => {
                      if (includes(pool.rewardAsset, debouncedFilter)) {
                          return [..._list, toTableRow(pool)];
                      }
                      return _list;
                  }, []);

            if (pools.length) {
                const poolGroup = {
                    key: asset._id,
                    coin: <Token symbol={asset.asset} balance={userBalance} />,
                    APR: showRange({
                        min: +(asset.minApr * 100).toFixed(2),
                        max: +(asset.maxApr * 100).toFixed(2),
                        separator: '~',
                        postFix: {
                            plural: `%`,
                            singular: `%`
                        }
                    }),
                    period: showRange({
                        min: asset.minDuration,
                        max: asset.maxDuration,
                        separator: '-',
                        postFix: {
                            plural: ` ${t('common:days')}`,
                            singular: ` ${t('common:day')}`
                        }
                    }),
                    pools
                };
                return [...list, poolGroup];
            }

            return list;
        }, []);

        return dataTable;
    }, [debouncedFilter, onlyUserAssets, userAssets]);

    return (
        <>
            <div className="flex space-x-8 justify-end">
                <CheckBox
                    className={classNames(!auth && '!cursor-not-allowed')}
                    boxContainerClassName="!w-6 !h-6"
                    labelClassName="text-txtSecondary dark:text-txtSecondary-dark tracking-normal text-base"
                    label={t('earn:my_assets_only')}
                    onChange={() => setOnlyUserAssets((old) => !old)}
                    active={onlyUserAssets}
                    isDisable={!auth}
                    sizeCheckIcon={24}
                />
                <InputV2
                    className="pb-0"
                    classNameDivInner="!bg-white dark:!bg-dark-2 !w-[23rem]"
                    value={filter}
                    onChange={onSearch}
                    onClear={() => onSearch('')}
                    placeholder={t('earn:search_token')}
                    allowClear={true}
                    maxLength={30}
                    prefix={
                        <label htmlFor="search_events">
                            <Search className="text-txtSecondary dark:text-txtSecondary-dark cursor-text" color="currentColor" size={16} />
                        </label>
                    }
                />
            </div>

            <TableWrapper>
                <ExpandableTable
                    className="bg-bgContainer dark:bg-bgContainer-dark rounded-xl mt-8 expandable-table"
                    columns={columns}
                    data={filteredAssets}
                    expandable={{
                        childrenColumnName: 'pools',
                        expandIconColumnIndex: 3,
                        expandIcon: ({ record, expanded, onExpand }) =>
                            record.pools ? (
                                <div
                                    className="w-full"
                                    onClick={(e) => {
                                        if (!expanded) {
                                            onExpand?.(record, e);
                                        }
                                    }}
                                >
                                    <ChevronDown size={24} color="currentColor" className={classNames('m-auto', expanded && '!rotate-0')} />
                                </div>
                            ) : (
                                <Button variants='text' className="font-semibold !text-xs md:!text-sm" onClick={() => openDepositModal(record?.raw)}>
                                    {t('earn:table:deposit')}
                                </Button>
                            ),
                        expandRowByClick: true,
                        onExpand: (expanded, record) => {
                            setExpandedRows((old) => ({ ...old, [record.key]: expanded }));
                        }
                    }}
                    emptyText={<NoData text={t('earn:table:no_data')} isSearch={!!debouncedFilter} />}
                    rowClassName={(record) => classNames('border-bottom', expandedRows[record.key] && 'expanded')}
                    tableStyle={{
                        rowHeight: '72px',
                        fontSize: '1rem'
                    }}
                />
            </TableWrapper>
        </>
    );
};

const TableWrapper = styled('div')`
    .rc-table {
        .rc-table-expanded-row-fixed {
            min-height: 268px;
        }
        .rc-table-row-level-1 {
            td {
                height: 64px;
            }
        }
    }
`;

export default PoolSection;
