import HrefButton from 'components/common/V2/ButtonV2/HrefButton';
import useLanguage from 'hooks/useLanguage';
import { useTranslation } from 'next-i18next';
import { getS3Url } from 'redux/actions/utils';
import { WIDTH_MD } from 'components/screens/Wallet';
import useWindowSize from 'hooks/useWindowSize';
import { LogoIcon, BxChevronDown, CheckCircleIcon } from 'components/svg/SvgIcon';
import ModalV2 from 'components/common/V2/ModalV2';
import { useState, useEffect, useRef } from 'react';
import * as Error from 'redux/actions/apiError';
import CheckBox from 'components/common/CheckBox';
import { formatNumber as formatWallet, setTransferModal, walletLinkBuilder, CopyText } from 'redux/actions/utils';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import Spiner from 'components/common/V2/LoaderV2/Spiner';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { NoDataDarkIcon } from 'components/common/V2/TableV2/NoData';
import { TabItemNao } from 'components/screens/Nao/NaoStyle';
import { find, forEach, isEmpty, isFunction, isNumber, keys, pickBy } from 'lodash';
import NamiCircle from 'components/svg/NamiCircle';
import TagV2 from 'components/common/V2/TagV2';
import { ApiStatus } from 'redux/actions/const';
import fetchAPI from 'utils/fetch-api';
import { PATHS } from 'constants/paths';
import { API_GET_BANK_ACCOUNT_NAME, API_GET_NAMI_RATE, API_PREFETCH_ORDER_CONVERT_SMALL_BALANCE } from 'redux/actions/apis';
import { BxsInfoCircle, BxsUserCircle, ArrowDropDownIcon } from 'components/svg/SvgIcon';
import colors from 'styles/colors';
import InputV2 from 'components/common/V2/InputV2';
import useOutsideClick from 'hooks/useOutsideClick';
import ChevronDown from 'components/svg/ChevronDown';
import CreditCard from 'components/svg/CreditCard';
import classNames from 'classnames';

import NoData from 'components/common/V2/TableV2/NoData';
import styled from 'styled-components';
import SearchBoxV2 from 'components/common/SearchBoxV2';
import Image from 'next/image';

const ModalAddPaymentMethod = ({ isOpenModalAdd, onBackdropCb, t, listBankAvailable }) => {
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;
    const [owner, setOwner] = useState({});
    const [bankNumber, setBankNumber] = useState('');
    const [selectedBank, setSelectedBank] = useState({});
    const [loading, setLoading] = useState(false);

    const handleBtnAdd = () => {
        setLoading(true);
        console.log('here', selectedBank?.bank_code, bankNumber);

        fetchAPI({
            url: API_GET_BANK_ACCOUNT_NAME,
            options: {
                method: 'GET'
            },
            params: {
                bankCode: selectedBank?.bank_code,
                accountNumber: bankNumber
            }
        })
            .then(({ status, data }) => {
                if (status === ApiStatus.SUCCESS) {
                    // setKyc(data);
                }
                console.log(status, data);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <ModalV2
            // isMobile={isMobile || width < WIDTH_MD}
            isVisible={isOpenModalAdd}
            onBackdropCb={onBackdropCb}
            className="!max-w-[488px]"
            wrapClassName="px-0 flex flex-col tracking-normal overflow-auto"
            btnCloseclassName="px-8"
        >
            <div className="txtPri-3 px-8">{t('payment-method:payment_method_add')}</div>
            <div className="p-4 bg-gray-13 dark:bg-dark-4 flex items-center mt-8 mb-10 gap-x-4">
                <BxsInfoCircle size={24} fill={isDark ? colors.gray[7] : colors.gray[1]} fillInside={'currentColor'} />
                <div className="text-xs leading-[16px]">{t('payment-method:privacy')}</div>
            </div>
            <div className="px-8 flex flex-col gap-y-4 txtSecond-3">
                {/* Banner Info */}
                <div
                    style={{
                        backgroundImage: `url(${getS3Url(
                            `/images/screen/account/bg_transfer_onchain_${currentTheme === THEME_MODE.DARK ? 'dark' : 'light'}.png`
                        )})`
                    }}
                    className="rounded-xl bg-cover bg-center dark:shadow-popover "
                >
                    <div className="w-full border p-6 rounded-xl border-green-border_light dark:border-none flex items-center gap-x-3">
                        <BxsUserCircle size={48} />
                        <div>
                            <div className="txtPri-1 pl-[1px]">{owner?.name ?? '_'}</div>
                            <div className="mt-1">{t('payment-method:owner_account')}</div>
                        </div>
                    </div>
                </div>
                {/* Bank name */}
                <div className="flex flex-col gap-y-2">
                    <span className="text-sm">{t('payment-method:bank_name')}</span>
                    <BankNameInput
                        t={t}
                        listData={listBankAvailable}
                        selected={selectedBank}
                        onChange={(bank) => setSelectedBank(bank)}
                        currentTheme={currentTheme}
                        isDark={isDark}
                    />
                </div>
                {/* Bank number */}
                <div className="flex flex-col gap-y-2">
                    <span className="text-sm">{t('payment-method:account_number')}</span>
                    <InputV2
                        className="!pb-0"
                        value={bankNumber}
                        onChange={(value) => setBankNumber(value.toString())}
                        // onHitEnterButton={(value) => onSearch(value.toString())}
                        placeholder={t('payment-method:input_bank_account')}
                        allowClear
                    />
                </div>
            </div>
            {/* Button action */}
            <ButtonV2 className="mx-8 mt-10 w-auto" onClick={handleBtnAdd}>
                {t('payment-method:add')}
            </ButtonV2>
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
                            <div className="flex items-center justify-center">
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
