import Image from 'next/image';
import { getS3Url } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { useState, useEffect, useMemo, useCallback } from 'react';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import SearchBoxV2 from 'components/common/SearchBoxV2';
import { API_DEFAULT_BANK_USER, API_GET_USER_BANK_LIST } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import fetchAPI from 'utils/fetch-api';
import ModalNeedKyc from 'components/common/ModalNeedKyc';
import TagV2 from 'components/common/V2/TagV2';
import RePagination from 'components/common/ReTable/RePagination';
import ModalAddPaymentMethod from './ModalAddPaymentMethod';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import Spinner from 'components/svg/Spinner';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import colors from 'styles/colors';
import Skeletor from 'components/common/Skeletor';

const LIMIT_ROW = 5;

const index = () => {
    const [search, setSearch] = useState('');
    const user = useSelector((state) => state.auth?.user);
    const isOpenModalKyc = useMemo(() => {
        return user ? user?.kyc_status !== 2 : false;
    }, [user]);
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const { t } = useTranslation();

    const [loadingListUserBank, setLoadingListUserBank] = useState(false);
    const [listUserBank, setListUserBank] = useState([]);
    const [dataTable, setDataTable] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpenModalAddNew, setIsOpenModalAddNew] = useState(false);

    const [loadingSetDefault, setLoadingSetDefault] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        setLoadingListUserBank(true);

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
            .finally(() => setLoadingListUserBank(false));
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
        setLoadingSetDefault(bankAccountId);

        fetchAPI({
            url: API_DEFAULT_BANK_USER,
            options: {
                method: 'POST'
            },
            params: {
                bankAccountId
            }
        })
            .then(({ status, data }) => {
                setResult({
                    isSuccess: status === ApiStatus.SUCCESS
                });
            })
            .catch((e) => {
                setResult({
                    isSuccess: false,
                    msg: t('error:COMMON_ERROR')
                });
            })
            .finally(() => {
                setLoadingSetDefault(null);
            });
    };

    const renderAlertNotification = useCallback(() => {
        if (!result) return null;

        return (
            <AlertModalV2
                isVisible={result}
                onClose={() => setResult(null)}
                type={result.isSuccess ? 'success' : 'error'}
                title={result.isSuccess ? t('common:success') : t('payment-method:error_add')}
                message={result.isSuccess ? '' : result.msg}
            />
        );
    }, [result]);

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
                {loadingListUserBank ? (
                    <TableSkeletor />
                ) : (
                    dataTable.map((bankAccount, index) => {
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
                                    {!bankAccount?.isDefault &&
                                        (loadingSetDefault === bankAccount?._id ? (
                                            <div className="h-full px-10 flex items-center justify-between">
                                                <Spinner color={isDark ? colors.green[2] : colors.green[3]} />
                                            </div>
                                        ) : (
                                            <ButtonV2 variants="text" className="px-6 !text-sm" onClick={() => handleSetDefault(bankAccount?._id)}>
                                                {t('reference:referral.set_default')}
                                            </ButtonV2>
                                        ))}
                                </div>
                            </div>
                        );
                    })
                )}
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
            <ModalAddPaymentMethod isOpenModalAdd={isOpenModalAddNew} onBackdropCb={() => setIsOpenModalAddNew(false)} t={t} user={user} isDark={isDark} />
            <ModalNeedKyc isOpenModalKyc={isOpenModalKyc} />
            {renderAlertNotification()}
        </div>
    );
};

const TableSkeletor = () =>
    Array(LIMIT_ROW)
        .fill()
        .map((_, i) => (
            <div
                key={'sekeleton' + i}
                className="dark:bg-dark-4 hover:bg-gray-13 dark:hover:bg-hover-dark rounded-xl border border-divider dark:border-none py-6 px-8 flex items-center justify-between"
            >
                <div className="flex items-center gap-x-4">
                    <Skeletor width={68} height={68} style={{ borderRadius: '100%' }} />
                    <div>
                        <Skeletor width={300} />
                        <div className="mt-2 flex items-center gap-x-3">
                            <Skeletor width={150} />
                        </div>
                    </div>
                </div>
            </div>
        ));

export default index;
