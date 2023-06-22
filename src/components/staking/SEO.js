import { NextSeo } from 'next-seo';
import { useTranslation } from 'next-i18next';
import { getS3Url } from 'redux/actions/utils';
import { STEP_STAKING } from 'constants/staking';

const StakingSEO = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    let getHref;

    const images = [
        {
            url: getS3Url('/images/staking/bg_header.png'),
            width: 596,
            height: 582,
            alt: t('staking:header.title'),
            type: 'image/jpeg'
        },
        {
            url: getS3Url('/images/staking/bg_why_choose_nami.png'),
            width: 596,
            height: 520,
            alt: t('staking:why_nami.title'),
            type: 'image/jpeg'
        },
        {
            url: getS3Url('/images/staking/ic_account.png'),
            width: 52,
            height: 52,
            alt: STEP_STAKING[0].subText?.[language],
            type: 'image/jpeg'
        },
        {
            url: getS3Url('/images/staking/ic_asset_digital.png'),
            width: 52,
            height: 52,
            alt: STEP_STAKING[1].subText?.[language],
            type: 'image/jpeg'
        },
        {
            url: getS3Url('/images/staking/ic_staking.png'),
            width: 52,
            height: 52,
            alt: STEP_STAKING[2].subText?.[language],
            type: 'image/jpeg'
        }
    ];

    if (typeof window !== 'undefined') {
        getHref = window.location.href;
    }
    return (
        <NextSeo
            title={t('staking:header.title')}
            description={t('staking:header.des')}
            canonical={`${process.env.NEXT_PUBLIC_API_URL}`}
            openGraph={{
                url: getHref,
                title: t('staking:header.title'),
                description: t('staking:header.des'),
                images: images,
                siteName: 'SiteName'
            }}
            twitter={{
                handle: '@handle',
                site: '@site',
                cardType: 'summary_large_image'
            }}
        />
    );
};
export default StakingSEO;
