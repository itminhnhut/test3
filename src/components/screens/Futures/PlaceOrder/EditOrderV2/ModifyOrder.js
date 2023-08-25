import React, { useMemo, useState, useRef, useEffect } from 'react';
import ModalV2 from 'components/common/V2/ModalV2';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';
import { useTranslation } from 'next-i18next';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import EditVolV2 from './EditVolV2';
import EditMarginV2 from './EditMarginV2';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { getPairConfig } from 'redux/selectors';
import { convertSymbol } from 'redux/actions/utils';

const tabs = [
    { label: 'futures:mobile:adjust_margin:add_volume', value: 'vol' },
    { label: 'futures:margin', value: 'margin' }
];

const getAvailable = createSelector([(state) => state.wallet?.FUTURES, (utils, params) => params], (wallet, params) => {
    const _avlb = wallet?.[params.assetId];
    return _avlb ? Math.max(_avlb?.value, 0) - Math.max(_avlb?.locked_value, 0) : 0;
});
const ModifyOrder = ({ isVisible, onClose, order, lastPrice, decimals, marketWatch, forceFetchOrder }) => {
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;
    const { t } = useTranslation();
    const [tab, setTab] = useState('vol');
    const pairConfig = useSelector((state) => getPairConfig(state, order?.symbol));
    const available = useSelector((state) => getAvailable(state, { assetId: pairConfig?.quoteAssetId }));
    const pairTicker = marketWatch?.[convertSymbol(order?.symbol)];
    const _lastPrice = pairTicker?.lastPrice ?? lastPrice;
    const quoteAsset = pairConfig?.quoteAsset;
    const order_value = order?.order_value ?? 0;
    const side = order?.side;
    const margin = order?.margin ?? 0;
    const quantity = order?.quantity ?? 0;

    const fee = useMemo(() => {
        const _fee = order?.fee ?? 0;
        // const funding = order?.funding_fee?.margin ? Math.abs(order?.funding_fee?.margin) : 0
        return _fee;
    }, [order]);

    const [showAlert, setShowAlert] = useState(false);
    const message = useRef({
        status: '',
        title: '',
        message: '',
        notes: ''
    });

    useEffect(() => {
        if (isVisible) setTab('vol');
    }, [isVisible]);

    const _onConfirm = (msg) => {
        if (onClose) onClose();
        message.current = msg;
        if (forceFetchOrder) forceFetchOrder();
        setShowAlert(true);
    };

    return (
        <>
            <AlertModalV2
                isVisible={showAlert}
                onClose={() => setShowAlert(false)}
                type={message.current?.status}
                title={message.current?.title}
                message={message.current?.message}
                notes={message.current?.notes}
            />
            <ModalV2 className="!max-w-[800px]" isVisible={isVisible} onBackdropCb={onClose}>
                <div className="text-2xl font-semibold mb-2">{t('futures:mobile:modify_order')}</div>
                <Tabs isDark tab={tab} className="gap-6 border-b border-divider dark:border-divider-dark">
                    {tabs?.map((item, idx) => (
                        <TabItem key={idx} V2 className="!text-left !px-0 !text-base" value={item.value} onClick={(isClick) => isClick && setTab(item.value)}>
                            {t(item.label)}
                        </TabItem>
                    ))}
                </Tabs>
                <div className="mt-6">
                    {tab === 'vol' && (
                        <EditVolV2
                            order={order}
                            pairConfig={pairConfig}
                            pairTicker={pairTicker}
                            available={available}
                            _lastPrice={_lastPrice}
                            quoteAsset={quoteAsset}
                            order_value={order_value}
                            side={side}
                            margin={margin}
                            quantity={quantity}
                            decimals={decimals}
                            fee={fee}
                            onConfirm={_onConfirm}
                            isDark={isDark}
                        />
                    )}
                    {tab === 'margin' && (
                        <EditMarginV2
                            order={order}
                            available={available}
                            _lastPrice={_lastPrice}
                            quoteAsset={quoteAsset}
                            order_value={order_value}
                            side={side}
                            margin={margin}
                            quantity={quantity}
                            decimals={decimals}
                            fee={fee}
                            onConfirm={_onConfirm}
                            isDark={isDark}
                        />
                    )}
                </div>
            </ModalV2>
        </>
    );
};

export default ModifyOrder;
