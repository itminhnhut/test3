import React from 'react';
import Luckydraw from 'components/screens/Nao/Luckydraw/Luckydraw2';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Platform = ({ platform }) => {
    return <Luckydraw platform={platform} />;
};
export const getServerSideProps = async ({ locale, params }) => ({
    props: {
        platform: params?.platform,
        ...(await serverSideTranslations(locale, ['common', 'nao']))
    }
});
export default Platform;
