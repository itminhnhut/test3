import React, { useMemo } from 'react';

// ** NEXT
import { useTranslation } from 'next-i18next';

// ** components
import CollapseV2 from 'components/common/V2/CollapseV2';

// ** styles
import colors from 'styles/colors';

// ** CONSTANTS
import { FAQ } from 'components/screens/Lending/constants';

const FQALending = ({ isDark }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const renderContent = (value) => {
        if (!value.content?.isHTMl)
            return (
                <ul className="list-disc pl-5">
                    <li className="text-gray-1 dark:text-gray-7">{value.content[language]}</li>
                </ul>
            );
        return <div className=" text-txtSecondary dark:text-txtSecondary-dark" dangerouslySetInnerHTML={{ __html: value.content[language] }} />;
    };

    const renderFAQ = useMemo(() => {
        return FAQ.map((item, index) => {
            return (
                <CollapseV2
                    key={`FAQ-${index}`}
                    className="w-full"
                    divLabelClassname="w-full justify-between !pb-5 !mb-0"
                    chrevronStyled={{ size: 24, color: isDark ? colors.gray['4'] : colors.gray['15'] }}
                    label={`${index + 1}. ${item.title?.[language]}`}
                    labelClassname="font-semibold mt-5 text-gray-15 dark:text-gray-4 w-10/12"
                    chevronDownClassName="mt-5"
                    isDividerBottom={index !== FAQ.length - 1}
                    dividerBottomClassName="!mt-5"
                >
                    {renderContent(item)}
                </CollapseV2>
            );
        });
    }, [isDark]);

    return (
        <section className="mt-20 pb-[120px]">
            <h2 className="text-6xl text-center font-semibold text-gray-15 dark:text-gray-4 mb-10">{t('lending:FAQ.title')}</h2>
            <div className="dark:bg-dark-4 bg-white rounded-xl px-6 py-8">{renderFAQ}</div>
        </section>
    );
};

export default FQALending;
