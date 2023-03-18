import Image from 'next/image';
import { getS3Url } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { useState, useEffect, useMemo } from 'react';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import SearchBoxV2 from 'components/common/SearchBoxV2';
import { API_DEFAULT_BANK_USER, API_GET_USER_BANK_LIST, API_GET_BANK_ACCOUNT_NAME, API_GET_BANK_AVAILABLE } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import fetchAPI from 'utils/fetch-api';
import ModalNeedKyc from 'components/common/ModalNeedKyc';
import TagV2 from 'components/common/V2/TagV2';
import RePagination from 'components/common/ReTable/RePagination';
import ModalAddPaymentMethod from './ModalAddPaymentMethod';

const LIMIT_ROW = 5;

const index = () => {
    const [search, setSearch] = useState('');
    const user = useSelector((state) => state.auth?.user);
    const isOpenModalKyc = useMemo(() => {
        return user ? user?.kyc_status !== 2 : false;
    }, [user]);

    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [listUserBank, setListUserBank] = useState([]);
    const [dataTable, setDataTable] = useState([]);
    const [listBankAvailable, setListBankAvailable] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpenModalAddNew, setIsOpenModalAddNew] = useState(false);

    useEffect(() => {
        setLoading(true);

        // Fetch list bank accounts
        fetchAPI({
            url: API_GET_USER_BANK_LIST,
            options: {
                method: 'GET'
            }
        })
            .then(({ status, data }) => {
                if (status === ApiStatus.SUCCESS) data ? setListUserBank(data) : setListUserBank([]);
            })
            .finally(() => setLoading(false));

        fetchAPI({
            url: API_GET_BANK_AVAILABLE,
            options: {
                method: 'GET'
            }
        })
            .then(({ status, data }) => {
                if (status === ApiStatus.SUCCESS) {
                    // setKyc(data);
                    data ? setListBankAvailable(data) : setListBankAvailable([]);
                }

                // mock data:
                setListUserBank(
                    data.map((bankAvai, idx) => ({
                        _id: idx,
                        bankName: bankAvai.bank_name,
                        bankLogo: bankAvai.logo,
                        bankKey: bankAvai.bank_key,
                        bankCode: bankAvai.bank_code,
                        accountNumber: idx + 1 + '',
                        isDefault: idx === 0
                    }))
                );

                setDataTable(
                    data.map((bankAvai, idx) => ({
                        _id: idx,
                        bankName: bankAvai.bank_name,
                        bankLogo: bankAvai.logo,
                        bankKey: bankAvai.bank_key,
                        bankCode: bankAvai.bank_code,
                        accountNumber: idx + 1 + '',
                        isDefault: idx === 0
                    }))
                );
            })
            .finally(() => {});
    }, []);

    useEffect(() => {
        setDataTable(
            listUserBank.filter(
                (item) => item.bankKey.toLowerCase().includes(search.toLowerCase()) || item.bankName.toLowerCase().includes(search.toLowerCase())
            )
        );
        setCurrentPage(1);
    }, [search]);

    const handleSetDefault = (bankAccountId) => {
        console.log('hello from ', bankAccountId);
    };

    const _onChangePage = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="mt-[58px] text-gray-15 dark:text-gray-4 font-semibold text-base">
            <div className="w-full flex items-center justify-between">
                <h1 className="text-[32px] leading-[38px]">{t('payment-method:payment_method')}</h1>
                <div className="flex gap-x-4">
                    <SearchBoxV2
                        wrapperClassname="w-[360px]"
                        value={search}
                        onChange={(value) => {
                            setSearch(value);
                        }}
                    />
                    <ButtonV2 onClick={() => setIsOpenModalAddNew(true)} className="w-auto whitespace-nowrap px-6">
                        {t('payment-method:add')}
                    </ButtonV2>
                </div>
            </div>

            <div className="mt-12 flex flex-col gap-y-6">
                {dataTable.map((bankAccount, index) => {
                    // 5 * 2 =10
                    const hidden = index >= currentPage * LIMIT_ROW || index < (currentPage - 1) * LIMIT_ROW;
                    if (hidden) return null;
                    return (
                        <div
                            key={bankAccount?._id}
                            className="dark:bg-dark-4 hover:bg-gray-13 dark:hover:bg-hover-dark rounded-xl border border-divider dark:border-none py-6 px-8 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-x-4">
                                <Image src={bankAccount.bankLogo} width={68} height={68} alt={bankAccount?.bankKey} className="rounded-full" />
                                <div>
                                    <div>{bankAccount?.bankName}</div>
                                    <div className="mt-2 flex items-center gap-x-3">
                                        <span className="txtSecond-3">{bankAccount?.accountNumber}</span>
                                        {bankAccount?.isDefault && (
                                            <TagV2 className="whitespace-nowrap" type="success">
                                                {t('reference:referral.default')}
                                            </TagV2>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                {!bankAccount?.isDefault && (
                                    <ButtonV2 variants="text" className="px-6 !text-sm" onClick={() => handleSetDefault(bankAccount?._id)}>
                                        {t('reference:referral.set_default')}
                                    </ButtonV2>
                                )}
                            </div>
                        </div>
                    );
                })}
                <div className="flex items-center justify-center font-normal">
                    <RePagination
                        total={dataTable?.length}
                        isNamiV2
                        current={currentPage}
                        pageSize={LIMIT_ROW}
                        name="market_table___list"
                        onChange={_onChangePage}
                    />
                </div>
            </div>

            {/* Popup if user have not KYC yet */}
            <ModalAddPaymentMethod
                isOpenModalAdd={isOpenModalAddNew}
                onBackdropCb={() => setIsOpenModalAddNew(false)}
                t={t}
                listBankAvailable={listBankAvailable}
                user={user}
            />
            <ModalNeedKyc isOpenModalKyc={isOpenModalKyc} />
        </div>
    );
};

export default index;
