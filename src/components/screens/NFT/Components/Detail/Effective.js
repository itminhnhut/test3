import { useMemo } from 'react';

import { useTranslation } from 'next-i18next';

import { CheckCircle2Icon } from 'components/svg/SvgIcon';

import styled from 'styled-components';

const REGEX_HTML = /<\/?[a-z][\s\S]*>/i;

const Effective = ({ effective, dark }) => {
    const { t } = useTranslation();

    const renderEffective = useMemo(() => {
        return (
            <WrapperContent className="mt-4">
                <h3 className="font-semibold text-[18px] text-gray-15 dark:text-gray-4">{t('nft:detail:features')}</h3>
                <selection className="w-full rounded-xl mt-3 flex flex-col gap-3 h-[96px] overflow-y-auto">
                    {effective.length > 0
                        ? effective?.map((value) => {
                              const isHtml = REGEX_HTML.test(value);
                              return !isHtml ? (
                                  <selection className="flex flex-row items-center">
                                      <div>
                                          <CheckCircle2Icon />
                                      </div>
                                      <p className="ml-2 dark:text-gray-4 text-gray-15">{value}</p>
                                  </selection>
                              ) : (
                                  <div dangerouslySetInnerHTML={{ __html: value }} />
                              );
                          })
                        : null}
                </selection>
            </WrapperContent>
        );
    }, [effective, dark]);

    return <>{renderEffective}</>;
};

const WrapperContent = styled.section.attrs(() => ({
    className: 'bg-white border-[1px] border-divider border-solid dark:border-0 dark:bg-dark-4 px-4 py-4 rounded-xl'
}))``;

export default Effective;
