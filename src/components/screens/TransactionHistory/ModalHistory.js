import React, { useEffect, useState } from 'react';
import ModalV2 from 'components/common/V2/ModalV2';
import TagV2 from 'components/common/V2/TagV2';
import { formatSwapRate, formatTime, getSymbolObject, shortHashAddress } from 'redux/actions/utils';
import { X } from 'react-feather';
import { API_GET_WALLET_TRANSACTION_HISTORY } from 'redux/actions/apis';
import axios from 'axios';
import { ApiStatus } from 'redux/actions/const';
import AssetLogo from '../../wallet/AssetLogo';
import Skeletor from 'components/common/Skeletor';
import TextCopyable from 'components/screens/Account/TextCopyable';
import { find, get, isNumber, isString } from 'lodash';
import classNames from 'classnames';
import { TRANSACTION_TYPES, modalDetailColumn, COLUMNS_TYPE } from './constant';
import { WalletTypeById, WalletType } from 'redux/actions/const';
import { ArrowCompareIcon } from '../../svg/SvgIcon';
import { customFormatBalance } from '.';

const NULL_ASSET = '--';

const renderWallet = ({ t, key, language }) => {
    const wallet = {
        [WalletType.SPOT]: t('common:wallet', { wallet: 'Nami Spot' }),
        [WalletType.FUTURES]: t('common:wallet', { wallet: 'Nami Futures' }),
        [WalletType.BROKER]: t('common:wallet', { wallet: language === 'vi' ? 'hoa hồng Nami' : 'Nami Commission' }),
        [WalletType.NAO_FUTURES]: t('common:wallet', { wallet: 'NAO Futures' })
    };

    const walletType = WalletTypeById[key];
    return wallet[walletType] || walletType || NULL_ASSET;
};

const parseObjToString = ({ keys, object }) => {
    return keys
        .filter((key) => {
            // filter number & string value.
            return isNumber(get(object, key)) || isString(get(object, key));
        })
        .map((key, index) => (index >= 1 ? ' ' : '') + get(object, key))
        .join('');
};

const ModalHistory = ({ onClose, isVisible, className, id, assetConfig, t, categoryConfig, language }) => {
    const [detailTx, setDetailTx] = useState(null);
    const [assetData, setAssetData] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const source = axios.CancelToken.source();
        const fetchDetail = async (id) => {
            setLoading(true);
            try {
                const detail = await axios.get(API_GET_WALLET_TRANSACTION_HISTORY + '/' + id, {
                    cancelToken: source.token
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
            source.cancel();
        };
    }, [id, assetConfig]);

    const isMoneyUseOutofDigit = detailTx?.result?.money_use && Math.abs(+detailTx?.result?.money_use) < Math.pow(10, (assetData?.assetDigit || 0) * -1);

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

                    <div className="mb-6">
                        <Skeletor className="rounded-full" width={100} height={20} />
                    </div>
                    <div className="mx-8 w-full dark:bg-darkBlue-3 bg-hover-1 p-4  space-y-1 rounded-xl">
                        <div className="flex w-full justify-between items-center">
                            <Skeletor className="rounded-full" width={100} height={20} />
                            <Skeletor className="rounded-full" width={100} height={20} />
                        </div>
                        <div className="flex w-full justify-between items-center">
                            <Skeletor className="rounded-full" width={100} height={20} />
                            <Skeletor className="rounded-full" width={100} height={20} />
                        </div>
                        <div className="flex w-full justify-between items-center">
                            <Skeletor className="rounded-full" width={100} height={20} />
                            <Skeletor className="rounded-full" width={100} height={20} />
                        </div>
                    </div>
                </div>
            ) : (
                detailTx && (
                    <>
                        <div className="flex pt-8 bg-center bg-cover bg-no-repeat px-8 pb-6 bg-tx-history-detail dark:bg-tx-history-detail-dark flex-col font-semibold text-2xl text-txtPrimary dark:text-txtPrimary-dark items-center">
                            <div className="flex w-full mb-6 justify-end rounded-md hover:opacity-50 transition-opacity cursor-pointer" onClick={onClose}>
                                <X size={24} />
                            </div>
                            <div className="mb-6 flex w-full items-start capitalize">
                                {detailTx?.categoryContent?.[language] ?? t('transaction-history:default_category')}
                            </div>
                            <div className="mb-6">
                                {/* convert === 'SWAP'. category 135 is SWAP FEE */}
                                {detailTx.type === 'convert' && detailTx.result.category !== 135 ? (
                                    <div className="flex items-center space-x-2">
                                        <div>
                                            <AssetLogo
                                                useNextImg={true}
                                                size={80}
                                                assetCode={get(detailTx, 'additionalData.fromAsset') || get(detailTx, 'result.metadata.fromAsset')}
                                            />
                                        </div>
                                        {(get(detailTx, 'additionalData.toAsset') || get(detailTx, 'result.metadata.toAsset')) !== 'USDT' && (
                                            <>
                                                <ArrowCompareIcon size={32} />
                                                <div>
                                                    <AssetLogo
                                                        useNextImg={true}
                                                        size={80}
                                                        assetCode={get(detailTx, 'additionalData.toAsset') || get(detailTx, 'result.metadata.toAsset')}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <AssetLogo useNextImg={true} size={80} assetId={detailTx?.result?.currency || detailTx?.additionalData?.assetId} />
                                )}
                            </div>
                            <div className="mb-3">
                                {!isMoneyUseOutofDigit
                                    ? `${detailTx?.result?.money_use > 0 ? '+' : ''}${customFormatBalance(
                                          detailTx?.result?.money_use,
                                          assetData?.assetDigit,
                                          true
                                      )}`
                                    : '--'}{' '}
                                {assetData?.assetCode}
                            </div>
                            <TagV2 type="success">
                                <div className="font-normal">{t('transaction-history:completed')}</div>
                            </TagV2>
                        </div>
                        <div className="mx-8 p-4 space-y-1 rounded-xl dark:bg-darkBlue-3 bg-hover-1">
                            {modalDetailColumn?.[detailTx.type]?.map((col) => {
                                let additionalData;

                                const keyData = parseObjToString({
                                    keys: col.keys,
                                    object: detailTx
                                });

                                let formatKeyData =
                                    keyData ||
                                    (col?.backupKeys
                                        ? parseObjToString({
                                              keys: col.backupKeys,
                                              object: detailTx
                                          })
                                        : null);
                                let symbol, asset;
                                switch (col.type) {
                                    case COLUMNS_TYPE.COPIEDABLE:
                                        let priorityKey = keyData || get(detailTx, 'additionalData.txId') || get(detailTx, 'additionalData.from.name');

                                        if (!priorityKey) formatKeyData = null;
                                        else {
                                            formatKeyData = (
                                                <TextCopyable
                                                    showingText={col.isAddress ? `${shortHashAddress(priorityKey, 10, 6)}` : undefined}
                                                    text={priorityKey}
                                                />
                                            );
                                        }

                                        break;
                                    case COLUMNS_TYPE.TIME:
                                        formatKeyData = formatTime(keyData, 'HH:mm:ss dd/MM/yyyy');
                                        break;

                                    case COLUMNS_TYPE.RATE:
                                        additionalData = detailTx?.additionalData || detailTx?.result?.metadata;

                                        if (!additionalData) {
                                            formatKeyData = '--';
                                            break;
                                        }
                                        const displayingAsset = additionalData?.displayingPriceAsset;

                                        const SWAP_SIDE = {
                                            to: 'from',
                                            from: 'to'
                                        };
                                        const otherFieldSide = displayingAsset === additionalData?.fromAsset ? 'to' : 'from';

                                        const fiatDigit = {
                                            USDT: 4,
                                            VNDC: 0
                                        }[displayingAsset?.toUpperCase()];

                                        const price =
                                            additionalData?.displayingPrice ??
                                            additionalData?.[`${otherFieldSide}Qty`] / additionalData?.[`${SWAP_SIDE[otherFieldSide]}Qty`];
                                        formatKeyData = `1 ${additionalData?.[`${otherFieldSide}Asset`] || NULL_ASSET} = ${customFormatBalance(
                                            price,
                                            fiatDigit,
                                            false
                                        )} ${displayingAsset || NULL_ASSET}`;
                                        break;
                                    case COLUMNS_TYPE.SYMBOL:
                                        symbol = getSymbolObject(keyData);
                                        if (!symbol) {
                                            symbol = {
                                                baseAsset: get(detailTx, 'additionalData.baseAsset') || get(detailTx, 'result.metadata.baseAsset'),
                                                quoteAsset: get(detailTx, 'additionalData.quoteAsset') || get(detailTx, 'result.metadata.quoteAsset')
                                            };
                                        }
                                        formatKeyData = `${symbol?.baseAsset || NULL_ASSET}/${symbol?.quoteAsset || NULL_ASSET}`;
                                        break;
                                    case COLUMNS_TYPE.FUTURES_ORDER:
                                        symbol = getSymbolObject(detailTx?.additionalData?.symbol);
                                        if (!symbol) {
                                            symbol = {
                                                baseAsset: get(detailTx, 'additionalData.baseAsset') || get(detailTx, 'result.metadata.baseAsset'),
                                                quoteAsset: get(detailTx, 'additionalData.quoteAsset') || get(detailTx, 'result.metadata.quoteAsset')
                                            };
                                        }

                                        formatKeyData = `${customFormatBalance(keyData, assetData?.assetDigit)} ${symbol?.quoteAsset || NULL_ASSET}`;
                                        break;
                                    case COLUMNS_TYPE.NUMBER_OF_ASSETS:
                                        additionalData = detailTx?.additionalData || detailTx?.result?.metadata;
                                        if (!additionalData) return;
                                        const assetLength = additionalData?.assets
                                            ? additionalData?.assets?.length
                                            : Object.keys(additionalData?.reward?.tokens || {})?.length;
                                        formatKeyData = `${assetLength < 10 ? `0${assetLength}` : assetLength}`;
                                        break;
                                    case COLUMNS_TYPE.WALLET_TYPE:
                                        formatKeyData = <div className="">{renderWallet({ t, language, key: keyData })}</div>;
                                        break;
                                    case COLUMNS_TYPE.NAMI_SYSTEM:
                                        formatKeyData = t('transaction-history:nami_system');
                                        break;
                                    case COLUMNS_TYPE.STAKING_SNAPSHOT:
                                        asset = assetConfig.find((asset) => asset.id === get(detailTx, col.keys[1]));
                                        formatKeyData = (
                                            <div className="flex">
                                                <a>
                                                    {customFormatBalance(get(detailTx, col.keys[0]), asset?.assetDigit || 0, true)}{' '}
                                                    {asset?.assetCode || NULL_ASSET}
                                                </a>
                                            </div>
                                        );
                                        break;
                                    case COLUMNS_TYPE.FIAT_USER:
                                        const fiatUsername = get(detailTx, col.keys[0]) || get(detailTx, col.backupKeys[0]);
                                        const fiatUserNamiCode = get(detailTx, col.keys[1]) || get(detailTx, col.backupKeys[1]);
                                        formatKeyData = (
                                            <>
                                                <div className="font-semibold capitalize text-txtPrimary dark:text-txtPrimary-dark">
                                                    {fiatUsername?.toLowerCase() || NULL_ASSET}
                                                </div>{' '}
                                                <div className="text-sm text-txtSecondary dark:text-txtSecondary-dark">{fiatUserNamiCode || NULL_ASSET}</div>{' '}
                                            </>
                                        );
                                        break;
                                    case COLUMNS_TYPE.SIDETYPE:
                                        const side =
                                            get(detailTx, col.keys[0])?.toLowerCase() || get(detailTx, 'result.metadata.side')?.toLowerCase() || NULL_ASSET;
                                        const type = get(detailTx, col.keys[1])?.toLowerCase() || get(detailTx, 'result.metadata.type')?.toLowerCase();
                                        formatKeyData = (
                                            <div className={classNames({ 'text-red': side === 'sell' }, { 'text-dominant': side === 'buy' })}>{`${t(
                                                'transaction-history:' + side
                                            )} ${type ? t('transaction-history:' + type) : ''}`}</div>
                                        );
                                        break;
                                    case COLUMNS_TYPE.INSURANCE_EXPECT:
                                        const sideInsurance =
                                            get(detailTx, col.keys[0])?.toLowerCase() ||
                                            get(detailTx, 'result.metadata.payload.side')?.toLowerCase() ||
                                            NULL_ASSET;
                                        formatKeyData = (
                                            <div
                                                className={classNames(
                                                    'uppercase',
                                                    { 'text-red': sideInsurance === 'sell' },
                                                    { 'text-dominant': sideInsurance === 'buy' }
                                                )}
                                            >
                                                {['sell', 'buy'].includes(sideInsurance)
                                                    ? t('transaction-history:modal_detail.expect_' + sideInsurance)
                                                    : NULL_ASSET}
                                            </div>
                                        );
                                        break;
                                    case COLUMNS_TYPE.INSURANCE_PAIR:
                                        symbol = {
                                            baseAsset: get(detailTx, 'additionalData.payload.asset_covered') || get(detailTx, 'result.metadata.payload.asset_covered'),
                                            quoteAsset: get(detailTx, 'additionalData.payload.quote_asset') || get(detailTx, 'result.metadata.payload.quote_asset')
                                        };

                                        formatKeyData = `${symbol?.baseAsset || NULL_ASSET}/${symbol?.quoteAsset || NULL_ASSET}`;
                                        break;
                                    case COLUMNS_TYPE.DEPOSIT_WITHDRAW_FEE:
                                        const fee = get(detailTx, col.keys[0]) || get(detailTx, 'result.metadata.fee.value') || 0;

                                        formatKeyData = (
                                            <div>
                                                {customFormatBalance(+fee, assetData?.assetDigit || 0)} {assetData?.assetCode}{' '}
                                            </div>
                                        );
                                        break;
                                    case COLUMNS_TYPE.CONVERT_ASSET:
                                        let qty = get(detailTx, col.keys[0]) || get(detailTx, col.backupKeys[0]);
                                        let assetCode = get(detailTx, col.keys[1]) || get(detailTx, col.backupKeys[1]);

                                        const config = assetConfig?.find((e) => e?.assetCode === assetCode);

                                        formatKeyData = `${customFormatBalance(+qty, config?.assetDigit || 0)} ${assetCode}`;
                                        break;

                                    default:
                                        break;
                                }
                                if (detailTx.type === TRANSACTION_TYPES.DEPOSITWITHDRAW) {
                                    // not showing "To" on type deposit (nạp)
                                    // not showing "From" on type withdraw (rút)
                                    if (
                                        (detailTx.result.category === 4 && col.localized === 'modal_detail.to') ||
                                        (detailTx.result.category === 5 && col.localized === 'modal_detail.from')
                                    )
                                        return null;

                                    // not showing "Fee" on type deposit (nạp)
                                    if (detailTx.result.category === 4 && col.localized === 'modal_detail.fee') {
                                        return null;
                                    }
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
                                            {formatKeyData || NULL_ASSET}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {detailTx.type === TRANSACTION_TYPES.CONVERTSMALLBALANCE && (
                            <div className="mx-8 mt-6">
                                <div className="font-semibold mb-3">{t('transaction-history:modal_detail.list_assets_convert')}</div>
                                <div className="p-4  space-y-1 rounded-xl dark:bg-darkBlue-3 bg-hover-1">
                                    {(detailTx?.additionalData?.assets || detailTx?.result?.metadata?.assets || []).map((asset) => {
                                        const _ = assetConfig.find((assetConf) => assetConf.id === asset.assetId);
                                        return (
                                            <div key={_?.id} className="flex text-txtPrimary  dark:text-txtPrimary-dark justify-between py-3 items-center">
                                                <div className="">{_?.assetCode || NULL_ASSET}</div>
                                                <div className={classNames('font-semibold')}>{customFormatBalance(asset.value, _?.assetDigit || 0, true)}</div>
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
