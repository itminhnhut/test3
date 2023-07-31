import { useTranslation } from 'next-i18next';

import styled from 'styled-components';

const Description = ({ detail }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    return (
        <WrapperContent className="mt-4">
            <h3 className="font-semibold text-[18px] text-gray-15 dark:text-gray-4">Mô tả</h3>
            <section className="mt-3 h-[84px] overflow-y-auto dark:text-gray-4 text-gray-15">{detail?.[`description_${language}`] || '-'}</section>
        </WrapperContent>
    );
};

const WrapperContent = styled.section.attrs(() => ({
    className: 'bg-white border-[1px] border-divider border-solid dark:border-0 dark:bg-dark-4 px-4 py-4 rounded-xl'
}))``;

export default Description;
