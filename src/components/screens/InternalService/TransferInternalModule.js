import NumberFormat from 'react-number-format';
import AssetLogo from 'src/components/wallet/AssetLogo';
import fetchAPI from 'utils/fetch-api';
import colors from 'styles/colors';
import useOutsideClick from 'hooks/useOutsideClick';

import { createRef, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { find, orderBy } from 'lodash';
import { formatPrice, formatWallet, getS3Url, formatNumber } from 'redux/actions/utils';
import { useSelector } from 'react-redux';
import { ApiStatus } from 'redux/actions/const';
import ModalV2 from 'components/common/V2/ModalV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

// import SVG
import { CloseIcon, ArrowDropDownIcon, BxsUserCircle } from 'components/svg/SvgIcon';
import NoData from 'components/common/V2/TableV2/NoData';
import styled from 'styled-components';
import SearchBoxV2 from 'components/common/SearchBoxV2';
import InputV2 from 'components/common/V2/InputV2';
import { Search } from 'react-feather';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { API_INTERNAL_FIND_USER, API_INTERNAL_TRANSFER } from 'redux/actions/apis';
import TextArea from 'components/common/V2/InputV2/TextArea';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';

const DEFAULT_PAIR = {
    fromAsset: 'VNDC',
    toAsset: 'USDT'
};

const TABS = [
    {
        key: 'personal',
        localized: 'Personal'
    },
    {
        key: 'multiple',
        localized: 'Multiple'
    }
];

const fromAssetRef = createRef();

const TransferInternalModule = ({ width, pair, setNewOrder }) => {
    // Init State
    const [state, set] = useState({
        swapConfigs: null,
        fromAsset: DEFAULT_PAIR.fromAsset,
        fromAmount: null,
        fromAssetList: null,
        fromErrors: {},
        focus: 'from',
        search: '',
        inputHighlighted: null,
        openAssetList: {},

        // State for to User
        searchUser: '',
        listUserFounded: [],
        toUser: null,
        errorToUser: '',

        // State for noti
        contentNotiVi: '',
        contentNotiEn: '',

        // State for Modal preview
        isOpenModalPreview: false,
        loadingTransfer: false,
        resultTransfer: null
    });

    const auth = useSelector((state) => state.auth.user) || null;

    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));
    // Get state from Rdx
    const wallets = useSelector((state) => state.wallet.SPOT);
    const assetConfig = useSelector((state) => state.utils.assetConfig);

    // Refs
    const fromAssetListRef = useRef();
    const toUserListRef = useRef();

    // Use Hooks
    const {
        t,
        i18n: { language }
    } = useTranslation(['navbar', 'common', 'error', 'convert', 'wallet']);
    const [currentTheme] = useDarkMode();

    const isDark = currentTheme === THEME_MODE.DARK;
    useOutsideClick(fromAssetListRef, () => state.openAssetList?.from && setState({ openAssetList: { from: false }, search: '' }));
    useOutsideClick(toUserListRef, () => state.openAssetList?.to && setState({ openAssetList: { to: false } }));

    useEffect(() => {
        let result = [];
        result = orderBy(result, ['available', 'fromAsset'], ['desc', 'asc']);

        setState({ fromAssetList: result });
    }, [state.search, wallets]);

    useEffect(() => {
        let tempFromAssetList = Object.keys(wallets)
            ?.map((key) => {
                const curAssetWalletData = wallets[key];
                return {
                    // assetId: key,
                    ...find(assetConfig, { id: +key }),
                    available: curAssetWalletData.value - curAssetWalletData.locked_value,
                    ...curAssetWalletData
                };
            })
            .filter((item) => item?.assetCode?.toLowerCase()?.includes(state.search?.toLowerCase()));

        tempFromAssetList = orderBy(tempFromAssetList, ['available', 'assetCode'], ['desc', 'asc']);

        setState({
            fromAssetList: tempFromAssetList
        });
    }, [wallets, assetConfig, state.search]);

    const renderFromAssetList = useCallback(() => {
        if (!state.openAssetList?.from || !state.fromAssetList) return null;

        return (
            <AssetList ref={fromAssetListRef}>
                <div className="px-4">
                    <SearchBoxV2
                        value={state.search}
                        onChange={(value) => {
                            setState({ search: value });
                        }}
                        width
                    />
                </div>
                <ul className="mt-6 max-h-[332px] overflow-y-auto">
                    {state.fromAssetList?.length ? (
                        state.fromAssetList.map(({ id, assetCode: fromAsset, available, assetName, assetDigit }) => (
                            <AssetItem
                                key={`asset_item___${id}`}
                                isChoosed={state.fromAsset === fromAsset}
                                onClick={() => onClickFromAsset(fromAsset)}
                                isDisabled={!available}
                            >
                                <div className={`flex items-center  `}>
                                    <div className={`${!available && 'opacity-20'} w-5 h-5`}>
                                        <AssetLogo assetCode={fromAsset} size={20} />
                                    </div>
                                    <p className={`${!available && 'text-txtDisabled dark:text-txtDisabled-dark'}`}>
                                        <span className={`mx-2 ${available && 'text-txtPrimary dark:text-txtPrimary-dark'}`}>{fromAsset}</span>
                                        <span className="text-xs leading-4 text-left">{assetName}</span>
                                    </p>
                                </div>
                                <div> {available ? formatNumber(available, assetDigit) : '0.0000'}</div>
                            </AssetItem>
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-[332px]">
                            <NoData isSearch={!!state.search} />
                        </div>
                    )}
                </ul>
            </AssetList>
        );
    }, [state.fromAsset, state.fromAssetList, state.openAssetList, state.search, language]);

    const onClickFromAsset = (fromAsset) => {
        setState({ fromAsset, search: '', fromErrors: {}, openAssetList: {} });
    };

    useEffect(() => {
        if (!state.searchUser) return setState({ errorToUser: '', toUser: null, listUserFounded: [], openAssetList: { to: false } });

        const fetchSearchUser = setTimeout(handleSearchToUser, 500);
        return () => clearTimeout(fetchSearchUser);
    }, [state.searchUser]);

    const handleSearchToUser = async () => {
        if (!state.searchUser) return;
        setState({ errorToUser: '', toUser: null, listUserFounded: [] });

        // Call api search user here
        const { status, data } = await fetchAPI({
            url: API_INTERNAL_FIND_USER,
            options: { method: 'GET' },
            params: {
                searchContent: state.searchUser
            }
        });

        if (status === ApiStatus.SUCCESS) {
            if (data?.length === 0) {
                setState({ errorToUser: 'User not found!' });
            } else {
                setState({ listUserFounded: data, openAssetList: { to: true } });
            }
        } else {
            setState({ errorToUser: 'Server error' });
        }
    };

    const renderListSearchToUser = useCallback(() => {
        if (!state.openAssetList?.to || !state.listUserFounded) return null;

        return (
            <AssetList ref={toUserListRef} className="w-full">
                <ul className="mt-6 max-h-[332px] overflow-y-auto">
                    {state.listUserFounded?.length ? (
                        state.listUserFounded.map((userFounded) => (
                            <AssetItem
                                key={`user_item_${userFounded?.id}`}
                                // isChoosed={state.toUser.?.id === userFounded}
                                onClick={() => setState({ toUser: userFounded, errorToUser: '', openAssetList: {} })}

                                // isDisabled={}
                            >
                                <div className={`flex items-center gap-x-3 w-full`}>
                                    {userFounded?.avatar ? (
                                        <img
                                            src={
                                                userFounded?.avatar?.includes?.('https://') || userFounded?.avatar?.includes?.('http://')
                                                    ? userFounded.avatar
                                                    : getS3Url(userFounded?.avatar)
                                            }
                                            alt="avatar_user"
                                            className="rounded-full w-10 h-10 bg-cover"
                                        />
                                    ) : (
                                        <BxsUserCircle size={40} />
                                    )}
                                    <div className="w-full">
                                        <div className="flex justify-between w-full text-base text-txtPrimary dark:text-txtPrimary-dark font-semibold">
                                            {userFounded?.code}
                                            <div>
                                                <span className="txtSecond-1 !text-base">ID: </span>
                                                {userFounded?.id}
                                            </div>
                                        </div>
                                        <div className="mt-2 text-sm text-txtSecondary dark:text-txtSecondary-dark">{userFounded?.email}</div>
                                    </div>
                                </div>
                            </AssetItem>
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-[332px]">
                            <NoData isSearch={!!state.search} />
                        </div>
                    )}
                </ul>
            </AssetList>
        );
    }, [state.listUserFounded, state.openAssetList]);

    useEffect(() => {
        if (!state.toUser) return;
        if (state?.toUser?.code === auth.code) setState({ errorToUser: 'Không thể tự chuyển cho chính mình!', toUser: null });
    }, [state.toUser]);

    const handleConfirmTransfer = () => {
        setState({ loadingTransfer: true, resultTransfer: null });
        fetchAPI({
            url: API_INTERNAL_TRANSFER,
            options: {
                method: 'POST'
            },
            params: {
                assetCode: state.fromAsset,
                amount: state.fromAmount,
                toUserId: state.toUser.id,
                noteVi: state.contentNotiVi ?? '',
                noteEn: state.contentNotiEn ?? ''
            }
        })
            .then((res) => {
                if (res.status === ApiStatus.SUCCESS) {
                    setState({
                        resultTransfer: {
                            type: 'success',
                            msg: 'Chuyển thành công'
                        }
                    });
                    setNewOrder(res.data);
                } else {
                    setState({
                        resultTransfer: {
                            type: 'error',
                            msg: res?.status && res?.status !== 'error' ? t(`error:${res.status}`) : t('error:COMMON_ERROR')
                        }
                    });
                }
            })
            .catch((e) => {
                setState({
                    resultTransfer: {
                        type: 'error',
                        msg: t('error:COMMON_ERROR')
                    }
                });
            })
            .finally(() => {
                setState({ loadingTransfer: false });
            });
    };

    const handleCloseAlert = () => {
        const isClear = state?.resultTransfer?.type === 'success';
        setState({ resultTransfer: null });

        if (isClear)
            setTimeout(
                setState({
                    fromAmount: '',
                    fromErrors: {},
                    search: '',
                    openAssetList: {},

                    // State for to User
                    searchUser: '',
                    listUserFounded: [],
                    toUser: null,
                    errorToUser: '',

                    // State for noti
                    contentNotiVi: '',
                    contentNotiEn: '',

                    // State for Modal preview
                    isOpenModalPreview: false,
                    loadingTransfer: false,
                    resultTransfer: null
                }),
                500
            );
    };

    // Handle screen Personal/Multiple transfer
    const [selectedTab, setSelectedTab] = useState(TABS[0].key);

    return (
        <>
            <div className="relative flex flex-row-reverse items-end tracking-normal w-full">
                <Tabs tab={selectedTab} className="gap-6 border-b border-divider dark:border-divider-dark sm:w-max">
                    {TABS?.map((rs) => (
                        <TabItem key={rs.key} V2 className="!px-0" value={rs.key} onClick={(isClick) => isClick && setSelectedTab(rs.key)}>
                            {t(rs.localized)}
                        </TabItem>
                    ))}
                </Tabs>
                <div className="absolute left-0 hidden md:block">
                    <span className="text-[32px] leading-[38px] font-semibold">Transfer Internal</span>
                </div>
            </div>
            <div className="mt-10 flex items-center justify-center w-full h-full">
                <div className="relative flex min-w-[488px] mt-8 p-6 rounded-xl shadow-card_light dark:border dark:border-divider-dark dark:bg-dark bg-white">
                    <div>
                        {/*INPUT WRAPPER*/}
                        <div className="relative flex flex-col gap-y-6">
                            <Input isFocus={state.inputHighlighted === 'from'}>
                                <div className="flex items-center justify-between pb-4 text-txtSecondary dark:text-txtSecondary-dark">
                                    <span>{t('common:from')}</span>
                                    <div className="flex gap-2 items-center">
                                        <span>
                                            {t('common:available_balance')}:{' '}
                                            {formatWallet(find(state.fromAssetList, { assetCode: state.fromAsset })?.available)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between bg-transparent font-semibold text-base w-full">
                                    <div className="flex items-center justify-between w-full">
                                        <NumberFormat
                                            thousandSeparator
                                            allowNegative={false}
                                            getInputRef={fromAssetRef}
                                            className="w-full text-left txtPri-3 placeholder-shown:text-txtSecondary dark:placeholder-shown:text-txtSecondary-dark"
                                            value={state.fromAmount}
                                            onFocus={() => setState({ focus: 'from', inputHighlighted: 'from' })}
                                            onBlur={() => setState({ inputHighlighted: null })}
                                            onValueChange={({ value }) => setState({ fromAmount: value })}
                                            placeholder={(0).toFixed(4)}
                                            decimalScale={4}
                                        />

                                        <button
                                            className={`border-r border-r-divider dark:border-r-divider-dark mr-3 pr-3 ${
                                                !!state.fromAmount ? 'visible' : 'invisible'
                                            }`}
                                        >
                                            <CloseIcon onClick={() => setState({ fromAmount: '' })} size={width >= 768 ? 20 : 16} className="cursor-pointer" />
                                        </button>
                                    </div>
                                    <div
                                        className="flex items-center cursor-pointer select-none"
                                        onClick={() => setState({ openAssetList: { from: !state.openAssetList?.from } })}
                                    >
                                        <AssetLogo assetCode={state.fromAsset} size={24} />
                                        <span className="mx-2 uppercase">{state.fromAsset}</span>
                                        <span className={`transition-transform duration-50 ${state.openAssetList?.from && 'rotate-180'}`}>
                                            <ArrowDropDownIcon size={16} />
                                        </span>
                                    </div>
                                </div>
                                {renderFromAssetList()}
                            </Input>
                            {/* {renderHelperTextFrom()} */}

                            <div className="relative">
                                <InputV2
                                    onFocus={handleSearchToUser}
                                    onHitEnterButton={handleSearchToUser}
                                    value={state.searchUser}
                                    onChange={(value) => (value ? setState({ searchUser: value }) : setState({ searchUser: value, toUser: null }))}
                                    placeholder={t('common:to') + ' (email/nami_id)'}
                                    suffix={<Search color={colors.darkBlue5} size={16} />}
                                    className="pb-0 w-full"
                                    error={state.errorToUser}
                                    classNameInput="!text-lg"
                                    onBlur={() => setState({ errorToUser: '' })}
                                />
                                {renderListSearchToUser()}
                            </div>
                            <div
                                style={{
                                    backgroundImage: `url(${getS3Url(`/images/screen/account/bg_transfer_onchain_${isDark ? 'dark' : 'light'}.png`)})`
                                }}
                                className="rounded-xl bg-cover bg-center dark:shadow-popover"
                            >
                                <div className="w-full border p-4 rounded-xl border-green-border_light dark:border-none flex items-center gap-x-3">
                                    {state?.toUser?.avatar ? (
                                        <img src={state.toUser.avatar} alt="avatar_user" className="rounded-full w-16 h-16 bg-cover" />
                                    ) : (
                                        <BxsUserCircle size={64} />
                                    )}
                                    <div className="w-full">
                                        <div className="txtPri-1 pl-[1px] flex items-center justify-between w-full">
                                            <span className="txtSecond-1 !text-base">ID: </span>
                                            {state?.toUser?.id ?? '???'}
                                        </div>
                                        <div className="mt-1 txtPri-1 items-center flex justify-between w-full">
                                            <span className="txtSecond-1 !text-base">Nami ID: </span>
                                            {state?.toUser?.code ?? '???'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <TextArea
                                label="Nội dung thông báo (Tiếng Việt)"
                                value={state?.contentNotiVi}
                                onChange={(value) => setState({ contentNotiVi: value })}
                                placeholder={'Nhập nội dung (không bắt buộc)'}
                                className="pb-0 w-full"
                                classNameInput="!text-lg h-24"
                            />

                            <TextArea
                                label="Nội dung thông báo (Tiếng Anh)"
                                value={state?.contentNotiEn}
                                onChange={(value) => setState({ contentNotiEn: value })}
                                placeholder={'Nhập nội dung (không bắt buộc)'}
                                className="pb-0 w-full"
                                classNameInput="!text-lg h-24"
                            />
                        </div>

                        {/*TRANSFER BUTTON*/}
                        <ButtonV2 disabled={!state?.fromAmount || !state?.toUser} onClick={() => setState({ isOpenModalPreview: true })} className="mt-8">
                            {t(`futures:mobile.close_all_positions.preview`)}
                        </ButtonV2>
                    </div>
                {selectedTab === 'multiple' && <div>Tab partners</div>}

                </div>
            </div>
            <ModalV2
                loading={false}
                className="!max-w-[488px]"
                isVisible={state.isOpenModalPreview}
                onBackdropCb={() => setState({ isOpenModalPreview: false })}
                btnCloseclassName="bg-white dark:bg-dark"
            >
                <div className="my-6 text-left font-semibold text-[24px] leading-[30px] text-dark-2 dark:text-gray-4 hover:bg-transparent">
                    Xác nhận giao dịch
                </div>
                <div className="flex flex-col items-start justify-between gap-2">
                    <span className="text-sm leading-5  text-txtSecondary dark:text-txtSecondary-dark">Số lượng chuyển:</span>
                    <div className="w-full rounded-md bg-gray-10 dark:bg-dark-2 px-3 py-2 flex justify-between text-base items-center leading-6">
                        <span className="py-1 text-txtPrimary dark:text-txtPrimary-dark">{formatPrice(state?.fromAmount)} </span>
                        <span className="text-txtSecondary dark:text-txtSecondary-dark">{state?.fromAsset}</span>
                    </div>
                </div>

                <div className="flex flex-col mt-4 items-start justify-between gap-2">
                    <span className="text-sm leading-5  text-txtSecondary dark:text-txtSecondary-dark">Người nhận:</span>
                    <div className="w-full rounded-md bg-gray-10 dark:bg-dark-2 px-3 py-2 flex flex-col gap-y-4 text-base items-center leading-6">
                        <InforTransfer
                            label="Avatar"
                            content={
                                state.toUser?.avatar ? (
                                    <img src={state.toUser.avatar} alt="avatar_user" className="rounded-full w-8 h-8 bg-cover" />
                                ) : (
                                    <BxsUserCircle size={32} />
                                )
                            }
                        />
                        <InforTransfer label="UID" content={state.toUser?.id ?? '--'} />
                        <InforTransfer label="Nami ID" content={state.toUser?.code ?? '--'} />
                        <InforTransfer label="Email" content={state.toUser?.email ?? '--'} />
                        <InforTransfer label="Name" content={state.toUser?.name ?? '--'} />
                        <InforTransfer label="Username" content={state.toUser?.username ?? '--'} />
                    </div>
                </div>

                {state?.contentNotiVi && (
                    <div className="flex flex-col mt-4 items-start justify-between gap-2">
                        <span className="text-sm leading-5  text-txtSecondary dark:text-txtSecondary-dark">Nội dung Thông báo (Tiếng Việt):</span>
                        <div className="w-full rounded-md bg-gray-10 dark:bg-dark-2 px-3 py-2 flex justify-between text-base items-center leading-6">
                            <span className="py-1 text-txtPrimary dark:text-txtPrimary-dark">{state?.contentNotiVi}</span>
                        </div>
                    </div>
                )}
                {state?.contentNotiEn && (
                    <div className="flex flex-col mt-4 items-start justify-between gap-2">
                        <span className="text-sm leading-5  text-txtSecondary dark:text-txtSecondary-dark">Nội dung Thông báo (Tiếng Anh):</span>
                        <div className="w-full rounded-md bg-gray-10 dark:bg-dark-2 px-3 py-2 flex justify-between text-base items-center leading-6">
                            <span className="py-1 text-txtPrimary dark:text-txtPrimary-dark">{state?.contentNotiEn}</span>
                        </div>
                    </div>
                )}
                <div className="mt-10 w-full flex flex-row items-center justify-between">
                    <ButtonV2 loading={state.loadingTransfer} onClick={handleConfirmTransfer}>
                        {t('common:confirm')}
                    </ButtonV2>
                </div>
            </ModalV2>
            <AlertModalV2
                key="modal_error"
                isVisible={!!state.resultTransfer}
                onClose={handleCloseAlert}
                type={state.resultTransfer?.type}
                title={state.resultTransfer?.msg}
                buttonClassName="hidden"
                // message={state.resultErr}
            />
        </>
    );
};

const Input = styled.div.attrs(({ isFocus }) => ({
    className: `py-6 px-4 rounded-xl relative bg-gray-13 dark:bg-dark-2 border ${isFocus ? 'border-green-2' : 'border-transparent'}`
}))``;

const AssetList = styled.div.attrs(({ AssetListRef }) => ({
    className: `absolute right-0 top-full py-4 mt-2 w-full max-w-[400px] z-20 rounded-xl
    border border-divider dark:border-divider-dark bg-white dark:bg-dark-4
    shadow-card_light dark:shadow-popover`,
    ref: AssetListRef
}))``;

const AssetItem = styled.li.attrs(({ key, className, isChoosed, onClick }) => ({
    className: `text-txtSecondary dark:text-txtSecondary-dark text-left text-base
    px-4 py-4 flex items-center justify-between cursor-pointer font-normal first:mt-0 mt-3
    hover:bg-hover focus:bg-hover dark:hover:bg-hover-dark dark:focus:bg-hover-dark
    ${isChoosed && 'bg-hover dark:bg-hover-dark'} ${className}`,
    key: key,
    onClick: onClick
}))``;

const InforTransfer = ({ label, content }) => (
    <div className="w-full flex justify-between items-center">
        <span className="text-txtSecondary dark:text-txtSecondary-dark">{label}</span>
        <span className="py-1 text-txtPrimary dark:text-txtPrimary-dark">{content}</span>
    </div>
);

export default TransferInternalModule;
