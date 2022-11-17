import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSelector } from 'react-redux';
import MaldivesLayout from 'src/components/common/layouts/MaldivesLayout';
import NewReference from 'src/components/screens/NewReference';
import DynamicNoSsr from 'components/DynamicNoSsr';

const Reference = () => {
    const currentTheme = useSelector((state) => state.user.theme);

    return (
        <DynamicNoSsr>
            <MaldivesLayout
                hideFooter
                navOverComponent
                navMode={currentTheme}
                navStyle={{
                    boxShadow: '0px 15px 20px rgba(0, 0, 0, 0.03)'
                }}
            >
                <div className="pt-[64px] h-full">
                    <NewReference />
                </div>
            </MaldivesLayout>
        </DynamicNoSsr>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            'common',
            'navbar',
            'wallet',
            'modal',
            'reference',
            'broker'
        ]))
    }
});

export default Reference;
