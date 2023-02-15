import React from 'react';
import { useWindowSize } from 'react-use';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { getS3Url } from 'redux/actions/utils';

const HomeCommunity = () => {
    const { width } = useWindowSize();
    const {
        t,
        i18n: { language }
    } = useTranslation(['home']);
    return (
        <section className="homepage-community">
            <div className="homepage-community___wrapper mal-container">
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
                    <Link href="https://www.facebook.com/namifutures">
                        <a className="homepage-community___channel__group___item" target="_blank">
                            <div className="homepage-community___channel__group___item__icon">
                                <img src={getS3Url('/images/icon/ic_facebook.png')} width="44" height="44" />
                            </div>
                            <div className="homepage-community___channel__group___item__label">Facebook</div>
                        </a>
                    </Link>
                    <Link href="https://www.facebook.com/groups/nami.exchange">
                        <a className="homepage-community___channel__group___item" target="_blank">
                            <div className="homepage-community___channel__group___item__icon">
                                <img src={getS3Url('/images/icon/ic_facebook.png')} width="44" height="44" />
                            </div>
                            <div className="homepage-community___channel__group___item__label">Facebook Group</div>
                        </a>
                    </Link>
                    <Link href="https://t.me/namitrade">
                        <a className="homepage-community___channel__group___item" target="_blank">
                            <div className="homepage-community___channel__group___item__icon">
                                <img src={getS3Url('/images/icon/ic_telegram.png')} width="44" height="44" />
                            </div>
                            <div className="homepage-community___channel__group___item__label">Telegram Global</div>
                        </a>
                    </Link>
                    <Link href="https://t.me/namitradevn">
                        <a className="homepage-community___channel__group___item" target="_blank">
                            <div className="homepage-community___channel__group___item__icon">
                                <img src={getS3Url('/images/icon/ic_telegram.png')} width="44" height="44" />
                            </div>
                            <div className="homepage-community___channel__group___item__label">Telegram</div>
                        </a>
                    </Link>
                    <Link href="https://twitter.com/NamiTrade">
                        <a className="homepage-community___channel__group___item" target="_blank">
                            <div className="homepage-community___channel__group___item__icon">
                                <img src={getS3Url('/images/icon/ic_twitter.png')} width="44" height="44" />
                            </div>
                            <div className="homepage-community___channel__group___item__label">Twitter</div>
                        </a>
                    </Link>
                    <Link href="https://www.reddit.com/r/NAMIcoin">
                        <a className="homepage-community___channel__group___item" target="_blank">
                            <div className="homepage-community___channel__group___item__icon">
                                <img src={getS3Url('/images/icon/ic_reddit.png')} width="44" height="44" />
                            </div>
                            <div className="homepage-community___channel__group___item__label">Reddit</div>
                        </a>
                    </Link>
                    <Link href="https://nami.io">
                        <a className="homepage-community___channel__group___item" target="_blank">
                            <div className="homepage-community___channel__group___item__icon">
                                <img src={getS3Url('/images/icon/ic_globe.png')} width="44" height="44" />
                            </div>
                            <div className="homepage-community___channel__group___item__label">Blog</div>
                        </a>
                    </Link>
                    <Link href={`https://www.coingecko.com/${language}/${language === LANGUAGE_TAG.VI ? 'ty_gia' : 'coins'}/nami-corporation-token`}>
                        <a className="homepage-community___channel__group___item">
                            <div className="homepage-community___channel__group___item__icon">
                                <img src={getS3Url('/images/icon/ic_coingecko.png')} width="44" height="44" />
                            </div>
                            <div className="homepage-community___channel__group___item__label">CoinGecko</div>
                        </a>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HomeCommunity;
