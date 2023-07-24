import React from 'react';
import { useWindowSize } from 'react-use';

import dynamic from 'next/dynamic';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

import MaldivesLayout from 'components/common/layouts/MaldivesLayout';

// ** dynamic components
const Filter = dynamic(() => import('components/screens/NFT/Filter'), { ssr: false });

const index = () => {
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const { width } = useWindowSize();
    const isMobile = width < 830;

    return (
        <MaldivesLayout>
            <main className="bg-white dark:bg-shadow">
                <section className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto px-4 mb-[120px]">
                    <header className="mt-10">
                        <h1 className="font-semibold text-4xl text-gray-15 dark:text-gray-4">Nami NFT Infinity</h1>
                    </header>
                    <Filter isDark={isDark} />
                </section>
            </main>
        </MaldivesLayout>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'navbar', 'staking']))
    }
});

export default index;
