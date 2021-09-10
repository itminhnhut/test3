import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LayoutWithHeader from 'components/common/layouts/layoutWithHeader';
import Footer from 'components/common/Footer';

const Custom404 = () => {
    const { t } = useTranslation(['404']);
    const router = useRouter();
    const { locale } = router;
    return (
        <LayoutWithHeader>
            Page not found
            <Footer />
        </LayoutWithHeader>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', '404', 'navbar', 'footer']),
    },
});
export default Custom404;
