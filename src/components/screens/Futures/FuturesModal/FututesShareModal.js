import React, { useMemo, useRef, useState } from 'react';
import ModalV2 from 'components/common/V2/ModalV2';
import { useTranslation } from 'next-i18next';
import Button from 'components/common/V2/ButtonV2/Button';
import styled from 'styled-components';
import { formatTime, TypeTable } from 'redux/actions/utils';
import { getShareModalData } from 'components/screens/Mobile/Futures/TabOrders/ShareFutureMobile';
import ChevronDown from 'components/svg/ChevronDown';
import colors from 'styles/colors';
import QRCode from 'qrcode.react';
import { useSelector } from 'react-redux';
import DomToImage from 'dom-to-image';
import { IconLoading } from 'components/common/Icons';

const FututesShareModal = ({ isVisible, onClose, order }) => {
    const marketWatch = useSelector((state) => state.futures.marketWatch);
    const pairTicker = marketWatch[order?.symbol];
    const refCode = useSelector((state) => state.auth?.user?.code_refer);
    const content = useRef();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const { price, closePrice, percent, leverage, id } = getShareModalData({ order, pairPrice: pairTicker });
    const negative = +String(percent).substr(0, String(percent).length - 1) < 0;

    const saveFile = (file, name) => {
        const a = document.createElement('a');
        const url = URL.createObjectURL(file);
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const onDownLoad = async () => {
        setLoading(true);
        try {
            const scale = 2;
            const option = {
                height: content.current.offsetHeight * scale,
                width: content.current.offsetWidth * scale,
                style: {
                    transform: 'scale(' + scale + ')',
                    transformOrigin: 'top left',
                    width: content.current.offsetWidth + 'px',
                    height: content.current.offsetHeight + 'px'
                }
            };
            await DomToImage.toBlob(content.current, option).then((blob) => {
                return saveFile(new File([blob], `${refCode}.png`, { type: 'image/png' }), `${refCode}.png`);
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalV2 wrapClassName="dark:!bg-dark-4" className="!max-w-[588px]" isVisible={isVisible} onBackdropCb={onClose}>
            <div className="text-2xl font-semibold mb-6">{t('futures:share:title')}</div>
            <Background ref={content} negative={negative}>
                <div className="flex flex-col space-y-1 text-txtSecondary-dark text-xs leading-4">
                    <span>#{id}</span>
                    <span>{formatTime(order?.opened_at, 'HH:mm:ss dd/MM/yyyy')}</span>
                </div>
                <div className="space-x-2 text-sm font-semibold mt-8 mb-2">
                    <TypeTable type="side" data={order} />
                    <span className="text-txtSecondary-dark">•</span>
                    <span className="text-white">{leverage}x</span>
                    <span className="text-txtSecondary-dark">•</span>
                    <span className="text-white">{order?.symbol}</span>
                </div>
                <div className={`${negative ? 'text-red' : 'text-teal'} text-[2.25rem] font-semibold flex items-center space-x-1`}>
                    <ChevronDown size={30} color={negative ? colors.red2 : colors.teal} className={!negative ? '!rotate-0' : ''} />
                    <span>{String(percent).substr(1, String(percent).length)}</span>
                </div>
                <div className="w-1/2 space-y-1 mt-6">
                    <Row>
                        <Item>{t('futures:order_table:open_price')}</Item>
                        <Item>{price}</Item>
                    </Row>
                    <Row>
                        <Item>{t('futures:order_table:close_price')}</Item>
                        <Item>{closePrice}</Item>
                    </Row>
                </div>
                <div id="section_bottom" className="absolute bottom-0 left-0 py-3 w-full flex items-center justify-between px-4">
                    <img className="max-h-6" src="/images/logo/nami-logo-v2.png" />
                    <div className="flex items-center space-x-6">
                        <div className="flex flex-col text-white">
                            <span className="text-xs">{t('futures:share:ref_id')}</span>
                            <span className="font-semibold">{refCode}</span>
                        </div>
                        <div className="p-1 bg-white rounded-[3px]">
                            <QRCode value={`https://nami.exchange/ref/${refCode}`} size={44} />
                        </div>
                    </div>
                </div>
            </Background>
            <Button disabled={loading} loading={loading} onClick={onDownLoad}>
                {t(`futures:${loading ? 'order_table:loading' : 'download'}`)}
            </Button>
        </ModalV2>
    );
};

const Row = styled.div.attrs({
    className: 'flex items-center justify-between text-sm leading-6'
})``;

const Item = styled.div.attrs({
    className: 'first:text-txtSecondary-dark last:font-semibold last:text-white'
})``;

const Background = styled.div.attrs({
    className: 'min-h-[380px] bg-dark mb-10 rounded-xl relative p-6 overflow-hidden'
})`
    background-image: ${({ negative }) => `url(${`/images/screen/futures/bg_share_${negative ? 'down' : 'up'}.png`})`};
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    #section_bottom {
        background-image: ${({}) => `url(${`/images/screen/futures/bg_share_bottom.png`})`};
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }
`;

export default FututesShareModal;
