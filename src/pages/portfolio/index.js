import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react'
import MaldivesLayout from 'src/components/common/layouts/MaldivesLayout';
import DynamicNoSsr from 'components/DynamicNoSsr';
import Portfolio from 'src/components/screens/Portfolio/Portfolio'

const index = () => {
    return (
        <DynamicNoSsr>
            <MaldivesLayout
                // useGridSettings
                navStyle={{
                    boxShadow: '0px 15px 20px rgba(0, 0, 0, 0.03)',
                }}
                hideFooter
                page="portfolio"
            >
                <div className="w-full h-full bg-[#F8F9FA] flex justify-center">
                    <Portfolio /> 
                </div>
            </MaldivesLayout>
        </DynamicNoSsr>
    )
}

export default index

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            "common",
            "portfolio",
            'navbar',
            'home',
            'modal',
            'input',
            'table',])),
    },
});