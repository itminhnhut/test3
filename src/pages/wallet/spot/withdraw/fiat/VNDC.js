import { IconLock } from 'components/common/Icons';
import NotKYC from 'components/convert/NotKYC';
import SearchInput from 'components/markets/SearchInput';
import AssetLogo from 'components/wallet/AssetLogo';
import compact from 'lodash/compact';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import { QueryWalletType } from 'redux/actions/const';
import Select from 'src/components/common/input/Select';
import LayoutWithHeader from 'src/components/common/layouts/layoutWithHeader';
import DepositWithdrawBankHistory from 'src/components/wallet/DepositWithdrawBankHistory';
import * as Error from 'src/redux/actions/apiError';
import { ApiStatus, KYC_STATUS } from 'src/redux/actions/const';
import { formatWallet, getAssetId } from 'src/redux/actions/utils';
import AuthSelector from 'src/redux/selectors/authSelectors';
import fetchAPI from 'utils/fetch-api';
import showNotification from 'utils/notificationService';

const WithdrawVNDC = () => {
    const { t } = useTranslation();
    const [selectedBank, setSelectedBank] = useState({});
    const [bankConfig, setBankConfig] = useState({});
    const [banks, setBanks] = useState([]);
    const [amount, setAmount] = useState(0);
    const [errors, setErrors] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingBanks, setLoadingBanks] = useState(false);
    const [id, setId] = useState(0);
    const wallets = useSelector(state => state.wallet.SPOT);
    const kycStatus = useSelector(AuthSelector.userKycStatusSelector);
    const assetId = getAssetId('VNDC');
    const availableBalance = wallets?.[assetId]?.value - wallets?.[assetId]?.lockedValue;
    const [activeTab, setActiveTab] = useState('VNDC');
    const [filteredAssetList, setFilteredAssetList] = useState([]);
    const [baseAssetList, setBaseAssetList] = useState([]);
    const [userBalances, setUserBalances] = useState([]);
    const [isUnderMaintenance, setIsUnderMaintenance] = useState(false);

    const assetConfigList = useSelector(state => state?.utils?.assetConfig ?? []);
    const wallet = useSelector(state => state.wallet) || null;

    const getUserBankConfig = async () => {
        setLoadingBanks(true);
        const {
            data,
            status,
        } = await fetchAPI({
            url: '/api/v1/deposit/data_for_bank_withdraw',
            options: {
                method: 'GET',
            },
        });
        if (status === ApiStatus.SUCCESS) {
            setBankConfig(data.withdrawConfig);
            setBanks(data.userBanks);
            setSelectedBank(data?.userBanks?.[0] || {});
            setLoadingBanks(false);
            setIsUnderMaintenance(data?.isOnline === false);
        }
    };

    const postBank = async () => {
        setErrors({});
        if (amount < +bankConfig.minAmountVNDC) {
            return setErrors({ min: formatWallet(bankConfig.minAmountVNDC) });
        }

        if (amount > Math.min(+bankConfig.maxAmountVNDC, availableBalance)) {
            return setErrors({ max: formatWallet(Math.min(+bankConfig.maxAmountVNDC, availableBalance)) });
        }

        if (isEmpty(selectedBank)) {
            return setErrors({ selectedBank: t('wallet:errors.selected_bank') });
        }

        setLoading(true);
        const { data, status, message, code } = await fetchAPI({
            url: '/api/v1/deposit/bank_withdraw',
            options: {
                method: 'POST',
            },
            params: {
                userBankId: selectedBank?._id,
                amount,
                submittedFee: 0,
            },
        });
        if (status === ApiStatus.SUCCESS) {
            showNotification({ message: t('wallet:withdraw_success'), title: t('common:success'), type: 'success' });
            setId(id + 1);
            return setLoading(false);
        }
        if (message === 'sellVNDCViaBankOffline') {
            showNotification({ message: t('wallet:bank_offline'), title: t('common:failed'), type: 'warning' });
        } else if (data?.remaining) {
            const error = find(Error, { code });
            const description = error
                ? t(`error:${error.message}`, { remaining: data?.remaining, asset: 'VNDC' })
                : t('wallet:withdraw_failed');
            showNotification({ message: `(${code}) ${description}`, title: t('common:failure'), type: 'failure' });
        } else {
            showNotification({ message: t('wallet:withdraw_failed'), title: t('common:failed'), type: 'warning' });
        }
        setId(id + 1);
        return setLoading(false);
    };
    useEffect(() => {
        getUserBankConfig();
    }, []);

    const walletType = QueryWalletType.spot;

    useEffect(() => {
        const balances = wallet[walletType];
        if (assetConfigList && assetConfigList.length && balances) {
            setUserBalances(assetConfigList.map(e => ({ ...e, ...balances && balances[e.id] ? balances[e.id] : {} })));
        }
    }, [assetConfigList, wallet, walletType]);

    useEffect(() => {
        let filterUserBalances = [];

        userBalances.forEach(asset => {
            const {
                walletType: _walletType,
            } = asset;
            if (_walletType !== walletType) return null;
            filterUserBalances.push(asset);
            return null;
        });
        filterUserBalances = compact(filterUserBalances);
        setFilteredAssetList(filterUserBalances);
        setBaseAssetList(filterUserBalances);
    }, [userBalances, walletType]);

    const handleFilterAssetsList = (value) => {
        let filtered = [];
        if (value.length === 0) {
            filtered = [...baseAssetList];
        } else {
            filtered = baseAssetList.filter(asset => asset.assetCode.toLowerCase().includes(value.toLowerCase()));
        }
        setFilteredAssetList(filtered);
    };

    const handleChangeTab = (tab) => {
        setActiveTab(tab);
    };

    const customAssetsStyle = {
        padding: '8px 16px',
        border: 'none',
    };

    const customAssetsWrapperStyle = {
        border: '1px solid #E1E2ED',
        margin: 0,
    };

    const renderMaintenance = () => {
        return (
            <div className="lg:w-[730px] mx-auto mt-20 mb-10 flex flex-col md:flex-row items-center justify-between">
                <p className="text-2xl mr-5 order-last text-center md:text-left md:order-first" style={{ fontWeight: 500 }}>Cổng bán VNDC hiện đang bảo trì, quý khách vui lòng quay trở lại sau ít phút.</p>
                <img src="/images/maintenance/maintenance.png" width={300} height={300} className="w-[300px] min-w-[300px]" />
            </div>
        );
    };

    const renderTab = () => {
        if (activeTab === 'VNDC') {
            return (
                <div className="card card-shadow bg-white rounded-xl lg:w-[480px] mx-auto mb-10">
                    <div className="card-body !py-12 !px-8">
                        <div className="form-group">
                            <label>{t('wallet:select_bank')}</label>
                            <Select
                                options={banks.map(e => ({ ...e, label: e.bankName }))}
                                onChange={setSelectedBank}
                                loading={loadingBanks}
                                error={errors?.selectedBank}
                            />
                            <div className="text-xs text-red mt-2">
                                {errors?.selectedBank ? t('wallet:errors.selected_bank') : null}
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="amount">
                                {t('common:amount')}
                            </label>
                            <div className={`input-group relative ${(errors.min || errors.max) ? 'is-error' : ''}`}>
                                <NumberFormat
                                    className="form-control form-control-lg"
                                    placeholder={t('wallet:placeholder')}
                                    decimalScale={10}
                                    thousandSeparator
                                    allowNegative={false}
                                    value={amount}
                                    onValueChange={({ value }) => {
                                        setAmount(value);
                                    }}
                                />
                                <div className="input-group-append">
                                    <button
                                        className="btn"
                                        type="button"
                                        onClick={() => setAmount(availableBalance)}
                                    >
                                        <span className="input-group-text text-violet-700 font-semibold">
                                            {t('common:max')}
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div className="text-xs text-red mt-2">
                                {errors.min ? t('convert:errors.min', { amount: errors.min }) : errors.max ? t('convert:errors.max', { amount: errors.max }) : null}
                            </div>
                        </div>
                        <div className="mt-3 text-xs">
                            <span className="text-black-600">
                                {t('wallet:available_balance')}:
                            </span>
                            <span className="font-semibold"> {formatWallet(availableBalance, 0)} VNDC</span>
                        </div>
                        <div className="mt-3 text-xs">
                            <span className="text-black-600">
                                {t('common:transaction_fee')}:
                            </span>
                            <span className="font-semibold"> 0 VNDC</span>
                        </div>
                        <div className="mt-3 text-xs">
                            <span className="text-black-600">
                                {t('common:min')}:
                            </span>
                            <span className="font-semibold"> {formatWallet(bankConfig.minAmountVNDC, 0)} VNDC</span>
                        </div>
                        <div className="mt-3 text-xs">
                            <span className="text-black-600">{t('wallet:max')}: </span>
                            <span className="font-semibold">{formatWallet(bankConfig.maxAmountVNDC, 0)} VNDC</span>
                        </div>
                        {console.log(isEmpty(bankConfig))}
                        <div className="mt-8">
                            <button
                                className="btn btn-primary w-full"
                                type="button"
                                disabled={loading || isEmpty(bankConfig)}
                                onClick={postBank}
                            >{t('wallet:withdraw')}
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        // const defaultCryptoList = ['ATS', 'BTC', 'BNB', 'ETH', 'USDT'];
        return (
            <div className="card card-shadow bg-white rounded-xl lg:w-[480px] mx-auto mb-10">
                <div className="card-body !pt-5 !px-0 min-h-[463px] h-[463px]">
                    <div className="px-8 mb-4">
                        <p className="font-bold text-lg mb-4">{t('wallet:crypto_select')}</p>
                        <SearchInput
                            placeholder={t('common:search')}
                            customStyle={customAssetsStyle}
                            customAssetsWrapperStyle={customAssetsWrapperStyle}
                            handleFilterAssetsList={handleFilterAssetsList}
                        />
                    </div>
                    <div>
                        <p className="px-8 text-[#8B8C9B] text-sm">{t('wallet:crypto_list')}</p>
                        <div className="h-[280px] overflow-y-auto mt-4">
                            {filteredAssetList.sort((a, b) => b.value - a.value).map(asset => (
                                <Fragment key={asset.assetCode}>
                                    <Link href={`/wallet/spot/withdraw/crypto/${asset?.assetCode}`} shallow>
                                        <div className="flex flex-row items-center justify-between hover:bg-[#F7F6FD] py-1 px-8 cursor-pointer">
                                            <div className="flex flex-row items-center">
                                                <AssetLogo assetCode={asset?.assetCode} assetId={asset?.id} />
                                                <div className="flex flex-col ml-3">
                                                    <p className="text-textPrimaryColor font-semibold text-sm">{asset?.assetCode}</p>
                                                    <p className="text-textSecondaryColor text-xs">{asset?.assetName}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold">{formatWallet(asset.value - asset.lockedValue)}</p>
                                                {asset.lockedValue > 0 && <p className="text-xs text-[#8B8C9B] inline-flex items-center"><span className="mr-1"><IconLock /></span> <span>{formatWallet(asset.lockedValue)}</span></p>}
                                            </div>
                                        </div>
                                    </Link>
                                </Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <LayoutWithHeader>
            <div className="flex flex-col flex-grow">
                <div className="convert-header py-[3.75rem]">
                    <div className="text-4xl text-white">
                        {t('wallet:withdraw')}
                    </div>
                    <div className="text-lg text-black-400">
                        {t('wallet:withdraw_vndc_desc')}
                    </div>
                </div>
                <div className="convert-container mb-[6.25rem] ">
                    {(kycStatus === KYC_STATUS.APPROVED || kycStatus === KYC_STATUS.ADVANCE_KYC) ? (
                        <>
                            <div className="flex items-center justify-center my-6">
                                <div className="flex items-center justify-between bg-[#EEF2FA] rounded-md text-sm p-1 w-[400px] max-w-[400px]">
                                    <button type="button" onClick={() => handleChangeTab('VNDC')} className={`flex-1 h-full rounded-[4px] font-bold px-[20px] py-2 ${activeTab === 'VNDC' ? 'bg-white' : 'text-[#8B8C9B]'}`} style={activeTab === 'VNDC' ? { boxShadow: '0px 1px 2px 1px rgba(0, 0, 0, 0.05)' } : null}>{t('common:sell')} VNDC</button>
                                    <button type="button" onClick={() => handleChangeTab('crypto')} className={`flex-1 h-full rounded-[4px] font-bold px-[20px] py-2 ${activeTab === 'crypto' ? 'bg-white' : 'text-[#8B8C9B]'}`} style={activeTab === 'crypto' ? { boxShadow: '0px 1px 2px 1px rgba(0, 0, 0, 0.05)' } : null}>Crypto</button>
                                </div>
                            </div>
                            {isUnderMaintenance && activeTab === 'VNDC' ? renderMaintenance() : (
                                <>
                                    {renderTab()}
                                    <DepositWithdrawBankHistory id={id} />
                                </>
                            )}
                        </>
                    ) : (
                        <div className="lg:w-[840px] mx-auto">
                            <NotKYC />
                        </div>
                    )}
                </div>
            </div>
        </LayoutWithHeader>
    );
};

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...await serverSideTranslations(locale, ['common', 'navbar', 'wallet', 'error', 'convert']),
        },
    };
}

export default WithdrawVNDC;
