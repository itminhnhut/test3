import { useRouter } from 'next/dist/client/router';
import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import { NAVBAR_USE_TYPE } from 'components/common/NavBar/NavBar';
import FetchApi from 'utils/fetch-api';
import { API_MARKETING_EVENT, API_MARKETING_EVENTS } from 'redux/actions/apis';
import { formatTime, getEventImg } from 'redux/actions/utils';
import Image from 'next/image';
import { Link as IconLink } from 'react-feather';
import { useTranslation } from 'next-i18next';
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
import FacebookFilled from 'components/svg/FacebookFilled';
import TelegramFilled from 'components/svg/TelegramFilled';
import TwitterFilled from 'components/svg/TwitterFilled';
import { FooterRedditFileld } from 'components/svg/RedditFilled';
import { AlarmIcon } from 'components/common/Icons';

const SOCIALS = [
    {
        key: 0,
        name: 'facebook',
        icon: <FacebookFilled color="currentColor" size={20} />
    },
    {
        key: 1,
        name: 'telegram',
        icon: <TelegramFilled color="currentColor" size={20} />
    },
    {
        key: 2,
        name: 'twitter',
        icon: <TwitterFilled color="currentColor" size={20} />
    },
    {
        key: 3,
        name: 'reddit',
        icon: <FooterRedditFileld color="currentColor" size={20} />
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
                <TwitterShareButton title={title} url={url} hashtags={['NamiExchange']} {...rest}>
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
 * @param {{ params: {slug: string}, event:{data { _id: string, thumbnailImgEndpoint?: string, bannerImgEndpoint?: string, title: string, startTime: string , endTime: string, anticipate: bool, prize: string, postLink: string, isHot: bool, creatorName: string, priority: number, isHidden: bool, calendarLink?: string }, article: any} }} props
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
                image={getEventImg(data.bannerImgEndpoint) || 'https://static.namifutures.com/nami.exchange/images/common-featured.png'}
                createdAt={article?.created_at}
                updatedAt={article?.updated_at}
            />
            <MaldivesLayout navMode={NAVBAR_USE_TYPE.FLUENT}>
                <div className="max-w-screen-v3 2xl:max-w-screen-xxl mx-auto pb-20 pt-0 px-4 v3:px-0">
                    <div className="max-w-[51.5rem] m-auto">
                        <h1 className="mt-6 mb:mt-20 text-xl mb:text-4xl font-bold">{data.title}</h1>

                        <div className="flex justify-between items-center flex-wrap mt-6 mb:mt-8 text-xs mb:text-base space-y-3 mb:space-y-0">
                            <div className="flex order-1 mb:order-2 space-x-3">
                                {SOCIALS.map(({ key, name, icon }) => {
                                    return (
                                        <ShareComponent
                                            key={key}
                                            className="dark:!bg-dark-2 !bg-gray-12 !rounded-full !p-2 !cursor-pointer"
                                            url={`${process.env.NEXT_PUBLIC_WEB_V1}/events/${params.slug}`}
                                            title={data.title}
                                            name={name}
                                        >
                                            {icon}
                                        </ShareComponent>
                                    );
                                })}
                                <div className="dark:bg-dark-2 bg-gray-12 rounded-full p-2 cursor-pointer" onClick={copyPageLink}>
                                    <IconLink color="currentColor" size={16} className="!stroke-[3px]" />
                                </div>
                            </div>
                            <div className="flex order-2 mb:order-1 space-x-4 text-txtSecondary dark:text-txtSecondary-dark w-full mb:w-[fit-content]">
                                {article?.primary_author?.name && (
                                    <span>
                                        {t('marketing_events:by')} {article.primary_author.name}
                                    </span>
                                )}
                                <span className="flex items-center space-x-1.5">
                                    <AlarmIcon color="currentColor" size={16} />
                                    <span>{`${formatTime(data.startTime, 'HH:mm dd/MM/yyyy')} - ${formatTime(data.endTime, 'HH:mm dd/MM/yyyy')}`}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 mb:mt-10">
                        <Image src={getEventImg(data.bannerImgEndpoint)} width={1216} height={638} className="h-auto object-cover rounded-xl" />
                    </div>

                    <div className="max-w-[51.5rem] m-auto mt-4">
                        <GhostContent content={article?.html} />
                        {data.calendarLink && (
                            <Link href={data.calendarLink}>
                                <a
                                    className="py-3 px-6 mt-8 w-fit rounded-md font-semibold bg-green-2 hover:bg-green-4 dark:hover:bg-green-4 text-white block"
                                    target="_blank"
                                >
                                    {t('marketing_events:add_to_calendar')}
                                </a>
                            </Link>
                        )}
                        <div className="mt-8">
                            <div className="font-semibold text-base mb:text-lg">{t('marketing_events:download')}</div>
                            <div className="mt-4 flex space-x-6 text-sm mb:text-base">
                                <Link href="https://apps.apple.com/app/id1480302334">
                                    <a
                                        className="py-3 px-4 w-fit flex space-x-2 items-center font-normal whitespace-nowrap bg-gray-10 hover:bg-gray-6 dark:bg-dark-4 dark:hover:bg-dark-5 rounded-md"
                                        target="_blank"
                                    >
                                        <AppleIcon color="currentColor" className="text-teal" />
                                        <span>IOS</span>
                                    </a>
                                </Link>
                                <Link href="https://play.google.com/store/apps/details?id=com.namicorp.exchange">
                                    <a
                                        className="py-3 px-4 w-fit flex space-x-2 items-center font-normal whitespace-nowrap bg-gray-10 hover:bg-gray-6 dark:bg-dark-4 dark:hover:bg-dark-5 rounded-md"
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
                    </div>
                    <RelatedEvents id={data['_id']} />
                    <div className="mb:pb-10"></div>
                </div>
            </MaldivesLayout>
        </>
    );
};

export const getServerSideProps = async ({ locale, params, query }) => {
    try {
        const [{ data }, article] = await Promise.all([
            FetchApi({
                url: `${process.env.API_URL + API_MARKETING_EVENT}/${params.slug}`,
                options: {
                    method: 'GET'
                }
            }),
            getArticle(params.slug)
        ]);

        if (!data || !article) {
            return {
                redirect: {
                    permanent: false,
                    destination: '/404'
                }
            };
        }

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
