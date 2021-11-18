import SvgSpeaker from 'src/components/svg/SvgSpeaker'

import { LANGUAGE_TAG } from 'hooks/useLanguage'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useKeenSlider } from 'keen-slider/react'
import { useWindowSize } from 'utils/customHooks'
import { useTranslation } from 'next-i18next'
import "keen-slider/keen-slider.min.css"

const LastedNews = ({ data }) => {
    const [state, set] = useState({
        loadingNews: false,
        lastedNewsAutoplay: true,
    })
    const setState = (state) => set(prevState => ({...prevState, ...state}))

    const { width } = useWindowSize()
    const { i18n: { language } } = useTranslation()

    const options = {
        slidesPerView: 1,
        centered: true,
        vertical: true,
        loop: true,
        dragStart: () => setState({ lastedNewsAutoplay: false }),
        dragEnd: () => setState({ lastedNewsAutoplay: true }),
    }

    const [lastedNewsRef, lastedNewSlider] = useKeenSlider(options)
    const timer = useRef()

    const renderLastestNews = useCallback(() => {
        if (!data) return null
        return data.map(item => (
            <div className="keen-slider__slide" key={`home_news_${item.ID}__alt`}>
                <a href={item.guid} target="_blank" title={item.post_title}>{item.post_title}</a>
            </div>
        ))
    }, [data])


    useEffect(() => {
        lastedNewsRef.current.addEventListener("mouseover", () => {
            setState({ lastedNewsAutoplay: false })
        })
        lastedNewsRef.current.addEventListener("mouseout", () => {
            setState({ lastedNewsAutoplay: true })
        })
    }, [lastedNewsRef])

    useEffect(() => {
        timer.current = setInterval(() => state.lastedNewsAutoplay && lastedNewSlider && lastedNewSlider.next(), 1800)
        return () => clearInterval(timer.current)
    }, [state.lastedNewsAutoplay, lastedNewSlider])

    useEffect(() => {
        width && lastedNewSlider && lastedNewSlider.resize()
    }, [width, lastedNewSlider])


    useEffect(() => {
        setTimeout(() => {
            setState({options: {
                    slidesPerView: 1,
                    centered: true,
                    vertical: true,
                    loop: true,
                    dragStart: () => setState({ lastedNewsAutoplay: false }),
                    dragEnd: () => setState({ lastedNewsAutoplay: true }),
                }})
        }, 10)
    }, []);

    return (
        <div className="homepage-news___lastest_news_wrapper">
            <div className="homepage-news___lastest___news">
                <div className="homepage-news___lastest___news____left">
                    <SvgSpeaker/>
                    <div className="homepage-news___lasted_slider">
                        <div ref={lastedNewsRef} className="keen-slider">
                            {renderLastestNews()}
                        </div>
                    </div>
                </div>
                <div className="homepage-news___lastest___news____right">
                    {language === LANGUAGE_TAG.VI ? 'Thêm' : 'More'}
                </div>
            </div>
        </div>
    )
}

export default LastedNews
