import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import LayoutMobile from 'components/common/layouts/LayoutMobile'
import DynamicNoSsr from 'components/DynamicNoSsr'
import Wallet from "components/screens/Mobile/Wallet/Wallet";

const WalletScreen = () => {
    return (
        <DynamicNoSsr>
            <LayoutMobile>
                <Wallet/>
            </LayoutMobile>
        </DynamicNoSsr>
    )
}

export const getStaticProps = async ({locale}) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'wallet', 'error'])),
        },
    }
}

export async function getStaticPaths() {
    return {
        paths: [{params: {asset: 'USDT'}}],
        fallback: true,
    }
}

export default WalletScreen
