import React from 'react';
import { SOCIALS_HREF } from './constants';
import Link from 'next/link';
import { getS3Url } from 'redux/actions/utils';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import TelegramFilled from '../../svg/TelegramFilled';
import TwitterFilled from '../../svg/TwitterFilled';
import FacebookFilled from '../../svg/FacebookFilled';
import RedditFilled from '../../svg/RedditFilled';
import MediumFilled from '../../svg/MediumFilled';
import CoingeckoFilled from '../../svg/CoingeckoFilled';
import GlobeFilled from '../../svg/GlobeFilled';

const getSocialImage = (socialType) => {
    let Icon = null;
    let imageURI;
    switch (socialType) {
        case 'facebook':
            // Icon = () => <FacebookFilled size={16} />; 
            imageURI = '/images/icon/ic_footer_fb.png';
            break;
        case 'telegram':
            // Icon = () => <TelegramFilled size={16} />;
            imageURI = '/images/icon/ic_footer_telegram.png';
            break;
        case 'blog':
            // Icon = () => <GlobeFilled size={16} />;
            imageURI = '/images/icon/ic_footer_globe.png';
            break;
        case 'reddit':
            // Icon = () => <RedditFilled size={16} />;
            imageURI = '/images/icon/ic_footer_reddit.png';
            break;
        case 'coingecko':
            // Icon = () => <CoingeckoFilled size={16} />;
            imageURI = '/images/icon/ic_footer_coingecko.png';
            break;
        case 'twitter':
            Icon = () => <TwitterFilled size={16} />;

            imageURI = '/images/icon/ic_footer_twitter.png';
            break;

        default:
            break;
    }
    return imageURI; // <Icon />;
};

const SocialsLink = ({ language }) => {
    return (
        <div className="flex flex-wrap gap-4 socials_link">
            {/* <div className="border p-2 rounded-full border-divider">{/* <CoingeckoFilled size={16} /> </div> */}

            {SOCIALS_HREF.map((social) => {
                const imageURI = getSocialImage(social.name);
                return (
                    <Link
                        key={social.key}
                        href={
                            social.name !== 'coingecko'
                                ? social.href
                                : `${social.href}/${language}/${language === LANGUAGE_TAG.VI ? 'ty_gia' : 'coins'}/nami-corporation-token`
                        }
                    >
                        <a target="_blank" className="!flex items-center w-[32px] h-[32px]">
                            <div className="border p-2 rounded-full border-divider">
                                {/* {getSocialImage(social.name)} */}
                                <img src={getS3Url(imageURI)} alt="" width="16" height="16" />
                            </div>
                        </a>
                    </Link>
                );
            })}
        </div>
    );
};

export default SocialsLink;
