import React from 'react';
import Luckydraw from 'components/screens/DailyLuckydraw';
import NaoDailyLuckydraw from 'components/screens/DailyLuckydraw/NaoDailyLuckydraw';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import MaldivesLayout from 'src/components/common/layouts/MaldivesLayout';
import { useRouter } from 'next/router';
const Platform = ({ platform }) => {
    const router = useRouter();

    switch (platform) {
        case 'frame':
            return <NaoDailyLuckydraw platform={platform} />;
        default:
            return (
                <MaldivesLayout hideInApp={!router.query?.web} hideFooter={true}>
                    <Luckydraw />
                </MaldivesLayout>
            );
    }
};
export const getServerSideProps = async ({ locale, params }) => ({
    props: {
        platform: params?.platform,
        ...(await serverSideTranslations(locale, ['common', 'nao', 'navbar']))
    }
});
export default Platform;
