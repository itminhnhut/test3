import Select from 'components/common/input/Select';
import LayoutWithHeader from 'components/common/layouts/layoutWithHeader';
import NotKYC from 'components/convert/NotKYC';
import SearchInput from 'components/markets/SearchInput';
import AssetLogo from 'components/wallet/AssetLogo';
import DepositWithdrawBankHistory from 'components/wallet/DepositWithdrawBankHistory';
import DetailDepositBank from 'components/wallet/DetailDepositBank';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import { ApiStatus, KYC_STATUS } from 'src/redux/actions/const';
import AuthSelector from 'src/redux/selectors/authSelectors';
import fetchAPI from 'utils/fetch-api';

const Deposit = () => {
    const { t } = useTranslation();
    const [selectedBank, setSelectedBank] = useState({});
    const [bankInFo, setBankInFo] = useState({ list_bank: [] });
    const [amount, setAmount] = useState();
    const [step, setStep] = useState(1);
    const [order, setOrder] = useState({});
    const [errors, setErrors] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingBanks, setLoadingBanks] = useState(false);
    const [activeTab, setActiveTab] = useState('VNDC');
    const [filteredAssetList, setFilteredAssetList] = useState([]);
    const [baseAssetList, setBaseAssetList] = useState([]);

    const assetConfigList = useSelector(state => state?.utils?.assetConfig ?? []);

    const kycStatus = useSelector(AuthSelector.userKycStatusSelector);
    const getBankInfo = async () => {
        setLoadingBanks(true);
        const {
            data,
            status,
        } = await fetchAPI({
            url: '/api/v1/deposit/bank_info',
            options: {
                method: 'GET',
            },
        });
        if (status === ApiStatus.SUCCESS) {
            setErrors({});
            setBankInFo(data);
            setSelectedBank(data?.list_bank?.[0] || {});
            setLoadingBanks(false);
        }
    };

    const postBank = async () => {
        const {
            minAmountVNDC,
            maxAmountVNDC,
        } = bankInFo;
        setErrors({});
        if (amount < +minAmountVNDC) {
            return setErrors({ min: minAmountVNDC });
        }
        if (amount > +maxAmountVNDC) {
            return setErrors({ max: maxAmountVNDC });
        }

        if (isEmpty(selectedBank)) {
            return setErrors({ selectedBank: t('wallet:errors.selected_bank') });
        }

        setLoading(true);
        const { data, status } = await fetchAPI({
            url: '/api/v1/deposit/bank_deposit',
            options: {
                method: 'POST',
            },
            params: {
                bankCode: selectedBank?.bank_code,
                amount,
            },
        });
        if (status === ApiStatus.SUCCESS) {
            setOrder(data);
            setStep(2);
        }
        return setLoading(false);
    };

    const resetState = async () => {
        setStep(1);
        setAmount(0);
    };

    useEffect(() => {
        getBankInfo();
    }, []);

    useEffect(() => {
        const list = [...assetConfigList];
        setFilteredAssetList(list);
        setBaseAssetList(list);
    }, [assetConfigList]);

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

    const renderTab = () => {
        if (activeTab === 'VNDC') {
            return (
                <>
                    {step === 1 ? (
                        <div className="card-body !py-12 !px-8">
                            <div className="form-group">
                                <label>{t('wallet:select_bank')}</label>
                                <Select
                                    options={bankInFo?.list_bank?.map(e => ({ ...e, label: e.bank_name }))}
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
                                        placeholder={t('wallet:input_amount')}
                                        decimalScale={10}
                                        thousandSeparator
                                        allowNegative={false}
                                        value={amount}
                                        onValueChange={({ value }) => {
                                            setAmount(value);
                                        }}
                                    />
                                    <div className="input-group-append">
                                        <button className="btn" type="button">
                                            <span className="input-group-text text-violet-700 font-semibold">
                                                VNDC
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                <div className="text-xs text-red mt-2">
                                    {/* eslint-disable-next-line no-nested-ternary */}
                                    {errors.hasOwnProperty('min') ? t('convert:errors.min', { amount: errors.min }) : errors.hasOwnProperty('max') ? t('errors.max', { amount: errors.max }) : null}
                                </div>
                            </div>
                            <div className="mt-8">
                                <button
                                    className="btn btn-primary w-full"
                                    type="button"
                                    disabled={loading}
                                    onClick={postBank}
                                >{t('wallet:deposit')}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <DetailDepositBank
                            order={order}
                            onClose={() => {
                                setStep(1);
                                setAmount('');
                            }}
                        />
                    )}
                </>
            );
        }

        // const defaultCryptoList = ['ATS', 'BTC', 'BNB', 'ETH', 'USDT'];
        return (
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
                        {filteredAssetList.sort((a, b) => a.assetCode.localeCompare(b.assetCode)).map(asset => (
                            <Fragment key={asset.assetCode}>
                                <Link href={`/wallet/spot/deposit/crypto/${asset?.assetCode}`} shallow>
                                    <div className="flex flex-row items-center hover:bg-[#F7F6FD] py-1 px-8 cursor-pointer">
                                        <AssetLogo assetCode={asset?.assetCode} assetId={asset?.id} />
                                        <div className="flex flex-col ml-3">
                                            <p className="text-textPrimaryColor font-semibold text-sm">{asset?.assetCode}</p>
                                            <p className="text-textSecondaryColor text-xs">{asset?.assetName}</p>
                                        </div>
                                    </div>
                                </Link>
                            </Fragment>
                        ))}
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
                        {t('wallet:deposit')}
                    </div>
                    <div className="text-lg text-black-400">
                        {t('wallet:deposit_vndc_desc')}
                    </div>
                </div>
                {kycStatus === KYC_STATUS.ADVANCE_KYC
                    ? (
                        <div className="convert-container mb-[6.25rem] ">
                            <div className="flex items-center justify-center my-6">
                                <div className="flex items-center justify-between bg-[#EEF2FA] rounded-md text-sm p-1 w-[400px] max-w-[400px]">
                                    <button type="button" onClick={() => handleChangeTab('VNDC')} className={`flex-1 h-full rounded-[4px] font-bold px-[20px] py-2 ${activeTab === 'VNDC' ? 'bg-white' : 'text-[#8B8C9B]'}`} style={activeTab === 'VNDC' ? { boxShadow: '0px 1px 2px 1px rgba(0, 0, 0, 0.05)' } : null}>{t('common:buy')} VNDC</button>
                                    <button type="button" onClick={() => handleChangeTab('crypto')} className={`flex-1 h-full rounded-[4px] font-bold px-[20px] py-2 ${activeTab === 'crypto' ? 'bg-white' : 'text-[#8B8C9B]'}`} style={activeTab === 'crypto' ? { boxShadow: '0px 1px 2px 1px rgba(0, 0, 0, 0.05)' } : null}>Crypto</button>
                                </div>
                            </div>
                            <div className="card card-shadow bg-white rounded-xl lg:w-[480px] mx-auto mb-10">
                                {renderTab()}
                            </div>
                            {
                                step === 1 && <DepositWithdrawBankHistory id={order._id} />
                            }
                        </div>
                    )
                    :
                    (
                        <div className="lg:w-[840px] mx-auto">
                            <NotKYC type="deposit" />
                        </div>
                    )}

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

export default Deposit;
