import React from 'react';
import { SOCIALS_HREF } from './constants';
import Link from 'next/link';
import { getS3Url } from 'redux/actions/utils';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import TelegramFilled from '../../svg/TelegramFilled';
import TwitterFilled from '../../svg/TwitterFilled';
import FacebookFilled from '../../svg/FacebookFilled';
import { FooterRedditFileld } from '../../svg/RedditFilled';
import MediumFilled from '../../svg/MediumFilled';
import CoingeckoFilled from '../../svg/CoingeckoFilled';
import GlobeFilled from '../../svg/GlobeFilled';

const getSocialImage = (socialType) => {
    let Icon = null;
    let imageURI;
    switch (socialType) {
        case 'facebook':
            Icon = () => <FacebookFilled color="currentColor" size={16} />;
            // imageURI = '/images/icon/ic_footer_fb.png';
            break;
        case 'telegram':
            Icon = () => <TelegramFilled color="currentColor" size={16} />;
            // imageURI = '/images/icon/ic_footer_telegram.png';
            break;
        case 'blog':
            Icon = () => <GlobeFilled color="currentColor" size={16} />;
            // imageURI = '/images/icon/ic_footer_globe.png';
            break;
        case 'reddit':
            Icon = () => <FooterRedditFileld color="currentColor" size={16} />;
            // imageURI = '/images/icon/ic_footer_reddit.png';
            break;
        case 'coingecko':
            Icon = () => <CoingeckoFilled color="currentColor" size={16} />;
            // imageURI = '/images/icon/ic_footer_coingecko.png';
            break;
        case 'twitter':
            Icon = () => <TwitterFilled color="currentColor" size={16} />;

            // imageURI = '/images/icon/ic_footer_twitter.png';
            break;
        case 'medium':
            Icon = () => <MediumFilled color="currentColor" size={16} />;

            // imageURI = '/images/icon/ic_footer_twitter.png';
            break;

        default:
            break;
    }
    return <Icon />; //imageURI; ;
};

const SocialsLink = ({ language }) => {
    return (
        <div className="flex flex-wrap gap-4 socials_link">
            {/* <div className="border p-2 rounded-full border-divider">{/* <CoingeckoFilled size={16} /> </div> */}

            {SOCIALS_HREF.map((social) => {
                const ImageIcon = getSocialImage(social.name);
                return (
                    <Link
                        key={social.key}
                        href={
                            social.name !== 'coingecko'
                                ? social.href
                                : `${social.href}/${language}/${language === LANGUAGE_TAG.VI ? 'ty_gia' : 'coins'}/nami-corporation-token`
                        }
                    >
                        <a target="_blank" className="!flex items-center w-[32px] h-[32px] text-txtPrimary dark:text-txtPrimary-dark ">
                            <div className="border p-2 rounded-full border-[#1e1e1e] dark:border-divider">
                                {ImageIcon}
                                {/* <img src={getS3Url(imageURI)} alt="" width="16" height="16" /> */}
                            </div>
                        </a>
                    </Link>
                );
            })}
        </div>
    );
};

export default SocialsLink;
