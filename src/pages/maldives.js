import LandingPage from 'version/maldives/m1/LandingPage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Maldives = () => <LandingPage/>

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar', 'maldives', 'modal']),
    },
});

export default Maldives
