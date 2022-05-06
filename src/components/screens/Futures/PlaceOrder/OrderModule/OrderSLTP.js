import CheckBox from 'components/common/CheckBox';
import TradingInput from 'components/trade/TradingInput';
import { SET_FUTURES_PRELOADED_FORM } from 'redux/actions/types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';
import { ChevronDown } from 'react-feather';
import { VndcFutureOrderType } from '../Vndc/VndcFutureOrderType';
import { getS3Url } from 'redux/actions/utils';
import { useState, useRef } from 'react';
import FuturesEditSLTPVndc from '../Vndc/EditSLTPVndc';
import Tooltip from 'components/common/Tooltip';

const FuturesOrderSLTP = ({
    isVndcFutures, orderSlTp,
    setOrderSlTp, decimalScalePrice,
    getValidator, side, pairConfig,
    size, price, stopPrice, lastPrice
}) => {
    const useSltp =
        useSelector((state) => state.futures.preloadedState?.useSltp) || false

    const dispatch = useDispatch()
    const { t } = useTranslation()
    const [showEditSLTP, setShowEditSLTP] = useState(false);
    const rowData = useRef(null);

    const setSLTP = (status) => {
        dispatch({
            type: SET_FUTURES_PRELOADED_FORM,
            payload: { useSltp: !status },
        })
    }

    const onChangeTpSL = (key) => {
        if (!isVndcFutures || !size) return;
        rowData.current = {
            fee: 0,
            side: side,
            quantity: +Number(String(size).replaceAll(',', '')),
            status: 0,
            price: price,
            quoteAsset: pairConfig.quoteAsset,
            symbol: pairConfig.symbol,
            ...orderSlTp
        }
        setShowEditSLTP(true);
    }

    const onConfirm = (data) => {
        setOrderSlTp({
            tp: data.tp,
            sl: data.sl,
        })
        setShowEditSLTP(false);
    }

    return (
        <>

            {/* <Tooltip id="tooltipTPSL" place="left" effect="solid">
                232323
            </Tooltip> */}
            {showEditSLTP &&
                <FuturesEditSLTPVndc
                    isVisible={showEditSLTP}
                    order={rowData.current}
                    onClose={() => setShowEditSLTP(false)}
                    status={rowData.current.status}
                    onConfirm={onConfirm}
                    lastPrice={lastPrice}
                />
            }
            {!isVndcFutures &&
                <CheckBox
                    label='TP-SL'
                    active={useSltp}
                    onChange={() => setSLTP(useSltp)}
                />
            }
            {(useSltp || isVndcFutures) && (
                <>
                    <TradingInput
                        containerClassName='mt-[12px]'
                        label={t('futures:take_profit')}
                        allowNegative={false}
                        value={orderSlTp.tp}
                        decimalScale={decimalScalePrice}
                        validator={getValidator('take_profit')}
                        onValueChange={({ value }) => setOrderSlTp({ ...orderSlTp, tp: value })}
                        labelClassName='whitespace-nowrap capitalize'
                        tailContainerClassName='flex items-center font-medium text-xs select-none'
                        renderTail={() => (
                            <div className='relative group select-none'>
                                <div data-for="tooltipTPSL" className='flex items-center cursor-pointer' onClick={() => onChangeTpSL('tp')} >
                                    {isVndcFutures ? <img src={getS3Url('/images/icon/ic_add.png')} height={16} width={16} /> : 'Mark'}
                                    {!isVndcFutures && <ChevronDown
                                        size={12}
                                        className='ml-1 group-hover:rotate-180'
                                    />
                                    }
                                </div>
                                {!isVndcFutures &&
                                    <div className='overflow-hidden hidden group-hover:block absolute z-30 min-w-[55px] top-full right-0 text-txtPrimary dark:text-txtPrimary-dark rounded-md bg-bgPrimary dark:bg-bgPrimary-dark drop-shadow-onlyLight dark:border dark:border-darkBlue-4'>
                                        <div className='px-3 py-1.5 hover:bg-teal-lightTeal dark:hover:bg-teal-opacity cursor-pointer whitespace-nowrap'>
                                            {t('futures:last_price')}
                                        </div>
                                        <div className='px-3 py-1.5 hover:bg-teal-lightTeal dark:hover:bg-teal-opacity cursor-pointer whitespace-nowrap'>
                                            Mark
                                        </div>
                                    </div>
                                }
                            </div>
                        )}
                    />

                    <TradingInput
                        containerClassName='mt-[12px]'
                        label={t('futures:stop_loss')}
                        allowNegative={false}
                        value={orderSlTp.sl}
                        decimalScale={decimalScalePrice}
                        validator={getValidator('stop_loss')}
                        onValueChange={({ value }) => setOrderSlTp({ ...orderSlTp, sl: value })}
                        labelClassName='whitespace-nowrap capitalize'
                        tailContainerClassName='flex items-center font-medium text-xs select-none'
                        renderTail={() => (
                            <div className='relative group select-none'>
                                <div className='flex items-center cursor-pointer' onClick={() => onChangeTpSL('sl')} >
                                    {isVndcFutures ? <img src={getS3Url('/images/icon/ic_add.png')} height={16} width={16} /> : 'Mark'}
                                    {!isVndcFutures && <ChevronDown
                                        size={12}
                                        className='ml-1 group-hover:rotate-180'
                                    />
                                    }
                                </div>
                                {!isVndcFutures &&
                                    <div className='overflow-hidden hidden group-hover:block absolute z-30 min-w-[55px] top-full right-0 text-txtPrimary dark:text-txtPrimary-dark rounded-md bg-bgPrimary dark:bg-bgPrimary-dark drop-shadow-onlyLight dark:border dark:border-darkBlue-4'>
                                        <div className='px-3 py-1.5 hover:bg-teal-lightTeal dark:hover:bg-teal-opacity cursor-pointer whitespace-nowrap'>
                                            {t('futures:last_price')}
                                        </div>
                                        <div className='px-3 py-1.5 hover:bg-teal-lightTeal dark:hover:bg-teal-opacity cursor-pointer whitespace-nowrap'>
                                            Mark
                                        </div>
                                    </div>
                                }
                            </div>
                        )}
                    />
                </>
            )}
        </>
    )
}

export default FuturesOrderSLTP
