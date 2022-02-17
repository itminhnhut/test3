import { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'

import FuturesFavoritePairItem from './FavoritePairItem'
import colors from 'styles/colors'
import Star from 'components/svg/Star'
import InfoSlider from 'components/markets/InfoSlider'

const FuturesFavoritePairs = ({ forceUpdateState }) => {
    const favoritePairs = useSelector((state) => state.futures.favoritePairs)

    const renderPairItems = useCallback(
        () =>
            favoritePairs.map((pair) => (
                <FuturesFavoritePairItem key={pair?.pair} pair={pair} />
            )),
        [favoritePairs]
    )

    return (
        <div className='h-full flex items-center pr-3'>
            <div className='flex items-center pl-5 pr-[10px] h-full dragHandleArea'>
                <Star size={16} fill={colors.yellow} />
            </div>
            <InfoSlider gutter={18} forceUpdateState={forceUpdateState}>
                {renderPairItems()}
            </InfoSlider>
        </div>
    )
}

export default FuturesFavoritePairs
