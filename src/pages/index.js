/* eslint-disable react/jsx-closing-tag-location */
import Footer from 'components/common/Footer';
import LayoutWithHeader from 'components/common/layouts/layoutWithHeader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';

const Index = () => {
    const { t } = useTranslation(['common', 'landing', 'home']);

    return (
        <LayoutWithHeader showBanner>
            Nami.Exchange
            <Footer />

        </LayoutWithHeader>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'footer', 'navbar', 'landing', 'home', 'promotion']),
    },
});
export default Index;
