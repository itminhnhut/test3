import { memo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { TRADING_MODE } from 'redux/actions/const'
import { formatNumber } from 'redux/actions/utils'

// mode = 'all' | 'avbl' | 'locked'

const AvblAsset = memo(
    ({ mode, tradingMode, assetCode, assetId, useSuffix = false }) => {
        const wallets =
            useSelector((state) =>
                tradingMode === TRADING_MODE.EXCHANGE
                    ? state.wallet?.SPOT
                    : state.wallet?.FUTURES
            )?.[assetId] || false

        const assetConfig = useSelector(
            (state) =>
                state.utils.assetConfig?.find(
                    (o) => o.assetCode === assetCode || o.id === assetId
                ) || {}
        )

        // console.log('namidev wallet avbl ', wallets)

        const renderValue = useCallback(() => {
            if (!wallets) return null

            let value = 0
            const decimals =
                assetConfig?.assetDigit !== undefined
                    ? assetConfig?.assetDigit
                    : 8

            switch (mode) {
                case 'all':
                    value = wallets?.value || 0
                    break
                case 'locked':
                    value = wallets?.locked_value || 0
                    break
                case 'avbl':
                default: {
                    if (wallets?.value) {
                        value = wallets.value - (wallets?.locked_value || 0)
                    }
                    break
                }
            }

            return `${value === 0 ? '0.00' : formatNumber(value, decimals)} ${
                useSuffix ? assetConfig?.assetCode : ''
            }`
        }, [wallets, assetConfig])

        return renderValue()
    }
)

export default AvblAsset
