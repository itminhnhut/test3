import React, { memo } from 'react';
import { useTranslation } from 'next-i18next';
import SvgFacebook from 'components/svg/SvgFacebook';
import TwitterFilled from 'components/svg/TwitterFilled';
import TelegramFilled from 'components/svg/TelegramFilled';
import RedditFilled from 'components/svg/RedditFilled';
import classNames from 'classnames';

const NaoFooter = memo(({noSpacingTop}) => {
    const { t } = useTranslation();
    const onRedirect = (key) => {
        let url = '';
        switch (key) {
            case 'term':
                url = 'https://nami.exchange/terms-of-futures';
                break;
            case 'privacy':
                url = 'https://nami.exchange/privacy';
                break;
            case 'facebook':
                url = 'https://www.facebook.com/groups/nami.exchange';
                break;
            case 'telegram':
                url = 'https://t.me/namitradevn';
                break;
            case 'twitter':
                url = 'https://twitter.com/NamiTrade';
                break;
            case 'reddit':
                url = 'https://www.reddit.com/r/NAMIcoin';
                break;
            default:
                break;
        }
        window.open(url, '_blank');
    }

    return (
        <div className={classNames("nao_footer min-h-[6.25rem] bg-gray-12 dark:bg-dark-2 flex items-center py-9 px-4 nao:p-0 text-txtSecondary dark:text-txtSecondary-dark", noSpacingTop ? '' : 'mt-12 sm:mt-20')}>
            <div className="text-sm max-w-[72.5rem] w-full m-auto h-full flex flex-col lg:flex-row  items-center justify-between text-center flex-wrap sm:gap-5">
                <div className="nao_footer_left font-semibold gap-0 sm:gap-5 flex items-center sm:flex-row flex-col sm:w-auto w-full">
                    <div
                        onClick={() => onRedirect('term')}
                        className="pb-3 border-b border-divider dark:border-divider-dark w-full sm:border-none whitespace-nowrap sm:p-0 cursor-pointer"
                    >
                        {t('nao:term')}
                    </div>
                    <div className="hidden sm:flex">|</div>
                    <div
                        onClick={() => onRedirect('privacy')}
                        className="py-3 border-b border-divider dark:border-divider-dark w-full sm:border-none whitespace-nowrap sm:p-0 cursor-pointer"
                    >
                        {t('nao:privacy_policy')}
                    </div>
                </div>

                <div className="nao_footer_right flex flex-wrap justify-center items-center">
                    <div className="font-medium pt-6 pb-4 w-full lg:w-auto sm:pt-0 lg:p-0 mx-11 lg:mx-4">
                        Copyright © 2022 Nami Foundation. All rights reserved.
                    </div>
                    <div className="items-center gap-5 flex">
                        <SvgFacebook className="cursor-pointer" onClick={() => onRedirect('facebook')} size={24} color="#1778F2" />
                        <TwitterFilled className="cursor-pointer" onClick={() => onRedirect('twitter')} size={24} color="#1DA1F2" />
                        <TelegramFilled className="cursor-pointer" onClick={() => onRedirect('telegram')} size={24} color="#6CC1E3" />
                        <RedditFilled className="cursor-pointer" onClick={() => onRedirect('reddit')} size={24} color="#FF4300" color2="white" />
                    </div>
                </div>
            </div>
        </div>
    );
});

export default NaoFooter;
