import SwapIndex from 'version/maldives/m1/Swap'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Swap = () => <SwapIndex/>

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...await serverSideTranslations(locale, ['common', 'navbar', 'wallet', 'convert', 'error']),
        },
    };
}
export default Swap
