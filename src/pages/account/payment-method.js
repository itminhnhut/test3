import dynamic from 'next/dynamic';
import AccountLayout from 'components/screens/Account/AccountLayout';
import Image from 'next/image';
import QRCode from 'qrcode.react';
import Link from 'next/link';
import { getS3Url } from 'redux/actions/utils';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import useDarkMode from 'hooks/useDarkMode';
import User from 'components/svg/User';
import CreditCard from 'components/svg/CreditCard';
import IDCard from 'components/svg/IDCard';
import PlayFilled from 'components/svg/PlayFilled';
import { createElement } from 'react';
import colors from 'styles/colors';
import { KYC_STATUS } from 'redux/actions/const';
import SearchBoxV2 from 'components/common/SearchBoxV2';
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
        ...(await serverSideTranslations(locale, ['common', 'navbar', 'profile', 'fee-structure', 'reward-center', 'identification', 'reference']))
    }
});

export default PaymentMethod;
