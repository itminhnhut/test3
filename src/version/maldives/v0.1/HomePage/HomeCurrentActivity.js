import { useKeenSlider } from "keen-slider/react"

import "keen-slider/keen-slider.min.css"
import { useState, useEffect, useRef, useCallback } from 'react'
import { useWindowSize } from 'utils/customHooks'

const HomeCurrentActivity = () => {
    // Initial State
    const [state, set] = useState({
        autoplay: true,
    })
    const setState = (state) => set(prevState => ({...prevState, ...state}))

    const { width } = useWindowSize()

    // Inital Keen Slider
    const [sliderRef, slider] = useKeenSlider({
        slidesPerView: 1,
        centered: true,
        vertical: true,
        loop: true,
        dragStart: () => setState({autoplay: false}),
        dragEnd: () => setState({autoplay: true})
    })
    const timer = useRef()

    // Render Handler
    const renderActivityItem = useCallback(() => {
        const mock = []

        for (let i = 0; i < 6; ++i) {
            mock.push(
                <div key={`homepage_user_activity__${i}`} className="keen-slider__slide homepage-activity__slide__item1">
                    <div className="homepage-activity__item___wrapper">
                        <div className="homepage-activity__item__inner">
                            <div className="homepage-activity__item__inner___text value-dominant">
                                NamiXXX****XX{i}
                            </div>
                            <div className="homepage-activity__item__inner___label">
                                Nami ID
                            </div>
                        </div>
                        <div className="homepage-activity__item__inner specific__case">
                            <div className="homepage-activity__item__inner___text text-dominant">
                                Nạp
                            </div>
                            <div className="homepage-activity__item__inner___label">
                                Loại lệnh
                            </div>
                        </div>
                        <div className="homepage-activity__item__inner">
                            <div className="homepage-activity__item__inner___text text-dominant">
                                Thành công
                            </div>
                            <div className="homepage-activity__item__inner___label">
                                Trạng thái
                            </div>
                        </div>
                        <div className="homepage-activity__item__inner">
                            <div className="homepage-activity__item__inner___text text-dominant">
                                Nami Token
                            </div>
                            <div className="homepage-activity__item__inner___label">
                                Tên Token
                            </div>
                        </div>
                        <div className="homepage-activity__item__inner">
                            <div className="homepage-activity__item__inner___text text-dominant">
                                300 Nami
                            </div>
                            <div className="homepage-activity__item__inner___label">
                                Số lượng
                            </div>
                        </div>
                        <div className="homepage-activity__item__inner">
                            <div className="homepage-activity__item__inner___text text-dominant">
                                09:11 06/10/21
                            </div>
                            <div className="homepage-activity__item__inner___label">
                                Thời gian
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        return mock
    }, [])


    useEffect(() => {
        sliderRef.current.addEventListener("mouseover", () => {
            setState({ autoplay: true })
        })
        sliderRef.current.addEventListener("mouseout", () => {
            setState({ autoplay: false })
        })
    }, [sliderRef])

    useEffect(() => {
        timer.current = setInterval(() => !state.autoplay && slider && slider.next(), 3800)
        return () => clearInterval(timer.current)
    }, [state.autoplay, slider])

    useEffect(() => {
        width && slider && slider.resize()
    }, [width, slider])

    return (
        <section className="homepage-activity">
            <div className="homepage-activity___wrapper mal-container">
                <div ref={sliderRef} className="keen-slider">
                    {renderActivityItem()}
                </div>
            </div>
        </section>
    )
}

export default HomeCurrentActivity
