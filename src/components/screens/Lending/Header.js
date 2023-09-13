// ** NEXT
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

// ** SVG
import CheckCircle from 'components/svg/CheckCircle';

const CONTENT = [
    { title: { vi: 'Không có phí giao dịch', en: 'không có phí giao dịch' } },
    { title: { vi: 'Không có phí giao dịch', en: 'không có phí giao dịch' } },
    { title: { vi: 'Tỉ lệ cho vay trên giá trị cao', en: 'Tỉ lệ cho vay trên giá trị cao' } },
    { title: { vi: 'Tỉ lệ cho vay trên giá trị cao', en: 'Tỉ lệ cho vay trên giá trị cao' } }
];

// max-w-screen-v3
const HeaderLending = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    return (
        <section className="relative">
            <Image width={1440} height={440} sizes="100vw" src="/images/lending/header.png" objectFit="contain" />
            <section className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto">
                <section className="absolute top-[80px]">
                    <h1 className="text-6xl font-semibold text-white">{t('lending:header:title')}</h1>
                    <h2 className="text-base text-white w-[460px] mt-6 mb-7">{t('lending:header:des')}</h2>
                    <section className="grid grid-cols-2 gap-x-[30px] gap-y-[16px]">
                        {CONTENT.map((item, key) => {
                            return (
                                <section className="flex flex-row items-center gap-2" key={`header_${key}_${item.title?.[language]}`}>
                                    <CheckCircle size={24} />
                                    <h3 className="text-teal text-base font-semibold">{item.title?.[language]}</h3>
                                </section>
                            );
                        })}
                    </section>
                </section>
            </section>
        </section>
    );
};

export default HeaderLending;
