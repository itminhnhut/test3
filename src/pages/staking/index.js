import Head from 'next/head';
import dynamic from 'next/dynamic';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import MaldivesLayout from 'components/common/layouts/MaldivesLayout';

import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useSelector } from 'react-redux';

import { useWindowSize } from 'react-use';
import styled from 'styled-components';

import Skeleton from 'components/staking/skeleton';

const CalculateInterest = dynamic(() => import('components/staking/CalculateInterest.js'), { ssr: false });
const HeaderStaking = dynamic(() => import('components/staking/Header.js'), {
    ssr: false,
    loading: () => <Skeleton variant="image" />
});
const StepStaking = dynamic(() => import('components/staking/Step.js'), { ssr: false, loading: () => <Skeleton variant="image" /> });
const WhyChooseNamiStaking = dynamic(() => import('components/staking/WhyChooseNami.js'), { ssr: false, loading: () => <Skeleton variant="list" /> });
const AssetDigitalStaking = dynamic(() => import('components/staking/AssetDigital.js'), { ssr: false, loading: () => <Skeleton variant="list" /> });
const FAQStaking = dynamic(() => import('components/staking/FAQ.js'), { ssr: false, loading: () => <Skeleton variant="list" /> });

const Reference = () => {
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const { width } = useWindowSize();
    const isMobile = width < 830;
    const auth = useSelector((state) => state.auth?.user);

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"></meta>
            </Head>

            <MaldivesLayout>
                <main className="bg-white dark:bg-shadow">
                    <div className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto px-4">
                        <HeaderStaking />
                        <StepStaking isDark={isDark} isMobile={isMobile} />
                        <WhyChooseNamiStaking />
                        <CalculateInterest />
                    </div>
                    <WrapperAssetFAQ mobile={isMobile} className="relative pt-0  lg:pt-[120px]" id="asset_digital">
                        <AssetDigitalStaking isMobile={isMobile} auth={auth} />
                        <FAQStaking isDark={isDark} />
                    </WrapperAssetFAQ>
                </main>
            </MaldivesLayout>
        </>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'navbar', 'staking']))
    }
});

const WrapperAssetFAQ = styled.section`
    background-image: url(${(props) => (props.mobile ? '/images/staking/bg_digital_faq_mb.png' : '/images/staking/bg_digital_faq.png')});
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
`;

export default Reference;
