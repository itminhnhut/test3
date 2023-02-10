import React from 'react';
import { SOCIALS_HREF } from './constants';
import Link from 'next/link';
import { getS3Url } from 'redux/actions/utils';
import { LANGUAGE_TAG } from 'hooks/useLanguage';



const getSocialImage = (socialType) => {
    let imageURI = '';
    switch (socialType) {
        case 'facebook':
            imageURI = '/images/icon/ic_footer_fb.png';
            break;
        case 'telegram':
            imageURI = '/images/icon/ic_footer_telegram.png';
            break;
        case 'blog':
            imageURI = '/images/icon/ic_footer_globe.png';
            break;
        case 'reddit':
            imageURI = '/images/icon/ic_footer_reddit.png';
            break;
        case 'coingecko':
            imageURI = '/images/icon/ic_footer_coingecko.png';
            break;
        case 'twitter':
            imageURI = '/images/icon/ic_footer_twitter.png';
            break;

        default:
            break;
    }
    return imageURI;
};

const SocialsLink = ({language}) => {
    return (
        <div className="flex flex-wrap gap-4 socials_link">
            {SOCIALS_HREF.map((social) => {
                const imageURI = getSocialImage(social.name);
                return (
                    <Link key={social.key} href={social.name !== 'coingecko' ? social.href : `${social.href}/${language}/${language === LANGUAGE_TAG.VI ? 'ty_gia' : 'coins'}/nami-corporation-token`}>
                        <a target="_blank" className="!flex items-center w-[32px] h-[32px]">
                            <div className="border p-2 rounded-full border-divider">
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
