import Image from 'next/image';
import { parseUnormStr } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { useState, useEffect, useMemo } from 'react';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import NoData from 'components/common/V2/TableV2/NoData';
import SearchBoxV2 from 'components/common/SearchBoxV2';
import { API_DEFAULT_BANK_USER, API_GET_USER_BANK_LIST, API_POST_REMOVE_USER_BANK_ACCOUNT } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import fetchAPI from 'utils/fetch-api';
import ModalNeedKyc from 'components/common/ModalNeedKyc';
import TagV2 from 'components/common/V2/TagV2';
import RePagination from 'components/common/ReTable/RePagination';
import ModalAddPaymentMethod from './ModalAddPaymentMethod';
import Spinner from 'components/svg/Spinner';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import colors from 'styles/colors';
import Skeletor from 'components/common/Skeletor';
import toast from 'utils/toast';
import { useRouter } from 'next/router';
import ModalV2 from 'components/common/V2/ModalV2';
import { X } from 'react-feather';
import { getS3Url } from 'redux/actions/utils';

const LIMIT_ROW = 5;

const initState = {
    accountBank: { isConfirm: false, isLoading: false }
};

const index = () => {
    const [search, setSearch] = useState('');
    const user = useSelector((state) => state.auth?.user);

    const isOpenModalKyc = useMemo(() => {
        return user ? user?.kyc_status !== 2 : false;
    }, [user]);

    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const { t } = useTranslation();

    const [accountBank, setAccountBank] = useState(initState.accountBank);

    const [loadingListUserBank, setLoadingListUserBank] = useState(false);
    const [listUserBank, setListUserBank] = useState([]);
    const [dataTable, setDataTable] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingSetDefault, setLoadingSetDefault] = useState(false);
    const router = useRouter();
    const { isAdd } = router.query;

    const setIsOpenModalAddNew = (value) => {
        router.replace(
            {
                //   pathname: '/...',
                query: {
                    isAdd: value ? 'true' : 'false'
                }
            },
            undefined,
            {
                shallow: true
            }
        );
    };

    const fetchListUserBank = () => {
        setLoadingListUserBank(true);

        // Fetch list bank accounts
        fetchAPI({
            url: API_GET_USER_BANK_LIST,
            options: {
                method: 'GET'
            }
        })
            .then(({ status, data }) => {
                if (status === ApiStatus.SUCCESS)
                    data
                        ? setListUserBank(
                              data.sort((a, b) => {
                                  if (a.isDefault && !b.isDefault) {
                                      return -1; // a should come before b
                                  }
                                  if (!a.isDefault && b.isDefault) {
                                      return 1; // a should come after b
                                  }
                                  return 0; // order doesn't matter
                              })
                          )
                        : setListUserBank([]);
            })
            .finally(() => setLoadingListUserBank(false));
    };

    useEffect(() => {
        fetchListUserBank();
    }, []);

    useEffect(() => {
        if (listUserBank?.length > 0)
            setDataTable(
                listUserBank.filter(
                    (item) => parseUnormStr(item.bankName).includes(parseUnormStr(search)) || item.accountNumber.toLowerCase().includes(search.toLowerCase())
                )
            );
        setCurrentPage(1);
    }, [search, listUserBank]);

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
            .then(({ status }) => {
                const isSuccess = status === ApiStatus.SUCCESS;
                if (isSuccess) {
                    toast({ text: t('payment-method:set_default_bank_success'), type: 'success' });
                    fetchListUserBank();
                } else {
                    toast({ text: t('payment-method:error_add'), type: 'error' });
                }
            })
            .catch((e) => {
                toast({ text: t('error:COMMON_ERROR'), type: 'error' });
            })
            .finally(() => {
                setLoadingSetDefault(null);
            });
    };

    const handleRemoveBank = (bankAccountId) => {
        setAccountBank({ isConfirm: true, bankAccountId });
    };

    const _onChangePage = (page) => {
        setCurrentPage(page);
    };

    const onConfirm = async () => {
        setAccountBank((prev) => ({ ...prev, isLoading: !prev.isLoading }));
        try {
            const { bankAccountId = '' } = accountBank;
            const { status, message } = await fetchAPI({
                url: API_POST_REMOVE_USER_BANK_ACCOUNT,
                options: {
                    method: 'POST'
                },
                params: {
                    bankAccountId
                }
            });
            if (status === 'ok') {
                toast({ text: t('payment-method:confirm.noti_text'), type: 'success' });
                fetchListUserBank();
                currentPage > 1 && setCurrentPage(1);
            } else {
                console.error(message);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setAccountBank(initState.accountBank);
        }
    };

    const onCloseModal = () => setAccountBank((prev) => ({ ...prev, isConfirm: !prev.isConfirm }));

    return (
        <div className="mt-[58px] text-gray-15 dark:text-gray-4 font-semibold text-base">
            <ModalV2
                isVisible={accountBank.isConfirm}
                onBackdropCb={onCloseModal}
                className="!max-w-[488px]"
                wrapClassName="p-8 flex flex-col text-gray-1 dark:text-gray-7 tracking-normal"
                customHeader={() => (
                    <div className="flex justify-end mb-6">
                        <div
                            className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark cursor-pointer"
                            onClick={onCloseModal}
                        >
                            <X size={24} />
                        </div>
                    </div>
                )}
            >
                <div className="flex flex-col justify-center items-center text-center">
                    <img src={getS3Url('/images/icon/ic_warning_2.png')} className="mr-3" width={80} height={80} alt="" />
                    <div className="dark:text-gray-4 text-txtPrimary text-2xl font-semibold mt-6">{t('payment-method:confirm.title')}</div>
                    <div className="dark:text-gray-7 text-gray-1 mt-4">{t('payment-method:confirm.text')}</div>
                    <ButtonV2 disabled={accountBank.isLoading} onClick={onConfirm} className="mt-10">
                        {accountBank.isLoading ? <Spinner color={isDark ? colors.green[2] : colors.green[3]} /> : t('common:confirm')}
                    </ButtonV2>
                </div>
            </ModalV2>
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
                ) : dataTable.length === 0 ? (
                    <div className="flex items-center justify-center py-[72px]">
                        <NoData isSearch={!!search} />
                    </div>
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
                                            <span className="txtSecond-2">{bankAccount?.accountNumber}</span>
                                            {bankAccount?.isDefault && (
                                                <TagV2 type="success" icon={false}>
                                                    <span className="text-xs font-normal whitespace-nowrap">{t('reference:referral.default')}</span>
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
                                            <div className="flex flex-row items-center">
                                                <ButtonV2 variants="text" className="px-6 !text-base" onClick={() => handleSetDefault(bankAccount?._id)}>
                                                    {t('reference:referral.set_default')}
                                                </ButtonV2>
                                                <hr className="h-7 w-[1px] border-[1px] border-solid dark:border-divider-dark border-divider mx-3" />
                                                <ButtonV2 variants="text" className="px-6 !text-base" onClick={() => handleRemoveBank(bankAccount?._id || '')}>
                                                    {t('common:clear')}
                                                </ButtonV2>
                                            </div>
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
                        onusMode={false}
                        current={currentPage}
                        pageSize={LIMIT_ROW}
                        name="market_table___list"
                        onChange={_onChangePage}
                    />
                </div>
            </div>

            {/* Popup if user have not KYC yet */}
            <ModalAddPaymentMethod
                isOpenModalAdd={isAdd?.toLowerCase() === 'true'}
                onBackdropCb={() => setIsOpenModalAddNew(false)}
                t={t}
                user={user}
                isDark={isDark}
                fetchListUserBank={fetchListUserBank}
            />
            <ModalNeedKyc isOpenModalKyc={isOpenModalKyc} />
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
