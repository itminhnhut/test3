import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSelector } from 'react-redux';
import MaldivesLayout from 'src/components/common/layouts/MaldivesLayout';

const Reference = () => {
    const currentTheme = useSelector(state => state.user.theme);

    return (
        <MaldivesLayout navOverComponent navMode={currentTheme}>
            <div>
                <span>123123123</span>
            </div>
        </MaldivesLayout>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar', 'wallet', 'modal', 'reference'])
    }
});

export default Reference;
