import MarketIndex from 'version/maldives/m1/Market'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Market = () => <MarketIndex/>

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...await serverSideTranslations(locale, ['common', 'navbar', 'table']),
        },
    };
}


export default Market
