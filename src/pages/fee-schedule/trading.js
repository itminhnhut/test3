import TradingFee from 'components/screens/Fee/TradingFee'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const TradingFeeDefault = () => <TradingFee/>

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar', 'fee-structure'])
    }
})

export default TradingFeeDefault
