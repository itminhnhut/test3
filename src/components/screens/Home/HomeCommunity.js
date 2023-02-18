import React from 'react';
import Link from 'next/link';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { getS3Url } from 'redux/actions/utils';

const HomeCommunity = ({
    width,
    t,
    language
}) => {

    return (
        <section className="homepage-community">
            <div className="homepage-community___wrapper mal-container">
                <div className="homepage-community___title">{t('home:community.title')}</div>
                <div className="homepage-community___description">
                    {width >= 992 ? (
                        <>
                            {t('home:community.description_desktop1')}
                            <br/>
                            {t('home:community.description_desktop2')}
                        </>
                    ) : (
                        <>{t('home:community.description_mobile')}</>
                    )}
                </div>
                <div className="homepage-community___channel__group">
                    <Link href="https://www.facebook.com/namifutures">
                        <a className="group homepage-community___channel__group___item" target="_blank">
                            <div className="homepage-community___channel__group___item__icon">
                                <img src={getS3Url('/images/icon/ic_facebook_v3.png')} width="50" height="50"/>
                            </div>
                            <div className="homepage-community___channel__group___item__bg"/>
                            <div className="homepage-community___channel__group___item__label group-hover:underline">Facebook</div>
                        </a>
                    </Link>
                    <Link href="https://www.facebook.com/groups/nami.exchange">
                        <a className="group homepage-community___channel__group___item" target="_blank">
                            <div className="homepage-community___channel__group___item__icon">
                                <img src={getS3Url('/images/icon/ic_facebook_v3.png')} width="50" height="50"/>
                            </div>
                            <div className="homepage-community___channel__group___item__bg"/>
                            <div className="homepage-community___channel__group___item__label group-hover:underline">Facebook Group</div>
                        </a>
                    </Link>
                    <Link href="https://t.me/namitrade">
                        <a className="group homepage-community___channel__group___item" target="_blank">
                            <div className="homepage-community___channel__group___item__icon">
                                <img src={getS3Url('/images/icon/ic_telegram_v3.png')} width="50" height="50"/>
                            </div>
                            <div className="homepage-community___channel__group___item__bg"/>
                            <div className="homepage-community___channel__group___item__label group-hover:underline">Telegram Global</div>
                        </a>
                    </Link>
                    <Link href="https://t.me/namitradevn">
                        <a className="group homepage-community___channel__group___item" target="_blank">
                            <div className="homepage-community___channel__group___item__icon">
                                <img src={getS3Url('/images/icon/ic_telegram_v3.png')} width="50" height="50"/>
                            </div>
                            <div className="homepage-community___channel__group___item__bg"/>
                            <div className="homepage-community___channel__group___item__label group-hover:underline">Telegram</div>
                        </a>
                    </Link>
                    <Link href="https://twitter.com/NamiTrade">
                        <a className="group homepage-community___channel__group___item" target="_blank">
                            <div className="homepage-community___channel__group___item__icon">
                                <img src={getS3Url('/images/icon/ic_twitter_v3.png')} width="50" height="50"/>
                            </div>
                            <div className="homepage-community___channel__group___item__bg"/>
                            <div className="homepage-community___channel__group___item__label group-hover:underline">Twitter</div>
                        </a>
                    </Link>
                    <Link href="https://www.reddit.com/r/NAMIcoin">
                        <a className="group homepage-community___channel__group___item" target="_blank">
                            <div className="homepage-community___channel__group___item__icon">
                                <img src={getS3Url('/images/icon/ic_reddit_v3.png')} width="50" height="50"/>
                            </div>
                            <div className="homepage-community___channel__group___item__bg"/>
                            <div className="homepage-community___channel__group___item__label group-hover:underline">Reddit</div>
                        </a>
                    </Link>
                    <Link href="https://nami.io">
                        <a className="group homepage-community___channel__group___item" target="_blank">
                            <div className="homepage-community___channel__group___item__icon">
                                <img src={getS3Url('/images/icon/ic_globe_v3.png')} width="50" height="50"/>
                            </div>
                            <div className="homepage-community___channel__group___item__bg"/>
                            <div className="homepage-community___channel__group___item__label group-hover:underline">Blog</div>
                        </a>
                    </Link>
                    <Link
                        href={`https://www.coingecko.com/${language}/${language === LANGUAGE_TAG.VI ? 'ty_gia' : 'coins'}/nami-corporation-token`}>
                        <a className="group homepage-community___channel__group___item">
                            <div className="homepage-community___channel__group___item__icon">
                                <img src={getS3Url('/images/icon/ic_coingecko_v3.png')} width="50" height="50"/>
                            </div>
                            <div className="homepage-community___channel__group___item__bg"/>
                            <div className="homepage-community___channel__group___item__label group-hover:underline">CoinGecko</div>
                        </a>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HomeCommunity;
