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
import TiktokFilled from 'components/svg/TiktokFilled';

const getSocialImage = (socialType) => {
    let Icon = null;
    switch (socialType) {
        case 'facebook':
            Icon = () => <FacebookFilled color="currentColor" size={16} />;
            break;
        case 'telegram':
            Icon = () => <TelegramFilled color="currentColor" size={16} />;
            break;
        case 'blog':
            Icon = () => <GlobeFilled color="currentColor" size={16} />;
            break;
        case 'reddit':
            Icon = () => <FooterRedditFileld color="currentColor" size={16} />;
            break;
        case 'coingecko':
            Icon = () => <CoingeckoFilled color="currentColor" size={16} />;
            break;
        case 'twitter':
            Icon = () => <TwitterFilled color="currentColor" size={16} />;
            break;
        case 'medium':
            Icon = () => <MediumFilled color="currentColor" size={16} />;
            break;
        case 'tiktok':
            Icon = () => <TiktokFilled color="currentColor" size={16} />;
        default:
            break;
    }
    return <Icon />;
};

const SocialsLink = ({ language }) => {
    return (
        <div className="flex flex-wrap gap-4 socials_link">
            {SOCIALS_HREF[language].map((social) => {
                const ImageIcon = getSocialImage(social.name);
                return (
                    <Link
                        key={social.key}
                        href={
                            social.name !== 'coingecko'
                                ? social.href
                                : `${social.href}/${language}/${language === LANGUAGE_TAG.VI ? 'san_giao_dich' : 'exchanges'}/nami_exchange`
                        }
                    >
                        <a target="_blank" className="!flex items-center w-[32px] h-[32px] text-txtPrimary dark:text-txtPrimary-dark ">
                            <div className="border p-2 rounded-full border-[#1e1e1e] dark:border-divider">{ImageIcon}</div>
                        </a>
                    </Link>
                );
            })}
        </div>
    );
};

export default SocialsLink;
