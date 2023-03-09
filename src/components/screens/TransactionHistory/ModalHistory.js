import React, { useEffect, useMemo, useState } from 'react';
import ModalV2 from 'components/common/V2/ModalV2';
import TagV2 from 'components/common/V2/TagV2';
import { formatPrice, formatTime, getSymbolObject, shortHashAddress } from 'redux/actions/utils';
import { X } from 'react-feather';
import { API_GET_WALLET_TRANSACTION_HISTORY } from 'redux/actions/apis';
import axios from 'axios';
import { ApiStatus } from 'redux/actions/const';
import AssetLogo from '../../wallet/AssetLogo';
import Skeletor from 'components/common/Skeletor';
import TextCopyable from 'components/screens/Account/TextCopyable';
import { get, isArray, isNumber, isString } from 'lodash';
import classNames from 'classnames';
import { TRANSACTION_TYPES, modalDetailColumn, COLUMNS_TYPE } from './constant';
import { WalletType } from 'redux/actions/const';

const WalletTypeById = {
    0: WalletType.SPOT,
    1: WalletType.MARGIN,
    2: WalletType.FUTURES,
    3: WalletType.P2P,
    4: WalletType.POOL
};

const FIX_ID = '64076daac648f330462bfaeb';

const ModalHistory = ({ onClose, isVisible, className, id, assetConfig, t }) => {
    const [detailTx, setDetailTx] = useState(null);
    console.log('detailTx:', detailTx);
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
                    setDetailTx(detail.data.data);
                    const asset = assetConfig?.find((e) => e?.id === detail.data.data?.result?.currency);
                    setAssetData(asset);
                }
            } catch (error) {
                console.log('error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            // fetchDetail(id);
            fetchDetail(FIX_ID);
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
            className={`w-[90%] !max-w-[488px] select-none border-divider ${className}`}
            customHeader={() => (
                <div className="absolute right-8 top-8">
                    <div className="flex items-center justify-center w-6 h-6 rounded-md hover:opacity-50 transition-opacity cursor-pointer" onClick={onClose}>
                        <X size={24} />
                    </div>
                </div>
            )}
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
                        <div className="flex pt-20 bg-center bg-cover bg-no-repeat px-8 pb-6 bg-tx-history-detail dark:bg-tx-history-detail-dark flex-col font-semibold text-2xl text-txtPrimary dark:text-txtPrimary-dark items-center">
                            <div className="mb-6 flex w-full items-start capitalize">{detailTx.type}</div>
                            <div className="mb-6">
                                {detailTx.type === 'convert' ? (
                                    <div className="flex items-center space-x-4">
                                        <AssetLogo useNextImg={true} size={80} assetCode={detailTx?.additionalData?.fromAsset} />
                                        <AssetLogo useNextImg={true} size={80} assetCode={detailTx?.additionalData?.toAsset} />
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
                                    : detailTx?.result?.money_use > 0 &&
                                      '+' + formatPrice(detailTx?.result?.money_use, assetData?.assetDigit ?? 0) + assetData?.assetCode}
                            </div>
                            <TagV2 type="success">{t('common:success')}</TagV2>
                        </div>
                        <div className="mx-8 p-4 space-y-1 rounded-xl dark:bg-darkBlue-3 bg-hover-1">
                            {modalDetailColumn[detailTx.type].map((col) => {
                                const additionalData = detailTx?.additionalData;

                                const keyData = col.keys
                                    .filter((key) => {
                                        // filter out falsy value or array, obj value.
                                        return isNumber(get(additionalData, key)) || isString(get(additionalData, key));
                                    })
                                    .map((key, index) => (index >= 1 ? ' ' : '') + get(additionalData, key))
                                    .join('');

                                let formatKeyData = keyData;
                                let symbol;
                                switch (col.type) {
                                    case COLUMNS_TYPE.COPIEDABLE:
                                        formatKeyData = (
                                            <TextCopyable showingText={col.isAddress ? `${shortHashAddress(keyData, 6, 6)}` : undefined} text={keyData} />
                                        );
                                        break;
                                    case COLUMNS_TYPE.TIME:
                                        formatKeyData = formatTime(keyData, 'HH:mm:ss dd/MM/yyyy');
                                        break;

                                    case COLUMNS_TYPE.RATE:
                                        formatKeyData = `1 ${additionalData.fromAsset} =  ${additionalData?.toQty / additionalData?.fromQty}  ${
                                            additionalData.toAsset
                                        }`;
                                        break;
                                    case COLUMNS_TYPE.SYMBOL:
                                        symbol = getSymbolObject(keyData);
                                        formatKeyData = `${symbol?.baseAsset}/${symbol?.quoteAsset}`;
                                        break;
                                    case COLUMNS_TYPE.FUTURES_ORDER:
                                        symbol = getSymbolObject(additionalData.symbol);
                                        formatKeyData = `${formatPrice(keyData)} ${symbol?.quoteAsset}`;
                                        break;
                                    case COLUMNS_TYPE.NUMBER_OF_ASSETS:
                                        const assetLength = additionalData.assets.length;
                                        formatKeyData = `${assetLength < 10 ? `0${assetLength}` : assetLength}`;
                                        break;
                                    case COLUMNS_TYPE.WALLET_TYPE:
                                        formatKeyData = <div className="capitalize">Ví {WalletTypeById?.[keyData]?.toLowerCase()}</div>;
                                        break;
                                    case COLUMNS_TYPE.NAMI_SYSTEM:
                                        formatKeyData = 'NAMI System'
                                        break;
                                    default:
                                        break;
                                }
                                return (
                                    <div key={col.localized} className="flex justify-between py-3 items-center">
                                        <div className="text-txtSecondary dark:text-txtSecondary-dark">{col.localized}</div>
                                        <div
                                            className={classNames('font-semibold text-txtPrimary  dark:text-txtPrimary-dark', {
                                                '!text-dominant': col.primaryTeal
                                            })}
                                        >
                                            {formatKeyData}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {detailTx.type === TRANSACTION_TYPES.CONVERTSMALLBALANCE && (
                            <div className="mx-8 mt-6">
                                <div className="font-semibold mb-3">Danh sách token chuyển đổi</div>
                                <div className="p-4  space-y-1 rounded-xl dark:bg-darkBlue-3 bg-hover-1">
                                    {detailTx.additionalData.assets.map((asset) => (
                                        <div key={asset.assetId} className="flex text-txtPrimary  dark:text-txtPrimary-dark justify-between py-3 items-center">
                                            <div className="">{asset.assetId}</div>
                                            <div className={classNames('font-semibold ')}>{formatPrice(asset.value)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )
            )}

            {/* <div>
                {data &&
                    data?.length &&
                    data?.map((transaction) => (
                        <div key={transaction.key} className="py-3  text-txtPrimary dark:text-txtPrimary-dark flex justify-between">
                            <div className="">{transaction.key}</div>
                            <div className="font-semibold">{transaction.value}</div>
                        </div>
                    ))}
            </div> */}
        </ModalV2>
    );
};

export default React.memo(ModalHistory);
