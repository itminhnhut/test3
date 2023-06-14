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
import EventItem, { SkeletonEventItem } from '../EventItem/EventItem';
import { useRouter } from 'next/router';
import NoData from 'components/common/V2/TableV2/NoData';
import { useTranslation } from 'next-i18next';


const MAX_SIZE = 5;

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
                {data.slice(0, MAX_SIZE).map((item, idx) => (
                    <div className="keen-slider__slide" key={item._id || idx}>
                        <EventItem {...item} />
                    </div>
                ))}
            </div>
            <div className="keen-slider__dots__wrapper">{renderDots()}</div>
        </Wrapper>
    );
};

const RelatedEvents = ({ id = '' }) => {
    const { isLoading, data: posts } = useQuery(
        ['event_carousel'],
        async ({ signal }) => {
            const res = await FetchApi({
                url: API_MARKETING_EVENTS,
                options: {
                    method: 'GET',
                    signal
                },
                params: {
                    pageSize: 6
                }
            });
            return res.data.events;
        },
        {
            persist: true,
            ttl: '2h'
        }
    );

    const data = posts?.filter?.(post => post["_id"] !== id)
    const { t } = useTranslation();

    return (
        <>
            {!isLoading && (
                <>
                    {data?.length ? (
                        <div className="mt-12 mb:mt-20">
                            <h3 className="text-xl mb:text-2xl font-semibold">{t('marketing_events:related_post')}</h3>
                            <div className="mt-5 mb:mt-8">
                                <Carousel data={data} id={id} />
                            </div>
                        </div>
                    ) : (
                        <div className="mt-8 py-[72px] px-[53px] flex items-center flex-col justify-center">
                            <NoData isAuth={true} isSearch text={t('marketing_events:no_related')} />
                        </div>
                    )}
                </>
            )}
            {isLoading && <SkeletonEventItem />}
        </>
    );
};

export default RelatedEvents;
