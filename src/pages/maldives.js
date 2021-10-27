import LandingPage from 'version/maldives/v0.1/LandingPage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Maldives = () => <LandingPage/>

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar', 'maldives']),
    },
});

export default Maldives
