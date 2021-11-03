import LandingPage from 'version/maldives/v0.1/LandingPage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ___DEV___ } from 'utils'

const Maldives = () => {
    if (!___DEV___) return null
    return <LandingPage/>
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar', 'maldives', 'modal']),
    },
});

export default Maldives
