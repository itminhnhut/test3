import Head from 'next/head';
import Image from 'next/image';
import dynamic from 'next/dynamic';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import MaldivesLayout from 'components/common/layouts/MaldivesLayout';

import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

import { useWindowSize } from 'react-use';

import CalculateInterest from 'components/screens/Staking/CalculateInterest.js';
const HeaderStaking = dynamic(() => import('./components/Header.js'), { ssr: false });
const StepStaking = dynamic(() => import('./components/Step.js'), { ssr: false });
const WhyChooseNamiStaking = dynamic(() => import('./components/WhyChooseNami.js'), { ssr: false });
const AssetDigitalStaking = dynamic(() => import('./components/AssetDigital.js'), { ssr: false });
const FAQStaking = dynamic(() => import('./components/FAQ.js'), { ssr: false });

const Reference = () => {
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const { width } = useWindowSize();
    const isMobile = width < 830;

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
                        <CalculateInterest />
                        <WhyChooseNamiStaking />
                    </div>
                    <section className="relative mt-0 lg:mt-[120px]">
                        <div className="absolute w-full h-full cursor-pointer">
                            {isMobile ? (
                                <Image src="/images/staking/bg_digital_faq_mb.png" layout="fill" objectFit="cover" quality={100} />
                            ) : (
                                <Image src="/images/staking/bg_digital_faq.png" layout="fill" objectFit="cover" quality={100} />
                            )}
                        </div>
                        <AssetDigitalStaking isMobile={isMobile} />
                        <FAQStaking isDark={isDark} />
                    </section>
                </main>
            </MaldivesLayout>
        </>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'navbar', 'reference', 'broker', 'futures']))
    }
});

export default Reference;
