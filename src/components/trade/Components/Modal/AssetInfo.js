import classNames from 'classnames';
import ModalV2 from 'components/common/V2/ModalV2';
import { IconClose, TelegramIconV2, TwitterIconV2, MediumIconV2, DiscordIconV2, FbIconV2, RedditIconV2 } from 'components/svg/SvgIcon';
import AssetLogo from 'components/wallet/AssetLogo';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { API_GET_SPOT_ASSET_INFO } from 'redux/actions/apis';
import { getAssetName, formatNumber } from 'redux/actions/utils';
import styled from 'styled-components';
import FetchApi from 'utils/fetch-api';

const SOCIAL = [
    { key: 'telegram', icon: <TelegramIconV2 /> },
    { key: 'twitter', icon: <TwitterIconV2 /> },
    { key: 'medium', icon: <MediumIconV2 /> },
    { key: 'discord', icon: <DiscordIconV2 /> },
    { key: 'facebook', icon: <FbIconV2 /> },
    { key: 'reddit', icon: <RedditIconV2 /> }
];

const TOTAL = [
    { title: 'spot:asset_info:circulating_supply', key: 'circulating_supply' },
    { title: 'spot:asset_info:max_supply', key: 'max_supply' },
    { title: 'spot:asset_info:total_supply', key: 'total_supply' }
];

const LINK = [
    { title: 'spot:asset_info:website', key: 'website' },
    { title: 'spot:asset_info:explorer', key: 'explorer' }
];

const ModalAssetInfo = ({ open, onCloseModal, id }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    const [data, setData] = useState();

    const handleAssetInfo = async () => {
        try {
            const { data = [] } = await FetchApi({ url: API_GET_SPOT_ASSET_INFO, params: { id } });
            setData(data);
        } catch (err) {
            throw new Error('call api get asset info', { cause: err });
        }
    };

    useEffect(() => {
        if (!open || !id) return;
        handleAssetInfo();
    }, [id, open]);

    const renderSocial = () => {
        return SOCIAL?.map((item) => {
            return (
                <Link href={data?.urls?.[item.key]?.[0] || '#'}>
                    <a target="_blank">{item.icon}</a>
                </Link>
            );
        });
    };

    const renderTotal = () => {
        return TOTAL?.map((item) => {
            return (
                <WrapperItem>
                    <div>{t(item.title)}</div>
                    <div className="text-gray-15 dark:text-gray-4 font-semibold">{formatNumber(data?.[item.key] || 0)}</div>
                </WrapperItem>
            );
        });
    };

    const renderLink = () => {
        return LINK?.map((item) => {
            return (
                <WrapperItem>
                    <div>{t(item.title)}</div>
                    <WrapperURl
                        href={data?.urls?.[item.key]?.[0] || '#'}
                        target="_blank"
                        className="text-green-3 dark:text-green-2 font-semibold max-w-[159px]"
                    >
                        {data?.urls?.[item.key]?.[0] || '-'}
                    </WrapperURl>
                </WrapperItem>
            );
        });
    };

    return (
        <ModalV2
            isVisible={open}
            onBackdropCb={onCloseModal}
            className="!max-w-[588px] bg-[#ffffff] dark:bg-dark-dark border-divider dark:border-divider-dark"
            wrapClassName="p-8 flex flex-col text-gray-1 dark:text-gray-7 tracking-normal"
            customHeader={() => (
                <div className="flex justify-end mb-6">
                    <div
                        className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark cursor-pointer"
                        onClick={onCloseModal}
                    >
                        <IconClose />
                    </div>
                </div>
            )}
        >
            <section className="flex flex-col">
                <div className="text-2xl font-semibold text-gray-15 dark:text-gray-4">{t('spot:asset_info:title')}</div>
                <section className="flex flex-row items-center gap-x-4 mt-6">
                    {data?.asset_id && <AssetLogo assetId={data.asset_id} size={32} />}
                    <div className="font-semibold dark:text-gray-4 text-gray-15">{getAssetName(data?.asset_id)}</div>
                </section>
                <section className="mt-6 bg-gray-13 dark:bg-dark-4 !border-divider dark:!border-divider-dark rounded-xl px-4 py-4 flex flex-col gap-3">
                    <WrapperItem>
                        <div>{t('spot:asset_info:rank')}</div>
                        <div className="text-gray-15 dark:text-gray-4 font-semibold">#{data?.cmc_rank || '-'}</div>
                    </WrapperItem>
                    {renderTotal()}
                    {renderLink()}
                </section>
                <section className="mt-6 bg-gray-13 dark:bg-dark-4 !border-divider dark:!border-divider-dark rounded-xl px-4 py-4 text-gray-15 dark:text-gray-4">
                    {data?.description?.[language] || data?.description}
                </section>
                <section className="flex flex-row justify-between mt-6 bg-gray-13 dark:bg-dark-4 !border-divider dark:!border-divider-dark rounded-xl px-4 py-4 text-gray-15 dark:text-gray-4">
                    <div className="text-gray-1 dark:text-gray-7">{t('spot:asset_info:social')}</div>
                    <div className="flex flex-row gap-4">{renderSocial()}</div>
                </section>
            </section>
        </ModalV2>
    );
};

const WrapperURl = styled.a`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    cursor: pointer;
`;

const WrapperItem = styled.section.attrs(() => ({
    className: 'flex flex-row justify-between dark:text-gray-7 text-gray-1'
}))``;

export default ModalAssetInfo;
