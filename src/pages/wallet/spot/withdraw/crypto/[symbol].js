/* eslint-disable no-nested-ternary */
import { Listbox, Transition } from '@headlessui/react';
import { IconArrowDown, IconArrowLeft } from 'components/common/Icons';
import find from 'lodash/find';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import NumberFormat from 'react-number-format';
import { useDispatch, useSelector } from 'react-redux';
import LayoutWithHeader from 'src/components/common/layouts/layoutWithHeader';
import TableNoData from 'src/components/common/table/TableNoData';
import TableLoader from 'src/components/loader/TableLoader';
import GoogleAuthModalWrapper from 'src/components/security/GoogleAuthModal';
import StatusWithdraw from 'src/components/wallet/StatusWithdraw';
import { tableStyle } from 'src/config/tables';
import { ApiStatus, SECURITY_VERIFICATION } from 'src/redux/actions/const';
import { getWithdrawOnchainCheckPassId, withdrawOnchain } from 'src/redux/actions/user';
import { formatTime, formatWallet } from 'src/redux/actions/utils';
import AuthSelector from 'src/redux/selectors/authSelectors';
import showNotification from 'src/utils/notificationService';
import fetchAPI from 'utils/fetch-api';

const WithdrawCrypto = ({ symbol, depositConfig }) => {
    const router = useRouter();
    const { t } = useTranslation();
    const [errors, setErrors] = useState({});
    const [amount, setAmount] = useState(0);
    const [withdrawTo, setWithdrawTo] = useState('');
    const [tag, setTag] = useState('');
    const [selectedNetwork, setSelectedNetwork] = useState({});
    const [networks, setNetworks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [history, setHistory] = useState([]);
    const [activeModal, setActiveModal] = useState(false);
    const [securityMethods, setSecurityMethods] = useState([]);
    const [checkPassId, setCheckPassId] = useState('');
    const [submitData, setSubmitData] = useState({});

    const assetConfig = useSelector(state => state.utils.assetConfig);
    const wallets = useSelector(state => state.wallet.SPOT);
    const user = useSelector(AuthSelector.userSelector);

    const asset = assetConfig.find(e => e.assetCode === symbol.toUpperCase()) || {};
    const { networkList } = depositConfig[asset.id] || { networkList: [] };
    const availableBalance = wallets?.[asset.id]?.value - wallets?.[asset.id]?.lockedValue;

    const dispatch = useDispatch();

    const getDepositHistory = async () => {
        setLoadingHistory(true);
        const { data, status } = await fetchAPI({
            url: '/api/v1/deposit/deposit_withdraw_history',
            options: {
                method: 'GET',
            },
            params: {
                type: 2,
                assetId: asset.id,
                transactionType: 'on-chain',
            },
        });
        if (status === ApiStatus.SUCCESS) {
            setHistory(data);
            setLoadingHistory(false);
        }
    };

    useEffect(() => {
        if (networkList.length) {
            const _networks = networkList.filter(e => (e.network !== 'bank-transfer') && (e.network !== 'off-chain'));
            setNetworks(_networks);
            if (_networks.length) {
                const defaultNetwork = _networks.filter(net => net?.isDefault === true,
                )?.[0];
                setSelectedNetwork(defaultNetwork ?? _networks[0]);
            }
        }
    }, [networkList]);

    useEffect(() => {
        if (asset?.id) {
            getDepositHistory();
        }
    }, [asset?.id]);

    const customStyles = {
        ...tableStyle,
    };

    const columns = useMemo(() => [
        {
            name: t('time'),
            selector: 'createdAt',
            ignoreRowClick: true,
            omit: false,
            cell: (row) => formatTime(row.createdAt),
        },
        {
            name: 'Token',
            selector: 'coin',
            ignoreRowClick: true,
            right: true,
            cell: (row) => <span>{symbol}</span>,
        },
        {
            name: t('amount'),
            selector: 'amount',
            ignoreRowClick: true,
            right: true,
            cell: (row) => <span>-{formatWallet(row.amount)} {symbol}</span>,
        },
        {
            name: t('status'),
            selector: 'status',
            ignoreRowClick: true,
            right: true,
            cell: (row) => <StatusWithdraw status={row.status} />,
        },
    ], [assetConfig]);

    const handleOnClose = () => {
        setActiveModal(false);
        setLoading(false);
    };

    const renderErrorNotification = (errorCode) => {
        const error = find(Error, { code: errorCode });
        const description = error
            ? t(`error:${error.message}`)
            : t('error:COMMON_ERROR');
        return showNotification({ message: `(${errorCode}) ${description}`, title: t('common:failure'), type: 'failure' });
    };

    const renderPopupSuccess = () => {
        showNotification({ message: t('wallet:withdraw_success_title'), title: t('common:success'), type: 'success' });
        handleOnClose();
    };

    const handleConfirmSecure = async () => {
        const result = await dispatch(await withdrawOnchain({ ...submitData, checkpassId: checkPassId }));
        if (result) {
            await setLoading(false);
            return renderErrorNotification(result);
        }
        renderPopupSuccess();
        getDepositHistory();
        setAmount(0);
        return setTimeout(setLoading(false), 1000);
    };

    const postWithdraw = async () => {
        setErrors({});
        const addressRegex = new RegExp(selectedNetwork.addressRegex);

        let validMemo = true;
        if (selectedNetwork?.memoRegex && selectedNetwork?.memoRegex.length) {
            const memoRegex = new RegExp(selectedNetwork.memoRegex);
            if (!memoRegex.test(tag)) validMemo = false;
        }

        if (!addressRegex.test(withdrawTo) || withdrawTo.length === 0) {
            return setErrors({ invalid_address: true });
        }
        if (!validMemo) {
            return setErrors({ invalid_memo: true });
        }
        if (amount < +selectedNetwork.withdrawMin) {
            return setErrors({ min: formatWallet(selectedNetwork.withdrawMin) });
        }
        if (amount > Math.min(+selectedNetwork.withdrawMax, availableBalance)) {
            return setErrors({ max: formatWallet(Math.min(+selectedNetwork.withdrawMax, availableBalance)) });
        }

        const data = {
            assetId: asset.id,
            amount: +amount,
            network: selectedNetwork.network,
            withdrawTo,
            tag,
        };
        await setLoading(true);
        setSubmitData(data);
        const result = await dispatch(await getWithdrawOnchainCheckPassId(data));
        await setLoading(false);
        if (result?._id) {
            await setCheckPassId(result?._id);
            await setSecurityMethods(result?.securityMethods);
            return setActiveModal(true);
        }
        return renderErrorNotification(result);
    };

    return (
        <LayoutWithHeader>
            {activeModal && <GoogleAuthModalWrapper
                user={user}
                closeModal={handleOnClose}
                authType={SECURITY_VERIFICATION.WITHDRAW_ONCHAIN}
                securityMethods={securityMethods}
                email={securityMethods.filter(method => method.name === 'Email')?.[0]?.target}
                phone={securityMethods.filter(method => method.name === 'Phone')?.[0]?.target}
                checkPassId={checkPassId}
                confirmSecure={handleConfirmSecure}
            />}
            <div className="flex flex-1 items-center flex-col mt-10">
                <div className="wallet-container-withdraw w-full">

                    <div className="flex items-center mb-8 cursor-pointer" aria-hidden role="button" onClick={() => router?.back()}>
                        <button className="btn btn-icon -ml-1 mr-4 !p-0 !text-[#4021D0]" type="button">
                            <IconArrowLeft width={16} height={20} />
                        </button>
                        <div className="font-bold text-[#4021D0]">
                            {t('common:back')}
                        </div>
                    </div>

                    <div className="card card-shadow bg-white withdraw-form rounded-3xl mb-10">
                        <div className="form-group">
                            <label>{t('wallet:receiver_address')}</label>
                            <input
                                type="text"
                                className={`form-control form-control-lg ${errors.invalid_address ? 'is-error' : ''}`}
                                placeholder={t('wallet:receiver_address_placeholder')}
                                value={withdrawTo}
                                onChange={(e) => setWithdrawTo(e.target.value)}
                            />
                            {
                                errors.invalid_address ? (
                                    <div className="text-xs text-red mt-2">
                                        {t('convert:errors.invalid_address')}
                                    </div>
                                ) : null
                            }
                        </div>

                        {
                            selectedNetwork?.memoRegex
                            &&
                            <div className="form-group">
                                <label>{t('wallet:receiver_memo')}</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-lg ${errors.invalid_memo ? 'is-error' : ''}`}
                                    value={tag}
                                    onChange={(e) => setTag(e.target.value)}
                                />
                                {
                                    errors.invalid_memo ? (
                                        <div className="text-xs text-red mt-2">
                                            {t('convert:errors.invalid_memo')}
                                        </div>
                                    ) : null
                                }
                            </div>
                        }
                        <div className="form-group">
                            <label>{t('wallet:blockchain_network')}</label>
                            <Listbox value={selectedNetwork} onChange={setSelectedNetwork}>
                                {({ open }) => (
                                    <>
                                        <div className="relative mt-1">
                                            <Listbox.Button
                                                className="relative w-full form-control form-control-lg border text-left"
                                            >
                                                <span className="block truncate">{selectedNetwork.name}</span>
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
                                                    {networks.map((network, index) => (
                                                        <Listbox.Option
                                                            key={index}
                                                            className={({ active }) => `${active ? 'text-white bg-violet-700' : ''} cursor-pointer select-none relative px-4 py-3 rounded-lg`}
                                                            value={network}
                                                        >
                                                            {({ selected, active }) => (
                                                                <>
                                                                    <span
                                                                        className={`${
                                                                            selected ? 'font-semibold' : 'font-normal'
                                                                        } block truncate`}
                                                                    >
                                                                        {network.name}
                                                                    </span>
                                                                    {selected ? (
                                                                        <span
                                                                            className={`${active ? 'text-violet-600' : 'text-white'} absolute inset-y-0 left-0 flex items-center pl-3`}
                                                                        />
                                                                    ) : null}
                                                                </>
                                                            )}
                                                        </Listbox.Option>
                                                    ))}
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    </>
                                )}
                            </Listbox>
                        </div>
                        <div className="form-group">
                            <label htmlFor="amount">
                                {t('common:amount')}
                            </label>
                            <div className={`input-group relative ${(errors.min || errors.max) ? 'is-error' : ''}`}>
                                <NumberFormat
                                    className="form-control form-control-lg"
                                    placeholder={t('placeholder')}
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
                            <span className="text-black-600">{t('common:fee')}: </span>
                            <span className="font-semibold">
                                {formatWallet(selectedNetwork?.withdrawFee)} {symbol}
                            </span>
                        </div>
                        <div className="mt-3 text-xs">
                            <span className="text-black-600">{t('wallet:available_balance')}: </span>
                            <span className="font-semibold">
                                {formatWallet(availableBalance)} {symbol}
                            </span>
                        </div>
                        <div className="mt-3 text-xs">
                            <span className="text-black-600">{t('common:min')}: </span>
                            <span className="font-semibold">
                                {formatWallet(selectedNetwork?.withdrawMin)} {symbol}
                            </span>
                        </div>
                        <div className="mt-3 text-xs">
                            <span className="text-black-600">{t('common:max')}: </span>
                            <span className="font-semibold">
                                {formatWallet(selectedNetwork?.withdrawMax)} {symbol}
                            </span>
                        </div>
                        <div className="mt-8">
                            <button
                                className="btn btn-primary w-full"
                                type="button"
                                onClick={postWithdraw}
                                disabled={loading || !selectedNetwork.withdrawEnable}
                            >
                                {t('common:send')}
                            </button>
                        </div>
                        { !selectedNetwork.withdrawEnable && (
                            <div className="mt-3 text-xs">
                                <span className="text-violet">{t('wallet:withdraw_enable_warn.first')} {symbol} {t('wallet:withdraw_enable_warn.second')} {selectedNetwork.name} {t('wallet:withdraw_enable_warn.last')}</span>
                            </div>
                        )}
                    </div>
                    <div className="card bg-white rounded-3xl mb-8">
                        <div className="card-header">
                            <div className="card-header-text">{t('wallet:sending_history')}</div>
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
                            />
                        </div>
                    </div>
                </div>
            </div>
        </LayoutWithHeader>
    );
};

export async function getServerSideProps({ params, locale }) {
    const { data } = await fetchAPI({
        url: '/api/v1/deposit/config',
        options: {
            method: 'GET',
        },
    });
    return {
        props: {
            depositConfig: data || {},
            symbol: params.symbol,
            ...await serverSideTranslations(locale, ['common', 'navbar', 'wallet', 'convert', 'error', 'profile']),
        },
    };
}

export default WithdrawCrypto;
