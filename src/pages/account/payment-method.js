import dynamic from 'next/dynamic';
import AccountLayout from 'components/screens/Account/AccountLayout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
const PaymentMethodComponent = dynamic(() => import('components/screens/Account/PaymentMethod'), { ssr: false });

const APP_URL = process.env.APP_URL || 'https://nami.exchange';

function PaymentMethod() {
    return (
        <AccountLayout>
            <PaymentMethodComponent />
        </AccountLayout>
    );
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            'common',
            'navbar',
            'profile',
            'fee-structure',
            'reward-center',
            'identification',
            'reference',
            'payment-method',
            'wallet',
            'dw_partner'
        ]))
    }
});

export default PaymentMethod;
