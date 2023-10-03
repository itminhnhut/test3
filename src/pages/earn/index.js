import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { i18n } from 'next-i18next';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import { NAVBAR_USE_TYPE } from 'components/common/NavBar/NavBar';
import FetchApi from 'utils/fetch-api';

import 'keen-slider/keen-slider.min.css';
import { API_GET_EARNING_POOLS } from 'redux/actions/apis';
import { EarnProvider } from 'components/screens/Earn/context/EarnContext';
import EarnPage from 'components/screens/Earn/EarnPage';

const Earn = ({ pool_list, hotPools, assetList, rewardList }) => {
    return (
        <EarnProvider>
            <MaldivesLayout navMode={NAVBAR_USE_TYPE.FLUENT}>
                <div className="bg-gray-13 dark:bg-dark">
                    <EarnPage pool_list={pool_list} hotPools={hotPools} assetList={assetList} rewardList={rewardList} />
                </div>
            </MaldivesLayout>
        </EarnProvider>
    );
};

export const getServerSideProps = async (ctx) => {
    const { locale } = ctx;
    // await i18n.reloadResources(locale, ['common', 'navbar', 'earn', 'wallet']);

    let hotPools = [];
    let pool_list = [];
    const assetMap = {};
    const rewardMap = {};
    let hotCount = 5;

    try {
        const { data } = await FetchApi({
            url: API_GET_EARNING_POOLS,
            options: {
                baseURL: process.env.API_URL || ''
            }
        });
        if (!data) {
            throw new Error('api error')
        }
        const { listAvailablePools, listHotPools } = data;
        pool_list = listAvailablePools;
        hotPools = listHotPools;

    } catch (error) {
        console.log('error:', error.message);
    }

    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'navbar', 'earn', 'wallet'])),
            hotPools: hotPools,
            pool_list,
            assetList: Object.keys(assetMap),
            rewardList: Object.keys(rewardMap)
        }
    };
};

export default Earn;
