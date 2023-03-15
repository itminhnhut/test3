import React, { useEffect, useState } from 'react';
import ModalV2 from 'components/common/V2/ModalV2';
import TagV2 from 'components/common/V2/TagV2';
import { formatPrice, formatWallet, formatTime, getSymbolObject, shortHashAddress } from 'redux/actions/utils';
import { X } from 'react-feather';
import { API_GET_WALLET_TRANSACTION_HISTORY } from 'redux/actions/apis';
import axios from 'axios';
import { ApiStatus } from 'redux/actions/const';
import AssetLogo from '../../wallet/AssetLogo';
import Skeletor from 'components/common/Skeletor';
import TextCopyable from 'components/screens/Account/TextCopyable';
import { get, isNumber, isString } from 'lodash';
import classNames from 'classnames';
import { TRANSACTION_TYPES, modalDetailColumn, COLUMNS_TYPE } from './constant';
import { WalletType, EarnWalletType } from 'redux/actions/const';
import { ArrowCompareIcon } from '../../svg/SvgIcon';

const WalletTypeById = {
    0: WalletType.SPOT,
    1: WalletType.MARGIN,
    2: WalletType.FUTURES,
    3: WalletType.P2P,
    4: WalletType.POOL,
    5: WalletType.EARN,
    6: EarnWalletType.STAKE,
    7: EarnWalletType.FARM,
    8: WalletType.BROKER
};

const mappingTokensRewardType = (detail) => {
    const tokens = get(detail, 'additionalData.reward.tokens');
    if (!tokens) return [];

    const assets = Object.keys(tokens).map((key) => ({ assetId: +key, value: tokens[key] }));

    return assets;
};

const ModalHistory = ({ onClose, isVisible, className, id, assetConfig, t, categoryConfig, language }) => {
    const [detailTx, setDetailTx] = useState(null);
    const [assetData, setAssetData] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const controller = new AbortController();

        const fetchDetail = async (id) => {
            setLoading(true);
            try {
                const detail = await axios.get(API_GET_WALLET_TRANSACTION_HISTORY + '/' + id, {
                    signal: controller.signal
                });
                if (detail.data && (detail.data.statusCode === 200 || detail.data.statusCode === ApiStatus.SUCCESS)) {
                    const result = detail.data.data.result;
                    const category = categoryConfig.find((cate) => cate.category_id === result?.category);
                    const asset = assetConfig?.find((e) => e?.id === result?.currency);

                    setDetailTx({ ...detail.data.data, categoryContent: category?.content });
                    setAssetData(asset);
                }
            } catch (error) {
                console.log('error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDetail(id);
        }

        return () => {
            // stop axios on unmount
            controller.abort();
        };
    }, [id, assetConfig]);

    return (
        <ModalV2
            isVisible={isVisible}
            wrapClassName="!px-0"
            onBackdropCb={onClose}
            className={classNames(`w-[90%] !max-w-[488px] overflow-y-auto select-none border-divider`, { className })}
            customHeader={() => <div className="bg-transparent"></div>}
        >
            {loading ? (
                <div className="flex flex-col pt-20 px-8 font-semibold text-xl text-txtPrimary dark:text-txtPrimary-dark items-center">
                    <div className="mb-6 flex w-full items-start capitalize">
                        <Skeletor width={100} height={20} />
                    </div>

                    <div className="mb-6">
                        <Skeletor circle width={80} height={80} />
                    </div>
                    <div className="mb-2">
                        <Skeletor width={100} height={20} />
                    </div>
                    <Skeletor className="rounded-full" width={100} height={20} />
                </div>
            ) : (
                detailTx && (
                    <>
                        <div className="flex pt-8  bg-center bg-cover bg-no-repeat px-8 pb-6 bg-tx-history-detail dark:bg-tx-history-detail-dark flex-col font-semibold text-2xl text-txtPrimary dark:text-txtPrimary-dark items-center">
                            <div className="flex w-full mb-6 justify-end rounded-md hover:opacity-50 transition-opacity cursor-pointer" onClick={onClose}>
                                <X size={24} />
                            </div>
                            <div className="mb-6 flex w-full items-start capitalize">{detailTx?.categoryContent?.[language] ?? detailTx.type}</div>
                            <div className="mb-6">
                                {detailTx.type === 'convert' ? (
                                    <div className="flex items-center space-x-2">
                                        <div>
                                            <AssetLogo useNextImg={true} size={80} assetCode={detailTx?.additionalData?.fromAsset} />
                                        </div>
                                        <ArrowCompareIcon size={32} />
                                        <div>
                                            <AssetLogo useNextImg={true} size={80} assetCode={detailTx?.additionalData?.toAsset} />
                                        </div>
                                    </div>
                                ) : detailTx.type === TRANSACTION_TYPES.CONVERTSMALLBALANCE ? (
                                    <AssetLogo useNextImg={true} size={80} assetCode={'NAMI'} />
                                ) : (
                                    <AssetLogo useNextImg={true} size={80} assetId={detailTx?.result?.currency || detailTx?.additionalData?.assetId} />
                                )}
                            </div>
                            <div className="mb-3">
                                {detailTx.type === TRANSACTION_TYPES.CONVERTSMALLBALANCE
                                    ? '+' + formatPrice(detailTx?.additionalData?.toQty)
                                    : (detailTx?.result?.money_use > 0 ? '+' : '') +
                                      `${formatPrice(detailTx?.result?.money_use, assetData?.assetDigit ?? 0)} ${assetData?.assetCode}`}
                            </div>
                            <TagV2 type="success">{t('common:success')}</TagV2>
                        </div>
                        <div className="mx-8 p-4 space-y-1 rounded-xl dark:bg-darkBlue-3 bg-hover-1">
                            {modalDetailColumn[detailTx.type].map((col) => {
                                let additionalData;

                                const keyData = col.keys
                                    .filter((key) => {
                                        // filter out falsy value, array and obj.
                                        return isNumber(get(detailTx, key)) || isString(get(detailTx, key));
                                    })
                                    .map((key, index) => (index >= 1 ? ' ' : '') + get(detailTx, key))
                                    .join('');

                                let formatKeyData = keyData;
                                let symbol, asset;
                                switch (col.type) {
                                    case COLUMNS_TYPE.COPIEDABLE:
                                        let priorityKey = keyData || get(detailTx, 'additionalData.txId') || get(detailTx, 'additionalData.from.name');
                                        formatKeyData =
                                            priorityKey.includes('0x') || col.localized === 'ID' ? (
                                                <TextCopyable
                                                    showingText={col.isAddress ? `${shortHashAddress(priorityKey, 10, 6)}` : undefined}
                                                    text={priorityKey}
                                                />
                                            ) : (
                                                <span>{priorityKey}</span>
                                            );

                                        break;
                                    case COLUMNS_TYPE.TIME:
                                        formatKeyData = formatTime(keyData, 'HH:mm:ss dd/MM/yyyy');
                                        break;

                                    case COLUMNS_TYPE.RATE:
                                        additionalData = detailTx?.additionalData;
                                        asset = assetConfig.find((asset) => asset.assetCode === additionalData?.toAsset);

                                        formatKeyData = `1 ${additionalData?.fromAsset} =  ${formatPrice(
                                            additionalData?.toQty / additionalData?.fromQty,
                                            asset?.assetDigit ?? 0
                                        )}  ${additionalData?.toAsset}`;
                                        break;
                                    case COLUMNS_TYPE.SYMBOL:
                                        symbol = getSymbolObject(keyData);
                                        if (!symbol) {
                                            symbol = {
                                                baseAsset: get(detailTx, 'additionalData.baseAsset'),
                                                quoteAsset: get(detailTx, 'additionalData.quoteAsset')
                                            };
                                        }
                                        formatKeyData = `${symbol?.baseAsset}/${symbol?.quoteAsset}`;
                                        break;
                                    case COLUMNS_TYPE.FUTURES_ORDER:
                                        symbol = getSymbolObject(detailTx?.additionalData?.symbol);
                                        if (!symbol) {
                                            symbol = {
                                                baseAsset: get(detailTx, 'additionalData.baseAsset'),
                                                quoteAsset: get(detailTx, 'additionalData.quoteAsset')
                                            };
                                        }
                                        formatKeyData = `${formatPrice(keyData)} ${symbol?.quoteAsset}`;
                                        break;
                                    case COLUMNS_TYPE.NUMBER_OF_ASSETS:
                                        additionalData = detailTx?.additionalData;
                                        if (!additionalData) return;
                                        const assetLength = additionalData?.assets
                                            ? additionalData?.assets?.length
                                            : Object.keys(additionalData?.reward?.tokens)?.length;
                                        formatKeyData = `${assetLength < 10 ? `0${assetLength}` : assetLength}`;
                                        break;
                                    case COLUMNS_TYPE.WALLET_TYPE:
                                        formatKeyData = (
                                            <div className="uppercase">
                                                {WalletTypeById?.[keyData]?.toLowerCase()}
                                                {/* {t('transaction-history:wallet', { wallet: WalletTypeById?.[keyData]?.toLowerCase() })} */}
                                            </div>
                                        );
                                        break;
                                    case COLUMNS_TYPE.NAMI_SYSTEM:
                                        formatKeyData = 'NAMI System';
                                        break;
                                    case COLUMNS_TYPE.STAKING_SNAPSHOT:
                                        asset = assetConfig.find((asset) => asset.id === get(detailTx, col.keys[1]));
                                        formatKeyData = (
                                            <div className="flex">
                                                <a>
                                                    {formatPrice(get(detailTx, col.keys[0]), asset?.assetDigit || 0)} {asset?.assetCode}
                                                </a>
                                            </div>
                                        );
                                        break;
                                    case COLUMNS_TYPE.FIAT_USER:
                                        const formatKeyData = (
                                            <>
                                                <div className="font-semibold text-txtPrimary dark:text-txtPrimary-dark">{get(detailTx, col.keys[0])}</div>
                                                <div className="text-sm text-txtSecondary dark:text-txtSecodnary-dark">{get(detailTx, col.keys[1])}</div>
                                            </>
                                        );
                                        break;
                                    default:
                                        break;
                                }
                                return (
                                    <div key={col.localized} className="flex justify-between py-3 items-center">
                                        <div className="text-txtSecondary dark:text-txtSecondary-dark max-w-[170px]">
                                            {t(`transaction-history:${col.localized}`)}
                                        </div>
                                        <div
                                            className={classNames('ml-2 text-right font-semibold text-txtPrimary  dark:text-txtPrimary-dark', {
                                                '!text-dominant': col.primaryTeal
                                            })}
                                        >
                                            {formatKeyData}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {(detailTx.type === TRANSACTION_TYPES.CONVERTSMALLBALANCE || detailTx.type === TRANSACTION_TYPES.REWARD) && (
                            <div className="mx-8 mt-6">
                                <div className="font-semibold mb-3">
                                    {detailTx.type === TRANSACTION_TYPES.REWARD
                                        ? t('transaction-history:modal_detail.list_assets')
                                        : t('transaction-history:modal_detail.list_assets_convert')}
                                </div>
                                <div className="p-4  space-y-1 rounded-xl dark:bg-darkBlue-3 bg-hover-1">
                                    {(
                                        (detailTx.type === TRANSACTION_TYPES.CONVERTSMALLBALANCE && detailTx?.additionalData?.assets) ||
                                        (detailTx.type === TRANSACTION_TYPES.REWARD && mappingTokensRewardType(detailTx))
                                    ).map((asset) => {
                                        const _ = assetConfig.find((assetConf) => assetConf.id === asset.assetId);
                                        return (
                                            <div key={_?.id} className="flex text-txtPrimary  dark:text-txtPrimary-dark justify-between py-3 items-center">
                                                <div className="">{_?.assetCode}</div>
                                                <div className={classNames('font-semibold')}>
                                                    {isNaN(formatWallet(asset.value, _?.assetDigit || 0))
                                                        ? asset.value.toFixed(_?.assetDigit || 0)
                                                        : formatWallet(asset.value, _?.assetDigit || 0)}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                )
            )}
        </ModalV2>
    );
};

export default React.memo(ModalHistory);
