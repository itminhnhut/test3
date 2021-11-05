import MarketIndex from 'version/maldives/m1/Market'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ___DEV___ } from 'utils/helpers'


const Market = () => {
    if (___DEV___) return null
    return  <MarketIndex/>
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar']),
    },
});


export default Market
