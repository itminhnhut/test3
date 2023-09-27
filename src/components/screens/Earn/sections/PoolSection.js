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

const Token = ({ symbol, balance }) => {
    const isGroup = typeof balance !== 'undefined' && balance !== null;
    const assetInfo = getAssetFromCode(symbol)

    return (
        <div className="flex space-x-2 items-center">
            <AssetLogo assetId={WalletCurrency[symbol]} size={32} />
            <div className="">
                <div className={classNames(isGroup && 'font-semibold')}>{symbol}</div>
                {balance > 0 && (
                    <div className="text-txtSecondary dark:text-txtSecondary-dark text-xs">
                        {formatNumber(balance, assetInfo?.assetDigit || 0)} {symbol}
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
            key: pool.key,
            period: `${pool.duration} ${pool.duration > 1 ? t('common:days') : t('common:day')}`,
            APR: `${pool.apr}%`,
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
            title: t('earn:table:coin'),
            dataIndex: 'coin',
            key: 'coin',
            width: 350,
            align: 'left'
        },
        {
            title: t('earn:table:apr'),
            dataIndex: 'APR',
            key: 'APR',
            width: 'auto',
            align: 'left'
        },
        {
            title: t('earn:table:period'),
            dataIndex: 'period',
            key: 'period',
            width: 'auto',
            align: 'left'
        },
        {
            title: t('earn:table:action'),
            dataIndex: 'action',
            key: 'action',
            width: 230,
            align: 'center'
        }
    ];

    const debounceSearch = debounce(setDebouncedFilter, 300);
    const onSearch = useCallback((search) => {
        setFilter(search);
        debounceSearch(search);
    }, []);

    const openDepositModal = (pool) => {
        if (auth) {
            setPoolInfo(pool);
        } else {
            const url = getLoginUrl('sso', 'login');
            router.push(url);
        }
    };

    const filteredAssets = useMemo(() => {
        const dataTable = pool_list.reduce((list, asset) => {
            const isMatch = includes(asset.asset, debouncedFilter);
            const userBalance = userAssets?.[WalletCurrency[asset.asset]]?.value || 0;
            const shouldShow = !onlyUserAssets || userBalance > 0;
            if (!shouldShow) {
                return list;
            }


            const pools = isMatch
                ? asset.pools.map(toTableRow)
                : asset.pools.reduce((_list, pool) => {
                      if (includes(pool.rewardAsset, debouncedFilter)) {
                          return [..._list, toTableRow(pool)];
                      }
                      return _list;
                  }, []);

            if (pools.length) {
                const poolGroup = {
                    key: asset.id,
                    coin: <Token symbol={asset.asset} balance={userBalance} />,
                    APR: showRange({
                        min: asset.minAPR,
                        max: asset.maxAPR,
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
                {auth && (
                    <CheckBox
                        className=""
                        boxContainerClassName="w-5 h-5"
                        labelClassName="text-txtSecondary dark:text-txtSecondary-dark tracking-normal text-base"
                        label={t('earn:my_assets_only')}
                        onChange={() => setOnlyUserAssets((old) => !old)}
                        active={onlyUserAssets}
                    />
                )}
                <InputV2
                    className="pb-0"
                    classNameDivInner="!bg-white dark:!bg-dark-2 border-none"
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
                            <div className="text-teal font-semibold" onClick={() => openDepositModal(record?.raw)}>
                                {t('earn:table:deposit')}
                            </div>
                        ),
                    expandRowByClick: true,
                    onExpand: (expanded, record) => {
                        setExpandedRows((old) => ({ ...old, [record.key]: expanded }));
                    }
                }}
                emptyText={<NoData text={t('earn:table:no_data')} isSearch />}
                rowClassName={(record) => classNames('border-bottom', expandedRows[record.key] && 'expanded')}
                tableStyle={{
                    rowHeight: '72px',
                    fontSize: '1rem'
                }}
            />
        </>
    );
};

export default PoolSection;
