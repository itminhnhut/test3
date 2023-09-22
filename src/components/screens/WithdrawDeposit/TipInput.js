import TabV2 from 'components/common/V2/TabV2';
import TradingInputV2 from 'components/trade/TradingInputV2';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatBalanceFiat, formatNanNumber } from 'redux/actions/utils';
import { setFee } from 'redux/actions/withdrawDeposit';

const RCMD_TIPS_LENGTH = 3;

const TipRecommendAmount = ({ minFee, handleChangeTip, fee }) => {
    const rcmdTipAmount = useMemo(() => {
        let result = [minFee];

        for (let i = 0; i < RCMD_TIPS_LENGTH; i++) {
            const copyArr = [...result];
            result = [...result, copyArr.pop() + 5e3];
        }

        return result;
    }, [minFee]);
    return (
        <div className="flex items-center gap-3 mb-4 flex-wrap">
            <TabV2
                variants="suggestion"
                isOverflow
                activeTabKey={+fee}
                onChangeTab={(key) => handleChangeTip({ value: key })}
                tabs={rcmdTipAmount.map((suggestItem) => ({
                    key: suggestItem,
                    children: formatNanNumber(suggestItem, 0)
                }))}
            />
        </div>
    );
};

const TipInput = ({ tipValidator, handleFocusInput, minFee }) => {
    const dispatch = useDispatch();
    const fee = useSelector((state) => state.withdrawDeposit.fee);
    const { t } = useTranslation();

    useEffect(() => {
        if (minFee) {
            dispatch(setFee(minFee));
        }
    }, [minFee]);

    const handleChangeTip = (input = '') => {
        const numberValue = input.value;
        dispatch(setFee(numberValue));
    };
    return (
        <>
            <TradingInputV2
                id="tip_TradingInputV2"
                label={
                    <h1
                        data-tip={t('dw_partner:partner_bonus_tooltip')}
                        data-for="partner_bonus_tooltip"
                        className="txtSecond-3 border-b border-dashed border-darkBlue-5 w-fit"
                    >
                        {t('dw_partner:partner_bonus')}
                    </h1>
                }
                value={fee || ''}
                allowNegative={false}
                thousandSeparator={true}
                containerClassName="px-2.5 !bg-gray-12 dark:!bg-dark-2 w-full"
                inputClassName="!text-left !ml-0"
                onValueChange={handleChangeTip}
                validator={tipValidator}
                errorTooltip={false}
                decimalScale={0}
                allowedDecimalSeparators={[',', '.']}
                clearAble
                placeHolder={t('dw_partner:enter_amount')}
                errorEmpty
                onFocus={handleFocusInput}
                renderTail={<span className="txtSecond-4">VND</span>}
            />
            <div className="txtSecond-5 !text-xs mb-4 mt-2">
                {t('common:min')}: {formatBalanceFiat(minFee, 'VNDC')} VND
            </div>
            <TipRecommendAmount handleChangeTip={handleChangeTip} fee={fee} minFee={minFee} />
        </>
    );
};

export default TipInput;
