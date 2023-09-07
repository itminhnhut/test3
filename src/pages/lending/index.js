import { useWindowSize } from 'react-use';

import dynamic from 'next/dynamic';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

import MaldivesLayout from 'components/common/layouts/MaldivesLayout';

// ** Dynamic components
const HeaderLending = dynamic(() => import('components/screens/Lending/Header'), { ssr: true });
const FQALending = dynamic(() => import('components/screens/Lending/FAQ'), { ssr: false });

const Lending = () => {
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const { width } = useWindowSize();
    const isMobile = width < 830;

    return (
        <>
            <MaldivesLayout>
                <main className="bg-white dark:bg-shadow">
                    <section className="2xl:max-w-screen-xxl">
                        <HeaderLending />
                    </section>
                    <section className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto">
                        content
                        <FQALending isDark={isDark} />
                    </section>
                </main>
            </MaldivesLayout>
        </>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'navbar', 'lending']))
    }
});

export default Lending;
