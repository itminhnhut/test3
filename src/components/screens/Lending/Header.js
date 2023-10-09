// ** NEXT
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

const HeaderLending = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    return (
        <section className="relative">
            <Image width={1440} height={440} sizes="100vw" src="/images/lending/header.png" objectFit="contain" />
        </section>
    );
};

export default HeaderLending;
