import React, { useState } from 'react';
import HotPool from '../components/HotPool/HotPool';
import { useKeenSlider } from 'keen-slider/react';
import styled from 'styled-components';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';

const HotSection = ({ pools }) => {
    const [activeItem, setActiveItem] = useState(0);
    const [sliderRef, slider] = useKeenSlider({
        initial: 0,
        slidesPerView: 3,
        centered: true,
        loop: true,
        spacing: 16,
        slideChanged: (slide) => setActiveItem(slide.details().relativeSlide),
        breakpoints: {
            '(max-width: 992px)': {
                slidesPerView: 2
            },
            '(max-width: 768px)': {
                slidesPerView: 1.5
            },
            '(max-width: 480px)': {
                slidesPerView: 1
            }
        }
    });
    const { t } = useTranslation();

    const renderDots = () => {
        if (!slider) return null;
        return (
            <div className="p-0 flex items-center space-x-2 justify-center">
                {[...Array(slider.details().size).keys()].map((idx) => {
                    return (
                        <button
                            key={idx}
                            onClick={() => slider.moveToSlideRelative(idx)}
                            className={classNames('dot h-2 transition-all', activeItem === idx ? '!bg-teal w-10 rounded-3xl' : '!bg-gray-12 dark:!bg-gray-7 w-2 rounded-full')}
                        />
                    );
                })}
            </div>
        );
    };

    if (!pools?.length) {
        return null;
    }

    return (
        <div className="">
            <h3 className="mt-20 mb-8 font-semibold text-2xl">{t('earn:hot_pools')}</h3>
            <div>
                <div className="keen-slider" ref={sliderRef}>
                    {pools.map((item, idx) => (
                        <div className="keen-slider__slide" key={item._id || idx}>
                            <HotPool pool={item} />
                        </div>
                    ))}
                </div>
                <div className="keen-slider__dots__wrapper">{renderDots()}</div>
            </div>
        </div>
    );
};

export default HotSection;
