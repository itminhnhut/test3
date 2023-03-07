import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { PATHS } from 'src/constants/paths';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import dynamic from 'next/dynamic';
import Skeleton from 'components/screens/TransactionHistory/Skeleton';
import { TransactionTabs } from 'components/screens/TransactionHistory/constant';

const TransactionHistory = dynamic(() => import('components/screens/TransactionHistory'), { ssr: false, loading: () => <Skeleton /> });

const index = ({ id }) => {
    return (
        <MaldivesLayout>
            <TransactionHistory id={id} />
        </MaldivesLayout>
    );
};

export default index;

export const getServerSideProps = async (context) => {
    const { id } = context.query;
    const existed = TransactionTabs.find((tab) => tab.href === '/transaction-history/' + id);

    return {
        props: {
            id: existed ? id : 'all',
            ...(await serverSideTranslations(context.locale, ['common', 'navbar', 'modal', 'wallet', 'reference']))
        }
    };
};
