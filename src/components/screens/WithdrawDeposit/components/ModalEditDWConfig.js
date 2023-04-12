import classNames from 'classnames';
import Button from 'components/common/V2/ButtonV2/Button';
import ModalV2 from 'components/common/V2/ModalV2';
import TradingInputV2 from 'components/trade/TradingInputV2';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useMemo, useState } from 'react';
import { DEFAULT_PARTNER_MAX, DEFAULT_PARTNER_MIN } from 'redux/actions/const';
import { formatBalanceFiat, formatNumber } from 'redux/actions/utils';
import { SIDE } from 'redux/reducers/withdrawDeposit';

const ModalEditDWConfig = ({ isVisible, partner, loading, onClose, side, onConfirm }) => {
    const [amount, setAmount] = useState({
        min: '',
        max: ''
    });
    const { t } = useTranslation();
    const orderConfig = useMemo(() => partner?.orderConfig?.[side?.toLowerCase() || SIDE.BUY], [partner?.orderConfig, side]);

    useEffect(() => {
        if (orderConfig && side) {
            setAmount({
                min: orderConfig?.min,
                max: orderConfig?.max
            });
        }
    }, [orderConfig, side]);

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
                if (+amount.min < orderConfig?.partnerMin) {
                    isValid = false;
                    msg = t('dw_partner:error.min_amount', {
                        amount: formatBalanceFiat(orderConfig?.partnerMin, 'VND'),
                        asset: 'VND'
                    });
                }
                if (+amount.min > orderConfig?.partnerMax) {
                    isValid = false;
                    msg = t('dw_partner:error.max_amount', {
                        amount: formatBalanceFiat(orderConfig?.partnerMax, 'VND'),
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
                    msg = t('dw_partner:error.max_greater_min');
                }
                if (+amount.max > orderConfig?.partnerMax) {
                    isValid = false;
                    msg = t('dw_partner:error.max_amount', {
                        amount: formatBalanceFiat(orderConfig?.partnerMax, 'VND'),
                        asset: 'VND'
                    });
                }

                if (+amount.max < orderConfig?.partnerMin) {
                    isValid = false;
                    msg = t('dw_partner:error.min_amount', {
                        amount: formatBalanceFiat(orderConfig?.partnerMin, 'VND'),
                        asset: 'VND'
                    });
                }

                return { isValid, msg, isError: !isValid };
            }
        }),
        [amount.min, amount.max, orderConfig]
    );

    const onConfirmHandler = async () => {
        +amount.min === partner?.orderConfig?.[side?.toLowerCase()]?.min && +amount.max === partner?.orderConfig?.[side?.toLowerCase()]?.max
            ? onClose()
            : await onConfirm({ side: side?.toLowerCase(), min: +amount.min, max: +amount.max });
    };

    return (
        <ModalV2
            isVisible={isVisible}
            wrapClassName=""
            onBackdropCb={loading ? undefined : () => onClose()}
            className={classNames(`w-[90%] !max-w-[488px] overflow-y-auto select-none border-divider`)}
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onConfirmHandler();
                }}
            >
                <div className="text-2xl font-semibold mb-6">{side && t(`dw_partner:${side?.toLowerCase()}_order_limit`)}</div>
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
                                placeHolder={`${t(`common:${key}`)} ${formatNumber(key === 'min' ? orderConfig?.partnerMin : orderConfig?.partnerMax, 0)} `}
                                errorEmpty
                                renderTail={<div className="text-txtSecondary dark:text-txtSecondary-dark">VND</div>}
                            />
                        </div>
                    ))}
                </div>

                <Button
                    loading={loading}
                    // onClick={}
                    disabled={validator.max().isError || validator.min().isError}
                    className="disabled:cursor-default mt-10"
                    variants="primary"
                >
                    {t('common:save')}
                </Button>
            </form>
        </ModalV2>
    );
};

export default ModalEditDWConfig;
