import React, { } from 'react';
import styled from 'styled-components';
import classnames from 'classnames';
import Draggable from 'react-draggable';
import DragTicket from 'components/screens/Nao/Luckydraw/DragTicket';
import { useTranslation } from 'next-i18next';
import { getS3Url } from 'redux/actions/utils';

const LuckyPage = ({ tickets, onOpen, width }) => {
    const { t } = useTranslation();
    const xs = width <= 360;
    const minWidth = xs ? 177 : 253;

    return (
        <>
            <div className="relative z-[2]">
                <div className={classnames(
                    'font-semibold text-[#02FFFE]',
                    { 'text-sm leading-[22px] pb-2': xs },
                    { 'leading-8 text-lg pb-4': !xs }
                )}>
                    {t(`nao:luckydraw:${tickets ? '' : 'not_'}ticket_title`)}
                </div>
                <div className={classnames(
                    'font-medium ',
                    { 'text-xs pb-8 px-8': xs },
                    { 'leading-7 pb-12 px-5': !xs },
                    { '!pb-6': tickets }
                )}>
                    {t(`nao:luckydraw:ticket_des`, { vndc: tickets ? '100,000,000' : '10,000,000 ', nao: tickets ? '100' : '10' })}
                </div>
                {tickets && <div onClick={() => onOpen(tickets[tickets.length - 1])} className="bg-nao-blue2 font-semibold leading-6 py-3 rounded-xl cursor-pointer">
                    {tickets ? t('nao:luckydraw:open_now') : t('nao:luckydraw:trade')}
                </div>
                }
                {tickets && <div className="text-[0.625rem] opacity-[0.65] leading-7 pt-2">
                    {t('nao:luckydraw:pull_ticket')}
                </div>}
            </div>
            <BgCenter className={`select-none top-1/2  ${xs ? 'min-w-[177px]' : 'min-w-[253px]'}`}>
                <div className={`bg-[#3C8BFD] w-full rounded-[50%] ${xs ? 'h-[165px] ' : 'h-[235px] '}`}></div>
                {tickets &&
                    tickets.map((ticket, idx) => (
                        <BgCenter key={idx} className={`${xs ? 'min-w-[127px]' : 'min-w-[181px]'} top-[25%]`}>
                            <DragTicket ticket={ticket} onOpen={onOpen} xs={xs} />
                        </BgCenter>
                    ))
                }
                <div style={{ bottom: `calc(${minWidth}px/2)` }} className='z-[2] relative w-full'>
                    <img src={getS3Url("/images/nao/luckydraw/bg_cover.png")} />
                </div>
            </BgCenter>
            <div className={`bottom-0 absolute left-0 h-[45%] w-full`}>
                <img src={getS3Url('/images/nao/luckydraw/bg_footer.png')} className='w-full' />
            </div>
        </>
    );
};


const BgCenter = styled.div.attrs({
    className: 'absolute'
})`
    left:50%;
    transform: translate(-50%,-42%)
`
export default LuckyPage;