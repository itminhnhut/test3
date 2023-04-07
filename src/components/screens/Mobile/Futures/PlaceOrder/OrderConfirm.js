import React, { useState, memo } from 'react';
import Modal from 'components/common/ReModal';
import Button from 'components/common/Button';
import { useTranslation } from 'next-i18next';
import CheckBox from 'components/common/CheckBox';
import { renderCellTable, VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { formatNumber } from 'redux/actions/utils';
import { fetchFuturesSetting } from 'redux/actions/futures';
import { useDispatch, useSelector } from 'react-redux';
import { FuturesSettings } from 'redux/reducers/futures';

const OrderConfirm = memo(({ onClose, onConfirm, data, isShowConfirm, disabled, decimals, decimalSymbol }) => {
    const { t, i18n: { language } } = useTranslation();
    const [hidden, setHidden] = useState(isShowConfirm)
    const auth = useSelector(state => state.auth?.user) || null
    const dispatch = useDispatch()

    const onHandleHidden = () => {
        // localStorage.setItem('show_order_confirm', JSON.stringify({ hidden: !hidden }))
        const params = {
            onusId: auth?.onus_user_id,
            setting: {
                [FuturesSettings.order_confirm]: hidden
            }
        }
        dispatch(fetchFuturesSetting(params))
        setHidden(!hidden)
    }

    return (
        <Modal onusMode={true} isVisible={true} onBackdropCb={onClose} onusClassName="!pt-12 !pb-10">
            <label className="font-semibold text-[1.25rem] leading-6">{t('futures:preferences:order_confirm')}</label>
            <div className="mt-6">
                <div className="flex items-center justify-between text-sm">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('futures:mobile:leverage_v2')}</div>
                    <div>{data?.side === 'Buy' ? 'Long' : 'Short'} {data?.baseAsset + '/' + data?.quoteAsset} <span className="text-green-2">{data?.leverage}x</span></div>
                </div>
                <div className="my-3 h-[1px] w-full bg-gray-12 dark:bg-dark-2"></div>
                <div className="flex items-center justify-between text-sm">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('futures:order_table:type')}</div>
                    <div>{renderCellTable('type', data, t, language)}</div>
                </div>
                {data?.type !== VndcFutureOrderType.Type.MARKET && <>
                    <div className="my-3 h-[1px] w-full bg-gray-12 dark:bg-dark-2"></div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('futures:price')}</div>
                        <div>{formatNumber(data?.price, decimalSymbol)} {data?.quoteAsset}</div>
                    </div>
                </>
                }
                <div className="my-3 h-[1px] w-full bg-gray-12 dark:bg-dark-2"></div>
                <div className="flex items-center justify-between text-sm">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('futures:margin')}</div>
                    <div>{formatNumber(data?.quoteQty / data?.leverage, decimalSymbol)} {data?.quoteAsset}</div>
                </div>
                {data?.sl && <>
                    <div className="my-3 h-[1px] w-full bg-gray-12 dark:bg-dark-2"></div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('futures:stop_loss')}</div>
                        <div className="text-red-2">{formatNumber(data?.sl, decimals?.decimalScalePrice ?? 0)}</div>
                    </div>
                </>
                }
                {data?.tp && <>
                    <div className="my-3 h-[1px] w-full bg-gray-12 dark:bg-dark-2"></div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="text-txtSecondary dark:text-txtSecondary-dark">{t('futures:take_profit')}</div>
                        <div className="text-green-2">{formatNumber(data?.tp, decimals?.decimalScalePrice ?? 0)}</div>
                    </div>
                </>
                }
            </div>
            <div className="mt-6 flex items-center" onClick={onHandleHidden}>
                <CheckBox onusMode={true} active={hidden}
                    boxContainerClassName={`rounded-[2px] ${hidden ? '' : 'border-none !bg-gray-12 dark:!bg-dark-2'}`} />
                <span className="ml-3 whitespace-nowrap text-txtSecondary dark:text-txtSecondary-dark font-medium text-xs">
                    {t('futures:mobile:not_show_this_message')}
                </span>
            </div>
            <div className='flex items-center w-full mt-6'>
                <Button
                    onusMode={true}
                    title={t('futures:cancel')}
                    className={`!h-[3rem] !text-[1rem] !font-semibold`}
                    componentType="button"
                    onClick={onClose}
                />
                <Button
                    onusMode={true}
                    title={t('futures:leverage:confirm')}
                    type="primary"
                    className={`ml-[7px] !h-[3rem] !text-[1rem] !font-semibold`}
                    componentType="button"
                    disabled={disabled}
                    onClick={() => !disabled && onConfirm()}
                />
            </div>
        </Modal>
    );
}, (pre, next) => {
    return pre.open === next.open && pre.disabled === next.disabled
});

export default OrderConfirm;
