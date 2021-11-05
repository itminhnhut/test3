import { useCallback } from 'react'

import TrendItem from 'components/markets/TrendItem'

const MarketTrend = ({ loading, data }) => {

    // * Initial Slider


    // * Render Handler
    const renderCard = useCallback(() => {
        return data && data.map(d => (
            <div key={d.s}>
                <TrendItem pair={d}/>
            </div>
        ))
    }, [data])

    return renderCard()
}

export default MarketTrend
