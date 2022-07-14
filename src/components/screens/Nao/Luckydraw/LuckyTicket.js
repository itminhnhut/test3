import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { getS3Url } from 'redux/actions/utils';
import classnames from 'classnames';
import { useTranslation } from 'next-i18next';

const LuckyTicket = ({ onClose, width }) => {
    const xs = width <= 360;
    const { t } = useTranslation();
    const [hidden, setHidden] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setHidden(false);
        }, 2000);
    }, [])
    return (
        <>
            <Div>
                <BgCenter className={`top-1/2 ${xs ? 'min-w-[183px]' : 'min-w-[221px]'}`}>
                    <TextTicket xs={xs} className="top-[10%] text-[0.625rem] font-medium opacity-[0.65]">
                        <div className="leading-4">ID: #123456789</div>
                        <div className="leading-4">Thời gian: 2022-06-09 10:31</div>
                    </TextTicket>
                    <TextTicket className="top-[33%] text-lg font-medium px-4">
                        {t('nao:luckydraw:goodluck')}
                    </TextTicket>
                    <img src="/images/nao/luckydraw/ic_open_ticket.png" width={221} height={474} />
                </BgCenter>
            </Div>
            {hidden ? <div className="h-[48px]" />
                :
                <div onClick={onClose} className="bg-nao-blue2 font-semibold leading-6 py-3 rounded-xl cursor-pointer">
                    {t('common:close')}
                </div>}
        </>
    );
};

const BgCenter = styled.div.attrs({
    className: 'absolute'
})`
    left:50%;
    transform: translate(-50%,-50%)
`

const TextTicket = styled.div.attrs({
    className: 'absolute w-full'
})`
    left:50%;
    transform: translate(-50%,0)
`


const InZoom = keyframes`
    0% {
        transform: scale(0, 0);
    }
    100% {
        transform: scale(1, 1);
    }
`

const Div = styled.div.attrs({
    className: 'select-none'
})`
    animation-name: ${InZoom};
    animation-duration: 2s;
`

export default LuckyTicket;