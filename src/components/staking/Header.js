import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { getS3Url } from 'redux/actions/utils';
import Link from 'next/link';

import ButtonV2 from 'components/common/V2/ButtonV2/Button';

const HeaderStaking = () => {
    const { t } = useTranslation();

    const handleScroller = () => {
        document.getElementById('asset_digital').scrollIntoView({ behavior: 'smooth' });
    };
    return (
        <div className="flex flex-col lg:flex-row justify-between gap-x-[99px]">
            <div className="w-full mt-[42px] lg:mt-[120px]">
                <h1 className="text-gray-15 dark:text-gray-4 text-2xl lg:text-6xl font-semibold text-center lg:text-left">{t('staking:header.title')}</h1>
                <div className="text-gray-1 dark:text-gray-7 mt-3 text-sm lg:text-base text-center lg:text-left">{t('staking:header.des')}</div>
                <div className="flex flex-row gap-3 mt-7 lg:mt-9 justify-center lg:justify-start">
                    <ButtonV2 className="w-[151px]" onClick={handleScroller}>
                        {t('staking:header.deposit_now')}
                    </ButtonV2>
                    <Link href="/staking/statistic">
                        <ButtonV2 className="w-[151px] " variants="secondary">
                            Thống kê
                        </ButtonV2>
                    </Link>
                </div>
            </div>
            <div className="w-full text-center lg:mt-0 mt-12">
                <Image width="596px" height="582px" src={getS3Url('/images/staking/bg_header.png')} />
            </div>
        </div>
    );
};

export default HeaderStaking;
