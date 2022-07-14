import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import classnames from 'classnames';
import { useTranslation } from 'next-i18next';
import { formatTime, getS3Url } from 'redux/actions/utils';

const LuckyTicket = ({ ticket, onClose, width, tickets }) => {
    const xs = width <= 360;
    const { t } = useTranslation();
    const [hidden, setHidden] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setHidden(false);
        }, 2000);
    }, [])

    const isGift = ticket?.can_receive;

    return (
        <>
            <Div>
                <BgCenter className={`top-1/2 ${xs ? 'min-w-[183px]' : 'min-w-[221px]'}`}>
                    <TextTicket className="top-[33%] text-lg font-semibold px-5 flex flex-col items-center">
                        {t(`nao:luckydraw:${isGift ? 'congrat_first' : 'goodluck'}`)}
                        {isGift && <div className="flex items-center space-x-2 pt-1">
                            <TextShadow className="text-[1.75rem] leading-9 font-semibold">{ticket?.reward?.value}</TextShadow>
                            <BgIcon>
                                <img src={getS3Url('/images/nao/ic_nao.png')} width="20" height="20" alt="" />
                            </BgIcon>
                        </div>}
                    </TextTicket>
                    <TextTicket xs={xs} className="top-[85%] text-[0.625rem] font-medium opacity-[0.65]">
                        <div className="leading-4">ID: #{ticket?.reward?.ticket_code}</div>
                        <div className="leading-4">{t('common:Thời gian')}: {formatTime(ticket?.reward?.time, 'yyyy-MM-dd HH:mm')}</div>
                    </TextTicket>
                    <img src={getS3Url(`/images/nao/luckydraw/${isGift ? 'ic_gift' : 'ic_open_ticket'}.png`)} width={221} height={474} />
                </BgCenter>
            </Div>
            {hidden ?
                <div className="min-h-[24px]" />
                :
                <div onClick={() => onClose(ticket)}
                    className="bg-nao-blue2 font-semibold leading-6 py-3 rounded-xl cursor-pointer">
                    {tickets.length > 1 ? t('nao:luckydraw:continue') : t('common:close')}
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

const BgIcon = styled.div.attrs({
    className: "w-7 h-7 rounded-[50%] flex items-center justify-center"
})`
    background: linear-gradient(101.26deg, rgb(0 21 81 / 60%) -5.29%, rgb(0 72 64 / 60%) 113.82%);
`

const TextShadow = styled.div.attrs({
    className: ""
})`
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

`

export default LuckyTicket;