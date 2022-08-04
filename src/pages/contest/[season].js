import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { seasons } from 'components/screens/Nao/Contest/Contest';
import Contest from 'components/screens/Nao/Contest/Contest';

const Season = ({ season }) => {
    return <Contest previous {...season} />
};

export const getStaticPaths = async ({ locales }) => {
    const paths = []
    seasons.map(item => {
        return locales.map((locale) => {
            return paths.push({
                params: { ...item },
                locale,
            })
        })
    })
    return {
        paths: paths,
        fallback: false
    };
}

export const getStaticProps = async (context) => {
    const { params, locale } = context;
    const season = seasons.find(e => e.season === params.season)
    return {
        props: {
            season: season,
            ...(await serverSideTranslations(locale, ['common', 'nao', 'error'])),
        },
    }
};

export default Season;