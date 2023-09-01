import React from 'react';
import Link from 'next/link';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { THEME_MODE } from 'hooks/useDarkMode';
import { getS3Url, isFunction } from 'redux/actions/utils';
import Image from 'next/image';
import classNames from 'classnames';

export const SOCIALS_HREF = {
    en: [
        {
            key: 0,
            image: { src: '/images/icon/ic_facebook_v3.png', width: 52, height: 52 },
            href: 'https://www.facebook.com/namifutures',
            title: 'Facebook'
        },
        {
            key: 1,
            image: { src: '/images/icon/ic_facebook_v3_plus.png', width: 52, height: 52 },
            href: 'https://www.facebook.com/groups/namiglobal',
            title: 'Facebook Group'
        },
        {
            key: 2,
            image: { src: '/images/icon/ic_telegram_v3_plus.png', width: 90, height: 52 },
            href: 'https://t.me/NamiGlobal',
            title: 'Telegram'
        },

        {
            key: 3,
            image: { src: '/images/icon/ic_twitter_v3.png', width: 52, height: 52 },
            title: 'Twitter',
            href: 'https://twitter.com/NamiExchange'
        },
        {
            key: 4,
            image: (currentTheme) => ({ src: `/images/icon/ic_coingecko_${currentTheme === THEME_MODE.DARK ? 'v4' : 'v3'}.png`, width: 52, height: 52 }),
            title: 'CoinGecko',
            href: 'https://www.coingecko.com/en/exchanges/nami_exchange'
        }
    ],
    vi: [
        {
            key: 0,
            image: { src: '/images/icon/ic_facebook_v3.png', width: 52, height: 52 },
            href: 'https://www.facebook.com/namifutures',
            title: 'Facebook'
        },
        {
            key: 1,
            image: { src: '/images/icon/ic_facebook_v3_plus.png', width: 52, height: 52 },
            href: 'https://www.facebook.com/groups/nami.exchange',
            title: 'Facebook Group'
        },
        {
            key: 2,
            image: { src: '/images/icon/ic_telegram_v3.png', width: 78, height: 58 },
            href: 'https://t.me/namitradevn',
            title: 'Telegram'
        },

        {
            key: 3,
            image: { src: '/images/icon/ic_twitter_v3.png', width: 52, height: 52 },
            title: 'Twitter',
            href: 'https://twitter.com/NamiExchange'
        },
        {
            key: 4,
            image: (currentTheme) => ({ src: `/images/icon/ic_coingecko_${currentTheme === THEME_MODE.DARK ? 'v4' : 'v3'}.png`, width: 52, height: 52 }),
            title: 'CoinGecko',
            href: 'https://www.coingecko.com/en/exchanges/nami_exchange'
        },
        {
            key: 5,
            image: { src: `/images/icon/ic_tiktok_v3.png`, width: 52, height: 52 },
            title: 'Tiktok',
            href: 'https://www.tiktok.com/@nami.officialchannel'
        },
        {
            key: 6,
            image: { src: `/images/icon/ic_youtube_v3.png`, width: 52, height: 52 },
            title: 'Youtube',
            href: 'https://www.youtube.com/channel/UCYAqEagemhtu0MOtnE7rNJQ'
        }
    ]
};

const HomeCommunity = ({ width, t, language, currentTheme }) => {
    return (
        <section className="homepage-community">
            <div className="homepage-community___wrapper px-4 max-w-screen-v3 2xl:max-w-screen-xxl mx-auto">
                <div className="homepage-community___title">{t('home:community.title')}</div>
                <div className="homepage-community___description">
                    {width >= 992 ? (
                        <>
                            {t('home:community.description_desktop1')}
                            <br />
                            {t('home:community.description_desktop2')}
                        </>
                    ) : (
                        <>{t('home:community.description_mobile')}</>
                    )}
                </div>
                <div className="homepage-community___channel__group">
                    {SOCIALS_HREF[language]?.map((social) => {
                        const img = isFunction(social.image) ? social.image(currentTheme) : social.image;
                        return (
                            <Link href={social.href}>
                                <a
                                    className={classNames(
                                        'group homepage-community___channel__group___item',
                                        {
                                            'md:!w-1/3': language === LANGUAGE_TAG.EN
                                        }
                                    )}
                                    target="_blank"
                                >
                                    <div className="homepage-community___channel__group___item__icon">
                                        <Image alt={`${social.title}_icon`} width={img.width} height={img.height} src={getS3Url(img.src)} />
                                    </div>
                                    <div className="homepage-community___channel__group___item__bg" />
                                    <div className="homepage-community___channel__group___item__label">{social.title}</div>
                                </a>
                            </Link>
                        );
                    })}
                    {/* <Link href="https://www.facebook.com/namifutures">
                        <a className="group homepage-community___channel__group___item" target="_blank">
                            <div className="homepage-community___channel__group___item__icon">
                                <Image alt="facebook_icon" width={52} height={52} src={getS3Url('/images/icon/ic_facebook_v3.png')} />
                            </div>
                            <div className="homepage-community___channel__group___item__bg" />
                            <div className="homepage-community___channel__group___item__label">Facebook</div>
                        </a>
                    </Link>
                    <Link href="https://www.facebook.com/groups/nami.exchange">
                        <a className="group homepage-community___channel__group___item" target="_blank">
                            <div className="homepage-community___channel__group___item__icon">
                                <Image alt="facebook_group_icon" width={52} height={52} src={getS3Url('/images/icon/ic_facebook_v3_plus.png')} />
                            </div>
                            <div className="homepage-community___channel__group___item__bg" />
                            <div className="homepage-community___channel__group___item__label">Facebook Group</div>
                        </a>
                    </Link>
                    <Link href="https://t.me/NamiGlobal">
                        <a className="group homepage-community___channel__group___item" target="_blank">
                            <div className="homepage-community___channel__group___item__icon ">
                                <Image alt="telegram_global_icon" width={90} height={52} src={getS3Url('/images/icon/ic_telegram_v3_plus.png')} />
                            </div>
                            <div className="homepage-community___channel__group___item__bg" />
                            <div className="homepage-community___channel__group___item__label">Telegram Global</div>
                        </a>
                    </Link>
                    <Link href="https://t.me/namitradevn">
                        <a className="group homepage-community___channel__group___item" target="_blank">
                            <div className="homepage-community___channel__group___item__icon">
                                <Image alt="telegram_icon" width={78} height={58} src={getS3Url('/images/icon/ic_telegram_v3.png')} />
                            </div>
                            <div className="homepage-community___channel__group___item__bg" />
                            <div className="homepage-community___channel__group___item__label">Telegram</div>
                        </a>
                    </Link>
                    <Link href="https://twitter.com/NamiExchange">
                        <a className="group homepage-community___channel__group___item" target="_blank">
                            <div className="homepage-community___channel__group___item__icon">
                                <Image alt="twitter_icon" width={52} height={52} src={getS3Url('/images/icon/ic_twitter_v3.png')} />
                            </div>
                            <div className="homepage-community___channel__group___item__bg" />
                            <div className="homepage-community___channel__group___item__label">Twitter</div>
                        </a>
                    </Link>
                    <Link href="https://www.reddit.com/r/NAMIcoin">
                        <a className="group homepage-community___channel__group___item" target="_blank">
                            <div className="homepage-community___channel__group___item__icon">
                                <Image alt="reddit_icon" width={52} height={52} src={getS3Url('/images/icon/ic_reddit_v3.png')} />
                            </div>
                            <div className="homepage-community___channel__group___item__bg" />
                            <div className="homepage-community___channel__group___item__label">Reddit</div>
                        </a>
                    </Link>
                    <Link href="https://nami.io">
                        <a className="group homepage-community___channel__group___item" target="_blank">
                            <div className="homepage-community___channel__group___item__icon">
                                <Image alt="blog_icon" width={52} height={52} src={getS3Url('/images/icon/ic_globe_v3.png')} />
                            </div>
                            <div className="homepage-community___channel__group___item__bg" />
                            <div className="homepage-community___channel__group___item__label">Blog</div>
                        </a>
                    </Link>
                    <Link href={`https://www.coingecko.com/${language}/${language === LANGUAGE_TAG.VI ? 'san_giao_dich' : 'exchanges'}/nami_exchange`}>
                        <a className="group homepage-community___channel__group___item">
                            <div className="homepage-community___channel__group___item__icon">
                                <Image
                                    alt="coingecko_icon"
                                    width={52}
                                    height={52}
                                    src={getS3Url(`/images/icon/ic_coingecko_${currentTheme === THEME_MODE.DARK ? 'v4' : 'v3'}.png`)}
                                />
                            </div>
                            <div className="homepage-community___channel__group___item__bg" />
                            <div className="homepage-community___channel__group___item__label">CoinGecko</div>
                        </a>
                    </Link> */}
                </div>
            </div>
        </section>
    );
};

export default HomeCommunity;
