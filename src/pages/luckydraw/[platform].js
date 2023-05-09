import React from 'react';
import Luckydraw from 'components/screens/DailyLuckydraw';
import NaoDailyLuckydraw from 'components/screens/DailyLuckydraw/NaoDailyLuckydraw';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Platform = ({ platform }) => {
    switch (platform) {
        case 'frame':
            return <NaoDailyLuckydraw platform={platform} />;
        default:
            return <Luckydraw />;
    }
};
export const getServerSideProps = async ({ locale, params }) => ({
    props: {
        platform: params?.platform,
        ...(await serverSideTranslations(locale, ['common', 'nao', 'navbar']))
    }
});
export default Platform;
