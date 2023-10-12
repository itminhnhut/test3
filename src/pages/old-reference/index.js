import React from "react";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PCView from "../../components/reference/PCView";
import { useSelector } from "react-redux";
import { NAVBAR_USE_TYPE } from 'src/components/common/NavBar/NavBar';
import MaldivesLayout from 'src/components/common/layouts/MaldivesLayout';

const Reference = () => {
    const currentTheme = useSelector(state => state.user.theme)

    return (
        <MaldivesLayout navOverComponent navMode={currentTheme}>
            <div >
                <PCView />
            </div>
        </MaldivesLayout>
    )
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar', 'wallet', 'modal', 'reference'])
    }
})

export default Reference;
