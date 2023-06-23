import { memo } from 'react';

import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import dynamic from 'next/dist/shared/lib/dynamic';
import TabV2 from 'components/common/V2/TabV2';
import { ASSET } from 'pages/staking/statistic';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

const InterestEstimate = dynamic(() => import('./InterestEstimate.js', { ssr: false }));

const ASSET_TABS = Object.keys(ASSET).map((assetCode) => ({ children: assetCode, key: ASSET[assetCode] }));

const StaticsStaking = ({ assetId, onToggle }) => {
    const { t } = useTranslation();
    return (
        <div className="mb-[60px]">
            <section className="mb-8">
                <div className="flex items-center justify-between mb-[30px]">
                    <div className="text-4xl font-semibold">{t('staking:statics.profit_stats')}</div>
                    <Link href={'/staking'} passHref>
                        <a className="block">
                            <ButtonV2 className="w-auto" variants="text">
                                {t('staking:statics.program_infor')}
                            </ButtonV2>
                        </a>
                    </Link>
                </div>
                <TabV2 wrapperClassName="!gap-3" activeTabKey={assetId} onChangeTab={(asset) => onToggle(asset)} tabs={ASSET_TABS} />
            </section>
            <InterestEstimate t={t} assetId={assetId} />
        </div>
    );
};

export default memo(StaticsStaking);
