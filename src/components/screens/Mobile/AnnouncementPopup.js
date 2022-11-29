import { X } from 'react-feather';
import Bell from 'src/components/svg/Bell';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { addHours } from 'date-fns';
import { LANGUAGE_TAG } from 'hooks/useLanguage';

const expireKey = 'announcement_expire_at';

export default function AnnouncementPopup() {
    const { t, i18n: { language } } = useTranslation()
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const now = new Date().valueOf();
        const expireAt = new Date(+(localStorage.getItem(expireKey) || 0)).valueOf();
        const endAt = new Date('2022-11-29T10:00:00.000Z').valueOf();
        if (now > expireAt && now < endAt) {
            setOpen(true);
        }
    }, []);

    const close = () => {
        localStorage.setItem(expireKey, addHours(new Date(), 6).valueOf().toString());
        setOpen(false);
    };

    const onClick = () => {
        const link = {
            [LANGUAGE_TAG.VI]: 'https://nami.exchange/vi/support/announcement/thong-bao/thong-bao-huy-niem-yet-cvc-tren-nami-futures-va-onus-futures',
            [LANGUAGE_TAG.EN]: 'https://nami.exchange/en/support/announcement/announcement/delisting-cvc-on-nami-futures-and-onus-futures',
        }[language]
        window.open(link)
    }

    if (!open) return null;

    return <div className='fixed inset-x-0 z-50 p-4 bg-red mx-4 mt-3 bg-onus-bg3 rounded'>
        <div className='flex justify-between items-center'>
            <div className='flex items-center'>
                <Bell className='mr-3' size={22} />
                <span className='bg-onus-base rounded text-xs text-onus-white leading-2 font-semibold px-2 py-1'>
                    {t('common:mobile:announcement')}
                </span>
            </div>
            <X className='text-onus-white' onClick={close} />
        </div>
        <div
            className='h-5 leading-5 font-bold text-white whitespace-nowrap mt-4 relative marquee'
            onClick={onClick}
        >
            <h3>
                {t('common:mobile:announcement_content')}
            </h3>
        </div>
    </div>;
}


