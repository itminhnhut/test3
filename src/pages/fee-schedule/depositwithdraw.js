import DepWdl from 'components/screens/Fee/DepWdl'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const DepositWithdrawDefault = () =>  <DepWdl/>

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar', 'fee-structure'])
    }
})

export default DepositWithdrawDefault
