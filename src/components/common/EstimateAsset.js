import { useEffect, useState } from 'react'
import { getUsdRate } from 'redux/actions/market'

const INITIAL_STATE = {

}

export const ESTIMATE_ASSET_STATUS = {
    NOT_AVAILABLE: 'not_availble',
    LOADING: 'loading',
    DONE: 'done'
}

const EstimateAsset = ({ assetCode }) => {
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({...prevState, ...state}))

    // Helper
    const getRate = async () => {
        setState({ loading: true })
        const data = await getUsdRate()
        console.log('namidev-DEBUG: => ', data)
        setState({ loading: false })
    }

    useEffect(() => {
        getRate()
    }, [])

    return '--'
}

export default EstimateAsset
