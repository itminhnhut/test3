import TradingInputV2 from 'components/trade/TradingInputV2';
import React, { useMemo, useState } from 'react';
import SelectV2 from 'components/common/V2/SelectV2';
import { useTranslation } from 'next-i18next';
import { getDayInterestPercent } from 'redux/actions/utils';
import dynamic from 'next/dynamic';
import { APY_PERCENT, STAKING_RANGE } from 'constants/staking';
import AssetItem from './AssetItem';

const APYInterestChart = dynamic(() => import('./APYInterestChart'), { ssr: false });

const STAKING_CURRENCIES = [
    {
        value: 39,
        code: 'VNST',
        dayInterestPercent: getDayInterestPercent(APY_PERCENT['VNST']),
        title: <AssetItem assetCode="VNST" assetId={39} />
    },
    {
        value: 72,
        code: 'VNDC',
        dayInterestPercent: getDayInterestPercent(APY_PERCENT['VNDC']),
        title: <AssetItem assetCode="VNDC" assetId={72} />
    },
    {
        value: 22,
        code: 'USDT',
        dayInterestPercent: getDayInterestPercent(APY_PERCENT['USDT']),
        title: <AssetItem assetCode="USDT" assetId={22} />
    },
];

const initState = {
    stakingCurrency: STAKING_CURRENCIES[0],
    amountStaking: STAKING_RANGE[72].DEFAULT
};

const CalculateInterest = () => {
    const { t } = useTranslation();

    const [state, set] = useState(initState);
    const setState = (_state) => set((prev) => ({ ...prev, ..._state }));

    return (
        <section className="mt-[88px] lg:mt-[118px] px-3 py-10 md:px-20 md:py-[60px] dark:bg-dark-4 bg-white border-divider dark:border-divider-dark border rounded-xl">
            <div className="text-center space-y-3 mb-10 md:mb-[60px]">
                <div className="text-2xl md:text-5xl font-semibold">{t('staking:calculate_interest.head_title')}</div>
                <div className="text-sm md:text-base text-txtSecondary dark:text-txtSecondary-dark">{t('staking:calculate_interest.sub_title')} </div>
            </div>
            <div className="flex flex-wrap lg:flex-nowrap -mx-5">
                <div className="px-5 mb-10 lg:mb-0 lg:max-w-[440px] w-full space-y-7">
                    <div className="space-y-2">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark text-xs md:text-sm">{t('staking:calculate_interest.select_asset')}</div>
                        <SelectV2
                            onChange={(_, currency) => {
                                setState({ stakingCurrency: currency, amountStaking: STAKING_RANGE[currency.value].DEFAULT });
                            }}
                            options={STAKING_CURRENCIES}
                            value={state.stakingCurrency.value}
                            popoverPanelClassName="!top-full !z-[11] "
                            popoverClassName="dark:!bg-dark-2"
                            className="txtPri-1 !bg-gray-12 dark:!bg-dark-2"
                            optionClassName="!px-3"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark text-xs md:text-sm">{t('common:quantity')}</div>
                        <TradingInputV2
                            id="staking_amount_input"
                            value={state.amountStaking}
                            allowNegative={false}
                            thousandSeparator={true}
                            containerClassName="px-2.5 !bg-gray-12 dark:!bg-dark-2 w-full"
                            inputClassName="!text-left !ml-0 txtPri-2"
                            onValueChange={({ value }) => setState({ amountStaking: value })}
                            decimalScale={state.stakingCurrency.value === 72 ? 0 : 4}
                            allowedDecimalSeparators={[',', '.']}
                            clearAble
                            placeHolder="0"
                            // validator={validator}
                            errorTooltip={false}
                        />
                    </div>
                </div>
                <div className="px-5 w-full lg:w-auto lg:flex-grow">
                    <APYInterestChart
                        amount={state.amountStaking}
                        currencyDayInterest={state.stakingCurrency.dayInterestPercent}
                        currencyId={state.stakingCurrency.value}
                    />
                </div>
            </div>
        </section>
    );
};

export default CalculateInterest;
