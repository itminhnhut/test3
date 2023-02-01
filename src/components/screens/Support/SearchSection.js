import { useCallback } from "react"
import SupportSearchBar from 'components/screens/Support/SupportSearchBar';
import Link from 'next/link'
import { BREAK_POINTS } from "constants/constants";

const SearchSection = ({ t, width, image = `url('/images/screen/support/v2/background/bg_main.png')` }) => {
    const renderInput = useCallback(() => {
        return <SupportSearchBar simpleMode={width < BREAK_POINTS.lg} />
    }, [width])

    return (
        <div className='flex justify-center w-full h-[456px]'
            style={{
                backgroundImage: image,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
            }}
        >
            <div className='max-w-[1440px] w-full px-10 lg:px-[112px] flex flex-col justify-center h-full'>
                <div className='font-bold text-[20px] h-6 lg:text-[44px] lg:h-12 text-white mb-12 w-fit'>
                    <Link href='/support'>
                        <a>
                            {t('support-center:title')}
                        </a>
                    </Link>
                </div>
                {renderInput()}
            </div>
        </div>
    )
}

export default SearchSection