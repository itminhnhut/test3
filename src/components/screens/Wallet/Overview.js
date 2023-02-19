import { useCallback, useMemo, useState, useRef } from 'react';
import { formatNumber as formatWallet, getS3Url, getV1Url, setTransferModal, walletLinkBuilder } from 'redux/actions/utils';
import { Trans, useTranslation } from 'next-i18next';
import { SECRET_STRING } from 'utils';
import { useDispatch, useSelector } from 'react-redux';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

import MCard from 'components/common/MCard';
import useWindowSize from 'hooks/useWindowSize';
import AssetLogo from 'components/wallet/AssetLogo';
import { useRouter } from 'next/router';
import { WalletType } from 'redux/actions/const';
import { EXCHANGE_ACTION } from 'pages/wallet';
import SvgWalletOverview from 'components/svg/SvgWalletOverview';
import SvgWalletExchange from 'components/svg/SvgWalletExchange';
import SvgWalletFutures from 'components/svg/SvgWalletFutures';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { HideIcon, SeeIcon, PartnersIcon, FuturePortfolioIcon, PortfolioIcon } from 'components/svg/SvgIcon';
import ModalNeedKyc from 'components/common/ModalNeedKyc';
import styled from 'styled-components';

const WIDTH_MD = 768;

const INITIAL_STATE = {
    hideAsset: false

    // ...
};

const OverviewWallet = (props) => {
    const {
        allAssets,
        exchangeEstBtc,
        exchangeRefPrice,
        futuresEstBtc,
        futuresRefPrice,
        partnersEstBtc,
        partnersRefPrice,
        stakingEstBtc,
        stakingRefPrice,
        farmingEstBtc,
        farmingRefPrice
    } = props;

    // Init State
    const [state, set] = useState(INITIAL_STATE);
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));

    // Use Hooks
    const { t } = useTranslation();
    const { width } = useWindowSize();
    const dispatch = useDispatch();

    // Memmoized
    const limitExchangeAsset = useMemo(() => {
        let limit = 5;
        if (width >= 1280) limit = 7;
        return limit;
    }, [width]);

    const isSmallScreen = width < WIDTH_MD;

    // Render Handler
    const renderExchangeAsset = useCallback(() => {
        if (!allAssets) return;
        const items = [];
        for (let i = 0; i < limitExchangeAsset; ++i) {
            const key = `overview__spot_${i}`;
            items.push(
                <button
                    onClick={() =>
                        onHandleClick(
                            'deposit_exchange',
                            walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.DEPOSIT, {
                                type: 'crypto',
                                asset: allAssets[i]?.assetCode
                            })
                        )
                    }
                    className="mr-3"
                >
                    <AssetLogo assetCode={allAssets[i]?.assetCode} size={30} />
                </button>
            );
        }

        return items;
    }, [limitExchangeAsset, allAssets]);

    const renderOverviewEstBalance = useCallback(() => {
        return (
            <>
                <div className="font-semibold text-[20px] leading-[28px] md:text-[32px] md:leading-[38px] dark:text-txtPrimary-dark text-txtPrimary">
                    {state.hideAsset
                        ? SECRET_STRING
                        : formatWallet(exchangeEstBtc?.totalValue + futuresEstBtc?.totalValue + partnersEstBtc?.totalValue, exchangeEstBtc?.assetDigit)}{' '}
                    BTC
                </div>
                <div className="font-normal text-sm md:text-base mt-1">
                    {state.hideAsset
                        ? SECRET_STRING
                        : `$ ${formatWallet(exchangeRefPrice?.totalValue + futuresRefPrice?.totalValue + partnersRefPrice?.totalValue, 2)}`}
                </div>
            </>
        );
    }, [exchangeEstBtc, exchangeRefPrice, futuresEstBtc, futuresRefPrice, state.hideAsset]);

    const renderExchangeEstBalance = useCallback(() => {
        return (
            <span className="text-txtPrimary dark:text-txtPrimary-dark text-2xl font-semibold mt-1 whitespace-nowrap leading-7">
                {state.hideAsset
                    ? SECRET_STRING
                    : formatWallet(exchangeEstBtc?.totalValue, exchangeEstBtc?.assetDigit) + ' BTC ~ $' + formatWallet(exchangeRefPrice?.totalValue, 2)}
            </span>
        );
    }, [exchangeEstBtc, exchangeRefPrice, state.hideAsset]);

    const renderFuturesEstBalance = useCallback(() => {
        return (
            <span className="text-txtPrimary dark:text-txtPrimary-dark text-2xl font-semibold mt-1 whitespace-nowrap leading-7">
                {state.hideAsset
                    ? SECRET_STRING
                    : formatWallet(futuresEstBtc?.totalValue, futuresEstBtc?.assetDigit) + ' BTC ~ $' + formatWallet(futuresRefPrice?.totalValue, 2)}
            </span>
        );
    }, [futuresEstBtc, futuresRefPrice, state.hideAsset]);

    const renderPartnersEstBalance = useCallback(() => {
        return (
            <span className="text-txtPrimary dark:text-txtPrimary-dark text-2xl font-semibold mt-1 whitespace-nowrap leading-7">
                {state.hideAsset
                    ? SECRET_STRING
                    : formatWallet(partnersEstBtc?.totalValue, partnersEstBtc?.assetDigit) + ' BTC ~ $' + formatWallet(partnersRefPrice?.totalValue, 2)}
            </span>
        );
    }, [partnersEstBtc, partnersRefPrice, state.hideAsset]);

    // const renderFarmingEstBalance = useCallback(() => {
    //     return (
    //         <>
    //             <span className="font-bold"> {formatWallet(farmingEstBtc?.totalValue, farmingEstBtc?.assetDigit, farmingEstBtc?.totalValue ? 0 : 8)} </span>{' '}
    //             <span className="text-xs font-medium">
    //                 {' '}
    //                 <AssetName assetCode="BTC" />{' '}
    //                 <span className="text-txtSecondary dark:text-txtSecondary-dark ">
    //                     ~ ${formatWallet(farmingRefPrice?.totalValue, farmingRefPrice?.assetDigit, farmingRefPrice?.assetDigit ? 0 : 2)}
    //                 </span>
    //             </span>
    //         </>
    //     );
    // }, [farmingEstBtc, farmingRefPrice]);

    // const renderStakingEstBalance = useCallback(() => {
    //     return (
    //         <>
    //             <span className="font-bold"> {formatWallet(stakingEstBtc?.totalValue, stakingEstBtc?.assetDigit, stakingEstBtc?.totalValue ? 0 : 8)} </span>{' '}
    //             <span className="text-xs font-medium">
    //                 {' '}
    //                 <AssetName assetCode="BTC" />{' '}
    //                 <span className="text-txtSecondary dark:text-txtSecondary-dark ">
    //                     ~ ${formatWallet(stakingRefPrice?.totalValue, stakingRefPrice?.assetDigit, stakingRefPrice?.assetDigit ? 0 : 2)}
    //                 </span>
    //             </span>
    //         </>
    //     );
    // }, [stakingEstBtc, stakingRefPrice]);

    // Check Kyc before redirect to page Deposit / Withdraw
    const router = useRouter();
    const auth = useSelector((state) => state.auth.user) || null;
    const [isOpenModalKyc, setIsOpenModalKyc] = useState(false);

    const handleKycRequest = (href) => {
        if (auth?.kyc_status !== 2) {
            return setIsOpenModalKyc(true);
        } else {
            return router.push(href);
        }
    };

    const flag = useRef(false);
    const onHandleClick = (key, href) => {
        switch (key) {
            case 'deposit_exchange':
                flag.current = true;
                if (href) {
                    handleKycRequest(href);
                } else {
                    handleKycRequest(walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.DEPOSIT, { type: 'crypto' }));
                }
                break;
            case 'withdraw_exchange':
                flag.current = true;
                handleKycRequest(walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.WITHDRAW, { type: 'crypto' }));
                break;
            case 'transfer_exchange':
                flag.current = true;
                dispatch(setTransferModal({ isVisible: true, fromWallet: WalletType.FUTURES, toWallet: WalletType.SPOT }));
                break;
            case 'details_exchange':
                if (flag.current) {
                    flag.current = false;
                    return;
                }
                router.push('/wallet/exchange');
                break;
            case 'transfer_futures':
                flag.current = true;
                dispatch(setTransferModal({ isVisible: true, fromWallet: WalletType.FUTURES, toWallet: WalletType.SPOT }));
                break;
            case 'transfer_partners':
                flag.current = true;
                dispatch(setTransferModal({ isVisible: true, fromWallet: WalletType.PARTNERS, toWallet: WalletType.SPOT }));
                break;
            case 'details_futures':
                if (flag.current) {
                    flag.current = false;
                    return;
                }
                router.push('/wallet/futures');
                break;
            case 'details_partners':
                if (flag.current) {
                    flag.current = false;
                    return;
                }
                router.push('/wallet/partners');
                break;
            default:
                break;
        }
    };

    const [currentTheme] = useDarkMode();

    const ListButton = ({ className }) => {
        return (
            <div className={className}>
                <ButtonV2 className="px-6" onClick={() => handleKycRequest(walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.DEPOSIT, { type: 'crypto' }))}>
                    {t('common:deposit')}
                </ButtonV2>
                <ButtonV2
                    onClick={() => handleKycRequest(walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.WITHDRAW, { type: 'crypto' }))}
                    className="px-6"
                    color="dark"
                    variants="none"
                >
                    {t('common:withdraw')}
                </ButtonV2>
                <ButtonV2 onClick={() => dispatch(setTransferModal({ isVisible: true }))} className="px-6" color="dark" variants="none">
                    {t('common:transfer')}
                </ButtonV2>
            </div>
        );
    };

    return (
        <div className="pb-32">
            <MCard
                addClass={`mt-8 p-4 md:p-8 bg-cover 
            ${
                currentTheme === THEME_MODE.DARK
                    ? 'bg-namiv2-linear-dark border border-divider-dark'
                    : 'bg-namiv2-linear shadow-card_light backdrop-blur-[60px] bg-[#ffffff66]'
            }`}
            >
                <div className="flex flex-col md:flex-row md:items-end md:justify-between tracking-normal">
                    <div>
                        <div className="flex items-center text-sm md:text-base text-txtSecondary dark:text-txtSecondary-dark">
                            <div className="mr-3">{t('wallet:est_balance')}</div>
                            <div
                                className="flex items-center cursor-pointer hover:opacity-80 select-none"
                                onClick={() => setState({ hideAsset: !state.hideAsset })}
                            >
                                {state.hideAsset ? <HideIcon size={isSmallScreen ? 16 : 24} /> : <SeeIcon size={isSmallScreen ? 16 : 24} />}
                            </div>
                        </div>
                        <div className="mt-[52px] md:mt-12 flex items-center justify-between">
                            <div className="hidden md:flex rounded-full dark:bg-listItemSelected-dark w-[64px] h-[64px] items-center justify-center mr-6">
                                <SvgWalletOverview />
                            </div>
                            <div>{renderOverviewEstBalance()}</div>
                            {/* <FuturePortfolioIcon size={24} /> */}
                            <PortfolioIcon className="md:hidden" />
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <ListButton className="flex items-end justify-end h-full w-full mt-3 sm:mt-0 sm:w-auto gap-3" />
                    </div>
                </div>
            </MCard>
            <ListButton className="mt-4 flex items-end justify-end h-full w-full gap-2 md:hidden" />

            {/* Số dư tài sản */}
            <div className="mt-12 md:mt-20 t-common-v2">{t('wallet:asset_balance')}</div>
            <MCard addClass="mt-8 !p-0 bg-trans bg-white !dark:bg-dark">
                {/* mark1 */}
                {/* Exchange */}
                <CardWallet onClick={() => onHandleClick('details_exchange')} isSmallScreen>
                    <AssetBalance title="Exchange" icon={<SvgWalletExchange />} renderEstBalance={renderExchangeEstBalance} />
                    <div className="flex flex-col lg:pl-4 xl:pl-7 sm:flex-row sm:items-center sm:justify-between flex-auto lg:border-l lg:border-divider dark:border-divider-dark dark:group-hover:border-darkBlue-6 group-hover:border-divider">
                        <div className="flex items-center mt-4 lg:mt-0">
                            {renderExchangeAsset()}
                            {/* <Link href={walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.DEPOSIT, { type: 'crypto' })} prefetch={false}> */}
                            <button onClick={() => onHandleClick('deposit_exchange')} className="mr-3">
                                <div
                                    className="min-w-[32px] min-h-[32px] w-[32px] h-[32px] flex items-center justify-center text-medium text-xs rounded-full
                                         bg-gray-10 group-hover:bg-white dark:group-hover:bg-bgButtonDisabled-dark dark:bg-bgButtonDisabled-dark text-txtSecondary dark:text-txtSecondary-dark "
                                >
                                    +6
                                </div>
                            </button>
                            {/* </Link> */}
                        </div>
                        <div className="flex items-center mt-4 lg:mt-0">
                            <ButtonV2 variants="text" className="px-6" onClick={() => onHandleClick('deposit_exchange')}>
                                {t('common:deposit')}
                            </ButtonV2>
                            {/* <HrefButton variants="blank" href={walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.DEPOSIT, { type: 'crypto' })}>
                                    {t('common:deposit')}
                                </HrefButton> */}
                            <div className="h-9 mx-3 border-l border-divider dark:border-divider-dark dark:group-hover:border-darkBlue-6" />
                            <ButtonV2 variants="text" className="px-6" onClick={() => onHandleClick('withdraw_exchange')}>
                                {t('common:withdraw')}
                            </ButtonV2>
                            {/* <HrefButton variants="blank" href={walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.WITHDRAW, { type: 'crypto' })}>
                                    {t('common:withdraw')}
                                </HrefButton> */}
                            <div className="h-9 mx-3 border-l border-divider dark:border-divider-dark dark:group-hover:border-darkBlue-6" />
                            <ButtonV2 variants="text" onClick={() => onHandleClick('transfer_exchange')}>
                                {t('common:transfer')}
                            </ButtonV2>
                        </div>
                    </div>
                </CardWallet>
                <CardWallet onClick={() => onHandleClick('details_futures')} isSmallScreen>
                    <AssetBalance title="Futures" icon={<SvgWalletFutures />} renderEstBalance={renderFuturesEstBalance} />
                    <div className="flex flex-col lg:pl-4 xl:pl-7 sm:flex-row sm:items-center sm:justify-between sm:w-full lg:w-2/3 lg:border-l lg:border-divider dark:border-divider-dark dark:group-hover:border-darkBlue-6 group-hover:border-divider">
                        <div className="flex items-center mt-4 pr-4 lg:mt-0">
                            <Trans>{t('wallet:futures_overview')}</Trans>
                        </div>
                        <div className="flex">
                            <ButtonV2 variants="text" onClick={() => onHandleClick('transfer_futures')}>
                                {t('common:transfer')}
                            </ButtonV2>
                        </div>
                    </div>
                </CardWallet>
                <CardWallet onClick={() => onHandleClick('details_partners')} isSmallScreen>
                    <AssetBalance title="Partners" icon={<PartnersIcon />} renderEstBalance={renderPartnersEstBalance} />
                    <div className="flex flex-col lg:pl-4 xl:pl-7 sm:flex-row sm:items-center sm:justify-between sm:w-full lg:w-2/3 lg:border-l lg:border-divider dark:border-divider-dark dark:group-hover:border-darkBlue-6 group-hover:border-divider">
                        <div className="flex items-center mt-4 pr-4 lg:mt-0">
                            <Trans>{t('wallet:partners_overview')}</Trans>
                        </div>
                        <div className="flex">
                            <ButtonV2 variants="text" onClick={() => onHandleClick('transfer_partners')}>
                                {t('common:transfer')}
                            </ButtonV2>
                        </div>
                    </div>
                </CardWallet>

                {/* <div
                    onClick={() => onHandleClick('details_exchange')}
                    className="p-4 md:p-8 rounded-xl md:rounded-none md:rounded-t-xl cursor-pointer group hover:bg-gray-13 dark:hover:bg-hover-dark"
                >
                    <AssetBalance title="Exchange" icon={<SvgWalletExchange />} renderEstBalance={renderExchangeEstBalance} />
                    <div className="flex flex-col lg:pl-4 xl:pl-7 sm:flex-row sm:items-center sm:justify-between flex-auto lg:border-l lg:border-divider dark:border-divider-dark dark:group-hover:border-darkBlue-6 group-hover:border-divider">
                        <div className="flex items-center mt-4 lg:mt-0">
                            {renderExchangeAsset()}
                            <button onClick={() => onHandleClick('deposit_exchange')} className="mr-3">
                                <div
                                    className="min-w-[32px] min-h-[32px] w-[32px] h-[32px] flex items-center justify-center text-medium text-xs rounded-full
                                         bg-gray-10 group-hover:bg-white dark:group-hover:bg-bgButtonDisabled-dark dark:bg-bgButtonDisabled-dark text-txtSecondary dark:text-txtSecondary-dark "
                                >
                                    +6
                                </div>
                            </button>
                        </div>
                        <div className="flex items-center mt-4 lg:mt-0">
                            <ButtonV2 variants="text" className="px-6" onClick={() => onHandleClick('deposit_exchange')}>
                                {t('common:deposit')}
                            </ButtonV2>
                            <div className="h-9 mx-3 border-l border-divider dark:border-divider-dark dark:group-hover:border-darkBlue-6" />
                            <ButtonV2 variants="text" className="px-6" onClick={() => onHandleClick('withdraw_exchange')}>
                                {t('common:withdraw')}
                            </ButtonV2>
                            <div className="h-9 mx-3 border-l border-divider dark:border-divider-dark dark:group-hover:border-darkBlue-6" />
                            <ButtonV2 variants="text" onClick={() => onHandleClick('transfer_exchange')}>
                                {t('common:transfer')}
                            </ButtonV2>
                        </div>
                    </div>
                </div> */}

                {/* Futures */}
                {/* <div
                    onClick={() => onHandleClick('details_futures')}
                    className="my-4 md:my-0 p-4 md:p-8 rounded-xl md:rounded-none flex flex-col lg:flex-row hover:bg-gray-13 dark:hover:bg-hover-dark cursor-pointer group"
                >
                    <AssetBalance title="Futures" icon={<SvgWalletFutures />} renderEstBalance={renderFuturesEstBalance} />
                    <div className="flex flex-col lg:pl-4 xl:pl-7 sm:flex-row sm:items-center sm:justify-between sm:w-full lg:w-2/3 lg:border-l lg:border-divider dark:border-divider-dark dark:group-hover:border-darkBlue-6 group-hover:border-divider">
                        <div className="flex items-center mt-4 pr-4 lg:mt-0">
                            <Trans>{t('wallet:futures_overview')}</Trans>
                        </div>
                        <div className="flex">
                            <ButtonV2 variants="text" onClick={() => onHandleClick('transfer_futures')}>
                                {t('common:transfer')}
                            </ButtonV2>
                        </div>
                    </div>
                </div> */}

                {/* Partners */}
                {/* <Link href="/wallet/partners"> */}
                {/* <div
                    onClick={() => onHandleClick('details_partners')}
                    className="px-8 py-11 xl:px-10 xl:pl-6 xl:pr-5 flex flex-col lg:flex-row hover:bg-gray-13 dark:hover:bg-hover-dark cursor-pointer rounded-b-xl group"
                >
                    <AssetBalance title="Partners" icon={<PartnersIcon />} renderEstBalance={renderPartnersEstBalance} />
                    <div className="flex flex-col lg:pl-4 xl:pl-7 sm:flex-row sm:items-center sm:justify-between sm:w-full lg:w-2/3 lg:border-l lg:border-divider dark:border-divider-dark dark:group-hover:border-darkBlue-6 group-hover:border-divider">
                        <div className="flex items-center mt-4 pr-4 lg:mt-0">
                            <Trans>{t('wallet:partners_overview')}</Trans>
                        </div>
                        <div className="flex">
                            <ButtonV2 variants="text" onClick={() => onHandleClick('transfer_partners')}>
                                {t('common:transfer')}
                            </ButtonV2>
                        </div>
                    </div>
                </div> */}
                {/* </Link> */}

                {/* Staking */}
                {/* <Link href="/wallet/staking">
                    <div className="px-8 py-11 xl:px-10 xl:pl-6 xl:pr-5 flex flex-col lg:flex-row border-b border-divider dark:border-divider-dark dark:hover:bg-hover hover:bg-teal-5 cursor-pointer rounded-b-xl group">
                        <AssetBalance title="Staking" icon={<SvgWalletStake />} renderEstBalance={renderStakingEstBalance} />
                        <div className="flex flex-col lg:pl-4 xl:pl-7 sm:flex-row sm:items-center sm:justify-between sm:w-full lg:w-2/3 lg:border-l lg:border-divider dark:border-divider-dark dark:group-hover:border-darkBlue-6">
                            <div className="flex items-center mt-4 pr-4 font-medium lg:mt-0 text-xs lg:text-sm">{t('wallet:staking_overview')}</div>
                            <div className="flex items-center mt-4 lg:mt-0">
                                <ButtonV2 variants="blank" href={PATHS.WALLET.STAKING} className="text-sm font-semibold">
                                    {t('common:read_more')}
                                </ButtonV2>
                            </div>
                        </div>
                    </div>
                </Link> */}

                {/* <Link href="/wallet/farming">
                    <div className="px-6 py-6 xl:px-10 xl:pl-6 xl:pr-5 flex flex-col lg:flex-row dark:hover:bg-teal-5 hover:bg-teal-5 cursor-pointer">
                        <div className="md:w-1/3 flex items-center">
                            <div className="min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px]">
                                <img src={getS3Url('/images/icon/ic_farming.png')} width="32" height="32" alt="" />
                            </div>
                            <div className="ml-4 xl:ml-6">
                                <div className="flex flex-wrap items-center font-medium text-xs md:text-sm">
                                    <span className="mr-4">Farming</span>
                                </div>
                                <div className="text-txtPrimary dark:text-txtPrimary-dark text-sm md:text-[16px] xl:text-[18px] mt-0.5 whitespace-nowrap">
                                    {renderFarmingEstBalance()}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col lg:pl-4 xl:pl-7 sm:flex-row sm:items-center sm:justify-between sm:w-full lg:w-2/3 lg:border-l-2 lg:border-divider dark:lg:border-divider-dark">
                            <div className="flex items-center mt-4 pr-4 font-medium lg:mt-0 text-xs lg:text-sm">{t('wallet:farming_overview')}</div>
                            <div className="flex items-center mt-4 lg:mt-0">
                                <Link href={PATHS.WALLET.FARMING} prefetch={false}>
                                    <a className="w-[90px] h-[32px] mr-2 flex items-center justify-center cursor-pointer rounded-md bg-bgContainer dark:bg-bgContainer-dark text-xs xl:text-sm text-medium text-center py-1.5 border border-dominant text-dominant hover:text-white hover:!bg-dominant">
                                        {t('common:read_more')}
                                    </a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Link> */}
            </MCard>
            <ModalNeedKyc isOpenModalKyc={isOpenModalKyc} onBackdropCb={() => setIsOpenModalKyc(false)} />
        </div>
    );
};

const AssetBalance = ({ title, icon, renderEstBalance }) => {
    return (
        <div className="min-w-[530px] max-w-[530px] flex items-center">
            <div className="min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] p-3 rounded-full bg-transparent dark:bg-dark-2">{icon}</div>
            <div className="ml-4 xl:ml-6 flex flex-col justify-between h-full">
                <span className="mr-4 text-txtSecondary dark:text-txtSecondary-dark text-sm">{title}</span>
                {renderEstBalance()}
            </div>
        </div>
    );
};
// className="p-4 md:p-8 rounded-xl md:rounded-none md:rounded-t-xl cursor-pointer group hover:bg-gray-13 dark:hover:bg-hover-dark"

const CardWallet = styled.div.attrs(({ onClick, isSmallScreen }) => ({
    className: `dark:bg-dark-4 bg-white cursor-pointer group hover:bg-gray-13 dark:hover:bg-hover-dark ${
        isSmallScreen
            ? 'p-4 rounded-xl first:mt-0 mt-4'
            : 'p-8 first:rounded-t-xl last:rounded-b-xl border-x first:border-t last:border-b border-divider dark:border-transparent'
    }`,
    onClick: onClick
}))``;

export default OverviewWallet;
