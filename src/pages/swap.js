import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import colors from 'styles/colors';

import SwapIntroduce from 'src/components/screens/Swap/SwapIntroduce';
import SwapModule from 'components/screens/Swap/SwapModule';
import useWindowSize from 'hooks/useWindowSize';
import SwapHistory from 'src/components/screens/Swap/SwapHistory';
import { isMobile } from 'react-device-detect';
import dynamic from 'next/dynamic';
import { getS3Url } from 'redux/actions/utils';
import Image from 'next/image';

const MaldivesLayout = dynamic(() => import('components/common/layouts/MaldivesLayout'), { ssr: false });
const LayoutMobile = dynamic(() => import('components/common/layouts/LayoutMobile'), { ssr: false });

const Swap = () => {
    const [pair, setPair] = useState({});
    const { width } = useWindowSize();
    const router = useRouter();

    useEffect(() => {
        const query = router?.query;

        if (query?.fromAsset) {
            setPair((prevState) => ({ ...prevState, fromAsset: query?.fromAsset }));
        }
        if (query?.toAsset) {
            setPair((prevState) => ({ ...prevState, toAsset: query?.toAsset }));
        }
    }, [router]);

    const renderContent = () => {
        return (
            <>
                <div>
                    <img src={'/images/screen/swap/swap-banner.png'} alt="" className="mx-auto h-[180px] w-full" />
                </div>
                <div className="bg-gray-13 dark:bg-dark text-txtPrimary dark:text-txtPrimary-dark px-4 flex justify-center">
                    <div className={`max-w-screen-v3 2xl:max-w-screen-xxl m-auto w-full h-full pt-20 pb-[120px]`}>
                        <div className="m-auto flex justify-center">
                            {/* {width >= 1024 && <SwapIntroduce />} */}
                            <SwapModule width={width} pair={pair} />
                        </div>
                        {/* {width >= 1024 && <SwapHistory width={width} />} */}
                        <SwapHistory width={width} />
                    </div>
                </div>
            </>
        );
    };

    return isMobile ? <LayoutMobile>{renderContent()}</LayoutMobile> : <MaldivesLayout>{renderContent()}</MaldivesLayout>;
};

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'navbar', 'wallet', 'convert', 'error']))
        }
    };
}
export default Swap;
