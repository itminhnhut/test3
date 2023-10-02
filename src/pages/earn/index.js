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

    const hotPools = [];
    const pool_list = [];
    const assetMap = {};
    const rewardMap = {};
    let hotCount = 5;

    try {
        const { data: poolList } = await FetchApi({
            url: API_GET_EARNING_POOLS,
            options: {
                baseURL: process.env.API_URL || ''
            },
            params: {
                skip: 0,
                limit: 10
            }
        });
        poolList.forEach((asset) => {
            let minAPR = Number.MAX_SAFE_INTEGER,
                maxAPR = 0,
                minDuration = Number.MAX_SAFE_INTEGER,
                maxDuration = 0;
            assetMap[asset.asset] = true;
            if (!asset?.projects?.length || !asset.isActive) {
                return;
            }
            const pools = asset.projects.reduce((_poolList, project) => {
                rewardMap[project.rewardAsset] = true;

                if (!project.isActive) {
                    return _poolList;
                }
                minAPR = Math.min(project.apr, minAPR);
                maxAPR = Math.max(project.apr, maxAPR);
                minDuration = Math.min(project.duration, minDuration);
                maxDuration = Math.max(project.duration, maxDuration);
                const pool = {
                    ...project,
                    asset: asset.asset,
                    key: project.id
                };
                if (hotCount && project.isHot) {
                    hotPools.push(pool);
                    hotCount--;
                }
                return [..._poolList, pool];
            }, []);
            pool_list.push({
                id: asset._id,
                isActive: asset.isActive,
                asset: asset.asset,
                minAPR,
                maxAPR,
                minDuration,
                maxDuration,
                pools
            });
        });
    } catch (error) {
        console.log('error:', error.message);
    }

    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'navbar', 'earn', 'wallet'])),
            hotPools,
            pool_list,
            assetList: Object.keys(assetMap),
            rewardList: Object.keys(rewardMap)
        }
    };
};

export default Earn;
