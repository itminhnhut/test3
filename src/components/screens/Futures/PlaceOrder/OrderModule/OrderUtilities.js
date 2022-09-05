import { useState } from 'react';
import { getS3Url, setTransferModal } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import { useDispatch } from 'react-redux';

import TradingLabel from 'components/trade/TradingLabel';
import AvblAsset from 'components/trade/AvblAsset';
import FuturesCalculator from 'components/screens/Futures/Calculator';

const FuturesOrderUtilities = ({ quoteAssetId, quoteAsset, isAuth, isVndcFutures }) => {
    const [openCalculator, setCalculator] = useState(false)

    const { t } = useTranslation()
    const dispatch = useDispatch()

    const openTransferModal = () =>
        dispatch(setTransferModal({ isVisible: true, asset: quoteAsset }))

    const onOpenCalculator = () => setCalculator((prevState) => !prevState)

    return (
        <>
            <div className='flex items-center'>
                <div className='flex-grow'>
                    <TradingLabel
                        label={t('common:available_balance')}
                        value={<AvblAsset useSuffix assetId={quoteAssetId} />}
                    />
                </div>
                {isAuth &&
                    <div className='w-6 h-6 flex items-center justify-center rounded-md cursor-pointer hover:bg-gray-4 dark:hover:bg-darkBlue-3'>
                        <div
                            className='flex flex-col text-txtSecondary dark:text-txtSecondary-dark'
                            onClick={openTransferModal}
                        >
                           <img src={getS3Url("/images/icon/ic_exchange2.png")} height="16" width="16" />
                        </div>
                    </div>
                }
            </div>
            <FuturesCalculator
                isVisible={openCalculator}
                onClose={() => setCalculator(false)}
            />
        </>
    )
}

export default FuturesOrderUtilities
