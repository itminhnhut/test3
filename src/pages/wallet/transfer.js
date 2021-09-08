import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ChevronLeft } from 'react-feather';
import Link from 'next/link';
import { Listbox, Popover, Transition } from '@headlessui/react';
import LayoutWithHeader from 'components/common/layouts/layoutWithHeader';
import { iconColorPrimary } from 'config/colors';
import { IconArrowDown } from 'components/common/Icons';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { ApiStatus } from 'src/redux/actions/const';
import find from 'lodash/find';
import { useRouter } from 'next/router';
import { formatTime, formatWallet, getAssetCode } from 'src/redux/actions/utils';
import NumberFormat from 'react-number-format';
import fetchAPI from 'utils/fetch-api';
import showNotification from 'utils/notificationService';
import { useTranslation } from 'next-i18next';
import { tableStyle } from 'src/config/tables';
import DataTable from 'react-data-table-component';
import TableNoData from 'components/common/table/TableNoData';
import TableLoader from 'components/loader/TableLoader';

const AssetSelector = dynamic(
    () => import('src/components/convert/AssetSelector'),
    // {ssr: false}
);

const TransferCrypto = ({ symbol }) => {
    const { t } = useTranslation(['common', 'convert']);
    const router = useRouter();
    const { query } = router;
    const buttonAssetRef = useRef();
    const [selectedAssetCode, setSelectedAssetCode] = useState(query.coin || 'VNDC');
    const [selectedAsset, setSelectedAsset] = useState({ });
    const [selectedSource, setSelectedSource] = useState(query.from || 'SPOT');
    const [sources, setSources] = useState([]);
    const [selectedDestination, setSelectedDestination] = useState('');
    const [filteredAssets, setFilteredAssets] = useState([]);
    const [search, setSearch] = useState('');
    const wallet = useSelector(state => state.wallet) || null;
    const assetConfig = useSelector(state => state.utils.assetConfig);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [availableBalance, setAvailableBalance] = useState();
    const [amount, setAmount] = useState('');
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [history, setHistory] = useState([]);

    const getTransferHistory = async () => {
        setLoadingHistory(true);
        const { data, status } = await fetchAPI({
            url: '/api/v1/wallet/transfer_history',
            options: {
                method: 'GET',
            },
            params: {
            },
        });
        if (status === ApiStatus.SUCCESS) {
            setHistory(data);
            setLoadingHistory(false);
        }
    };

    const customStyles = {
        ...tableStyle,
        rows: {
            style: {
                borderBottom: 'none !important',
                cursor: 'pointer',
                '&:hover': {
                    background: '#F6F9FC',
                },
            },
        },
    };
    const columns = useMemo(() => [
        {
            name: t('time'),
            selector: 'time',
            omit: false,
            width: '150px',
            cell: (row) => <span data-tag="allowRowEvents">{formatTime(row.createdAt)}</span>,
        },
        {
            name: t('common:asset'),
            selector: 'assetId',
            cell: (row) => <span data-tag="allowRowEvents">{getAssetCode(row.assetId)}</span>,
        },
        {
            name: t('common:from_wallet'),
            selector: 'fromWallet',
            cell: (row) => <span data-tag="allowRowEvents">{row.fromWallet}</span>,
        },
        {
            name: t('common:to_wallet'),
            selector: 'toWallet',
            cell: (row) => <span data-tag="allowRowEvents">{row.toWallet}</span>,
        },
        {
            name: t('common:quantity'),
            selector: 'quantity',
            right: true,
            cell: (row) => <span data-tag="allowRowEvents">{formatWallet(row.quantity)}</span>,
        },
        {
            name: t('common:status'),
            selector: 'status',
            right: true,
            cell: (row) => {
                if (row.status === 'PENDING') {
                    return <span className="text-yellow">{t('common:pending')}</span>;
                } if (row.status === 'APPROVED') {
                    return <span className="text-green">{t('common:success')}</span>;
                } if (row.status === 'REJECTED') {
                    return <span className="text-red">{t('common:failed')}</span>;
                }
                return (
                    <span className="text-green">{t('common:success')}</span>
                );
            },
        },
    ], [assetConfig]);

    useEffect(() => {
        const data = assetConfig.filter(e => {
            return (e?.assetCode?.toLowerCase()?.includes(search?.toLowerCase())
                    || e?.assetName?.toLowerCase()?.includes(search?.toLowerCase()));
        });
        setFilteredAssets(data);
    }, [assetConfig, search]);

    useEffect(() => {
        setSelectedSource('');
        setSelectedDestination('');
        setSources([]);
        const _asset = find(assetConfig, e => e.assetCode === selectedAssetCode) || { walletTypes: {} };
        const _sources = [];
        Object.keys(_asset.walletTypes).forEach(e => {
            if (_asset.walletTypes[e]) {
                _sources.push(e);
            }
        });
        setSelectedAsset(_asset);
        if (_sources.length > 1) {
            setSources(_sources);
            if (_sources.includes(query.from)) {
                setSelectedSource(query.from);
            } else {
                setSelectedSource(_sources[0]);
            }
        }
    }, [selectedAssetCode, assetConfig]);

    useEffect(() => {
        const _destinationsSources = sources.filter(e => e !== selectedSource && (selectedSource === 'SPOT' ? e !== 'BROKER' : true));
        if (_destinationsSources.length) {
            setSelectedDestination(_destinationsSources[0]);
        }
    }, [selectedSource, sources]);

    useEffect(() => {
        const _wallet = wallet?.[selectedSource]?.[selectedAsset.id] || { value: 0, lockedValue: 0 };
        setAvailableBalance(_wallet.value - _wallet.lockedValue);
    }, [selectedAsset, selectedSource, wallet]);

    useEffect(() => {
        getTransferHistory();
    }, []);

    useEffect(() => {
        router.push(`/wallet/transfer?coin=${selectedAssetCode}&from=${selectedSource}`, undefined, { shallow: true });
    }, [selectedAssetCode, selectedSource]);

    const handleClickCoin = (a) => {
        setSearch('');
        setSelectedAssetCode(a);
        buttonAssetRef?.current.click();
    };

    const transfer = async () => {
        setErrors({});
        if (amount > availableBalance) {
            setErrors({ max: formatWallet(availableBalance) });
        } else {
            setLoading(true);
            const { data, status, code } = await fetchAPI({
                url: '/api/v1/wallet/transfer',
                options: {
                    method: 'POST',
                },
                params: {
                    'fromWallet': selectedSource,
                    'toWallet': selectedDestination,
                    'assetId': selectedAsset.id,
                    'quantity': amount,
                },
            });
            if (status === ApiStatus.SUCCESS) {
                setAmount('');
                showNotification({
                    message: t('wallet:transfer_success', {
                        amount: formatWallet(amount),
                        assetCode: selectedAsset.assetCode,
                        selectedSource,
                        selectedDestination,
                    }),
                    title: t('common:success'),
                    type: 'success',
                });
            } else {
                let message = t('error:ERROR_COMMON');
                if (code === 6300) {
                    message = t('wallet:transfer_no_support');
                } else if (code === 9003) {
                    message = t('wallet:transfer_min', { data: `${formatWallet(data)} ${selectedAssetCode}` });
                }
                showNotification({
                    message,
                    title: t('common:failure'),
                    type: 'warning',
                });
            }
            setLoading(false);
            getTransferHistory();
        }
    };

    return (
        <LayoutWithHeader>
            <div className="flex flex-1 items-center flex-col mt-10">
                <div className="wallet-container-withdraw w-full">
                    <Link href="/wallet/spot">
                        <div className="flex items-center mb-8 cursor-pointer">
                            <button className="btn btn-icon -ml-1 mr-4 !p-0" type="button">
                                <ChevronLeft color={iconColorPrimary} size={30} />
                            </button>
                            <span className="font-bold">
                                {t('wallet:transfer')} <span className="uppercase">{symbol}</span>
                            </span>
                        </div>
                    </Link>

                    <div className="card card-shadow bg-white rounded-3xl mb-20">
                        <div className="card-body transfer-form">
                            <div className="form-group relative">
                                <label>{t('common:asset')}</label>
                                <Popover className="flex items-center relative">
                                    {({ open }) => (
                                        <>
                                            <Popover.Button
                                                className="relative w-full form-control form-control-lg border text-left"
                                                ref={buttonAssetRef}
                                            >
                                                <span className="block truncate">{selectedAssetCode}</span>
                                                <span
                                                    className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none"
                                                >
                                                    <IconArrowDown />
                                                </span>
                                            </Popover.Button>
                                            {open
                                            && <AssetSelector
                                                setSearch={setSearch}
                                                assets={filteredAssets}
                                                onSelectAsset={handleClickCoin}
                                                selectedAsset={selectedAssetCode}
                                            />}
                                        </>
                                    )}
                                </Popover>
                            </div>
                            <div className="pl-5 border-0 border-l border-violet-700">
                                <div className="form-group">
                                    <label>{t('common:from_wallet')}</label>
                                    <Listbox value={selectedSource} onChange={setSelectedSource}>
                                        {({ open }) => (
                                            <>
                                                <div className="relative mt-1">
                                                    <Listbox.Button
                                                        className="relative w-full form-control form-control-lg border text-left"
                                                    >
                                                        <span className="block truncate">{selectedSource}</span>
                                                        <span
                                                            className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none"
                                                        >
                                                            <IconArrowDown />
                                                        </span>
                                                    </Listbox.Button>
                                                    <Transition
                                                        show={open}
                                                        as={Fragment}
                                                        leave="transition ease-in duration-100"
                                                        leaveFrom="opacity-100"
                                                        leaveTo="opacity-0"
                                                    >
                                                        <Listbox.Options
                                                            static
                                                            className="absolute w-full mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10"
                                                        >
                                                            {sources && sources.length > 1 ? (sources.map((source, index) => (
                                                                <Listbox.Option
                                                                    key={index}
                                                                    className={({ active }) => `${active ? 'text-white bg-violet-700' : ''} cursor-pointer select-none relative px-4 py-3 rounded-lg`}
                                                                    value={source}
                                                                >
                                                                    {({ selected, active }) => (
                                                                        <>
                                                                            <span
                                                                                className={`${selected ? 'font-semibold' : 'font-normal'} block truncate`}
                                                                            >
                                                                                {source}
                                                                            </span>
                                                                            {selected ? (
                                                                                <span
                                                                                    className={`${active ? 'text-violet-600' : 'text-white'} absolute inset-y-0 left-0 flex items-center pl-3`}
                                                                                />
                                                                            ) : null}
                                                                        </>
                                                                    )}
                                                                </Listbox.Option>
                                                            ))) : (
                                                                <li className="cursor-pointer select-none relative px-4 py-3 rounded-lg">
                                                                    No supported wallets
                                                                </li>
                                                            )}
                                                        </Listbox.Options>
                                                    </Transition>
                                                </div>
                                            </>
                                        )}
                                    </Listbox>
                                </div>
                                <div className="form-group mb-5">
                                    <label>{t('common:to_wallet')}</label>
                                    <Listbox value={selectedDestination} onChange={setSelectedDestination}>
                                        {({ open }) => (
                                            <>
                                                <div className="relative mt-1">
                                                    <Listbox.Button
                                                        className="relative w-full form-control form-control-lg border text-left"
                                                    >
                                                        <span
                                                            className="block truncate"
                                                        >{selectedDestination}
                                                        </span>
                                                        <span
                                                            className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none"
                                                        >
                                                            <IconArrowDown />
                                                        </span>
                                                    </Listbox.Button>
                                                    <Transition
                                                        show={open}
                                                        as={Fragment}
                                                        leave="transition ease-in duration-100"
                                                        leaveFrom="opacity-100"
                                                        leaveTo="opacity-0"
                                                    >
                                                        <Listbox.Options
                                                            static
                                                            className="absolute w-full mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10"
                                                        >
                                                            {sources && sources.length > 1 ? (
                                                                sources.filter(e => e !== selectedSource && (selectedSource === 'SPOT' ? e !== 'BROKER' : true)).map((source, index) => (
                                                                    <Listbox.Option
                                                                        key={index}
                                                                        className={({ active }) => `${active ? 'text-white bg-violet-700' : ''} cursor-pointer select-none relative px-4 py-3 rounded-lg`}
                                                                        value={source}
                                                                    >
                                                                        {({ selected, active }) => (
                                                                            <>
                                                                                <span
                                                                                    className={`${selected ? 'font-semibold' : 'font-normal'} block truncate`}
                                                                                >
                                                                                    {source}
                                                                                </span>
                                                                                {selected ? (
                                                                                    <span
                                                                                        className={`${active ? 'text-violet-600' : 'text-white'} absolute inset-y-0 left-0 flex items-center pl-3`}
                                                                                    />
                                                                                ) : null}
                                                                            </>
                                                                        )}
                                                                    </Listbox.Option>
                                                                ))
                                                            ) : (
                                                                <li className="cursor-pointer select-none relative px-4 py-3 rounded-lg">
                                                                    No supported wallets
                                                                </li>
                                                            )}
                                                        </Listbox.Options>
                                                    </Transition>
                                                </div>
                                            </>
                                        )}
                                    </Listbox>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="amount">
                                    {t('common:amount')}
                                </label>
                                <div className={`input-group relative ${(errors.min || errors.max) ? 'is-error' : ''}`}>
                                    <NumberFormat
                                        className="form-control form-control-lg"
                                        placeholder="Nhập số tiền"
                                        decimalScale={10}
                                        thousandSeparator
                                        allowNegative={false}
                                        value={amount}
                                        onValueChange={({ value }) => {
                                            setAmount(value);
                                        }}
                                    />
                                    <div className="input-group-append">
                                        <button className="btn" type="button" onClick={() => setAmount(availableBalance)}>
                                            <span className="input-group-text text-violet-700 font-semibold">
                                                {t('common:max')}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                {
                                    (errors.min || errors.max) ? (
                                        <div className="text-xs text-red mt-2">
                                            {errors.min ? t('convert:errors.min', { amount: errors.min }) : errors.max ? t('convert:errors.max', { amount: errors.max }) : null}
                                        </div>
                                    ) : null
                                }
                            </div>
                            <div className="mt-3 text-xs">
                                <span className="text-black-600">{t('common:available_balance')}:</span> <span className="font-semibold">{formatWallet(availableBalance)} {selectedAsset.assetCode}</span>
                            </div>
                            <div className="mt-8">
                                <button
                                    className="btn btn-primary w-full"
                                    type="button"
                                    disabled={loading || amount <= 0 || availableBalance === 0}
                                    onClick={transfer}
                                >
                                    {t('common:send')}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="card bg-white rounded-3xl mb-8 lg:max-w-[825px] mx-auto">
                        <div className="card-header">
                            <div className="card-header-text">{t('wallet:transfer_history')}</div>
                            <div className="card-header-actions">
                                <Link href="/wallet/history">
                                    <span className="text-sm text-violet-700 font-bold cursor-pointer">{t('wallet:all')}</span>
                                </Link>
                            </div>
                        </div>
                        <div className="card-body">
                            <DataTable
                                data={history}
                                columns={columns}
                                customStyles={customStyles}
                                noHeader
                                fixedHeader
                                fixedHeaderScrollHeight="300px"
                                dense
                                noDataComponent={<TableNoData />}
                                progressPending={loadingHistory}
                                progressComponent={<TableLoader />}
                                data-tag="allowRowEvents"
                                pagination
                            />
                        </div>
                    </div>
                </div>
            </div>
        </LayoutWithHeader>
    );
};

export async function getServerSideProps({ query, locale }) {
    return {
        props: {
            symbol: query.symbol || '',
            ...await serverSideTranslations(locale, ['common', 'navbar', 'wallet', 'convert']),
        },
    };
}

export default TransferCrypto;
