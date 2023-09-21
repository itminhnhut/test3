import { useWindowSize } from 'react-use';

import dynamic from 'next/dynamic';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

import MaldivesLayout from 'components/common/layouts/MaldivesLayout';

// ** Dynamic components
const HeaderLending = dynamic(() => import('components/screens/Lending/Header'), { ssr: true });
const CryptoLending = dynamic(() => import('components/screens/Lending/CryptoLending'), { ssr: false });
const FQALending = dynamic(() => import('components/screens/Lending/FAQ'), { ssr: false });

const Lending = () => {
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const { width } = useWindowSize();
    const isMobile = width < 830;

    return (
        <>
            <MaldivesLayout>
                <main className="bg-dark-13 dark:bg-dark-dark">
                    <HeaderLending />
                    <section className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto">
                        <CryptoLending />
                        <FQALending isDark={isDark} />
                    </section>
                </main>
            </MaldivesLayout>
        </>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'navbar', 'lending', 'transaction-history', 'wallet']))
    }
});

export default Lending;
