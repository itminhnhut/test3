import classNames from 'classnames';
import Button from 'components/common/V2/ButtonV2/Button';
import InputV2 from 'components/common/V2/InputV2';
import Card from 'components/screens/WithdrawDeposit/components/common/Card';
import AssetLogo from 'components/wallet/AssetLogo';
import useOutsideClick from 'hooks/useOutsideClick';
import find from 'lodash/find';
import keyBy from 'lodash/keyBy';
import orderBy from 'lodash/orderBy';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useMemo, useRef, useState } from 'react';
// import { ChevronDown } from 'react-feather';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import { formatNumber, roundByExactDigit } from 'redux/actions/utils';
import AssetsDropdown from './AssetsDropdown';
import ReceiverInput from './ReceiverInput';
import ModalOtp from 'components/screens/WithdrawDeposit/components/ModalOtp';
import { BxChevronDown } from 'components/svg/SvgIcon';
import SvgChevronDown from 'components/svg/ChevronDown';

export const MAX_NOTE_LENGTH = 70;

const DepositInputCard = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { assetId: assetCode } = router.query;

    // SELECTOR
    const paymentConfigs = useSelector((state) => state.wallet.paymentConfigs) || [];
    const assetConfigs = useSelector((state) => state.utils.assetConfig) || [];
    const spotWallets = useSelector((state) => state.wallet.SPOT) || {};
    const mapAssetConfig = useMemo(() => keyBy(assetConfigs, 'id'), [assetConfigs]);

    // LOCAL STATE
    const assetListRef = useRef();
    const [amount, setAmount] = useState('');
    const [search, setSearch] = useState('');
    const [receiver, setReceiver] = useState({
        type: 'nami-id',
        value: '',
        noteValue: ''
    });
    const [openSelectAsset, setOpenSelectAsset] = useState(false);
    useOutsideClick(assetListRef, () => setOpenSelectAsset(!openSelectAsset));

    // frequently used variable base on state, selector
    const currentAsset = useMemo(() => find(paymentConfigs, { assetCode }), [paymentConfigs, assetCode]);
    const assetBalance = useMemo(() => {
        const balance = spotWallets?.[currentAsset?.assetId];
        return balance?.value - balance?.locked_value;
    }, [spotWallets, currentAsset]);

    const assetOptions = useMemo(() => {
        const listAssetAvailable = paymentConfigs
            .filter((c) => c.assetCode?.includes(search.trim().toUpperCase()))
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

        return orderBy(listAssetAvailable, ['availableValue', 'assetCode'], ['desc', 'asc']);
    }, [paymentConfigs, spotWallets, search]);

    const currentAssetConfig = useMemo(() => {
        return mapAssetConfig[currentAsset?.assetId] || {};
    }, [currentAsset, mapAssetConfig]);

    const isMax = +amount === roundByExactDigit(assetBalance, currentAssetConfig?.assetDigit);

    const onSetMax = () => {
        if (isMax) return;
        setAmount(assetBalance);
    };

    return (
        <>
            <Card className="max-w-[508px] ">
                <div className="bg-gray-13 dark:bg-darkBlue-3 p-4 relative rounded-xl mb-6">
                    {openSelectAsset && (
                        <AssetsDropdown
                            search={search}
                            setOpenSelectAsset={setOpenSelectAsset}
                            setSearch={setSearch}
                            mapAssetConfig={mapAssetConfig}
                            assetOptions={assetOptions}
                            ref={assetListRef}
                        />
                    )}
                    <div className="flex justify-between text-txtSecondary dark:text-txtSecondary-dark mb-4">
                        <p>{t('common:amount')}</p>
                        <p>
                            {t('common:available_balance')}:{' '}
                            <span className="cursor-pointer" onClick={onSetMax}>
                                {formatNumber(assetBalance, currentAssetConfig?.assetDigit)}
                            </span>{' '}
                            {currentAsset?.assetCode}
                        </p>
                    </div>
                    <div className="flex items-center overflow-hidden select-none">
                        <div className="flex items-center flex-1">
                            <div className="flex-1 pr-2">
                                <NumberFormat
                                    thousandSeparator
                                    decimalScale={currentAssetConfig?.assetDigit || 0}
                                    allowNegative={false}
                                    placeholder="0"
                                    className="w-full font-semibold text-2xl"
                                    value={amount}
                                    onValueChange={({ value }) => setAmount(value)}
                                />
                            </div>

                            <button
                                disabled={isMax}
                                className="font-semibold uppercase text-green-3 hover:text-green-4 active:text-green-4 dark:text-green-2 dark:hover:text-green-4 disabled:cursor-default dark:active:text-green-4 disabled:text-txtDisabled dark:disabled:text-txtDisabled-dark "
                                onClick={onSetMax}
                            >
                                MAX
                            </button>
                        </div>
                        <div className="w-[1px] h-6 bg-divider dark:bg-divider-dark mx-2" />
                        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setOpenSelectAsset((prev) => !prev)}>
                            <AssetLogo assetCode={currentAsset?.assetCode} size={24} />
                            <span className="font-semibold">{currentAsset?.assetCode}</span>

                            <div className="text-txtPrimary dark:text-txtPrimary-dark">
                                <SvgChevronDown
                                    className={classNames('transition-transform',{
                                        '!rotate-0': openSelectAsset
                                    })}
                                    size={24}
                                    color={'currentColor'}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <ReceiverInput receiver={receiver} setReceiver={setReceiver} />

                <div className="mt-10">
                    <Button>Rút</Button>
                </div>
            </Card>
            {/* <ModalOtp isVisible={true} otpExpireTime={60} onClose={() => {}} isUseSmartOtp={true}/> */}
        </>
    );
};

export default DepositInputCard;
