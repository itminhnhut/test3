import React from 'react'
import { SearchSection } from 'pages/support'
import { useTranslation } from 'next-i18next'
import { useWindowSize } from 'react-use'

const SupportLayout = ({ children, tabs }) => {
    const { t } = useTranslation()
    const { width } = useWindowSize()

    return (
        <div>
            <SearchSection t={t} width={width} />
            <div className='flex'>
                <div className='lg:w-[308px] w-[208px]'>

                </div>
                <div className='w-full'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default SupportLayout