import { useCallback } from "react"
import SupportSearchBar from 'components/screens/Support/SupportSearchBar';
import Link from 'next/link'
import { BREAK_POINTS } from "constants/constants";
import classNames from "classnames";

const SearchSection = ({ t, width = 1024, image = `url('/images/screen/support/v2/background/bg_main.png')` }) => {
    const isMobile = width < 640
    const renderInput = useCallback(() => {
        return <SupportSearchBar simpleMode={isMobile} />
    }, [width])

    return (
        <div className={classNames('flex justify-center w-full h-[158px] sm:h-[456px]')}
            style={{
                backgroundImage: image,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
            }}
        >
            <div className={classNames('relative max-w-[1440px] w-full px-4 lg:px-[112px] flex flex-col justify-center h-full')}>
                <div className='font-bold text-[20px] h-6 sm:text-[44px] sm:h-12 text-white sm:mb-12 w-fit'>
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
    )
}

export default SearchSection