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
                <Filter isDark={isDark} />
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
