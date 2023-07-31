import { useCallback } from 'react';

import { useTranslation } from 'next-i18next';

import CheckBox from 'components/common/CheckBox';
import CollapseV2 from 'components/common/V2/CollapseV2';

import colors from 'styles/colors';

const CategoryFilter = ({ collections, onChangeCollection, isDark, filter }) => {
    const { t } = useTranslation();

    const renderCollections = useCallback(() => {
        if (!Array.isArray(collections) || !filter.isShowCollection) return;
        return (
            <>
                <CollapseV2
                    active={true}
                    label={t('nft:filter:collection')}
                    key={`NFT_Collections`}
                    className="w-full last:pb-4"
                    reload={filter.isOpen}
                    divLabelClassname="w-full justify-between"
                    labelClassname="text-base font-semibold text-gray-15 dark:text-gray-4 w-10/12"
                    chrevronStyled={{ size: 24, color: isDark ? colors.gray['4'] : colors.gray['15'] }}
                >
                    {collections?.length > 0 &&
                        collections?.map((item) => {
                            return (
                                <CheckBox
                                    key={item.name}
                                    className="mr-6 mb-4"
                                    boxContainerClassName="w-6 h-6"
                                    label={item.name}
                                    active={filter.collection.includes(item?._id)}
                                    labelClassName="text-gray-1 dark:text-gray-7 text-base"
                                    onChange={() => onChangeCollection(item._id)}
                                />
                            );
                        })}
                </CollapseV2>
                <div className="my-6 h-[1px] bg-divider dark:bg-divider-dark" />
            </>
        );
    }, [collections, filter.isShowCollection, filter.collection, filter.isOpen]);

    return <>{renderCollections()}</>;
};

export default CategoryFilter;
