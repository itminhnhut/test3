import { useSelector } from 'react-redux'
import find from 'lodash/find'
import { useMemo } from 'react'
import { formatWallet } from 'redux/actions/utils'

const AssetValue = (props) => {
    const { assetCode, assetId, value } = props
    const assetConfig = useSelector(state => state.utils.assetConfig)
    if (!assetConfig) return null

    return useMemo(() => {
        const filter = {}
        if (assetCode !== undefined) filter.assetCode = assetCode
        if (assetId !== undefined) filter.id = assetId
        const config = find(assetConfig, filter)
        if (config?.assetDigit) {
            return value !== 0 ? formatWallet(value, config.assetDigit) : '0.0000'
        }
        return ''
    }, [assetCode, assetId])
}

export default AssetValue
