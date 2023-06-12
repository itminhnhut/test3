import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import { NAVBAR_USE_TYPE } from 'components/common/NavBar/NavBar';
import FetchApi from 'utils/fetch-api';
import { API_MARKETING_EVENT, API_MARKETING_EVENTS } from 'redux/actions/apis';
import { formatTime, getEventImg } from 'redux/actions/utils';
import Image from 'next/image';

/**
 *
 * @param {{ params: {slug: string}, event: { _id: string, thumbnailImgEndpoint?: string, bannerImgEndpoint?: string, title: string, startTime: string , endTime: string, anticipate: bool, prize: string, postLink: string, isHot: bool, creatorName: string, priority: number, isHidden: bool } }} props
 */
const EventDetailPage = ({ event }) => {
    const { query, isFallback } = useRouter();

    return (
        <MaldivesLayout navMode={NAVBAR_USE_TYPE.FLUENT}>
            <div className="max-w-screen-v3 2xl:max-w-screen-xxl mx-auto">
                {isFallback ? (
                    'loading'
                ) : (
                    <>
                        <h1 className="mt-6 mb:mt-20 text-xl mb:text-4xl font-bold">{event.title}</h1>

                        <div className="flex justify-between flex-wrap mt-8 mb:mt-10 text-xs mb:text-base mb:py-1.5 space-y-3 mb:space-y-0">
                            <div className="flex order-1 mb:order-2">abc</div>
                            <div className="flex order-2 mb:order-1 space-x-4 text-txtSecondary dark:text-txtSecondary-dark">
                                <span>by {event.creatorName}</span>
                                <span>{`${formatTime(event.startTime, 'hh:mm DD/MM/YYYY')} - ${formatTime(event.endTime, 'hh:mm DD/MM/YYYY')}`}</span>
                            </div>
                        </div>

                        <div className="mt-8 mb:mt-10">
                            <Image src={getEventImg(event.bannerImgEndpoint)} width={1216} height={638} className="h-auto" />
                        </div>
                    </>
                )}
            </div>
        </MaldivesLayout>
    );
};

export async function getStaticPaths() {
    try {
        const res = await FetchApi({
            url: process.env.API_URL + API_MARKETING_EVENTS,
            options: {
                method: 'GET'
            },
            params: {
                pageSize: 4,
                currentPage: 1
            }
        });
        const {
            data: { events }
        } = res;
        const paths = events.map(({ slug }) => ({ params: { slug } }));
        console.log({ paths });

        return {
            paths: paths,
            fallback: true // can also be false or 'blocking'
        };
    } catch (e) {
        console.log({ error: e.message });
        return {
            paths: [],
            fallback: true // can also be false or 'blocking'
        };
    }
}

export const getStaticProps = async ({ locale, params, query }) => {
    const { data } = await FetchApi({
        url: `${process.env.API_URL + API_MARKETING_EVENT}/${params.slug}`,
        options: {
            method: 'GET'
        }
    });

    console.log({ url: `${process.env.API_URL + API_MARKETING_EVENT}/${params.slug}` });

    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'navbar', 'marketing_events'])),
            theme: query?.theme || 'dark',
            language: query?.language || 'en',
            params: params,
            event: data
        }
    };
};

export default EventDetailPage;
