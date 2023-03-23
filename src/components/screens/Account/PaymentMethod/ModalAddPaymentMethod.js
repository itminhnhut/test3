import { getS3Url } from 'redux/actions/utils';
import { CheckCircleIcon } from 'components/svg/SvgIcon';
import ModalV2 from 'components/common/V2/ModalV2';
import { useState, useEffect, useRef, useCallback } from 'react';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { isFunction } from 'lodash';
import { ApiStatus } from 'redux/actions/const';
import fetchAPI from 'utils/fetch-api';
import { API_ADD_USER_BANK_ACCOUNT, API_GET_BANK_AVAILABLE } from 'redux/actions/apis';
import { BxsInfoCircle, BxsUserCircle, ArrowDropDownIcon } from 'components/svg/SvgIcon';
import colors from 'styles/colors';
import InputV2 from 'components/common/V2/InputV2';
import useOutsideClick from 'hooks/useOutsideClick';
import CreditCard from 'components/svg/CreditCard';

import NoData from 'components/common/V2/TableV2/NoData';
import styled from 'styled-components';
import SearchBoxV2 from 'components/common/SearchBoxV2';
import Image from 'next/image';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import SwapWarning from 'components/svg/SwapWarning';

const regex = /^[0-9]*$/; // chỉ cho phép nhập các ký tự từ 0 đến 9 hoặc giá trị rỗng

const ModalAddPaymentMethod = ({ isOpenModalAdd, onBackdropCb, t, isDark, user, fetchListUserBank }) => {
    const [bankNumber, setBankNumber] = useState('');
    const [selectedBank, setSelectedBank] = useState({});
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [helperTextBankNumber, setHelperTextBankNumber] = useState('');
    const [listBankAvailable, setListBankAvailable] = useState([]);

    useEffect(() => {
        fetchAPI({
            url: API_GET_BANK_AVAILABLE,
            options: {
                method: 'GET'
            }
        })
            .then(({ status, data }) => {
                if (status === ApiStatus.SUCCESS) {
                    data ? setListBankAvailable(data) : setListBankAvailable([]);
                }
            })
            .finally(() => {});
    }, []);

    const handleBtnAdd = () => {
        setLoading(true);

        fetchAPI({
            url: API_ADD_USER_BANK_ACCOUNT,
            options: {
                method: 'POST'
            },
            params: {
                bankCode: selectedBank?.bank_code,
                accountNumber: bankNumber
            }
        })
            .then(({ status, data }) => {
                let isSuccess = status === ApiStatus.SUCCESS;
                setResult({
                    isSuccess,
                    msg: isSuccess ? '' : t('payment-method:bank_account_not_found')
                });
                if (isSuccess) fetchListUserBank();
            })
            .catch((e) => {
                setResult({
                    isSuccess: false,
                    msg: t('error:COMMON_ERROR')
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onCloseAlert = () => {
        setHelperTextBankNumber('');
        setResult(null);
    };

    const renderAlertNotification = useCallback(() => {
        if (!result) return null;

        return (
            <AlertModalV2
                isVisible={result}
                onClose={onCloseAlert}
                type={result.isSuccess ? 'success' : 'error'}
                title={result.isSuccess ? t('common:success') : t('payment-method:error_add')}
                message={result.isSuccess ? '' : result.msg}
            />
        );
    }, [result]);

    const onBlurInputBankNumber = (e) => {
        if (!bankNumber) {
            setHelperTextBankNumber(t('payment-method:please_input_account_num'));
        } else {
            setHelperTextBankNumber('');
        }
    };

    const onChangeBankNumber = (value) => {
        if (regex.test(value)) {
            setBankNumber(value);
        }

        if (value === '') {
            setHelperTextBankNumber(t('payment-method:please_input_account_num'));
        } else {
            setHelperTextBankNumber('');
        }
    };

    return (
        <ModalV2
            loading={loading}
            isVisible={isOpenModalAdd}
            onBackdropCb={onBackdropCb}
            className="!max-w-[488px]"
            wrapClassName="px-0 flex flex-col tracking-normal overflow-auto"
            btnCloseclassName="px-8"
        >
            {/* Title */}
            <div className="txtPri-3 px-8">{t('payment-method:payment_method_add')}</div>

            {/* Notice */}
            <div className="p-4 bg-gray-13 dark:bg-dark-4 flex items-center mt-8 mb-10 gap-x-4">
                <BxsInfoCircle size={24} color={isDark ? colors.gray[7] : colors.gray[1]} />
                <div className="text-xs leading-[16px]">{t('payment-method:privacy')}</div>
            </div>

            <div className="px-8 flex flex-col gap-y-4 txtSecond-3">
                {/* Banner Info */}
                <div
                    style={{
                        backgroundImage: `url(${getS3Url(`/images/screen/account/bg_transfer_onchain_${isDark ? 'dark' : 'light'}.png`)})`
                    }}
                    className="rounded-xl bg-cover bg-center dark:shadow-popover "
                >
                    <div className="w-full border p-6 rounded-xl border-green-border_light dark:border-none flex items-center gap-x-3">
                        {user?.avatar ? (
                            <Image width={48} height={48} objectFit="cover" src={user?.avatar} alt="avatar_user" className="rounded-full" />
                        ) : (
                            <BxsUserCircle size={48} />
                        )}
                        <div>
                            <div className="txtPri-1 pl-[1px]">{user?.name ?? '_'}</div>
                            <div className="mt-1">{t('payment-method:owner_account')}</div>
                        </div>
                    </div>
                </div>

                {/* Bank name */}
                <div className="flex flex-col gap-y-2">
                    <span className="text-sm">{t('payment-method:bank_name')}</span>
                    <BankNameInput t={t} listData={listBankAvailable} selected={selectedBank} onChange={(bank) => setSelectedBank(bank)} isDark={isDark} />
                </div>
                {/* Bank number */}
                <div className="flex flex-col gap-y-2">
                    <span className="text-sm">{t('payment-method:account_number')}</span>
                    <InputV2
                        // type="number"
                        className="!pb-0"
                        value={bankNumber}
                        onChange={(value) => onChangeBankNumber(value)}
                        placeholder={t('payment-method:input_bank_account')}
                        allowClear
                        onBlur={onBlurInputBankNumber}
                        error={helperTextBankNumber}
                        onFocus={() => setHelperTextBankNumber('')}
                    />
                </div>
            </div>
            {/* Button action */}
            <ButtonV2 disabled={!bankNumber || !selectedBank?.bank_code} loading={loading} className="mx-8 mt-10 w-auto" onClick={handleBtnAdd}>
                {t('payment-method:add')}
            </ButtonV2>

            {renderAlertNotification()}
        </ModalV2>
    );
};

const BankNameInput = ({ t, selected = {}, onChange, listData = [], isDark }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const [search, setSearch] = useState('');

    useOutsideClick(ref, () => {
        setOpen(false);
    });

    const [listItems, setListItems] = useState([]);

    useEffect(() => {
        if (!search && listData?.length === 0) setListItems([]);
        else {
            setListItems(listData.filter((eachData) => eachData.bank_name.toLowerCase().includes(search.toLowerCase())));
        }
    }, [search, listData]);

    const internalOnChange = (bank) => {
        if (isFunction(onChange)) onChange(bank);
        setOpen(false);
    };

    return (
        <div ref={ref} className="relative">
            <div
                className="bg-gray-12 dark:bg-dark-2 p-4 rounded-md cursor-pointer select-none flex items-center justify-between"
                onClick={() => {
                    setOpen((prev) => !prev);
                }}
            >
                {selected?.logo ? (
                    <div className="flex items-center gap-x-2">
                        <Image src={selected.logo} width={32} height={32} alt={selected?.bank_key} className="rounded-full" />
                        <div>
                            <div className="txtPri-1">{selected?.bank_key}</div>
                            <div className="mt-1">{selected?.bank_name}</div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-x-2">
                        <CreditCard />
                        <div className="text-base">{t('payment-method:select_bank')}</div>
                    </div>
                )}
                <span className={`transition-transform duration-50 ${open && 'rotate-180'}`}>
                    <ArrowDropDownIcon size={16} color={isDark ? colors.gray[7] : colors.gray[1]} />
                </span>
            </div>

            {open && (
                <BankList>
                    <div className="px-4">
                        <SearchBoxV2
                            inputClassname="!text-sm"
                            value={search}
                            onChange={(value) => {
                                setSearch(value);
                            }}
                            width
                        />
                    </div>
                    <ul className="mt-6 max-h-[200px] overflow-y-auto">
                        {listItems?.length ? (
                            listItems.map((item) => (
                                <li
                                    className="cursor-pointer flex items-center justify-between py-3 px-4 mt-3 first:mt-0 hover:bg-hover dark:hover:bg-hover-dark transition"
                                    key={item?.bank_code}
                                    onClick={() => internalOnChange(item)}
                                >
                                    <div className={`flex items-center gap-x-3`}>
                                        <Image src={item.logo} width={40} height={40} alt={item?.bank_key} className="rounded-full" />
                                        <div>
                                            <div className="text-base text-txtPrimary dark:text-txtPrimary-dark font-semibold">{item?.bank_key}</div>
                                            <div className="mt-2 text-sm text-txtSecondary dark:text-txtSecondary-dark">{item?.bank_name}</div>
                                        </div>
                                    </div>
                                    {item?.bank_code === selected?.bank_code && <CheckCircleIcon color={isDark ? colors.gray[4] : null} />}
                                </li>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-[200px]">
                                <NoData isSearch={!!search} />
                            </div>
                        )}
                    </ul>
                </BankList>
            )}
        </div>
    );
};

const BankList = styled.div.attrs(({ ref }) => ({
    className: `transition absolute right-0 bottom-full py-4 mb-2 w-full max-h-[292px] z-20 rounded-xl 
    border border-divider dark:border-divider-dark bg-white dark:bg-dark-4
    shadow-card_light dark:shadow-popover`,
    ref: ref
}))``;

export default ModalAddPaymentMethod;
