import React, { useState, memo, useEffect } from 'react';
import styled from 'styled-components';
import colors from 'styles/colors';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import classNames from 'classnames';
import { setBottomTab } from 'redux/actions/utils'
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router'
import url from 'socket.io-client/lib/url';
import SvgWallet from 'components/svg/SvgWallet';
import SvgSwap from 'components/svg/SvgSwap';
import SvgFutures from 'components/svg/SvgFutures';
import SvgMarket from 'components/svg/SvgMarket';

const listNav = [
    { title: 'Markets', prefix: '/mobile/', nav: 'market', icon: <SvgMarket /> },
    { title: 'Futures', prefix: '/mobile/', nav: 'futures', icon: <SvgFutures /> },
    { title: 'Wallets', prefix: '/mobile/', nav: 'wallet', icon: <SvgWallet /> },
]

const BottomNavBar = memo(() => {
    const router = useRouter();
    const [currentTheme] = useDarkMode()
    const dispatch = useDispatch();
    const isDark = currentTheme === THEME_MODE.DARK;
    const bottomNav = useSelector(state => state.utils.bottomNav)
    const [tab, setTab] = useState(bottomNav ?? listNav[0].nav);

    const onChangeTab = (e) => {
        router.push(`/${e.prefix}/${e.nav}`)
        dispatch(setBottomTab(e.nav))
        setTab(e.nav)
    }

    useEffect(() => {
        if (!bottomNav) {
            dispatch(setBottomTab(listNav[0].nav))
        }
    }, [])

    return (
        <Tabs isDark={isDark}>
            {listNav.map((item) => {
                return (
                    <Tab key={item.nav} active={tab === item.nav} onClick={() => onChangeTab(item)}>
                        {item.icon}
                        {item.title}
                    </Tab>
                )
            })}
        </Tabs>
    );
}, () => { return true });


const Tabs = styled.div.attrs({
    className: "bg-white dark:bg-darkBlue-3"
})`
    height:80px;
    width:100%;
    position:fixed;
    bottom:0;
    z-index:10;
    border-radius:12px 12px 0 0;
    padding:10px;
    display:flex;
    align-items:center;
    justify-content:space-around;
    box-shadow: 3px -5px 30px -16px rgba(0, 0, 0, 0.16);
    svg,path{
            fill:${colors.grey3}
        }
    .active{
        color: ${({ isDark }) => isDark ? colors.white : colors.darkBlue1};
        svg,path{
            fill:${colors.teal}
        }
    }

`
const Tab = styled.div.attrs(({ active }) => ({
    className: classNames(
        'text-sm text-gray h-full flex items-center flex-col px-[10px]',
        {
            'active': active
        }
    )
}))`
`
export default BottomNavBar;
