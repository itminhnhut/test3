import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
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
    const existedRoute = TransactionTabs.find((tab) => tab.key === id);

    const redirectObj = !existedRoute
        ? {
              redirect: {
                  destination: `/transaction-history/all`,
                  permanent: false
              }
          }
        : {};

    return {
        ...redirectObj,
        props: {
            id,
            ...(await serverSideTranslations(context.locale, ['common', 'navbar', 'modal', 'wallet', 'reference', 'transaction-history']))
        }
    };
};
