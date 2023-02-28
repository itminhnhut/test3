import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import dynamic from 'next/dynamic';

const TransactionHistory = dynamic(() => import('components/screens/TransactionHistory'), { ssr: false });

const index = ({ id }) => {
    return (
        <MaldivesLayout>
            <TransactionHistory id={id} />
        </MaldivesLayout>
    );
};

export default index;

export const getServerSideProps = async (context) => {
    return {
        props: {
            id: '',
            ...(await serverSideTranslations(context.locale, ['common', 'navbar', 'modal']))
        }
    };
};
