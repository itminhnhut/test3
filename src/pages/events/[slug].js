import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import { NAVBAR_USE_TYPE } from 'components/common/NavBar/NavBar';
import FetchApi from 'utils/fetch-api';
import { API_MARKETING_EVENT, API_MARKETING_EVENTS } from 'redux/actions/apis';
import { formatTime, getEventImg } from 'redux/actions/utils';
import Image from 'next/image';
import { Facebook, Link as IconLink } from 'react-feather';
import { useTranslation } from 'next-i18next';
import { getSocialImage } from 'components/common/Footer/SocialsLink';
import { useCopyToClipboard } from 'react-use';
import toast from 'utils/toast';
import { FacebookShareButton, TelegramShareButton, TwitterShareButton, RedditShareButton } from 'react-share';
import Button from 'components/common/V2/ButtonV2/Button';
import { AndroidIcon, AppleIcon } from 'components/svg/SvgIcon';
import { getArticle } from 'utils';
import Link from 'next/link';
import SEO from 'components/common/SEO';
import GhostContent from 'components/screens/Support/GhostContent';
import RelatedEvents from 'components/screens/Events/Detail/RelatedEvents';

const SOCIALS = [
    {
        key: 0,
        name: 'facebook'
    },
    {
        key: 1,
        name: 'telegram'
    },
    {
        key: 2,
        name: 'twitter'
    },
    {
        key: 3,
        name: 'reddit'
    }
];

const communitiy = [
    { platform: 'telegram', route: 'https://t.me/namitradevn' },
    { platform: 'telegram_international', route: 'https://t.me/NamiGlobal' },
    { platform: 'website', route: 'https://t.me/NamiGlobal' },
    { platform: 'twitter', route: 'https://nami.exchange' },
    { platform: 'facebook', route: 'https://www.facebook.com/namifutures' }
];

const ShareComponent = ({ name, title, url, children, ...rest }) => {
    switch (name) {
        case 'telegram':
            return (
                <TelegramShareButton title={title} url={url} {...rest}>
                    {children}
                </TelegramShareButton>
            );
        case 'twitter':
            return (
                <TwitterShareButton title={title} url={url} hashtags="#NamiExchange" {...rest}>
                    {children}
                </TwitterShareButton>
            );
        case 'reddit':
            return (
                <RedditShareButton title={title} url={url} {...rest}>
                    {children}
                </RedditShareButton>
            );
        default:
            return (
                <FacebookShareButton title={title} url={url} hashtag="#NamiExchange" {...rest}>
                    {children}
                </FacebookShareButton>
            );
    }
};

/**
 *
 * @param {{ params: {slug: string}, event:{data { _id: string, thumbnailImgEndpoint?: string, bannerImgEndpoint?: string, title: string, startTime: string , endTime: string, anticipate: bool, prize: string, postLink: string, isHot: bool, creatorName: string, priority: number, isHidden: bool }, article: any} }} props
 */
const EventDetailPage = ({ event, params }) => {
    const { data, article } = event;
    const { asPath, push } = useRouter();
    const { t } = useTranslation();

    const [, copy] = useCopyToClipboard();

    const copyPageLink = () => {
        copy(process.env.NEXT_PUBLIC_WEB_V1 + `/events/${params.slug}`);
        toast({ text: `${t('common:copied')} link`, type: 'success', duration: 1000 });
    };

    return (
        <>
            <SEO
                title={article?.title}
                url={asPath}
                description={article?.excerpt}
                image={article?.feature_image || 'https://static.namifutures.com/nami.exchange/images/common-featured.png'}
                createdAt={article?.created_at}
                updatedAt={article?.updated_at}
            />
            <MaldivesLayout navMode={NAVBAR_USE_TYPE.FLUENT}>
                <div className="max-w-screen-v3 2xl:max-w-screen-xxl mx-auto pb-20 pt-0 px-4 v3:px-0">
                    <h1 className="mt-6 mb:mt-20 text-xl mb:text-4xl font-bold">{data.title}</h1>

                    <div className="flex justify-between flex-wrap mt-8 mb:mt-10 text-xs mb:text-base mb:py-1.5 space-y-3 mb:space-y-0">
                        <div className="flex order-1 mb:order-2 space-x-3">
                            {SOCIALS.map(({ key, name }) => {
                                const SocialIcon = getSocialImage(name);
                                return (
                                    <ShareComponent
                                        key={key}
                                        className="dark:!bg-dark-2 !bg-gray-12 !rounded-full !p-2 !cursor-pointer"
                                        url={`${process.env.NEXT_PUBLIC_WEB_V1}/events/${params.slug}`}
                                        title={data.title}
                                    >
                                        {SocialIcon}
                                    </ShareComponent>
                                );
                            })}
                            <div className="dark:bg-dark-2 bg-gray-12 rounded-full p-2 cursor-pointer" onClick={copyPageLink}>
                                <IconLink color="currentColor" size={16} className="!stroke-[3px]" />
                            </div>
                        </div>
                        <div className="flex order-2 mb:order-1 space-x-4 text-txtSecondary dark:text-txtSecondary-dark">
                            {data.creatorName && (
                                <span>
                                    {t('common:by')} {data.creatorName}
                                </span>
                            )}
                            <span>{`${formatTime(data.startTime, 'HH:mm dd/MM/yyyy')} - ${formatTime(data.endTime, 'HH:mm dd/MM/yyyy')}`}</span>
                        </div>
                    </div>

                    {/* <div className="mt-8 mb:mt-10">
                        <Image src={getEventImg(data.bannerImgEndpoint)} width={1216} height={638} className="h-auto object-cover" />
                    </div> */}

                    <GhostContent content={article?.html} />

                    <Button variants="primary" className="py-3 px-6 w-fit mt-8">
                        {t('marketing_events:add_to_calendar')}
                    </Button>

                    <div className="mt-8">
                        <div className="font-semibold text-base mb:text-lg">{t('marketing_events:download')}</div>
                        <div className="mt-4 flex space-x-6 text-sm mb:text-base">
                            <Link href="https://apps.apple.com/app/id1480302334">
                                <a
                                    className="py-3 px-4 w-fit flex space-x-2 items-center font-normal whitespace-nowrap bg-gray-10 hover:bg-gray-6 text-gray-15 dark:bg-dark-2 dark:hover:bg-dark-5 dark:text-gray-7 rounded-md"
                                    target="_blank"
                                >
                                    <AppleIcon color="currentColor" className="text-teal" />
                                    <span>IOS</span>
                                </a>
                            </Link>
                            <Link href="https://play.google.com/store/apps/details?id=com.namicorp.exchange">
                                <a
                                    className="py-3 px-4 w-fit flex space-x-2 items-center font-normal whitespace-nowrap bg-gray-10 hover:bg-gray-6 text-gray-15 dark:bg-dark-2 dark:hover:bg-dark-5 dark:text-gray-7 rounded-md"
                                    target="_blank"
                                >
                                    <AndroidIcon color="currentColor" className="text-teal" />
                                    <span>Android</span>
                                </a>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="text-base mb:text-lg font-semibold">{t('marketing_events:community:title')}</div>
                        {communitiy.map(({ platform, route }) => (
                            <div className="text-xs mb:text-base mt-3">
                                <span>{t(`marketing_events:community:${platform}`)}: </span>
                                <Link href={route}>
                                    <a target="_blank" className="text-teal">
                                        {route}
                                    </a>
                                </Link>
                            </div>
                        ))}
                    </div>

                    <RelatedEvents id={data["_id"]} />
                </div>
            </MaldivesLayout>
        </>
    );
};

const fallbackSlug = 'the-ranking-of-nao-futures-vndc-nami-championship-season-7-week-1'; // dev only

export const getServerSideProps = async ({ locale, params, query }) => {
    try {
        const [{ data }, article] = await Promise.all([
            FetchApi({
                url: `${process.env.API_URL + API_MARKETING_EVENT}/${params.slug}`,
                options: {
                    method: 'GET'
                }
            }),
            getArticle(fallbackSlug)
        ]);

        return {
            props: {
                ...(await serverSideTranslations(locale, ['common', 'navbar', 'marketing_events'])),
                theme: query?.theme || 'dark',
                language: query?.language || 'en',
                params: params,
                event: {
                    data,
                    article
                }
            }
        };
    } catch (e) {
        console.log({ error: e.message });
        return {
            redirect: {
                permanent: false,
                destination: '/404'
            }
        };
    }
};

export default EventDetailPage;
