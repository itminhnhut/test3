import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSelector } from 'react-redux';
import MaldivesLayout from 'src/components/common/layouts/MaldivesLayout';
import NewReference from 'src/components/screens/NewReference';
import DynamicNoSsr from 'components/DynamicNoSsr';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import Head from 'next/head';
import { useEffect } from 'react';

const Reference = () => {
    // const currentTheme = useSelector((state) => state.user.theme);
    const [currentTheme, onThemeSwitch, setTheme] = useDarkMode();

    useEffect(() => {
        const root = document.querySelector(":root");
        root.classList.add("light");
        setTheme(THEME_MODE.LIGHT);
    }, [])

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"></meta>
            </Head>
            <DynamicNoSsr>
                <MaldivesLayout
                    hideNavBar
                    hideFooter
                    navOverComponent
                    light
                    navStyle={{
                        position: 'fixed'
                    }}
                >
                    <div className="h-full">
                        <NewReference />
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
