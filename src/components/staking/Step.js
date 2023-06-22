import React, { useMemo } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { getS3Url } from 'redux/actions/utils';

import classNames from 'classnames';
import styled from 'styled-components';

import { STEP_STAKING } from 'constants/staking';

const StepStaking = ({ isDark, isMobile }) => {
    const {
        i18n: { language }
    } = useTranslation();

    const renderStep = useMemo(() => {
        return STEP_STAKING.map((item, key) => {
            return !item?.isDivider ? (
                <section className="w-full px-[43.5px] lg:px-4 mx-[19.5px] lg:mx-0" key={item.title?.[language]}>
                    <Image width={isMobile ? 48 : 54} height={isMobile ? 48 : 54} src={getS3Url(item.imgSrc)} />
                    <div className="font-semibold text-gray-15 dark:text-gray-4 mt-6 text-sm lg:text-base">{item.title?.[language]}</div>
                    <div className="text-gray-1 dark:text-gray-7 mt-3 lg:mt-6">{item.subText?.[language]}</div>
                </section>
            ) : (
                <section className="my-3 lg:my-0" key={`step-line-${key}`}>
                    <div
                        className={classNames(
                            'h-12 lg:h-[1px] w-[1px] lg:w-[92px]',
                            'bg-gradient-to-l from-dominant dark:to-[rgba(0,0,0,.2)] to-[rgba(255,255,255,0.2)]',
                            { '!bg-gradient-to-t dark:to-[rgba(0,0,0,0)] to-[rgba(255,255,255,0.2)]': isMobile }
                        )}
                    ></div>
                </section>
            );
        });
    }, []);

    return (
        <WrapperStep
            isDark={isDark}
            className="mt-[88px] lg:mt-[120px] relative
              border-[1px] dark:border-[#222940] dark:bg-dark-4 bg-divider border-[#30BF73] rounded-3xl  border-solid"
        >
            <div className="h-full lg:h-[294px] flex flex-col py-[60px] lg:py-0 lg:flex-row gap-x-4 items-center justify-center text-center">{renderStep}</div>
        </WrapperStep>
    );
};

const WrapperStep = styled.div`
    background: ${(props) =>
        props.isDark
            ? `linear-gradient(184.08deg, rgba(30, 32, 40, 0.15) 3.33%, rgba(30, 128, 110, 0.15) 69%, rgba(30, 255, 201, 0.15) 130.36%)`
            : `linear-gradient(184.08deg, rgba(255, 255, 255, 0.15) 3.33%, rgba(70, 211, 128, 0.075) 130.36%);`};
`;

export default StepStaking;
