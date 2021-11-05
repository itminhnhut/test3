import { useCallback } from 'react'

import TrendItem from 'components/markets/TrendItem'

const MarketTrend = ({ loading, data }) => {

    // * Initial Slider


    // * Render Handler
    const renderCard = useCallback(() => {
        return data && data.map(d => (
            <div key={d.s} className="keen-slider__slide">
                <TrendItem pair={d}/>
            </div>
        ))
    }, [data])

    return (
        <div>
            {renderCard()}
        </div>
    )
}

export default MarketTrend
