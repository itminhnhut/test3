import MCard from 'components/common/MCard'
import { initMarketWatchItem } from 'utils'
import { memo } from 'react'

const TrendItem = memo(({ pair }) => {
    // exchange pairs
    const _ = initMarketWatchItem(pair, false)

    return (
        <MCard>
            <div className="">

            </div>
        </MCard>
    )
})

export default TrendItem
