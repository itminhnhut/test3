import { useMemo } from 'react';

import { useTranslation, Trans } from 'next-i18next';

import styled from 'styled-components';

const Effective = ({ effective, dark }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const renderEffective = useMemo(() => {
        const { FEE, CASHBACK, APY_BOOSTER } = effective || {};
        return (
            <WrapperContent className="mt-4">
                <h3 className="font-semibold text-[18px] text-gray-15 dark:text-gray-4 mt-[18px]">Tính năng</h3>
                <div className="w-full rounded-xl mt-3 flex flex-col gap-3 h-[72px] overflow-y-auto">
                    {FEE ? (
                        <div className="flex flex-row items-center">
                            {dark ? <DarkCheckCircle /> : <CheckCircle />}

                            <Trans
                                i18nKey="nft:detail:effective:FEE"
                                values={{
                                    value: FEE?.value,
                                    day: FEE?.day
                                }}
                                components={[<p className="ml-2 dark:text-gray-4 text-gray-15" />]}
                            />
                        </div>
                    ) : null}
                    {CASHBACK ? (
                        <div className="flex flex-row items-center">
                            {dark ? <DarkCheckCircle /> : <CheckCircle />}

                            <Trans
                                i18nKey="nft:detail:effective:CASHBACK"
                                values={{
                                    value: CASHBACK?.value,
                                    week: CASHBACK?.week
                                }}
                                components={[<p className="ml-2 dark:text-gray-4 text-gray-15" />]}
                            />
                        </div>
                    ) : null}
                    {APY_BOOSTER ? (
                        <div className="flex flex-row items-center">
                            {dark ? <DarkCheckCircle /> : <CheckCircle />}

                            <Trans
                                i18nKey="nft:detail:effective:APY_BOOSTER"
                                values={{
                                    value: APY_BOOSTER?.value,
                                    day: APY_BOOSTER?.day,
                                    max: APY_BOOSTER?.max
                                }}
                                components={[<p className="ml-2 dark:text-gray-4 text-gray-15" />]}
                            />
                        </div>
                    ) : null}
                </div>
            </WrapperContent>
        );
    }, [effective, dark]);

    return <>{renderEffective}</>;
};

const WrapperContent = styled.section.attrs(() => ({
    className: 'bg-divider dark:bg-dark-4 px-4 py-4 rounded-xl'
}))``;

const DarkCheckCircle = ({ color = '#47CC85', size = '16' }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M7.999 1.332a6.674 6.674 0 0 0-6.667 6.667 6.674 6.674 0 0 0 6.667 6.666A6.674 6.674 0 0 0 14.665 8 6.674 6.674 0 0 0 8 1.332zm-1.333 9.609L4.191 8.47l.941-.944 1.533 1.53 3.529-3.53.943.943-4.471 4.47z"
            fill={color}
        />
    </svg>
);

const CheckCircle = ({ color = '#30BF73', size = '16' }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M7.999 1.332a6.674 6.674 0 0 0-6.667 6.667 6.674 6.674 0 0 0 6.667 6.666A6.674 6.674 0 0 0 14.665 8 6.674 6.674 0 0 0 8 1.332zm-1.333 9.609L4.191 8.47l.941-.944 1.533 1.53 3.529-3.53.943.943-4.471 4.47z"
            fill={color}
        />
    </svg>
);

export default Effective;
