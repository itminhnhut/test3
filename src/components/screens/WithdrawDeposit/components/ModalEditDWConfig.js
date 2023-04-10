import classNames from 'classnames';
import Button from 'components/common/V2/ButtonV2/Button';
import ModalV2 from 'components/common/V2/ModalV2';
import TradingInputV2 from 'components/trade/TradingInputV2';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useMemo, useState } from 'react';
import { DEFAULT_PARTNER_MAX, DEFAULT_PARTNER_MIN } from 'redux/actions/const';
import { formatBalanceFiat, formatNumber } from 'redux/actions/utils';
import { isEqual } from 'lodash';

const ModalEditDWConfig = ({ isVisible, partner, loading, onClose, side, onConfirm }) => {
    const [amount, setAmount] = useState({
        min: '',
        max: ''
    });
    const { t } = useTranslation();

    useEffect(() => {
        if (partner && side) {
            const { min, max } = partner?.orderConfig?.[side?.toLowerCase()];
            setAmount({
                min,
                max
            });
        }
    }, [partner, side]);

    const validator = useMemo(
        () => ({
            min: () => {
                let isValid = true,
                    msg = '',
                    isError = false;
                if (!amount.min) {
                    return {
                        isValid: false,
                        isError: true,
                        msg: t('dw_partner:error.miss_input')
                    };
                }
                if (+amount.min < DEFAULT_PARTNER_MIN[side]) {
                    isValid = false;
                    msg = t('dw_partner:error.min_amount', {
                        amount: formatBalanceFiat(DEFAULT_PARTNER_MIN[side], 'VND'),
                        asset: 'VND'
                    });
                }
                if (+amount.min > DEFAULT_PARTNER_MAX[side]) {
                    isValid = false;
                    msg = t('dw_partner:error.max_amount', {
                        amount: formatBalanceFiat(DEFAULT_PARTNER_MAX[side], 'VND'),
                        asset: 'VND'
                    });
                }

                return { isValid, msg, isError: !isValid };
            },
            max: () => {
                let isValid = true,
                    msg = '',
                    isError = false;
                if (!amount.max) {
                    return {
                        isValid: false,
                        isError: true,
                        msg: t('dw_partner:error.miss_input')
                    };
                }
                if (+amount.max <= +amount.min) {
                    isValid = false;
                    msg = 'Số lượng tối đa phải lơn hơn số lượng tối thiểu';
                }
                if (+amount.max > DEFAULT_PARTNER_MAX[side]) {
                    isValid = false;
                    msg = t('dw_partner:error.max_amount', {
                        amount: formatBalanceFiat(DEFAULT_PARTNER_MAX[side], 'VND'),
                        asset: 'VND'
                    });
                }

                if (+amount.max < DEFAULT_PARTNER_MIN[side]) {
                    isValid = false;
                    msg = t('dw_partner:error.min_amount', {
                        amount: formatBalanceFiat(DEFAULT_PARTNER_MIN[side], 'VND'),
                        asset: 'VND'
                    });
                }

                return { isValid, msg, isError: !isValid };
            }
        }),
        [amount.min, amount.max]
    );

    const onConfirmHandler = async () => {
        await onConfirm({ side: side.toLowerCase(), min: +amount.min, max: +amount.max });
    };

    return (
        <ModalV2
            isVisible={isVisible}
            wrapClassName=""
            onBackdropCb={loading ? undefined : () => onClose()}
            className={classNames(`w-[90%] !max-w-[488px] overflow-y-auto select-none border-divider`)}
        >
            <div className="text-2xl font-semibold mb-6">Giới hạn lệnh {t(`common:${side}`)}</div>
            <div className="space-y-4">
                {['min', 'max'].map((key) => (
                    <div key={key}>
                        <label htmlFor={key} className="txtSecond-3 mb-2">
                            {t(`common:${key}`)}
                        </label>
                        <TradingInputV2
                            id={key}
                            value={amount[key]}
                            allowNegative={false}
                            thousandSeparator={true}
                            containerClassName="px-2.5 !bg-gray-12 dark:!bg-dark-2 w-full"
                            inputClassName="!text-left !ml-0"
                            onValueChange={({ value }) => setAmount((prev) => ({ ...prev, [key]: value }))}
                            validator={validator[key]()}
                            errorTooltip={false}
                            decimalScale={0}
                            allowedDecimalSeparators={[',', '.']}
                            clearAble
                            placeHolder={`${t(`common:${key}`)} ${formatNumber(key === 'min' ? DEFAULT_PARTNER_MIN[side] : DEFAULT_PARTNER_MAX[side], 0)} `}
                            errorEmpty
                            renderTail={<div className="text-txtSecondary dark:text-txtSecondary-dark">VND</div>}
                        />
                    </div>
                ))}
            </div>

            <Button
                loading={loading}
                onClick={onConfirmHandler}
                disabled={
                    validator.max().isError ||
                    validator.min().isError ||
                    (+amount.min === partner?.orderConfig?.[side?.toLowerCase()]?.min && +amount.max === partner?.orderConfig?.[side?.toLowerCase()]?.max)
                }
                className="disabled:cursor-default mt-10"
                variants="primary"
            >
                Lưu thay đổi
            </Button>
        </ModalV2>
    );
};

export default ModalEditDWConfig;
