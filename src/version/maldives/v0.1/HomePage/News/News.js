import { useKeenSlider } from 'keen-slider/react'
import { useWindowSize } from 'utils/customHooks'
import { useCallback, useEffect, useRef, useState } from 'react'
import "keen-slider/keen-slider.min.css"
import { ChevronLeft, ChevronRight } from 'react-feather'

const News = ({ data }) => {
    const [state, set] = useState({
        autoplay: true,
        slideStep: 1,
        currentSlide: 0
    })
    const setState = (state) => set(prevState => ({...prevState, ...state}))
    const { width } = useWindowSize()

    // slider
    const [refNews, slider] = useKeenSlider({
        initial: 0,
        slidesPerView: 1,
        spacing: 12,
        loop: true,
        dot: true,
        slideChanged: slide => setState({ currentSlide: slide.details().relativeSlide }),
        breakpoints: {
            '(min-width: 768px)': {
                slidesPerView: 3
            },
            '(min-width: 1024px)': {
                slidesPerView: 4
            }
        },
    })
    const timer = useRef()


    const renderNews = useCallback(() => {
        if (!data) return null

        return data.map(news => {
            const { feature_img, guid, post_title } = news
            return (
                <div key={`news___${news.ID}`} className="keen-slider__slide number-slide1" title={post_title}>
                    <a href={guid} target="_blank">
                        <img src={feature_img} alt="" />
                    </a>
                </div>
            )
        })
    }, [data])

    const renderControl = useCallback(() => {
        if (!slider || width < 768) return null
        return (
            <div className="keen-slider__slide__control__wrapper mal-container">
                <div className="keen-slider__slide__control__item keen-slider__slide__control__prev"
                     onClick={() => slider.prev()}>
                    <ChevronLeft size={width >= 1024 ? 26 : 18}/>
                </div>
                <div className="keen-slider__slide__control__item keen-slider__slide__control__next"
                     onClick={() => slider.next()}>
                    <ChevronRight size={width >= 1024 ? 26 : 18}/>
                </div>
            </div>
        )
    }, [slider, width])

    useEffect(() => {
        refNews.current.addEventListener("mouseover", () => {
            setState({ autoplay: false })
        })
        refNews.current.addEventListener("mouseout", () => {
            setState({ autoplay: true })
        })
    }, [refNews])

    useEffect(() => {
        timer.current = setInterval(() => state.autoplay && slider && slider.next(), 2300)
        return () => clearInterval(timer.current)
    }, [state.autoplay, slider])

    useEffect(() => {
        width && slider && slider.resize()
    }, [width, slider])

    return (
        <div className="homepage-news___news">
            <div className="slider-container">
                <div className="keen-slider keen-slider___news" ref={refNews}>
                    {renderNews()}
                </div>
                {renderControl()}
            </div>
        </div>
    )
}

export default News
