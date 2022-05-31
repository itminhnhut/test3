import { useTranslation } from 'next-i18next'
import Portal from 'components/hoc/Portal'
import classNames from 'classnames'
import { X } from 'react-feather'
import Market from 'components/screens/Mobile/Market/Market'
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

const ModelMarketMobile = ({ visible, onClose }) => {
    const router = useRouter()
    const { t } = useTranslation(['common'])

    useEffect(() => {
        onClose()
    }, [router])

    return (
        <Portal portalId='PORTAL_MODAL'>
            <div
                className={classNames(
                    'flex flex-col absolute top-0 left-0 h-full w-full z-[20] bg-white dark:bg-darkBlue-1',
                    { visible, invisible: !visible }
                )}
            >
                <div className='flex justify-between items-center px-4 pt-4'>
                    <span className='font-semibold text-xl leading-6'>
                        {t('markets:spot_markets')}
                    </span>
                    <div className='cursor-pointer p-2 pr-0' onClick={onClose}>
                        <X />
                    </div>
                </div>
                <div className='flex-1 min-h-0'>
                    <Market isRealtime={visible}/>
                </div>
            </div>
        </Portal>
    )
}

export default ModelMarketMobile
