import dynamic from 'next/dynamic'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { WALLET_SCREENS } from 'pages/wallet/index'

const WalletComponent = dynamic(() => import('src/components/screens/Wallet'),
                       { ssr: false })

const Wallet = () => <WalletComponent/>

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar', 'wallet'])
    }
})

export async function getStaticPaths() {
    return {
        paths: [
            {
                params: {
                    id: WALLET_SCREENS.OVERVIEW
                }
            }
        ],
        fallback: true,
    };
}

export default Wallet
