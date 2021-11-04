import MarketIndex from 'version/maldives/m1/Market'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'


const Market = () => <MarketIndex/>

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar']),
    },
});


export default Market
