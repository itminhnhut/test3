import { useCallback } from 'react';

import { useTranslation } from 'next-i18next';

import CheckBox from 'components/common/CheckBox';
import CollapseV2 from 'components/common/V2/CollapseV2';

import { LIST_TIER } from 'components/screens/NFT/Constants';

import colors from 'styles/colors';

const TierFilter = ({ onChangeTier, isDark, filter }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const renderTier = useCallback(() => {
        return (
            <CollapseV2
                key={`NFT_tier`}
                active={true}
                label={t('nft:tier')}
                reload={filter.isOpen}
                className="w-full last:pb-4"
                divLabelClassname="w-full justify-between"
                labelClassname="text-base font-semibold text-gray-15 dark:text-gray-4 w-10/12 text-[18px]"
                chrevronStyled={{ size: 24, color: isDark ? colors.gray['4'] : colors.gray['15'] }}
            >
                {LIST_TIER?.map((tier) => {
                    return (
                        <CheckBox
                            key={tier.name?.[language]}
                            className="mr-6 mb-4"
                            boxContainerClassName="w-6 h-6"
                            label={tier.name?.[language]}
                            active={filter?.tier?.includes(tier?.active)}
                            labelClassName="text-gray-1 dark:text-gray-7 text-base"
                            onChange={() => onChangeTier(tier.active)}
                        />
                    );
                })}
            </CollapseV2>
        );
    }, [isDark, filter?.tier]);

    return <>{renderTier()}</>;
};

export default TierFilter;
