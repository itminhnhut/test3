/* eslint-disable */
import {useRouter} from 'next/router';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import LayoutWithHeader from 'components/common/layouts/layoutWithHeader';
import Footer from 'components/common/Footer';

const Terms = () => {
    const router = useRouter();
    const { locale } = router;

    return (
        <LayoutWithHeader>
            <div className="ats-container my-20 policies-page">
            </div>
            <Footer />
        </LayoutWithHeader>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['footer', 'navbar', 'common']),
    },
});
export default Terms;
