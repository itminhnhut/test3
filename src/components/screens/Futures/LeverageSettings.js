import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SET_FUTURES_PRELOADED_LEVERAGE } from 'redux/actions/types'
import { API_FUTURES_LEVERAGE } from 'redux/actions/apis'
import { Minus, Plus, X } from 'react-feather'
import { ScaleLoader } from 'react-spinners'

import classNames from 'classnames'
import SvgWarning from 'components/svg/SvgWarning'
import Button from 'components/common/Button'
import Slider from 'components/trade/InputSlider'
import colors from 'styles/colors'
import Modal from 'components/common/ReModal'
import axios from 'axios'
import { formatNumber } from 'redux/actions/utils'

const FuturesLeverageSettings = ({
    pair,
    isVisible,
    onClose,
    leverage,
    setLeverage,
    pairConfig,
    leverageBracket,
}) => {
    const [loading, setLoading] = useState(false)
    const [_leverage, _setLeverage] = useState(leverage)
    const [_leverageBracket, _setLeverageBracket] = useState(
        pairConfig?.leverageBracket?.[0]
    )

    const onSetLeverage = async (symbol, leverage) => {
        setLoading(true)
        try {
            const { data } = await axios.post(API_FUTURES_LEVERAGE, {
                symbol,
                leverage,
            })
            console.log(data)
            if (data?.status === 'ok') {
                setLeverage(data?.data?.[symbol])
            }
        } catch (error) {
            console.log(`Can't set leverage `, e)
        } finally {
            setLoading(false)
            onClose()
        }
    }

    const renderNotionalCap = useCallback(() => {
        return (
            <span className='text-txtPrimary dark:text-txtPrimary-dark'>
                {formatNumber(
                    _leverageBracket?.notionalCap,
                    pairConfig?.quoteAssetPrecision
                )}{' '}
                {pairConfig?.quoteAsset}
            </span>
        )
    }, [_leverageBracket, pairConfig])

    const renderConfirmButton = useCallback(
        () => (
            <Button
                title={
                    loading ? (
                        <ScaleLoader
                            color={colors.white}
                            width={2}
                            height={12}
                        />
                    ) : (
                        'Confirm'
                    )
                }
                componentType='button'
                className='!h-[36px]'
                type='primary'
                disabled={loading}
                onClick={() => !loading && onSetLeverage(pair, _leverage)}
            />
        ),
        [_leverage, pair, loading]
    )

    useEffect(() => {
        if (_leverage && pairConfig) {
            _setLeverageBracket(
                pairConfig?.leverageBracket?.find(
                    (o) => _leverage >= o?.initialLeverage
                )
            )
        }
    }, [_leverage, pairConfig])

    return (
        <Modal
            isVisible={isVisible}
            onBackdropCb={onClose}
            containerClassName='max-w-[306px] select-none'
        >
            <div className='-mt-1 mb-3 flex items-center justify-between font-bold text-sm'>
                Adjust Leverage
                <div
                    className='flex items-center justify-center w-6 h-6 rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark cursor-pointer'
                    onClick={onClose}
                >
                    <X size={16} />
                </div>
            </div>
            <div className='mb-1.5 font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark'>
                Leverage
            </div>
            <div className='px-2 mb-4 h-[36px] flex items-center bg-gray-4 dark:bg-darkBlue-3 rounded-[4px]'>
                <div className='w-5 h-5 flex items-center justify-center rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark'>
                    <Minus
                        size={10}
                        className='text-txtSecondary dark:text-txtSecondary-dark cursor-pointer'
                        onClick={() =>
                            _leverage > 1 &&
                            _setLeverage((prevState) => prevState - 1)
                        }
                    />
                </div>
                <input
                    value={`${_leverage}x`}
                    onChange={(e) =>
                        _setLeverage(+e.target.value?.trim()?.replace('x', ''))
                    }
                    className='px-2.5 flex-grow text-center text-sm font-medium'
                />
                <div className='w-5 h-5 flex items-center justify-center rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark'>
                    <Plus
                        size={10}
                        className='text-txtSecondary dark:text-txtSecondary-dark cursor-pointer'
                        onClick={() =>
                            _leverage < pairConfig?.leverageConfig?.max &&
                            _setLeverage((prevState) => prevState + 1)
                        }
                    />
                </div>
            </div>
            <div className='mb-3'>
                <Slider
                    useLabel
                    labelSuffix='x'
                    x={_leverage}
                    axis='x'
                    xmax={pairConfig?.leverageConfig?.max}
                    onChange={({ x }) =>
                        x === 0 ? _setLeverage(1) : _setLeverage(x)
                    }
                />
            </div>
            <div className='mb-1 text-xs font-medium text-txtSecondary dark:text-txtSecondary-dark select-none'>
                *Maximum position at current leverage: {renderNotionalCap()}
            </div>
            <span className='block mb-1 font-medium text-xs text-dominant'>
                Check on Leverage & Margin table
            </span>
            <span className='block mb-1 font-medium text-xs text-dominant'>
                Position Limit Enlarge
            </span>
            <div className='mt-2.5 flex items-start'>
                <div className='pt-1'>
                    <SvgWarning size={12} fill={colors.red2} />
                </div>
                <div className='pl-2.5 font-medium text-xs text-red'>
                    Selecting higher leverage such as [10x] increases your
                    liquidation risk. Always manage your rish levels. See help
                    articles for more information.
                </div>
            </div>
            <div className='mt-5 mb-2'>{renderConfirmButton()}</div>
        </Modal>
    )
}

export default FuturesLeverageSettings
