import classNames from 'classnames';
import Button from 'components/common/V2/ButtonV2/Button';
import ModalV2 from 'components/common/V2/ModalV2';
import TradingInputV2 from 'components/trade/TradingInputV2';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useMemo, useState } from 'react';
import { formatBalanceFiat, formatNumber } from 'redux/actions/utils';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import { ALLOWED_ASSET, ALLOWED_ASSET_ID } from '../constants';

const ModalEditDWConfig = ({ isVisible, rate, assetId, partner, loading, onClose, side, onConfirm }) => {
    const [amount, setAmount] = useState({
        min: '',
        max: ''
    });
    const { t } = useTranslation();
    const orderConfig = useMemo(
        () => partner?.orderConfig?.[(side?.toLowerCase() || SIDE.BUY) + (assetId === ALLOWED_ASSET_ID['VNDC'] ? '' : 'Usdt')],
        [partner?.orderConfig, side, assetId]
    );

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
                        amount: formatBalanceFiat(orderConfig?.partnerMin, 'VNDC'),
                        asset: 'VND'
                    });
                }
                if (+amount.min > orderConfig?.partnerMax) {
                    isValid = false;
                    msg = t('dw_partner:error.max_amount', {
                        amount: formatBalanceFiat(orderConfig?.partnerMax, 'VNDC'),
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
                        amount: formatBalanceFiat(orderConfig?.partnerMax, 'VNDC'),
                        asset: 'VND'
                    });
                }

                if (+amount.max < orderConfig?.partnerMin) {
                    isValid = false;
                    msg = t('dw_partner:error.min_amount', {
                        amount: formatBalanceFiat(orderConfig?.partnerMin, 'VNDC'),
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
            : await onConfirm({ side: side?.toLowerCase(), min: +amount.min, max: +amount.max, assetId });
    };

    return (
        <ModalV2
            isMobile
            isVisible={isVisible}
            wrapClassName=""
            onBackdropCb={loading ? undefined : () => onClose()}
            className={classNames(` md:!max-w-[588px] overflow-y-auto select-none border-divider`)}
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onConfirmHandler();
                }}
            >
                <div className="text-2xl font-semibold mb-6">
                    {side && assetId && t(`dw_partner:${side?.toLowerCase()}_order_limit`, { assetCode: assetId && ALLOWED_ASSET[+assetId] })}
                </div>
                <div className="space-y-4">
                    {['min', 'max'].map((key) => (
                        <div key={key}>
                            <label htmlFor={key} className="flex items-center  mb-2 justify-between">
                                <div className="txtSecond-3 ">{t(`common:${key}`)}</div>
                                <div className="flex  items-center space-x-1">
                                    <span className="txtSecond-3">Giá trị {ALLOWED_ASSET[+assetId]} tương ứng:</span>

                                    <span className="font-semibold text-sm max-w-[200px] truncate">
                                        {side && assetId && formatBalanceFiat(amount[key] / rate?.[side]?.[assetId], ALLOWED_ASSET[+assetId])}{' '}
                                        {ALLOWED_ASSET[+assetId]}
                                    </span>
                                </div>
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
