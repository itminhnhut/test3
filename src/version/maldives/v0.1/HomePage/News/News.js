import { useKeenSlider } from 'keen-slider/react'
import { useWindowSize } from 'utils/customHooks'
import { useCallback, useEffect, useState } from 'react'

const News = ({ data }) => {
    const [images, setImages] = useState(null)
    const { width } = useWindowSize()

    const [ref, slider] = useKeenSlider({
        slidesPerView: 1,
        spacing: 15,
        loop: true,
        dot: true,
        // mounted: (s) => s.refresh()
        // breakpoints: {
        //    "(min-width: 320px)": {
        //       slidesPerView: 1,
        //    },
        //    "(min-width: 390px)": {
        //       slidesPerView: 2,
        //    },
        // },
    })

    const renderNews = useCallback(() => {
        if (!data || !images) return null

        return data.map((news, index) => {
            const { feature_img, guid, post_title } = news
            return (
                <div key={`news___${news.ID}`} className="keen-slider__slide number-slide1" title={post_title}>
                    <a href={guid} target="_blank">
                        {images[index]}
                    </a>
                </div>
            )
        })
    }, [data, images])

    useEffect(() => {
        const img = []
        data && data.map(n => img.push(<img src={n.feature_img} alt="nami.io" />))
        setTimeout(() => {
            setImages(img)
        }, 2000)
    }, [data, slider])

    useEffect(() => {
        images && slider && slider.refresh('')
    }, [images, slider])



    return (
        <div className="homepage-news___news">
            <div className="slider-container">
                <div className="keen-slider keen-slider___news" ref={ref}>
                    {renderNews()}
                </div>
            </div>
        </div>
    )
}

export default News
