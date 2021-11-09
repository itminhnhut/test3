import { memo, useCallback } from 'react'
import { shuffle } from 'lodash'

import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Autoplay } from 'swiper'

import MarketTrendItem from 'components/markets/MarketTrendItem'

// Import Swiper styles
import "swiper/css"
SwiperCore.use([Autoplay])

const MarketTrend = memo(({ loading, data }) => {
    // * Initial Slider


    // * Render Handler
    const renderCard = useCallback(() => {
        return data && shuffle(data).map(d => (
            <SwiperSlide key={d.s}>
                <MarketTrendItem pair={d}/>
            </SwiperSlide>
        ))
    }, [data])

    return (
        <div className="py-6 px-4 lg:px-0">
            <Swiper
                loop
                grabCursor
                mousewheel
                direction="horizontal"
                className="mySwiper"
                slidesPerView={1}
                spaceBetween={10}
                autoplay={{
                    "delay": 2500,
                    "disableOnInteraction": true
                }}
                breakpoints={{
                    "576": {
                        "slidesPerView": 2,
                        "spaceBetween": 20
                    },
                    "768": {
                        "slidesPerView": 3,
                        "spaceBetween": 20
                    },
                    "1280": {
                        "slidesPerView": 4,
                        "spaceBetween": 20
                    }
                }}>
                {renderCard()}
            </Swiper>
        </div>
    )
})

export default MarketTrend
