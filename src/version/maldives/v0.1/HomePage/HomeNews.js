import Slider from 'react-slick'
import Axios from 'axios'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useWindowSize } from 'utils/customHooks'
import { ChevronLeft, ChevronRight } from 'react-feather'

import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const HomeNews = () => {
    // Initial State
    const [state, set] = useState({
        loadingNews: false,
        news: null,
    })
    const setState = (state) => set(prevState => ({...prevState, ...state}))

    const { width } = useWindowSize()

    // Slider Settings
    const settings = useMemo(() => {
        const common = {
            dots: true,
            arrows: false,
            // autoplay: true,
            speed: 300,
            variableWidth: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            swipeToSlide: true,
            centerMode: true,
            infinite: true,
        }
        if (width >= 768) {
            return {
                ...common,
                slidesToShow: 3,
                slidesToScroll: 2,
                centerMode: false,
                arrows: true,
                nextArrow: <ControlArrows direction="next" />,
                prevArrow: <ControlArrows direction="prev" />
            }
        }
        return common
    }, [width])

    // Helper
    const getNews = async (lang = 'vi') => {
        setState({ loadingNews: true })
        try {
            const { status, data: news } = await Axios.get(`https://nami.io/api/v1/top_posts?language=${lang}`)
            if (status === 200 && news) {
                setState({ news })
            }
        } catch (e) {
            console.log('Cant get news data: ', e)
        } finally {
            setState({ loadingNews: false })
        }
    }

    // Render Handler
    const renderNewsItem = useCallback(() => {
        if (!state.news) return null;
        return state.news.map(news => (
            <div key={`home_news_${news.ID}`} className="homepage-news___slider__item">
                <img src={news.feature_img} alt="nami.io"/>
            </div>
            ))
    }, [state.news])

    useEffect(() => {
        getNews();
    }, [])

    return (
        <section className="homepage-news">
            <div className="homepage-news___wrapper mal-container">
                <Slider {...settings}>
                    {renderNewsItem()}
                </Slider>
            </div>
        </section>
    )
}

const ControlArrows = (props) => {
    const { className, style, onClick, direction } = props
    return (
        <div
            className={className}
            style={{ ...style, display: "block"}}
            onClick={onClick}
        >
            {direction === 'next' ? <ChevronRight/> : <ChevronLeft/>}
        </div>
    );
}

export default HomeNews
