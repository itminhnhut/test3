import { useKeenSlider } from 'keen-slider/react';
import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import 'keen-slider/keen-slider.min.css';
import styled from 'styled-components';
import { getEventImg, getS3Url } from 'redux/actions/utils';
import useQuery from 'hooks/useQuery';
import FetchApi from 'utils/fetch-api';
import { API_MARKETING_EVENTS } from 'redux/actions/apis';

const Wrapper = styled.div`
    .dots {
        padding: 0 unset;
        align-items: center;
        .dot {
            width: 0.5rem;
            height: 0.5rem;
            transition: all 150ms ease-in-out;
            border-radius: 50%;
            &.active {
                width: 2.5rem;
                border-radius: 24px;
            }
        }
    }
`;

const CarouselItem = ({ banner, link, title }) => {
    return (
        <div className="keen-slider__slide p-0" title={title}>
            <Link href={link} passHref>
                <a target="_blank" className="block bg-gray rounded-2xl overflow-hidden leading-[0]">
                    <Image src={getEventImg(banner)} alt={title} width={1216} height={440} className="object-cover" />
                </a>
            </Link>
        </div>
    );
};

/**
 *
 * @param {{ data: Array<{ _id: string, thumbnailImgEndpoint?: string, bannerImgEndpoint?: string, title: string, startTime: string , endTime: string, anticipate: bool, prize: string, postLink: string, isHot: bool, creatorName: string, priority: number, isHidden: bool }> }} props
 */

const Carousel = ({ data }) => {
    const [activeItem, setActiveItem] = useState(0);
    const [sliderRef, slider] = useKeenSlider({
        initial: 0,
        slidesPerView: 1,
        centered: true,
        loop: true,
        dot: true,
        slideChanged: (slide) => setActiveItem(slide.details().relativeSlide)
    });

    const renderDots = () => {
        if (!slider) return null;
        return (
            <div className="dots">
                {[...Array(slider.details().size).keys()].map((idx) => {
                    return (
                        <button
                            key={idx}
                            onClick={() => slider.moveToSlideRelative(idx)}
                            className={'dot ' + (activeItem === idx ? 'active !bg-teal' : '!bg-gray-12 dark:!bg-gray-7')}
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <Wrapper>
            <div className="keen-slider" ref={sliderRef}>
                {data.map((item, idx) => (
                    <CarouselItem banner={item.bannerImgEndpoint} link="#" key={item._id || idx} title={item.title} />
                ))}
            </div>
            <div className="keen-slider__dots__wrapper">{renderDots()}</div>
        </Wrapper>
    );
};

const EventCarousel = () => {
    const { isLoading, data } = useQuery(
        ['event_carousel'],
        async ({ signal }) => {
            const res = await FetchApi({
                url: API_MARKETING_EVENTS,
                options: {
                    method: 'GET',
                    signal
                }
            });
            return res.data.events;
        },
        {
            persist: true,
            ttl: '2h'
        }
    );

    return (
        <>
            {!isLoading &&
                (data?.length ? (
                    <Carousel data={data} />
                ) : (
                    <Image src="/images/featured/common-featured.png" alt="events" width={1216} height={440} className="object-cover" />
                ))}
            {isLoading && 'Loading'}
        </>
    );
};

export default EventCarousel;
