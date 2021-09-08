import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { createRef, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Menu, Transition } from '@headlessui/react';
import { MoreVertical } from 'react-feather';
import Link from 'next/link';

import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { formatPercentage, formatSpotPrice, formatWallet, getPercentageOf } from 'src/redux/actions/utils';
import compact from 'lodash/compact';
import { useAsync, useLocalStorage } from 'react-use';
import { useRouter } from 'next/router';
import { tableStyle } from 'src/config/tables';
import { iconColor } from 'src/config/colors';
import fetchAPI from 'src/utils/fetch-api';
import { ApiStatus, QueryWalletType } from 'src/redux/actions/const';

import { IconSearch, IconSort } from 'components/common/Icons';
import AssetLogo from 'components/wallet/AssetLogo';
import LayoutWithHeader from 'components/common/layouts/layoutWithHeader';
import TextLoader from 'components/loader/TextLoader';
import TableLoader from 'components/loader/TableLoader';
import TableNoData from 'components/common/table/TableNoData';
import PercentageOf from 'components/common/label/PercentageOf';
import { useComponentVisible, useWindowSize } from 'utils/customHooks';
import { getAssetCode } from 'redux/actions/utils';
import { map as lodashMap, filter as lodashFilter, size } from 'lodash';
import Custom404 from '../404';

const Wallet = ({ id, errorCode }) => {
    const tabs = ['spot', 'broker', 'earn', 'membership'];
    // const tabs = ['spot', 'broker'];
    const router = useRouter();
    const { locale } = router;
    const [walletType, setWalletType] = useState(QueryWalletType[id || QueryWalletType.spot]);
    const { t } = useTranslation();

    const wallet = useSelector(state => state.wallet) || null;

    const [portfolio, setPortfolio] = useState(null);
    const [search, setSearch] = useState('');
    const [userBalances, setUserBalances] = useState([]);
    const [smallBalanceDisplay, setSmallBalanceDisplay] = useLocalStorage('wallet:small_balance', 'show');
    const [loadingPortfolio, setLoadingPortfolio] = useState(true);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    // const user = useSelector(state => state.user.user) || null;
    const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [popUpPosition, setPopUpPosition] = useState([0, 0, 0, 0]);

    const { width } = useWindowSize();

    const assetConfig = useSelector(state => state.utils.assetConfig);
    const quoteAsset = useSelector(state => state.user.quoteAsset) || 'USDT';
    // TODO use api
    // const multiValue = quoteAsset === 'VNDC' ? 24000 : 1;
    const [loadingAssetValue, setLoadingAssetValue] = useState(true);
    const [assetValue, setAssetValue] = useState(null);
    const [multiValue, setMultiValue] = useState(quoteAsset === 'VNDC' ? 24000 : 1);
    const [filterUserBalances, setFilterUserBalances] = useState([]);
    const [spotWalletValue, setSpotWalletValue] = useState(0);
    const [brokerWalletValue, setBrokerWalletValue] = useState(0);

    useEffect(() => {
        if (!loadingAssetValue && assetValue) {
            if (assetValue?.[617] > 0) setMultiValue(quoteAsset === 'VNDC' ? (1 / assetValue?.[617]) : (assetValue?.[20]));
        }
    }, [loadingAssetValue, assetValue, quoteAsset]);

    const ItemBtn = (props) => { // ensure that all props are forwarded to the btn directly.
        const { href, children, ...rest } = props;
        return (
            <Link href={href}>
                <button {...rest} type="button">{children}</button>
            </Link>
        );
    };

    const [totalWallet, setTotalWallet] = useState(0);

    useEffect(() => {
        let filterUserBalance = [];

        let totalSpot = 0;
        let totalBroker = 0;
        userBalances.forEach(asset => {
            const {
                assetCode, assetName, value, walletType: _walletType,
            } = asset;

            if (asset?.value > 0) {
                if (_walletType.toLowerCase() === 'spot') {
                    if (!isNaN(assetValue?.[asset?.id]) && !isNaN(asset?.value)) { totalSpot += assetValue?.[asset?.id] * asset?.value; }
                }
                if (_walletType.toLowerCase() === 'broker') {
                    if (!isNaN(assetValue?.[asset?.id]) && !isNaN(asset?.value)) { totalBroker += assetValue?.[asset?.id] * asset?.value; }
                }
            }

            if (_walletType !== walletType) return null;

            if (smallBalanceDisplay === 'hide' && value < 0.0000001) return null;
            if (typeof search === 'string' && search.length) {
                if (assetCode.indexOf(search.toUpperCase()) >= 0 || assetName.indexOf(search) >= 0) {
                    filterUserBalance.push(asset);
                }
            } else {
                filterUserBalance.push(asset);
            }
            return null;
        });
        if (walletType.toLowerCase() === 'spot') {
            setSpotWalletValue(totalSpot * multiValue);
        }
        if (walletType.toLowerCase() === 'broker') {
            setBrokerWalletValue(totalBroker * multiValue);
        }
        filterUserBalance = compact(filterUserBalance);
        setFilterUserBalances(filterUserBalance);
    }, [userBalances, assetValue, search, smallBalanceDisplay, walletType, multiValue]);

    useEffect(() => {
        let totalValue = 0;
        tabs.forEach(tab => {
            const balances = wallet[tab.toUpperCase()];
            let total = 0;
            if (assetConfig && assetConfig.length && balances) {
                const test = assetConfig.map(e => ({ ...e, ...balances && balances[e.id] ? balances[e.id] : {} }));
                const filterUserBalance = [];
                test.forEach(asset => {
                    const {
                        assetCode, assetName, value, walletType: _walletType,
                    } = asset;

                    if (asset?.value > 0) {
                        if (!isNaN(assetValue?.[asset?.id]) && !isNaN(asset?.value)) { total += assetValue?.[asset?.id] * asset?.value; }
                    }

                    if (_walletType !== walletType) return null;

                    if (smallBalanceDisplay === 'hide' && value < 0.0000001) return null;
                    if (typeof search === 'string' && search.length) {
                        if (assetCode.indexOf(search.toUpperCase()) >= 0 || assetName.indexOf(search) >= 0) {
                            filterUserBalance.push(asset);
                        }
                    } else {
                        filterUserBalance.push(asset);
                    }
                    return null;
                });
            }
            totalValue += total;
        });
        setTotalWallet(totalValue * multiValue);
    }, [wallet, multiValue]);

    const handlePopup = async (item) => {
        await setSelectedItem(item);
        setIsComponentVisible(true);
        const currentBtn = document.getElementById(item.id).getBoundingClientRect();
        setPopUpPosition([currentBtn?.top + window.pageYOffset + 10, currentBtn?.right + window.pageXOffset + 40, currentBtn?.bottom + window.pageYOffset + 40, currentBtn?.left + window.pageXOffset + 40]);
    };

    const renderActionBtn = (item, index) => (
        <div>
            <button type="button" className="btn btn-icon" onClick={() => handlePopup(item)} id={item.id}>
                <span className="icon">
                    <MoreVertical color={iconColor} />
                </span>
            </button>
        </div>
    );

    const getAssetValue = async () => {
        const { data, status } = await fetchAPI({
            url: '/api/v1/asset/value',
            options: {
                method: 'GET',
            },
        });
        if (status === ApiStatus.SUCCESS) {
            setAssetValue(data);
        }

        setLoadingAssetValue(false);
    };
    useAsync(async () => {
        await getAssetValue();
    }, []);
    useEffect(() => {
        const balances = wallet[walletType];
        if (assetConfig && assetConfig.length && balances) {
            setUserBalances(assetConfig.map(e => ({ ...e, ...balances && balances[e.id] ? balances[e.id] : {} })));
        }
    }, [assetConfig, wallet[walletType]]);

    // const getPnL = (row) => {
    //     const price = portfolio?.wallets?.[walletType]?.assets?.[row.id]?.price;
    //     const initialPrice = portfolio?.wallets?.[walletType]?.assets?.[row.id]?.initialPrice;
    //     if (!(price > 0 && initialPrice > 0 && row.value > 0)) {
    //         return 0;
    //     }
    //     return formatPercentage((price - initialPrice) / initialPrice * 100, 2, true);
    // };
    const columns = useMemo(() => [
        {
            name: t('common:asset'),
            selector: 'assetCode',
            sortable: true,
            ignoreRowClick: true,
            cell: (row) => (
                <div className="flex items-center">
                    <div className="mr-4 w-8 h-8">
                        <AssetLogo assetCode={row?.assetCode} size={32} />
                    </div>
                    <div className="flex-1 flex flex-col">
                        <div className="font-semibold text-sm flex-grow truncate">{row?.assetCode}</div>
                        <div
                            className="text-black-500 text-xs line-clamp-1"
                            title={row?.assetName}
                        >{row?.assetName}
                        </div>
                    </div>
                </div>
            ),
            width: '190px',
        },
        {
            name: t('common:total_balance'),
            selector: 'value',
            sortable: true,
            ignoreRowClick: true,
            right: true,
            minWidth: '150px',
            cell: (row) => (formatWallet(row.value)),
        },
        {
            name: t('common:available_balance'),
            ignoreRowClick: true,
            right: true,
            sortable: true,
            minWidth: '150px',
            cell: (row) => (formatWallet(row.value - row.lockedValue)),
        },
        {
            name: t('common:in_order'),
            selector: 'lockedValue',
            ignoreRowClick: true,
            right: true,
            sortable: true,
            minWidth: '150px',
            cell: (row) => (formatWallet(row.lockedValue)),
        },
        // {
        //     name: t('common:initial_price'),
        //     selector: 'initial_price',
        //     ignoreRowClick: true,
        //     sortable: true,
        //     right: true,
        //     minWidth: '150px',
        //     sortFunction: (a, b) => {
        //         return portfolio?.wallets?.[walletType]?.assets?.[a.id]?.initialPrice
        //             - portfolio?.wallets?.[walletType]?.assets?.[b.id]?.initialPrice;
        //     },
        //     cell: (row) => {
        //         const value = multiValue * portfolio?.wallets?.[walletType]?.assets?.[row.id]?.initialPrice;
        //         if (row?.assetCode === quoteAsset) {
        //             return 1;
        //         }
        //         if (value > 0) {
        //             return formatSpotPrice(value);
        //         }
        //         // return t('wallet:calculating');
        //         return '-';
        //     }
        //     ,
        // },
        {
            name: t('common:current_price'),
            selector: 'current_price',
            ignoreRowClick: true,
            sortable: true,
            right: true,
            minWidth: '150px',
            sortFunction: (a, b) => {
                return assetValue?.[a.id]
                    - assetValue?.[b.id];
            },
            cell: (row) => {
                const value = multiValue * assetValue?.[row.id];
                if (row?.assetCode === quoteAsset) {
                    return 1;
                }
                if (value > 0) {
                    return formatSpotPrice(value);
                }
                // return t('wallet:calculating');
                return '-';
            },
        },
        // {
        //     name: t('common:pnl'),
        //     selector: 'pnl',
        //     ignoreRowClick: true,
        //     sortable: true,
        //     right: true,
        //     width: '100px',
        //     sortFunction: (a, b) => {
        //         return getPnL(a) - getPnL(b);
        //     },
        //     cell: (row) => {
        //         const pnLPercentage = getPnL(row);
        //         if (Number(pnLPercentage) !== 0) {
        //             return <span className={`${pnLPercentage > 0 ? 'text-green' : 'text-red'}`}>{pnLPercentage}%</span>;
        //         }
        //         return '-';
        //     },
        // },
        {
            name: '',
            selector: 'id',
            ignoreRowClick: true,
            right: true,
            width: '60px',
            cell: (row, index) => renderActionBtn(row, index),
        },
    ], [assetValue, multiValue, t, walletType, rowsPerPage, filterUserBalances]);

    const customStyles = {
        ...tableStyle,
        rows: {
            style: {
                borderBottom: 'none !important',
                '&:nth-child(odd)': {
                    background: '#F6F9FC',
                },
                height: '60px',
            },
        },
    };

    // const currentValue = multiValue * portfolio?.wallets?.[walletType]?.now?.totalValue;
    // const currentPnL24hValue = multiValue * portfolio?.wallets?.[walletType]?.now?.totalPnL;
    // const currentPnL24h = useMemo(() => {
    //     return <PercentageOf
    //         a={portfolio?.wallets?.[walletType]?.now?.totalPnL}
    //         b={portfolio?.wallets?.[walletType]?.now?.totalValue - portfolio?.wallets?.[walletType]?.now?.totalPnL}
    //         withBackground
    //     />;
    // }, [portfolio, walletType]);
    // const allWalletValue = multiValue * portfolio?.total?.now?.totalValue;
    // const allWalletPnL24h = getPercentageOf(
    //     portfolio?.total?.now?.totalPnL,
    //     portfolio?.total?.now?.totalValue - portfolio?.total?.now?.totalPnL);

    if (errorCode) {
        return <Custom404 statusCode={errorCode} />;
    }

    return (
        <>
            <LayoutWithHeader>
                <div className="ats-container">
                    <div className="wallet-container bg-white rounded-3xl mb-14">
                        <div className="wallet-header text-white">
                            <div className="wallet-header-summary">
                                <div className="wallet-header-summary--assets">
                                    <div className="text-sm opacity-60">{t('wallet:total_balance')}</div>
                                    <div className="mb-2.5">
                                        <span
                                            className="text-lg lg:text-4xl font-bold mr-2"
                                        >
                                            {
                                                loadingAssetValue
                                                    ? <TextLoader height={40} />
                                                    : (totalWallet ? `~${formatWallet(totalWallet, 0)}` : '0')
                                            }

                                        </span>
                                        <span className="wallet-header-currency text-lg font-semibold">{quoteAsset}
                                        </span>
                                    </div>
                                </div>
                                {/* <div className="wallet-header-summary--divider" /> */}
                                {/* <div className="wallet-header-summary--pnl opacity-80">
                                    <span>{t('wallet:pnl_analytic')}:&nbsp;</span>
                                    <span>
                                        {
                                            loadingPortfolio
                                                ? <TextLoader height={18} />
                                                : allWalletPnL24h
                                        }
                                    </span>
                                </div> */}
                            </div>
                            <div className="wallet-header-actions lg:mt-0 mt-10 grid md:grid-cols-2 gap-x-2 gap-y-2">
                                <Link href="/wallet/spot/withdraw/fiat/VNDC" locale={locale} prefetch={false}>
                                    <button className="btn btn-outline-primary-light mr-2 btn-withdraw" type="button">
                                        {t('common:withdraw')}
                                    </button>
                                </Link>
                                <Link href="/wallet/spot/deposit/fiat/VNDC" locale={locale} prefetch={false}>
                                    <button className="btn btn-primary-light btn-deposit" type="button">
                                        {t('common:deposit')}
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="wallet-body mt-8">
                            <ul className="tabs wallet-body-padding-x">
                                {tabs.filter(tab => tab !== 'earn' && tab !== 'membership').map((tab, index) => (
                                    <li className="tab-item" key={index}>
                                        <Link href={`/wallet/${tab}`} locale={locale}>
                                            <a
                                                className={'mr-10 tab-link font-semibold ' + (walletType === QueryWalletType[tab] ? 'active text-black-700' : 'text-black-400')}
                                                onClick={() => setWalletType(QueryWalletType[tab])}
                                            > {t(`wallet:${tab}`)}
                                            </a>
                                        </Link>
                                    </li>
                                ))}
                                <div className="flex-grow" />
                                <li className="tab-item">
                                    <Link href="/wallet/history">
                                        <span className="ml-2 tab-link text-violet font-bold">
                                            {t('common:transaction_history')}
                                        </span>
                                    </Link>
                                </li>
                            </ul>
                            <div className="wallet-body-padding-x tab-content py-8">

                                <div className="flex flex-col md:flex-row mb-8 justify-between">
                                    <div className="grid lg:grid-cols-2 gap-x-2 md:mb-0 mb-5">
                                        <div className="md:mr-20">
                                            <div className="text-sm md:mr-2 h-8 flex items-center">
                                                {t('wallet:wallet_balance')}
                                            </div>

                                            {
                                                loadingAssetValue
                                                    ? <TextLoader height={32} width={120} />
                                                    : (
                                                        <div className="font-bold">
                                                            <span className="text-lg md:text-3xl mr-2">
                                                                {walletType.toLowerCase() === 'spot' && (spotWalletValue > 0 ? `~${formatWallet(spotWalletValue, 0)}` : '0')}
                                                                {walletType.toLowerCase() === 'broker' && (brokerWalletValue > 0 ? `~${formatWallet(brokerWalletValue, 0)}` : '0')}

                                                            </span>
                                                            <span>{quoteAsset}</span>
                                                        </div>
                                                    )
                                            }
                                        </div>

                                        {/* {
                                            walletType === 'SPOT'
                                            &&
                                            <div>

                                                <div className="text-sm h-8 flex items-center">
                                                    {t('wallet:pnl_analytic')}
                                                    {currentPnL24h}
                                                </div>
                                                {
                                                    loadingPortfolio
                                                        ? <TextLoader height={32} width={120} />
                                                        : (
                                                            <div className="font-bold">
                                                                <span className="text-lg md:text-3xl mr-2">{formatWallet(currentPnL24hValue, 0, true)}
                                                                </span>
                                                                <span>{quoteAsset}</span>
                                                            </div>
                                                        )
                                                }
                                            </div>

                                        } */}

                                    </div>
                                    <div className="grid items-center mb-2 gap-x-2">
                                        <div className="form-group md:w-[240px]">
                                            <div className="input-group">
                                                <input
                                                    className="form-control form-control-sm"
                                                    type="text"
                                                    placeholder={t('wallet:search_asset')}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                />

                                                <div
                                                    className="input-group-append px-3 flex-shrink-0 w-[60px] flex justify-end items-center"
                                                >
                                                    <span className="input-group-text text-black-500">
                                                        <IconSearch />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox rounded text-violet"
                                                onChange={(e) => setSmallBalanceDisplay(e?.target?.checked ? 'hide' : 'show')}
                                                checked={smallBalanceDisplay === 'hide'}
                                            />
                                            <span
                                                className="ml-2 text-sm text-black"
                                            >{t('wallet:hide_small_balance')}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <DataTable
                                        data={filterUserBalances}
                                        columns={columns}
                                        sortIcon={<div className="mx-1"><IconSort /></div>}
                                        defaultSortField="value"
                                        className="ats-table"
                                        defaultSortAsc={false}
                                        noHeader
                                        customStyles={customStyles}
                                        overflowY // prevent clipping menu
                                        overflowYOffset="0px"
                                        noDataComponent={<TableNoData />}
                                        progressPending={!(wallet?.[walletType] && Object.keys(wallet?.[walletType]).length)}
                                        progressComponent={<TableLoader />}
                                        onChangeRowsPerPage={(rows) => setRowsPerPage(rows)}
                                        pagination
                                        paginationPerPage={rowsPerPage}
                                        paginationRowsPerPageOptions={[10, 30, 50]}
                                    />
                                </div>
                                <div ref={ref}>
                                    <Transition
                                        show={isComponentVisible}
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <div
                                            style={width > 1080 ? { top: `${popUpPosition[0]}px`, left: `${popUpPosition[3]}px` } : { top: `${popUpPosition[0]}px`, left: `${popUpPosition[3] - 170}px` }}
                                            className="absolute w-32 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-xl shadow-lg focus:outline-none z-10"
                                        >
                                            <div className="">
                                                <div>
                                                    <ItemBtn
                                                        href={`/wallet/spot/withdraw/crypto/${selectedItem?.assetCode}`}
                                                        type="button"
                                                        className="text-black group flex hover:rounded-md items-center w-full px-3 py-2 text-sm border-b font-medium transition-all"

                                                    >
                                                        {t('common:send')}
                                                    </ItemBtn>
                                                </div>
                                                <div>
                                                    <ItemBtn
                                                        href={`/wallet/spot/deposit/crypto/${selectedItem?.assetCode}`}
                                                        type="button"
                                                        className="text-black group flex hover:rounded-md items-center w-full px-3 py-2 text-sm border-b font-medium transition-all"
                                                    >
                                                        {t('common:receive')}
                                                    </ItemBtn>
                                                </div>
                                                <div>
                                                    <ItemBtn
                                                        href={`/wallet/transfer?coin=${selectedItem?.assetCode}&from=${walletType}`}
                                                        type="button"
                                                        className="text-black group flex rounded-md items-center w-full px-3 py-2 text-sm font-medium transition-all border-b"
                                                    >
                                                        {t('wallet:transfer')}
                                                    </ItemBtn>
                                                </div>
                                                {
                                                    !['USDT', 'VNDC'].includes(selectedItem?.assetCode) && (
                                                        <div>
                                                            <ItemBtn
                                                                href={`/spot/${selectedItem?.assetCode}_${quoteAsset}`}
                                                                type="button"
                                                                className="text-black group flex rounded-md items-center w-full px-3 py-2 text-sm font-medium transition-all"
                                                            >
                                                                {t('wallet:trade')}
                                                            </ItemBtn>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </Transition>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </LayoutWithHeader>
        </>
    );
};

export async function getServerSideProps({ locale, params }) {
    const { id } = params;
    const errorCode = Object.prototype.hasOwnProperty.call(QueryWalletType, id) ? false : 404;
    return {
        props: {
            errorCode,
            id,
            ...await serverSideTranslations(locale, ['common', 'navbar', 'wallet', '404', 'footer', 'spot']),
        },
    };
}

export default Wallet;
