import React, { useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import CollapseV2 from 'components/common/V2/CollapseV2';
import colors from 'styles/colors';

import { FAQ } from 'constants/staking';

const FAQStaking = ({ isDark }) => {
    const {
        i18n: { language }
    } = useTranslation();

    const renderFAQ = useMemo(() => {
        return FAQ.map((item, key) => {
            return (
                <CollapseV2
                    key={`FAQ-${key}`}
                    className="w-full divider-bottom lg:last:pb-[120px] last:pb-[80px]"
                    divLabelClassname="w-full justify-between !pb-5 !mb-0"
                    chrevronStyled={{ size: 24, color: isDark ? colors.gray['4'] : colors.gray['15'] }}
                    label={item.title?.[language]}
                    labelClassname="text-base lg:text-[18px] font-semibold mt-5 text-gray-15 dark:text-white w-10/12"
                    chevronDownClassName="mt-5"
                    isDividerBottom={true}
                    dividerBottomClassName="!mt-5"
                >
                    <ul className="list-disc pl-5">
                        <li className="text-gray-1 dark:text-gray-7">{item.content[language]}</li>
                    </ul>
                </CollapseV2>
            );
        });
    }, [isDark]);

    return (
        <section className="max-w-screen-v3 2xl:max-w-screen-xxl m-auto px-4 mt-[88px]">
            <h2 className="text-2xl lg:text-5xl font-semibold text-gray-15 dark:text-gray-4">Các câu hỏi thường gặp (FAQ)</h2>
            <div className="mt-8 lg:mt-[60px]">{renderFAQ}</div>
        </section>
    );
};

export default FAQStaking;
