import { useTranslation } from 'next-i18next';

import styled from 'styled-components';

const Description = ({ detail }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    return (
        <WrapperContent className="mt-12">
            <h3 className="font-semibold text-[18px] text-gray-15 dark:text-gray-4">{t('nft:detail:des')}</h3>
            <section className="mt-3 dark:text-gray-4 text-gray-15">{detail?.[`description_${language}`] || '-'}</section>
        </WrapperContent>
    );
};

const WrapperContent = styled.section.attrs(() => ({
    className: ''
}))``;

export default Description;
