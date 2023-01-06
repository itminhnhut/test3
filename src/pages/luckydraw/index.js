import React from 'react';
import Luckydraw from 'components/screens/Nao/Luckydraw/Luckydraw2';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
const index = () => {
    return <Luckydraw platform={'frame'} />;
};
export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'nao']))
    }
});
export default index;
