import React, { useState } from 'react';
import LayoutNaoToken from 'components/common/layouts/LayoutNaoToken';
import styled from 'styled-components';
import LuckyPage from 'components/screens/Nao/Luckydraw/LuckyPage';
import LuckyTicket from 'components/screens/Nao/Luckydraw/LuckyTicket';
import { useWindowSize } from 'utils/customHooks';
import classnames from 'classnames';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Luckydraw = () => {
    const ticket = false;
    const { width } = useWindowSize();
    const [open, setOpen] = useState(false);

    const onOpen = () => {
        if (!ticket) return;
        setTimeout(() => {
            setOpen(true);
        }, 500);
    }

    return (
        <LayoutNaoToken isHeader={false}>
            <Background>
                <BackgroundImage width={width} className="text-center">
                    <div className="flex items-center justify-between relative top-0">
                        <img src="/images/nao/luckydraw/ic_onus.png" width="74" height="20" alt="" />
                        <img src="/images/nao/luckydraw/ic_nami.png" width="66" height="36" alt="" />
                    </div>
                    {!open ?
                        <LuckyPage ticket={ticket} width={width} onOpen={onOpen} />
                        :
                        <LuckyTicket open={open} width={width} onClose={() => setOpen(false)} />
                    }
                </BackgroundImage>
            </Background>
        </LayoutNaoToken>
    );
};


const Background = styled.div.attrs({
    className: 'min-w-full overflow-hidden'
})`
    background:radial-gradient(196.95% 136.02% at 50% -4.15%, #005BDF 0%, #010163 77.35%);
    height:calc(var(--vh, 1vh) * 100)
`

const BackgroundImage = styled.div.attrs(({ width }) => ({
    className: classnames(
        'min-w-full h-full flex flex-col justify-between overflow-hidden relative ',
        { 'px-4 pt-9 pb-6': width > 360 },
        { 'p-4': width <= 360 },
    )
}))`
    background-image:${() => `url(${(`/images/nao/luckydraw/bg_screen.png`)})`};
    background-repeat: no-repeat;     
    background-size: cover;
    background-position: center top;
`
export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            'common', 'nao'
        ])),
    },
})
export default Luckydraw;