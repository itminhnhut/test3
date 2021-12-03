import { useTranslation } from 'next-i18next'
import { TrendingUp } from 'react-feather'

import withTabLayout, { ROUTES } from 'components/common/layouts/withTabLayout'
import MCard from 'components/common/MCard'
import Link from 'next/link'

const TradingFee = () => {

    // Use hooks
    const { t } = useTranslation()

    return (
        <>
            <div className="flex items-center justify-between">
                <div className="t-common">
                    Your fee level <span className="text-dominant">VIP 0</span>
                </div>
                <Link href="/">
                   <a className="flex items-center text-dominant text-sm hover:!underline" target="_blank">
                       <TrendingUp size={16} className="mr-2.5" /> How to upgrade level?
                   </a>
                </Link>
            </div>

            <MCard addClass="mt-5 px-4 py-6 lg:px-7 px-4 py-6 lg:py-8">
                <div className="">
                    <div>Exchange <span className="">{t('fee-structure:trading_fee_t')}</span></div>
                </div>
            </MCard>
        </>
    )
}

export default withTabLayout({ routes: ROUTES.FEE_STRUCTURE })(TradingFee)
