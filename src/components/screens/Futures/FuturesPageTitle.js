import { PRODUCT } from 'constants/constants'
import Head from 'next/head'

const FuturesPageTitle = ({ pair, price }) => {
    return (
        <Head>
            <title>
                {!!price ? `${price} |` : ''} {pair} | {PRODUCT.FUTURES}
            </title>
        </Head>
    )
}

export default FuturesPageTitle
