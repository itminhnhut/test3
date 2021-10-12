import HomePage from 'version/maldives/v0.1/HomePage/HomePage'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Index = () => <HomePage/>

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar', 'home', 'modal', 'input', 'table']),
    },
});

export default Index
