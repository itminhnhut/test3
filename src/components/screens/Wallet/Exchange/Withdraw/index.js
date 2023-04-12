import classNames from 'classnames';
import ErrorTriggers from 'components/svg/ErrorTriggers';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useMemo, useRef, useState } from 'react';
import { isFunction, keyBy } from 'lodash';
import useOutsideClick from 'hooks/useOutsideClick';
import { formatNumber, formatWallet } from 'redux/actions/utils';
import NumberFormat from 'react-number-format';
import AssetLogo from 'components/wallet/AssetLogo';
import ChevronDown from 'components/svg/ChevronDown';
import { THEME_MODE } from 'hooks/useDarkMode';
import colors from 'styles/colors';
import { Search } from 'react-feather';
import NoData from 'components/common/V2/TableV2/NoData';
import CheckCircle from 'components/svg/CheckCircle';
import { PATHS } from 'constants/paths';
import { roundToDown } from 'round-to';
import { useTranslation } from 'next-i18next';

export const ErrorMessage = ({ message, show }) => {
    return (
        <div
            className={classNames('overflow-hidden transition-[max-height_opacity] duration-300', {
                'max-h-0 opacity-0 ease-out': !show,
                'max-h-[5rem] opacity-1 ease-in': show
            })}
        >
            <div className="flex items-center mt-3">
                <ErrorTriggers />
                <div className="text-red text-xs leading-4 ml-1">{message}</div>
            </div>
        </div>
    );
};

export const AmountInput = ({
    t,
    amount,
    currentAsset,
    currentTheme,
    contentClassName = '',
    onAmountChange,
    errorMessage,
    available = '',
    max = 0,
    min = 0
}) => {
    const paymentConfigs = useSelector((state) => state.wallet.paymentConfigs) || [];
    const spotWallets = useSelector((state) => state.wallet.SPOT) || {};
    const assetConfigs = useSelector((state) => state.utils.assetConfig) || [];

    const router = useRouter();

    const [search, setSearch] = useState('');
    const [openSelectAsset, setOpenSelectAsset] = useState(false);

    const mapAssetConfig = useMemo(() => keyBy(assetConfigs, 'id'), [assetConfigs]);

    const assetOptions = useMemo(() => {
        return paymentConfigs
            .filter((c) => c.assetCode?.includes(search.toUpperCase()))
            .map((config) => {
                const wallet = spotWallets[config.assetId] || {
                    value: 0,
                    locked_value: 0
                };

                return {
                    ...config,
                    availableValue: wallet.value - wallet.locked_value
                };
            });
    }, [paymentConfigs, spotWallets, search]);
    const ref = useRef(null);

    useOutsideClick(ref, () => setOpenSelectAsset(!openSelectAsset));

    const internalAmountChange = (value) => {
        if (isFunction(onAmountChange)) {
            onAmountChange(value);
        }
    };

    const currentAssetConfig = useMemo(() => {
        return mapAssetConfig[currentAsset?.assetId] || {};
    }, [currentAsset, mapAssetConfig]);

    return (
        <div className="relative">
            <div className="bg-gray-13 dark:bg-darkBlue-3 px-4 py-5 rounded-xl">
                <div className="flex justify-between text-txtSecondary dark:text-txtSecondary-dark mb-4">
                    <p>{t('common:amount')}</p>
                    <p>
                        {t('common:available_balance')}: {formatNumber(available, currentAssetConfig.assetDigit)} {currentAsset?.assetCode}
                    </p>
                </div>
                <div className="flex items-center overflow-hidden select-none">
                    <div className="flex items-center flex-1">
                        <div className="flex-1">
                            <NumberFormat
                                thousandSeparator
                                decimalScale={currentAssetConfig?.assetDigit || 0}
                                allowNegative={false}
                                className="w-full text-2xl font-semibold"
                                value={amount}
                                onValueChange={({ value }) => internalAmountChange(value)}
                            />
                        </div>
                        {+amount < max && (
                            <div className="cursor-pointer text-teal uppercase font-semibold" onClick={() => internalAmountChange(max)}>
                                {t('common:max')}
                            </div>
                        )}
                    </div>
                    <div className="w-[1px] h-6 bg-divider dark:bg-divider-dark mx-2" />
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setOpenSelectAsset(!openSelectAsset)}>
                        <AssetLogo assetCode={currentAsset?.assetCode} size={24} />
                        <span className="font-semibold">{currentAsset?.assetCode}</span>
                        <ChevronDown
                            size={16}
                            className={openSelectAsset ? '!rotate-0' : ''}
                            color={currentTheme === THEME_MODE.DARK ? colors.gray[4] : colors.darkBlue}
                        />
                    </div>
                </div>
            </div>
            <ErrorMessage message={errorMessage} show={!!errorMessage && !!amount} />
            {openSelectAsset && (
                <div
                    ref={ref}
                    className={classNames(
                        'absolute z-10 right-0 left-16 mt-2 flex flex-col py-4 space-y-6 max-h-[436px] min-h-[200px]',
                        'rounded-xl shadow-common overflow-hidden',
                        'bg-white nami-light-shadow',
                        'dark:bg-darkBlue-3 dark:shadow-none dark:border dark:border-divider-dark ',
                        contentClassName
                    )}
                >
                    <div className="px-4">
                        <div className="bg-gray-10 dark:bg-dark-2 h-12 flex items-center px-3 rounded-md">
                            <Search color={colors.darkBlue5} size={16} className="mr-2" />
                            <input type="text" value={search} placeholder={t('common:search')} onChange={(e) => setSearch(e.target.value)} autoFocus />
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1 space-y-3">
                        {!assetOptions.length && <NoData isSearch={!!search} />}
                        {assetOptions.map((asset) => {
                            return (
                                <div
                                    key={asset._id}
                                    onClick={() => {
                                        router
                                            .push(withdrawLinkBuilder(asset.assetCode), null, {
                                                scroll: false
                                            })
                                            .finally(() => {
                                                setOpenSelectAsset(false);
                                            });
                                    }}
                                    className={classNames(
                                        'flex items-center justify-between px-4 py-3 cursor-pointer transition hover:bg-hover dark:hover:bg-hover-dark',
                                        {
                                            'bg-hover dark:bg-hover-dark': asset._id === currentAsset?._id
                                        }
                                    )}
                                >
                                    <div className="flex">
                                        <AssetLogo assetCode={asset?.assetCode} size={24} />
                                        <span className="ml-2">{asset.assetCode}</span>
                                    </div>
                                    <span className="float-right text-txtSecondary">
                                        {formatWallet(asset.availableValue, mapAssetConfig[asset.assetId]?.assetDigit || 0)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export const AddressInput = ({ t, value, onChange, isValid }) => {
    const refInput = useRef();
    const paste = () => {
        navigator.clipboard.readText().then((text) => {
            if (onChange) {
                onChange(text);
                refInput.current?.focus();
            }
        });
    };

    return (
        <div>
            <div className="bg-gray-13 dark:bg-darkBlue-3 px-4 py-5 rounded-xl">
                <p className="text-txtSecondary dark:text-txtSecondary-dark mb-4">{t('common:address_wallet')}</p>
                <div className="flex font-semibold">
                    <div className="flex-1">
                        <input
                            ref={refInput}
                            type="text"
                            className="w-full"
                            placeholder={t('wallet:receive_address_placeholder')}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                        />
                    </div>
                    <div className="text-teal cursor-pointer ml-6" onClick={paste}>
                        {t('common:paste')}
                    </div>
                </div>
            </div>
            <ErrorMessage message={t('wallet:errors.invalid_withdraw_address')} show={!isValid && !!value} />
        </div>
    );
};

export const NetworkInput = ({ t, selected = {}, onChange, networkList = [], currentTheme }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef();

    useOutsideClick(ref, () => setOpen(!open));

    const internalOnChange = (network) => {
        if (isFunction(onChange) && network.withdrawEnable) onChange(network);
        setOpen(false);
    };

    return (
        <div className="relative">
            <div
                className="bg-gray-13 dark:bg-darkBlue-3 px-4 py-5 rounded-xl cursor-pointer"
                onClick={() => {
                    setOpen(true);
                }}
            >
                <p className="text-txtSecondary dark:text-txtSecondary-dark mb-4">{t('wallet:network')}</p>
                <div className="flex justify-between font-semibold">
                    <div className="flex-1">{selected?.name}</div>
                    <ChevronDown className={open ? '!!rotate-0' : ''} size={16} color={currentTheme === THEME_MODE.DARK ? colors.gray[4] : colors.darkBlue} />
                </div>
            </div>

            {open && (
                <div
                    ref={ref}
                    className={classNames(
                        'absolute z-10 right-0 left-14 mt-2 flex flex-col p-4 space-y-6 max-h-[412px] min-h-[200px]',
                        'rounded-xl shadow-common overflow-hidden',
                        'bg-white nami-light-shadow',
                        'dark:bg-darkBlue-3 dark:shadow-none dark:border dark:border-divider-dark '
                    )}
                >
                    <p className="text-txtSecondary dark:text-txtSecondary-dark">{t('wallet:select_network_warning')}</p>
                    <div className="flex-1 overflow-y-auto -mr-3 pr-2 space-y-3">
                        {networkList.map((network) => {
                            const isSelected = network._id === selected?._id;
                            return (
                                <div
                                    key={network._id}
                                    className={classNames(
                                        'p-4 rounded-md border border-transparent cursor-pointer',
                                        'flex items-center hover:bg-gray-13 dark:hover:bg-darkBlue-3',
                                        {
                                            '!cursor-not-allowed': !network?.withdrawEnable,
                                            '!border-teal bg-gray-13 dark:bg-darkBlue-3': isSelected
                                        }
                                    )}
                                    onClick={() => internalOnChange(network)}
                                >
                                    <div className="flex-1">
                                        <p
                                            className={classNames('font-semibold mb-2', {
                                                'text-txtSecondary dark:text-txtSecondary-dark': !network?.withdrawEnable
                                            })}
                                        >
                                            {network.name}
                                        </p>
                                        <div className="text-sm">
                                            <span className="mr-1 text-txtSecondary dark:text-txtSecondary-dark">{t('common:transaction_fee')}:</span>
                                            <span>
                                                {network.withdrawFee} {network.coin}
                                            </span>
                                        </div>
                                    </div>
                                    {isSelected && <CheckCircle />}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export const MemoInput = ({ t, value, onChange, errorMessage }) => {
    return (
        <div>
            <div className="bg-gray-13 dark:bg-darkBlue-3 px-4 py-5 rounded-xl">
                <p className="text-txtSecondary dark:text-txtSecondary-dark mb-4">Memo ({t('common:optional')})</p>
                <input className="w-full" placeholder={t('wallet:receiver_memo')} value={value} onChange={(e) => onChange(e.target.value)} type="text" />
            </div>
            <ErrorMessage message={errorMessage} show={!!errorMessage && !!value} />
        </div>
    );
};

export const Information = ({ min, max, fee, receive, assetCode, className = '' }) => {
    const { t } = useTranslation();
    return (
        <div className={classNames('space-y-2', className)}>
            {[
                {
                    title: t('wallet:min_withdraw'),
                    value: min
                },
                {
                    /* {
                    title: t('wallet:max_withdraw'),
                    value: max
                }, */
                },
                {
                    title: t('wallet:withdraw_fee'),
                    value: fee
                },
                {
                    title: t('wallet:will_receive'),
                    value: receive
                }
            ].map((item, index) => {
                return (
                    <div key={index}>
                        <span className="text-txtSecondary dark:text-txtSecondary-dark">{item.title}</span>
                        <span className="float-right font-semibold">
                            {item.value || '--'} {assetCode}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

const withdrawLinkBuilder = (asset) => {
    return `${PATHS.WALLET.EXCHANGE.WITHDRAW}?asset=${asset}`;
};
