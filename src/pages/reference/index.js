import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSelector } from 'react-redux';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import NewReference from 'components/screens/NewReference/mobile';
import DynamicNoSsr from 'components/DynamicNoSsr';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import Head from 'next/head';
import { useEffect } from 'react';
import { useWindowSize } from 'react-use';
import RefDesktopScreen from 'components/screens/NewReference/desktop';
import classNames from 'classnames';

const Reference = () => {
    // const currentTheme = useSelector((state) => state.user.theme);
    const [currentTheme, onThemeSwitch, setTheme] = useDarkMode();

    const { width } = useWindowSize()
    const isMobile = width < 830

    useEffect(() => {
        if (isMobile) {
            const root = document.querySelector(":root");
            root.classList.add("dark");
            setTheme(THEME_MODE.DARK);
        }
    }, [currentTheme, isMobile])

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"></meta>
            </Head>
            <DynamicNoSsr>
                <MaldivesLayout
                    hideNavBar={isMobile}
                    hideFooter={isMobile}
                    navOverComponent
                    light={currentTheme === THEME_MODE.LIGHT}
                    dark={currentTheme === THEME_MODE.DARK}
                    navStyle={isMobile ? {
                        position: 'fixed',
                    } : {
                        boxShadow: '0px 15px 20px rgba(0, 0, 0, 0.03)',
                    }}
                >
                    <div className={classNames("h-full ", { 'flex justify-center': !isMobile })}>
                        {!isMobile ? <RefDesktopScreen />  :<NewReference />}
                    </div>
                </MaldivesLayout>
            </DynamicNoSsr>
        </>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'navbar', 'reference', 'broker', 'futures']))
    }
});

export default Reference;
