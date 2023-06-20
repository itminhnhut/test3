import React, { useMemo } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

import { WHY_CHOOSE_NAMI } from 'constants/staking';

const WhyChooseNamiStaking = () => {
    const {
        i18n: { language }
    } = useTranslation();

    const renderWhyChooseNami = useMemo(() => {
        return WHY_CHOOSE_NAMI.map((item) => {
            return (
                <article
                    key={item.title[language]}
                    className="flex flex-col gap-2 lg:gap-3 w-full last:mb-0 lg:last:mb-[60px] mb-[60px] first:mt-7 lg:first:mt-[53px]"
                >
                    <div className="text-gray-15 dark:text-gray-4 font-semibold text-base lg:text-2xl">{item.title[language]}</div>
                    <div className="text-gray-1 dark:text-gray-7 text-sm lg:text-base">{item.context[language]}</div>
                </article>
            );
        });
    }, []);

    return (
        <section className="mt-[88px] lg:mt-[120px]">
            <h2 className="text-gray-15 dark:text-gray-4 text-2xl lg:text-5xl font-semibold text-center">Tại sao nên chọn Nami Exchange?</h2>
            <div className="flex flex-col lg:flex-row gap-x-[103px] justify-between mt-[60px]">
                <div className="w-full text-center">
                    <Image width="596px" height="520px" src="/images/staking/bg_why_choose_nami.png" />
                </div>
                <article className="w-full">{renderWhyChooseNami}</article>
            </div>
        </section>
    );
};

export default WhyChooseNamiStaking;
