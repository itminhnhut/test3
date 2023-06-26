import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React from 'react';

const Header = () => {
    const { t } = useTranslation();
    return (
        <section className="flex items-center justify-between mb-[30px]">
            <h1 className="text-4xl font-semibold">{t('staking:statics.profit_stats')}</h1>
            <Link href={'/staking'} passHref>
                <a className="block">
                    <ButtonV2 className="w-auto" variants="text">
                        {t('staking:statics.program_infor')}
                    </ButtonV2>
                </a>
            </Link>
        </section>
    );
};

export default Header;
