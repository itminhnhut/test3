import NumberFormat from 'react-number-format';
import AssetLogo from 'src/components/wallet/AssetLogo';
import fetchAPI from 'utils/fetch-api';
import colors from 'styles/colors';
import * as Error from '../../../redux/actions/apiError';
import Skeletor from 'src/components/common/Skeletor';
import useOutsideClick from 'hooks/useOutsideClick';
import { WalletType } from 'redux/actions/const';
import { EXCHANGE_ACTION } from 'pages/wallet';

import { createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAsync, useDebounce } from 'react-use';
import { Trans, useTranslation } from 'next-i18next';
import { find, orderBy, uniqBy } from 'lodash';
import {
    formatPrice,
    formatSwapRate,
    formatWallet,
    getDecimalScale,
    getLoginUrl,
    countDecimals,
    walletLinkBuilder,
    safeToFixed,
    dwLinkBuilder,
    getS3Url
} from 'redux/actions/utils';
import { useSelector } from 'react-redux';
import { ApiStatus } from 'redux/actions/const';
import { PATHS } from 'constants/paths';
import { roundToDown } from 'round-to';
import router from 'next/router';
import ModalV2 from 'components/common/V2/ModalV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import HrefButton from 'components/common/V2/ButtonV2/HrefButton';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';

// import SVG
import SvgAddCircle from 'components/svg/SvgAddCircle';
import SwapWarning from 'components/svg/SwapWarning';
import { CloseIcon, SyncAltIcon, ArrowDropDownIcon, BxsUserCircle } from 'components/svg/SvgIcon';
import NoData from 'components/common/V2/TableV2/NoData';
import styled from 'styled-components';
import SearchBoxV2 from 'components/common/SearchBoxV2';
import { TYPE_DW } from '../WithdrawDeposit/constants';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import InputV2 from 'components/common/V2/InputV2';
import { Search } from 'react-feather';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

const FEE_RATE = 0 / 100;
const DEBOUNCE_TIMEOUT = 500;

const DEFAULT_PAIR = {
    fromAsset: 'VNDC',
    toAsset: 'USDT'
};
const REJECT_PREORDER = ['BROKER_ERROR', 'PRICE_CHANGED', 'INVALID_SWAP_REQUEST_ID', 'INSTRUMENT_NOT_LISTED_FOR_TRADING_YET'];

const fromAssetRef = createRef();

const TransferInternalModule = ({ width, pair }) => {
    // Init State
    const [state, set] = useState({
        init: false,
        loading: false,
        swapConfigs: null,
        estRate: null,
        loadingEstRate: false,
        shouldRefreshRate: false,
        preOrder: null,
        loadingPreOrder: false,
        processingOrder: false,
        invoiceId: null,
        fromAsset: DEFAULT_PAIR.fromAsset,
        fromAmount: null,
        fromAssetList: null,
        toAsset: DEFAULT_PAIR.toAsset,
        toAmount: null,
        toAssetList: null,
        fromErrors: {},
        toErrors: {},
        focus: 'from',
        search: '',
        inputHighlighted: null,
        changeEstRatePosition: false,
        openAssetList: {},
        openModal: false,
        resultSwap: null
        //... Add new state here
    });

    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));
    // Get state from Rdx
    const wallets = useSelector((state) => state.wallet.SPOT);
    const auth = useSelector((state) => state.auth?.user);
    const assetConfig = useSelector((state) => state.utils.assetConfig);

    // Refs
    const fromAssetListRef = useRef();
    const fromAssetBtnRef = useRef();

    // Use Hooks
    const {
        t,
        i18n: { language }
    } = useTranslation(['navbar', 'common', 'error', 'convert', 'wallet']);
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;
    useOutsideClick(fromAssetListRef, () => state.openAssetList?.from && setState({ openAssetList: { from: false }, search: '' }));

    const config = useMemo(() => {
        return find(assetConfig, { assetCode: state?.fromAsset });
    }, [assetConfig, state.fromAsset]);

    console.log('config: ', config);
    // AVAILABEL ASSET
    const availabelAsset = useMemo(() => {
        return wallets?.[config?.id]?.value;
    }, [wallets]);

    const user = null;

    return (
        <>
            <div className="flex items-center justify-center w-full h-full lg:block lg:w-auto lg:h-auto">
                <div className="relative min-w-[488px] max-w-[508px] rounded-xl">
                    <div className="flex flex-col justify-center items-center">
                        <span className="text-[32px] leading-[38px] font-semibold">Transfer internal</span>
                    </div>
                    <div className="mt-8 p-6 rounded-xl shadow-card_light dark:border dark:border-divider-dark dark:bg-dark bg-white">
                        {/*INPUT WRAPPER*/}
                        <div className="relative flex flex-col gap-y-4">
                            <Input isFocus={state.inputHighlighted === 'from'}>
                                <div className="flex items-center justify-between pb-4 text-txtSecondary dark:text-txtSecondary-dark">
                                    <span>{t('common:from')}</span>
                                    <div className="flex gap-2 items-center">
                                        <span>
                                            {t('common:available_balance')}: {formatWallet(availabelAsset)}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleDepositIconBtn();
                                            }}
                                        >
                                            <SvgAddCircle size={13.3} color={colors.teal} className="cursor-pointer" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between bg-transparent font-semibold text-base">
                                    <div className="flex items-center justify-between">
                                        <NumberFormat
                                            thousandSeparator
                                            allowNegative={false}
                                            getInputRef={fromAssetRef}
                                            className="w-full text-left txtPri-3 placeholder-shown:text-txtSecondary dark:placeholder-shown:text-txtSecondary-dark"
                                            value={state.fromAmount}
                                            onFocus={() => setState({ focus: 'from', inputHighlighted: 'from' })}
                                            onBlur={() => setState({ inputHighlighted: null })}
                                            onValueChange={({ value }) => setState({ fromAmount: value })}
                                            placeholder="0.0000"
                                            decimalScale={getDecimalScale(+config.filters?.[0].stepSize)}
                                        />

                                        <button
                                            className={`border-r border-r-divider dark:border-r-divider-dark mr-3 pr-3 ${
                                                !!state.fromAmount ? 'visible' : 'invisible'
                                            }`}
                                        >
                                            <CloseIcon onClick={() => setState({ fromAmount: '' })} size={width >= 768 ? 20 : 16} className="cursor-pointer" />
                                        </button>
                                    </div>
                                    <div className="relative flex items-center justify-end">
                                        <div
                                            className="uppercase cursor-pointer hover:opacity-50 text-teal"
                                            onClick={() => onMaximumQty('from', availabelAsset?.fromAsset)}
                                        >
                                            max
                                        </div>
                                        <div className="mx-3 w-[1px] bg-divider dark:bg-divider-dark h-6" />
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
                                </div>

                                {/* {renderFromAssetList()} */}
                            </Input>
                            {/* {renderHelperTextFrom()} */}

                            <InputV2
                                value={''}
                                onChange={(value) => {}}
                                placeholder={t('common:to')}
                                suffix={<Search color={colors.darkBlue5} size={16} />}
                                className="pb-0 w-full "
                                // classNameDivInner=" !bg-white !dark:bg-dark-2"
                            />
                            <div
                                style={{
                                    backgroundImage: `url(${getS3Url(`/images/screen/account/bg_transfer_onchain_${isDark ? 'dark' : 'light'}.png`)})`
                                }}
                                className="rounded-xl bg-cover bg-center dark:shadow-popover "
                            >
                                <div className="w-full border p-6 rounded-xl border-green-border_light dark:border-none flex items-center gap-x-3">
                                    {user?.avatar ? (
                                        <img src={user?.avatar} alt="avatar_user" className="rounded-full w-12 h-12 bg-cover" />
                                    ) : (
                                        // <Image width={48} height={48} objectFit="cover" src={user?.avatar} alt="avatar_user" className="rounded-full" />
                                        <BxsUserCircle size={48} />
                                    )}
                                    <div>
                                        <div className="txtPri-1 pl-[1px]">{user?.name ?? '_'}</div>
                                        <div className="mt-1">{t('payment-method:owner_account')}</div>
                                    </div>
                                </div>
                            </div>

                            <InputV2 value={''} onChange={(value) => {}} placeholder={'Content notification'} className="pb-0 w-full " />
                        </div>

                        {/*SWAP BUTTON*/}
                        <ButtonV2 disabled={false} onClick={() => {}} className="mt-8">
                            {t(`futures:mobile.close_all_positions.preview`)}
                        </ButtonV2>
                        {/*END:SWAP BUTTON*/}
                    </div>
                </div>
            </div>
            {/* {renderPreOrderModal()}
            {renderAlertNotification()} */}
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

export default TransferInternalModule;
