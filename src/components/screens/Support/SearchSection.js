import { useCallback } from "react"
import SupportSearchBar from 'components/screens/Support/SupportSearchBar';
import Link from 'next/link'
import { BREAK_POINTS } from "constants/constants";
import classNames from "classnames";
import { getS3Url } from "redux/actions/utils";

const SearchSection = ({ t, width = 1024, image = `url('/images/screen/support/v2/background/bg_main.png')` }) => {
    const isMobile = width < 640
    const renderInput = useCallback(() => {
        return <SupportSearchBar simpleMode={isMobile} />
    }, [width])

    return (
        <div className={classNames('flex justify-center w-full h-[158px] sm:h-[456px] bg-[#000]')}>
            <div
                className={classNames('relative max-w-screen-v3 2xl:max-w-screen-xxl m-auto w-full px-4 lg:px-[112px] flex flex-col justify-center h-full')}
                style={{
                    backgroundImage: getS3Url(image) ,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                }}
            >
                <div>
                    <div className='text-white w-fit font-semibold text-[20px] leading-7 sm:text-[44px] sm:leading-[58px]'>
                        <Link href='/support'>
                            <a>
                                {t('support-center:title')}
                            </a>
                        </Link>
                    </div>
                    <div className="w-full relative -bottom-12">
                        <div className={isMobile ? "absolute  w-full " : ''}>
                            {renderInput()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchSection