import { useTranslation } from 'next-i18next';

import CheckBox from 'components/common/CheckBox';
import CollapseV2 from 'components/common/V2/CollapseV2';

import { LIST_TIER } from 'components/screens/NFT/Constants';

import colors from 'styles/colors';

const TierFilter = ({ onChangeTier, isDark, filterTier }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const renderTier = () => {
        return (
            <CollapseV2
                key={`NFT_tier`}
                className="w-full last:pb-4"
                divLabelClassname="w-full justify-between"
                chrevronStyled={{ size: 24, color: isDark ? colors.gray['4'] : colors.gray['15'] }}
                label="Độ hiếm"
                labelClassname="text-base font-semibold text-gray-15 dark:text-gray-4 w-10/12"
                active={true}
            >
                {LIST_TIER?.map((tier) => {
                    return (
                        <CheckBox
                            key={tier.name?.[language]}
                            className="mr-6 mb-4"
                            boxContainerClassName="w-6 h-6"
                            label={tier.name?.[language]}
                            active={filterTier?.includes(tier?.active)}
                            labelClassName="text-gray-1 dark:text-gray-7 text-base"
                            onChange={() => onChangeTier(tier.active)}
                        />
                    );
                })}
            </CollapseV2>
        );
    };

    return <>{renderTier()}</>;
};

export default TierFilter;
