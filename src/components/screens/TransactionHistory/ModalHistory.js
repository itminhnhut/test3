import React, { useEffect, useMemo, useState } from 'react';
import ModalV2 from 'components/common/V2/ModalV2';
import TagV2 from 'components/common/V2/TagV2';
import { formatPrice } from 'redux/actions/utils';
import { X } from 'react-feather';
import { API_GET_WALLET_TRANSACTION_HISTORY } from 'redux/actions/apis';
import axios from 'axios';
import { ApiStatus } from 'redux/actions/const';
import AssetLogo from '../../wallet/AssetLogo';
import Skeletor from 'components/common/Skeletor';

const ModalHistory = ({ onClose, isVisible, className,  id, assetConfig, t }) => {
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
            wrapClassName="!p-8"
            onBackdropCb={onClose}
            className={`w-[90%] !max-w-[488px] select-none ${className}`}
            customHeader={() => (
                <div className="flex justify-end mb-6">
                    <div className="flex items-center justify-center w-6 h-6 rounded-md hover:opacity-50 transition-opacity cursor-pointer" onClick={onClose}>
                        <X size={24} />
                    </div>
                </div>
            )}
        >
            {loading ? (
                <div className="flex flex-col font-semibold text-xl text-txtPrimary dark:text-txtPrimary-dark items-center">
                    <div className="mb-2">
                        <Skeletor circle width={64} height={64} />
                    </div>
                    <div className="mb-2">
                        <Skeletor width={100} height={20} />
                    </div>
                    <Skeletor className="rounded-full" width={100} height={20} />
                </div>
            ) : (
                detailTx && (
                    <div className="flex flex-col font-semibold text-xl text-txtPrimary dark:text-txtPrimary-dark items-center">
                        <div className="mb-2">
                            <AssetLogo useNextImg={true} size={64} assetId={detailTx?.result?.currency || detailTx?.additionalData?.assetId} />
                        </div>
                        <div className="mb-2">
                            {detailTx?.result?.money_use > 0 && '+'}
                            {formatPrice(detailTx?.result?.money_use, assetData?.assetDigit ?? 0)} {assetData?.assetCode}
                        </div>
                        <TagV2 type="success">{t('common:success')}</TagV2>

                        {/* <div className="px-4">
                        <div className="flex justify-between items-center"></div>
                        <div className="flex justify-between items-center"></div>
                        <div className="flex justify-between items-center"></div>
                        <div className="flex justify-between items-center"></div>
                        <div className="flex justify-between items-center"></div>
                        <div className="flex justify-between items-center"></div>
                    </div> */}
                    </div>
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
