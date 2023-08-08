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
                <div className="text-2xl font-semibold text-gray-15 dark:text-gray-4">{t('spot:asset_info:info')}</div>
                <section className="flex flex-row items-center gap-x-4 mt-6">
                    {data?.asset_id && <AssetLogo assetId={data.asset_id} size={32} />}
                    <div className="font-semibold dark:text-gray-4 text-gray-15">{getAssetName(data?.asset_id)}</div>
                </section>
                <section className="mt-6 bg-gray-13 dark:bg-dark-4 !border-divider dark:!border-divider-dark rounded-xl px-4 py-4 flex flex-col gap-3">
                    <section className="flex flex-row justify-between dark:text-gray-7 text-gray-1">
                        <div>{t('spot:asset_info:rank')}</div>
                        <div className="text-gray-15 dark:text-gray-4 font-semibold">#{data?.cmc_rank || '-'}</div>
                    </section>
                    <section className="flex flex-row justify-between dark:text-gray-7 text-gray-1">
                        <div>{t('spot:asset_info:circulating_supply')}</div>
                        <div className="text-gray-15 dark:text-gray-4 font-semibold">{formatNumber(data?.circulating_supply || 0)}</div>
                    </section>
                    <section className="flex flex-row justify-between dark:text-gray-7 text-gray-1">
                        <div>{t('spot:asset_info:max_supply')}</div>
                        <div className="text-gray-15 dark:text-gray-4 font-semibold">{formatNumber(data?.max_supply || 0)}</div>
                    </section>
                    <section className="flex flex-row justify-between dark:text-gray-7 text-gray-1">
                        <div>{t('spot:asset_info:total_supply')}</div>
                        <div className="text-gray-15 dark:text-gray-4 font-semibold">{formatNumber(data?.total_supply || 0)}</div>
                    </section>
                    <section className="flex flex-row justify-between dark:text-gray-7 text-gray-1">
                        <div>{t('spot:asset_info:website')}</div>
                        <Link href={data?.urls?.website?.[0] || '#'}>
                            <WrapperURl target="_blank" className="text-green-3 dark:text-green-2 font-semibold max-w-[159px]">
                                {data?.urls?.website?.[0] || '-'}
                            </WrapperURl>
                        </Link>
                    </section>
                    <section className="flex flex-row justify-between dark:text-gray-7 text-gray-1">
                        <div>{t('spot:asset_info:explorer')}</div>
                        <Link href={data?.urls?.explorer?.[0] || '#'}>
                            <WrapperURl target="_blank" className="text-green-3 dark:text-green-2 font-semibold max-w-[159px]">
                                {data?.urls?.explorer?.[0] || '-'}
                            </WrapperURl>
                        </Link>
                    </section>
                </section>
                <section className="mt-6 bg-gray-13 dark:bg-dark-4 !border-divider dark:!border-divider-dark rounded-xl px-4 py-4 text-gray-15 dark:text-gray-4">
                    {data?.description?.[language] || data?.description}
                </section>
                <section className="flex flex-row justify-between mt-6 bg-gray-13 dark:bg-dark-4 !border-divider dark:!border-divider-dark rounded-xl px-4 py-4 text-gray-15 dark:text-gray-4">
                    <div className="text-gray-1 dark:text-gray-7">{t('spot:asset_info:social')}</div>
                    <div className="flex flex-row gap-4">
                        <Link href={data?.urls?.telegram?.[0] || '#'}>
                            <a target="_blank">
                                <TelegramIconV2 />
                            </a>
                        </Link>
                        <Link href={data?.urls?.twitter?.[0] || '#'}>
                            <a target="_blank">
                                <TwitterIconV2 />
                            </a>
                        </Link>
                        <Link href={data?.urls?.medium?.[0] || '#'}>
                            <a target="_blank">
                                <MediumIconV2 />
                            </a>
                        </Link>
                        <Link href={data?.urls?.website?.[0] || '#'}>
                            <a target="_blank">
                                <DiscordIconV2 />
                            </a>
                        </Link>
                        <Link href={data?.urls?.facebook?.[0] || '#'}>
                            <a target="_blank">
                                <FbIconV2 />
                            </a>
                        </Link>
                        <Link href={data?.urls?.reddit?.[0] || '#'}>
                            <a target="_blank">
                                <RedditIconV2 />
                            </a>
                        </Link>
                    </div>
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

export default ModalAssetInfo;
