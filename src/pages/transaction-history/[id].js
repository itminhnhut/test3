import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { PATHS } from 'src/constants/paths';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import dynamic from 'next/dynamic';
import Skeleton from 'components/screens/TransactionHistory/Skeleton';

const TransactionHistory = dynamic(() => import('components/screens/TransactionHistory'), { ssr: false, loading: () => <Skeleton /> });

const index = ({ id }) => {
    return (
        <MaldivesLayout>
            <TransactionHistory id={id} key={id}/>
        </MaldivesLayout>
    );
};

export default index;

export const getServerSideProps = async (context) => {
    const { id } = context.query;
    return {
        props: {
            id: id ?? 'all',
            ...(await serverSideTranslations(context.locale, ['common', 'navbar', 'modal', 'wallet', 'reference']))
        }
    };
};
