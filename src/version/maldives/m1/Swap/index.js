import MaldivesLayout from 'components/common/layouts/MaldivesLayout'
import SwapIntroduce from 'version/maldives/m1/Swap/SwapIntroduce'
import SwapModule from 'version/maldives/m1/Swap/SwapModule'
import useWindowSize from 'hooks/useWindowSize'
import SwapHistory from 'version/maldives/m1/Swap/SwapHistory'

const SwapIndex = () => {
    const { width } = useWindowSize()

    return (
        <MaldivesLayout>
            <div className="bg-gray-4 dark:bg-darkBlue-1 w-full h-full py-[64px] lg:pb-[74px] xl:pb-[94px]">
                <div className="mal-container flex justify-between pt-[64px] xl:pt-[72px]">
                    {width >= 1024 && <SwapIntroduce/>}
                    <SwapModule width={width} pair={{ fromAsset: 'BNB', toAsset: 'USDT' }}/>
                </div>
                {width >= 1024 && <SwapHistory width={width}/>}
            </div>
        </MaldivesLayout>
    )
}

export default SwapIndex
