import React from 'react'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import LayoutMobile from 'components/common/layouts/LayoutMobile'
import Market from "components/screens/Mobile/Market/Market";

const MarketScreen = () => {
    return (
        <LayoutMobile>
            <div className='h-[calc(100vh-70px)]'>
                <Market/>
            </div>
        </LayoutMobile>
    )
}

export async function getStaticProps({locale}) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                'common',
                'navbar',
                'markets',
            ])),
        },
    }
}

export default MarketScreen
