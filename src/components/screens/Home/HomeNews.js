import Axios from 'axios'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'react-feather'

import { useTranslation } from 'next-i18next'

import LastedNews from 'components/screens/Home/News/LastedNews'
import News from 'components/screens/Home/News/News'

const HomeNews = () => {
    // Initial State
    const [state, set] = useState({
        loadingNews: false,
        news: null,
        lastedNewsAutoplay: true
    })
    const setState = (state) => set(prevState => ({...prevState, ...state}))

    const { i18n: { language } } = useTranslation()

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

    useEffect(() => {
        getNews(language);
    }, [language])


    return (
        <section className="homepage-news">
            <div className="homepage-news___wrapper mal-container">
                {state.news && <News data={state.news} />}
                {state.news && <LastedNews data={state.news}/>}
            </div>
        </section>
    )
}

export default HomeNews
