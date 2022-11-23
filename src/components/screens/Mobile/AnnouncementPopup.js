import { X } from 'react-feather';
import Bell from 'src/components/svg/Bell'
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { addSeconds } from 'date-fns';

const expireKey = 'announcement_expire_at'

export default function AnnouncementPopup() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const now = new Date()
        const expireAt = new Date(+(localStorage.getItem(expireKey) || 0))
        console.log(now.valueOf(), expireAt.valueOf(), now.valueOf() < expireAt.valueOf(), '000000000')
        if (now.valueOf() > expireAt.valueOf()) {
            setOpen(true)
        }
    }, [])

    const close = () => {
        localStorage.setItem(expireKey, addSeconds(new Date(), 20).valueOf().toString())
        setOpen(false)
    }

    if (!open) return null

    return <div className='fixed inset-x-0 z-50 p-4 bg-red mx-4 mt-3 bg-onus-bg3 rounded'>
        <div className='flex justify-between items-center'>
            <div className='flex'>
                <Bell className='mr-3' size={22} />
                <span className='bg-onus-base rounded text-xs text-onus-white leading-2 font-semibold px-2 py-1'>
                    {t('common:mobile:announcement')}
                </span>
            </div>
            <X className='text-onus-white' onClick={() => close()}/>
        </div>
        <div className='h-5 leading-5 font-bold text-white whitespace-nowrap mt-4 relative marquee'>
            <h3>
                {t('common:mobile:announcement_content')}
            </h3>
        </div>
    </div>;
}


