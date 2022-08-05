import { createGlobalStyle } from 'styled-components'
import styled from 'styled-components'
import { Col, Row, Container } from 'react-grid-system'
import { isMobile } from 'react-device-detect'
import Div100vh from 'react-div-100vh'

export const GlobalStyles = createGlobalStyle`

    ::-webkit-scrollbar-thumb {
        background: ${props => props.theme.scrollbarBg} !important;
    }

    ::-webkit-scrollbar-thumb:active {
        background: ${props => props.theme.colors.mint} !important;
    }

    ::-webkit-scrollbar {
        width: ${isMobile ? '3px' : '5px'} !important;
        height: 7px;
    }

    ::-webkit-scrollbar-track {
        background: #f5f5f5 !important;
    }

    html {
        overflow-x: ${isMobile ? 'hidden' : 'unset'};
    }

    body.ReactModal__Body--open {
        color: ${props => props.theme.colors.white};
    }

    body {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: Source Sans Pro, sans-serif;
        background: ${props => props.theme.body} !important;
            //color: ${props => props.theme.textPrimary};
        overflow: hidden ${isMobile ? 'hidden' : 'auto'} !important;
        transition: all .3s linear;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;

        .select_market__modal {
            display: flex;
            width: 100%;
            height: 120px;
            justify-content: center;

            .market_option__item {
                border-radius: 12px;
                width: 100px;
                height: 100px;
                cursor: pointer;
                transition: all .18s ease;

                a {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                    color: ${({ theme }) => theme.colors.mint};
                    font-weight: 600;

                    .market_option__item_inner {
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        flex-direction: column;
                        align-items: center;

                        img {
                            display: block;
                            margin-bottom: 8px;
                            width: 48%;
                            height: auto;
                        }
                    }
                }

                :hover {
                    background: ${({ theme }) => theme.colors.mint_opacity};
                }

                :first-child {
                    margin-right: 45px;
                }
            }
        }

        .anticon svg {
            fill: ${({ theme }) => theme.textSecondary};
        }

        .ant-picker-header {
            border-color: ${({ theme }) => theme.dimLine};
        }

        .ant-picker-panel {
            border-color: transparent;
        }

        .ant-picker-panel-container {
            background: ${({ theme }) => theme.background};
        }

        .ant-picker-dropdown {
            font-family: Source Sans Pro, serif !important;
        }

        .ant-picker {
            border: none;
            padding: 0;
            background: transparent;
            color: ${({ theme }) => theme.textSecondary};
        }

        .ant-picker-input > input {
            color: ${({ theme }) => theme.textPrimary};
        }

        .ant-picker-clear {
            background: transparent;
        }

        .ant-picker-focused {
            box-shadow: none;
        }

        .ant-picker-range .ant-picker-active-bar {
            margin-left: 0;
            background: ${({ theme }) => theme.colors.mint};
        }

        .ant-picker-cell-in-view.ant-picker-cell-today .ant-picker-cell-inner::before {
            border: 1px solid ${({ theme }) => theme.colors.mint};
        }

        .ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner, .ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner, .ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner {
            background: ${({ theme }) => theme.colors.mint};
        }

        .ant-picker-cell-in-view.ant-picker-cell-in-range::before {
            background: ${({ theme }) => theme.colors.mint_opacity};
        }

        .ant-picker-cell-range-hover::after {
            border-color: #03bbcc !important;
        }

        .ant-picker-content th, .ant-picker-cell, .ant-picker-header {
            color: ${({ theme }) => theme.textPrimary};
        }

        .ant-picker-range-arrow::after {
            border: 5px solid ${({ theme }) => theme.background};
        }

        .ant-picker-panel-container {
            box-shadow: ${({ theme }) => theme.stuff.shadow};
            border-radius: 4px;
        }

        .the-next-container {
            max-width: 99%;
        }

        .value-font {
            font-family: Barlow, serif;
            font-weight: 400;
        }

        .text-dotx3 {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }

        .inc-padding {
            @media (min-width: 1200px) {
                padding-left: 80px !important;
                padding-right: 80px !important;
            }

            @media (min-width: 1220px) {
                padding-left: 100px !important;
                padding-right: 100px !important;
            }

            @media (min-width: 1300px) {
                padding-left: 140px !important;
                padding-right: 140px !important;
            }

            @media (min-width: 1400px) {
                padding-left: 180px !important;
                padding-right: 180px !important;
            }

            @media (min-width: 1500px) {
                padding-left: 220px !important;
                padding-right: 220px !important;
            }

            @media (min-width: 1600px) {
                padding-left: 240px !important;
                padding-right: 240px !important;
            }

            @media (min-width: 1700px) {
                padding-left: 280px !important;
                padding-right: 280px !important;
            }

            @media (min-width: 1800px) {
                padding-left: 320px !important;
                padding-right: 320px !important;
            }
        }

        i.fa, i.fas, i.far, i.fal {
            font-family: "Font Awesome 5 Pro", serif !important;
        }

        i.fab {
            font-family: 'Font Awesome 5 Brands', serif !important;
        }

        a {
            color: ${props => props.theme.textSecondary};
            transition: all .2s ease;

            :hover {
                color: ${props => props.theme.colors.mint};
            }
        }


        #fc_frame {
            display: ${props => props.history.location.pathname === '/happy-weekend' ? 'none' : 'unset'};
        }

        .Toastify__toast-container--bottom-right {
            bottom: ${isMobile ? '1rem' : '90px !important'};
        }

        .text-mint {
            color: ${({ theme }) => theme.colors.mint}
        }

        .ReactTable .-pagination {
            border-top: none !important;
            font-size: ${props => props.theme.fontSize.font12};
        }

        .ReactTable .-pagination .-pageJump {
            margin: 0 5px;
        }

        .ReactTable .rt-thead.-header {
            height: 40px; //marked
        }

        .ReactTable .rt-thead .rt-th.-sort-asc, .ReactTable .rt-thead .rt-td.-sort-asc {
            box-shadow: inset 0 3px 0 0 ${props => props.theme.textSecondary} !important;
        }

        .ReactTable.reactable_custom .-pagination .-btn {
            background-color: ${props => props.theme.titleHighlight} !important;
            color: ${props => props.theme.textPrimary} !important;
            border: none !important;
        }

        .ReactTable .-pagination .-btn {
            outline: none;
        }

        .ReactTable .-pagination .-btn[disabled] {
            cursor: not-allowed;
        }

        .ReactTable .-pagination .-btn:not([disabled]):hover {
            background: ${props => props.theme.colors.mint} !important;
            color: ${props => props.theme.textHover} !important;
            outline: none;
            border: none;
        }

        .ReactTable .rt-thead .rt-th, .ReactTable .rt-tbody .rt-td, .future__modify-price--value {
            text-align: left !important;
            color: ${props => props.theme.textAbsolute};
        }

        .ReactTable .rt-thead .rt-th, .ReactTable .rt-thead .rt-td {
            border-right: none;
            color: ${props => props.theme.textSecondary};
            font-size: ${props => props.theme.fontSize.font10 + 3}px;
        }

        .ReactTable .rt-thead.-header {
            padding: ${props => props.theme.stuff.spacing - 5}px 0;
        }

        .ReactTable .rt-thead.-header {
            box-shadow: none !important;
            border-bottom: 2px solid ${props => props.theme.stuff.border};
        }

        .ReactTable .-loading.-active {
            background: ${props => props.theme.background} !important;
        }

        .ReactTable .-loading .-loading-inner, .ReactTable .-loading > div {
            color: ${props => props.theme.textPrimary} !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
        }

        .ReactTable {
            background: ${props => props.theme.background} !important;
            border: none;
            padding: 0 ${props => props.theme.stuff.spacing + 5}px;

            span.close_order {
                background: transparent !important;
                color: ${props => props.theme.colors.sell};
                transition: all .2s ease;
                font-weight: 600;
                border-radius: 3px;

                :hover {
                    background: ${props => props.theme.colors.sell} !important;
                    color: ${props => props.theme.textHover};
                }
            }

            .rt-table {
                height: 100%;
                overflow-y: hidden;
            }

            .rt-tbody {
                height: calc(100% - 39px);
                overflow-x: hidden;
                max-height: 300px;
                //min-height: 280px;

                @media (min-width: ${props => props.theme.breakPoint.xxl}) {
                    max-height: unset;
                    min-height: unset;
                }
            }

            :not(.emoji-mart)::-webkit-scrollbar {
                width: 5px !important;
                height: 5px !important;
            }
        }

        .ReactTable .-pageJump input, .ReactTable .-pageSizeOptions select {
            color: ${props => props.theme.textSecondary} !important;
        }

        .ReactTable .-pagination .-pageSizeOptions {
            display: block;
        }

        @media (min-width: ${props => props.theme.breakPoint.xl}) and (max-width: 1366px) {
            .ReactTable .-pagination .-pageSizeOptions {
                display: none;
            }
        }

        @media (min-width: 1366px) {
            .ReactTable .-pagination .-pageSizeOptions {
                display: block;
            }
        }
    }
`

export const HR = styled.hr`
    border-color: ${({ darkMode, theme }) => darkMode ? theme.stuff.border : 'rgba(0, 0, 0, .08)'};
    margin-bottom: ${({ marginBott }) => marginBott ? marginBott : '1rem'};
`

export const BoldSpan = styled.span`
    font-weight: 600;
`

export const A = styled.a`
    color: ${({
                  darkMode,
                  theme,
                  useSecondColor
              }) => darkMode ? theme.textPrimary : (useSecondColor && theme.colors.dark3) || theme.colors.dark5};

    span {
        img {
            margin-top: -3px;
            width: ${({ lastedNews }) => lastedNews ? '14px' : 'unset'};
            margin-right: ${({ lastedNews }) => lastedNews ? '10px' : 'unset'};
        }
    }
`

export const GlobalButton = styled.button`
    font-family: Source Sans Pro, sans-serif;
    cursor: pointer;
    background: ${({
                       background,
                       theme,
                       isDisable
                   }) => isDisable ? theme.textDisabled : (background ? background : theme.colors.mint)};
    width: ${({ width }) => width ? `${width} !important` : '100%'};
    font-size: ${({ fontSize }) => fontSize ? fontSize : '12px'};
    color: ${({ color, theme }) => color ? color : '#ffffff'};
    border-width: ${({ borderWidth }) => borderWidth ? borderWidth : '2px'};
    border-style: ${({ borderStyle }) => borderStyle ? borderStyle : 'solid'};
    border-color: ${({ borderColor }) => borderColor ? borderColor : 'transparent'};
    outline: none;
    border-radius: ${({ moreRadius, radius }) => radius ? radius : (moreRadius ? '5px' : '3px')};
    padding: ${({ padding }) => padding ? padding : '.45rem .8rem'};
    font-weight: ${({ fontW }) => fontW ? fontW : 'normal'};
    position: relative;
    box-shadow: ${({ shadow, theme, withoutDark }) => shadow ? (withoutDark ? shadow : theme.stuff.shadow) : 'unset'};
    white-space: nowrap;
    min-width: ${({ minWidth }) => minWidth ? minWidth : 'unset'};
    max-height: ${({ maxHeight }) => maxHeight ? maxHeight : 'unset'};
    max-height: ${({ minHeight }) => minHeight ? minHeight : 'unset'};
    height: ${({ height }) => height ? height : 'auto'};

    a.type-1 {
        display: block !important;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        z-index: 3;
        transition: all .2s ease;
        color: ${({ darkMode, theme }) => darkMode ? theme.textPrimary : '#454545'};
    }

    a {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        color: ${({ darkMode, theme }) => darkMode ? theme.textPrimary : '#454545'};
        transition: all .2s ease;

        i {
            margin-left: .2rem
        }
    }

    :after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background: white;
        opacity: 0;
        visibility: hidden;
        transition: all .2s ease;
        border-radius: ${({ moreRadius, radius }) => radius ? radius : (moreRadius ? '5px' : '3px')};
        z-index: 2;
    }

    :hover {
        border-color: ${({ borderHover }) => borderHover ? borderHover : 'transparent'};
        color: ${({ colorHover, theme }) => colorHover ? colorHover : '#ffffff'};

        a {
            color: ${({ colorHover, theme }) => colorHover ? colorHover : '#ffffff'};
        }

        :after {
            opacity: ${({ hoverOpacity }) => hoverOpacity ? hoverOpacity : '.5'};
            visibility: visible;
        }
    }

    :focus, :active {
        outline: none;
    }

    @media (min-width: 992px) {
        font-size: 14px;
    }

    @media (min-width: 1200px) {
        padding: ${({ padding }) => padding ? padding : '.5rem .8rem'};
    }
`

export const SomethingComingUp = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    flex-direction: column;
    position: relative;
    cursor: pointer;
    margin-top: -10px;

    @keyframes RocketFly {
        0% {
            visibility: visible;
            opacity: 1
        }
        10% {
            visibility: hidden;
            opacity: 0
        }
        20% {
            visibility: visible;
            opacity: 1
        }
        30% {
            visibility: hidden;
            opacity: 0
        }
        40% {
            visibility: visible;
            opacity: 1
        }
        50% {
            visibility: hidden;
            opacity: 0
        }
        60% {
            visibility: visible;
            opacity: 1
        }
        70% {
            visibility: hidden;
            opacity: 0
        }
        80% {
            visibility: visible;
            opacity: 1
        }
        90% {
            visibility: hidden;
            opacity: 0
        }
        100% {
            visibility: visible;
            opacity: 1
        }
    }

    @keyframes blinker {
        50% {
            opacity: 0;
        }
    }

    :hover {
        //span.coming_text {
        //    display: none;
        //}

        //span.rocket_launchpad {
        //    visibility: visible;
        //    opacity: 1;
        //}

        #launchpad__graphics {
            visibility: visible;
            opacity: 1;
        }

        span.coming_text {
            animation: unset;
        }

        a > span > img.rocket_engine {
            animation: RocketFly 1.8s infinite;
        }
    }

    a {
        display: flex;
        align-items: center;
        transition: unset !important;
        color: ${({ theme }) => theme.colors.mint};
        margin-top: 10px;
    }

    span.rocket_launchpad {
        display: inline-block;
        width: 30px;
        height: 30px;
        position: relative;
        visibility: visible;
        opacity: 1;
        transition: all .2s ease-in-out;
        margin-left: 3px;
        //margin-top: 10px;

        img {
            display: block;
            width: 100%;
            height: 100%;
            position: relative;
            z-index: 2;
            transform: rotate(35deg);
        }

        img:last-child {
            position: absolute;
            z-index: 1;
            top: 0;
            transition: all .2s ease;
        }
    }

    span.coming_text {
        display: block;
        width: auto;
        position: absolute;
        top: 75%;
        left: 0;
        transform: translateY(-50%);
        font-size: 9px;
        white-space: nowrap;
        color: ${({ theme, onlyDark }) => onlyDark ? theme.colors.white : theme.textPrimary};
        animation: blinker 1.4s linear infinite;
    }
`

const slideDown = 'translateY(-100%)'
const slideDownActive = 'translateY(0)'
const slideLeft = 'translateX(-100%)'
const slideLeftActive = 'translateX(0)'
const slideUp = 'translateY(100%)'
const slideUpActive = 'translateY(0)'

export const MobileSideNav = styled.div`
    background: ${({ theme, withoutDark }) => withoutDark ? theme.colors.white : theme.background};
    min-height: 20px;
    padding: 16px 0 0 0;
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    overflow: auto hidden;

    ::-webkit-scrollbar {
        height: 3px !important;
    }

    .nav-item {
        margin-right: 25px;
        color: ${({ theme, withoutDark }) => withoutDark ? theme.colors.dark3 : theme.textSecondary};
        opacity: .6;
        font-weight: 600;
        font-size: 16px;
        white-space: nowrap;
        position: relative;
        padding-bottom: 12px;
        cursor: pointer;

        :after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            width: 100%;
            background: ${({ theme, tab }) => tab ? theme.colors.green : theme.colors.mint};
            border-radius: 3px;
            display: none;
        }
    }

    .active {
        opacity: 1;
        color: ${({ theme, withoutDark }) => withoutDark ? theme.colors.dark6 : theme.textPrimary};

        :after {
            display: block
        }
    }
`

export const SideNav = styled.div`
    width: 100%;
    min-height: 768px;
    height: 100%;
    //box-shadow: rgba(0, 0, 0, 0.08) 0 2px 4px, rgba(0, 0, 0, 0.08) 0 0 4px;
    background: ${({ theme, background }) => background ? background : theme.background};
    border-radius: ${({ borderRadius }) => borderRadius ? borderRadius + 'px' : 'unset'};
    overflow: hidden;
    border-right: 1px solid ${({ borderRight }) => borderRight ? borderRight : 'unset'};
    border-bottom: 1px solid ${({ borderBottom }) => borderBottom ? borderBottom : 'unset'};

    .active {
        color: ${({ theme, textActive }) => textActive ? textActive : theme.textAbsolute} !important;
        background: ${({ bgActive, theme }) => bgActive ? bgActive : theme.colors.mint_opacity} !important;
        //font-weight: bold !important;

        :after {
            display: block !important;
        }

        i {
            color: ${({ theme }) => theme.colors.mint} !important;
        }

        span:last-child {
            opacity: 1 !important;
        }
    }

    .nav-item {
        height: 52px;
        display: flex;
        align-items: center;
        transition: background .2s ease;
        color: ${({ theme, textDeactive }) => textDeactive ? textDeactive : theme.textSecondary};
        cursor: pointer;
        font-size: 15px;
        font-weight: 600;
        position: relative;

        span:first-child {
            width: 40px;
            height: 40px;
            margin-right: 10px;
            display: flex;
            justify-content: center;
            align-items: center;

            i {
                font-size: 20px;
            }
        }

        span:last-child {
            opacity: .88;
        }

        :after {
            position: absolute;
            content: '';
            width: 4px;
            height: 100%;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            background: ${({ theme }) => theme.colors.mint};
            display: none;
        }

        :hover {
            background: ${({ theme, bgHover }) => bgHover ? bgHover : theme.colors.mint_opacity};

            span:last-child {
                opacity: 1;
            }
        }
    }
`

export const SubNav = styled.div`
    display: flex;
    align-items: center;
    padding-top: 16px;

    div a {
        cursor: pointer;
    }

    div:first-child {
        a {
            color: ${({ theme }) => theme.textSecondary};

            :hover {
                text-decoration: underline;
            }
        }
    }

    span {
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 4px;

        svg {
            width: 14px;
            height: 14px;
        }
    }

    div:last-child {
        a {
            color: ${({ theme }) => theme.textPrimary};

            :hover {
                text-decoration: underline;
            }
        }
    }
`

export const DashboardHeader = styled.div`
    width: 100%;
    background: ${({ bg, theme }) => bg ? bg : theme.background};
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    @media (min-width: 576px) {
        padding: 18px 0;
        justify-content: space-between;
        flex-wrap: nowrap;
    }

    @media (min-width: 768px) {
        padding: 24px 0;
        align-items: flex-start;
    }

    @media (min-width: 992px) {
        align-items: center;
    }

    div.dashboard-title {
        font-size: 28px;
        font-weight: 600;
        color: ${({ color, theme }) => color ? color : theme.textPrimary};
        width: 100%;

        span {
            //display: block;
            color: ${({ theme, subTextColor }) => subTextColor ? subTextColor : theme.textPrimary};
            font-size: 14px;
            margin-top: 8px;
            padding-left: 0;
            line-height: 20px;
            display: inline-block;
            font-weight: 500;

            @media (min-width: 992px) {
                padding-left: 10px;
            }
        }

        @media (min-width: 992px) {
            width: auto;
        }

        @media (min-width: 1440px) {
            font-size: 34px;
        }
    }

    div.dashboard-function {
        display: flex;
        align-items: center;
        flex-wrap: ${({ isSpot }) => isSpot ? 'wrap' : 'nowrap'};
        width: 100%;

        @media (min-width: 768px) {
            flex-wrap: nowrap;
            width: auto;
        }

        span.ver-divider {
            display: inline-block;
            padding: 8px 0;
            width: 1px;
            background: ${({ theme }) => theme.dimLine};
            margin: 0 18px;
        }

        button.exchange-portfolio-btn {
            width: 100%;
            min-width: fit-content;
            margin: 10px 0;
            background: ${({ theme }) => theme.colors.mint};
            padding: .45rem .8rem;
            border: none;
            outline: none;
            border-radius: 4px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFF;
            white-space: nowrap;

            i {
                font-size: 16px;
                margin-left: 6px;
            }

            svg {
                width: 16px;
                height: auto;
                margin-left: 6px;
            }

            @media (min-width: 768px) {
                width: fit-content;
            }

            @media (min-width: 1200px) {
                padding: .5rem .8rem;
            }
        }

        .dashboard-function__exchange {
            display: flex;
            justify-content: space-between;
            width: 100%;
            margin-top: 12px;

            button {
                width: calc(94% / 3) !important;
                margin-right: 0;
            }

            @media (min-width: 768px) {
                margin-top: 0;
                button {
                    width: 100px !important;

                    :first-child {
                        margin-left: 0;
                    }
                }
            }
        }

        button {
            margin-right: 16px;
            color: ${({ theme }) => theme.textPrimary};

            @media (min-width: 768px) {
                margin-left: 16px;
                margin-right: 0;
            }
        }
    }
`


export const TinyModal = styled.div`
    position: absolute;
    z-index: 2000;
    max-width: 420px;
    width: auto;
    height: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: ${({ theme }) => theme.background};
    box-shadow: ${({ theme }) => theme.stuff.shadow};
    border-radius: 12px;
    padding: 16px;

    .tinymodal-title {
        font-weight: bold;
        font-size: ${({ titleSize }) => titleSize ? titleSize + 'px' : '16px'};
        text-align: ${({ align }) => align ? align : 'left'};
    }

    .tinymodal-content {
        margin: 1rem 0;
        text-align: ${({ align }) => align ? align : 'left'};
        width: 100%;
    }

    .tinymodal-button {
        cursor: pointer;
        border-radius: 8px;
        background: ${({ theme }) => theme.colors.mint};
        color: ${({ theme }) => theme.textHover};
        font-size: 14px;
        transition: background .2s ease;
        width: 220px;
        max-width: 80%;
        margin: auto;
        font-weight: 600;
        text-align: center;
        padding: 8px 0;

        :hover {
            background: ${({ theme }) => theme.colors.mint4};
        }
    }
`

export const GlobalMobileModalType1 = styled(Div100vh)`
    position: absolute;
    z-index: 2000;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    transition: all ${({ duration }) => duration ? duration + 's' : '.2s'} ease-in-out;
    opacity: ${({ active, effect }) => effect === 'fade' ? (active ? 1 : 0) : 1};
    visibility: ${({ active, effect }) => effect === 'fade' ? (active ? 'visible' : 'hidden') : 'visible'};
    transform: ${({ active, effect, wide }) =>
        effect === 'slideDown' ? (active ? slideDownActive : slideDown)
            : effect === 'slideLeft' ? (active ? slideLeftActive : slideLeft)
            : effect === 'slideUp' ? (active ? slideUpActive : slideUp) : wide ? 'translate(-50%, -50%)' : 'unset'};
    background: ${({ withoutDark, theme }) => withoutDark ? theme.colors.white : theme.background};
    padding: 12px;
    color: ${({ theme, withoutDark }) => withoutDark ? theme.colors.dark5 : theme.textPrimary};
`

export const LoadingWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 280px;
`

export const GlobalModalWide = styled(Div100vh)`
    //overlay
    position: absolute;
    z-index: 1999;
    background: ${({ theme, withoutDark }) => withoutDark ? theme.colors.white_opacity : theme.background_opacity};
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    visibility: ${({ active }) => active ? 'visible' : 'hidden'};
    opacity: ${({ active }) => active ? 1 : 0};
    transition: all ${({ duration }) => duration ? duration + 'ms' : '200ms'} ease;
    user-select: none;
    color: ${({ theme, withoutDark }) => withoutDark ? theme.colors.dark5 : theme.textPrimary};
`

export const ChevronDownClip = styled.div`
    width: ${({ s }) => s ? s.w + 'px' : '10px'};
    height: ${({ s }) => s ? s.h + 'px' : '6px'};
    clip-path: polygon(50% 100%, 0 0, 100% 0);
    background: ${({ theme }) => theme.textSecondary};
`

export const PageMain = styled(Div100vh)`
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
`

export const GlobalRoot = styled.div.attrs({ id: 'global-root' })`
    color: ${({ theme }) => theme.textPrimary};
    height: 100%;
    background: ${({ theme, withoutDark }) => withoutDark ? theme.colors.grey0 : theme.body};
    overflow: ${isMobile ? 'unset' : 'hidden auto'};
    font-family: Source Sans Pro, serif !important;
`

export const GlobalTitle = styled.div`
    text-align: ${({ tA }) => tA ? tA : 'left'};
    font-weight: ${({ fontWeight }) => fontWeight ? fontWeight : '600'};
    font-size: ${({ fontSize }) => fontSize ? fontSize : '18px'};
    margin: ${({ margin }) => margin ? margin : 'unset'};
    margin-top: ${({ marginTop }) => marginTop ? marginTop + ' !important' : 'unset'};
    margin-left: ${({ marginLeft }) => marginLeft ? marginLeft + ' !important' : 'unset'};
    margin-right: ${({ marginRight }) => marginRight ? marginRight + ' !important' : 'unset'};
    margin-bottom: ${({ marginBottom }) => marginBottom ? marginBottom + ' !important' : 'unset'};
    color: ${({ colorType, theme }) => colorType === 1 ? theme.textPrimary : theme.textSecondary};
`

export const MediumBold = styled.span`
    font-weight: 600;
`

export const TextWeight = styled.span`
    font-weight: ${({ weight }) => weight ? weight : 600};
    color: ${({ c }) => c ? c : 'initial'};
`

export const navHeight = '65px'

export const pocketNavHeight = '58px'

export const pocketNavBottom = '55px'

export const mobileNavHeight = '55px'

export const FullScreenWrapper = styled(Container)`
    background: ${({ theme }) => theme.background};
        //height: calc(100% - ${navHeight});
    padding-top: 1rem;
    margin-top: 1.2px;
    min-height: ${({ minHeight }) => minHeight ? minHeight + 'px' : '768px'};
`

export const MobileContentWrapper = styled.div`
    height: ${({ isApp, isMixTableMode }) => isMixTableMode ? `calc(100% - ${navHeight})`
        : isApp ? '100%' : `calc(100% - ${pocketNavHeight} - ${mobileNavHeight})`};
    background: ${({ background, theme }) => background ? background : theme.background};
    overflow: hidden auto;

    ::-webkit-scrollbar {
        width: 3px !important;
        height: 3px !important;
    }
`

export const TopNewsHeight = '35px'

export const FutureCoinHeight = '56px'

export const ExchangeCoinHeight = '66px'

export const ModeSwitcher = styled.div`
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    color: ${props => props.theme.textPrimary};
    cursor: pointer;
`

export const SymbolTab = styled.div`
    flex-flow: row nowrap;

    button {
        background: ${props => props.theme.background};
        border: 1.8px solid ${props => props.theme.stuff.border};
        border-radius: ${props => props.theme.stuff.radius} !important;
        font-size: ${props => props.theme.fontSize.font12};
        outline: none;
        margin: 0 ${props => props.theme.stuff.spacing - 7}px;
        color: ${props => props.theme.textPrimary};
    }

    button.selected {
        border: 1px solid ${props => props.theme.colors.mint};
        color: ${props => props.theme.colors.mint};

        // i.fa-star {
            //   color: ${props => props.theme.colors.mint};
        // }
    }

    input {
        z-index: 1;
        border-radius: ${props => props.theme.stuff.radius} !important;
        border: 1.8px solid ${props => props.theme.stuff.border};
        padding-left: ${props => props.theme.stuff.spacing - 5}px;
        padding-right: ${props => props.theme.stuff.spacing + 8}px;
        background: transparent;
        color: ${props => props.theme.textPrimary};
        font-size: ${props => props.theme.fontSize.font12};
        user-select: all;
    }

    input:focus {
        border-color: ${props => props.theme.colors.mint} !important;
        box-shadow: none;
        z-index: 2;
        background: transparent;
        color: ${props => props.theme.textPrimary};
    }

    .input-group-prepend {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 3;
    }

    i {
        font-size: ${props => props.theme.fontSize.font10 + 1}px;
    }

    i.fa-search {
        color: ${props => props.theme.textSecondary};
    }

`

export const SymbolListDropdown = styled.div`
    position: absolute;
    width: 300px;
    z-index: 2;
    top: ${props => props.isExchange ? '95%' : '52%'};
    left: 0;
    visibility: hidden;
    opacity: 0;
`

export const I = styled.i`
    font-size: 26px;
    margin-top: 1.5px;
    color: ${props => props.theme.textSecondary};
`

export const CoinDetail = styled(Row)`
    padding: ${props => props.theme.stuff.spacing}px ${props => props.theme.stuff.spacing + 10}px;
    margin: 0 0 ${p => p.theme.stuff.spacing - 2.5}px 0;
    background: ${p => p.theme.mode === 'light' ? p.theme.background : '#101621'};
    border-radius: ${({ theme, exchangeV1 }) => exchangeV1 === 'true' ? 'none' : theme.stuff.radius};
    border: 1px solid ${({ theme, exchangeV1 }) => exchangeV1 === 'true' ? (theme.mode === 'light' ? '#e6e6e6' : 'transparent') : 'none'} !important;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: ${props => props.mode === 'exchange' ? ExchangeCoinHeight : FutureCoinHeight};
    position: relative;

    #vertical-center-symbol {
        position: relative;
        z-index: 1;
        top: 50%;
        transform: translateY(-50%);
        user-select: none;
        cursor: pointer;

        :hover > #symbol-list-dropdown {
            visibility: visible;
            opacity: 1;
        }
    }

    .couple-symbol-future {
        margin-right: 0 !important;
    }

    @media (min-width: ${props => props.theme.breakPoint.xl}) {
        padding: ${props => props.theme.stuff.spacing}px ${props => props.theme.stuff.spacing + 18}px;
    }
`

export const CoinItem = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: ${props => props.theme.textPrimary};
    margin-right: ${props => props.theme.stuff.spacing}px;
    font-size: ${props => props.theme.fontSize.font16};

    div.last-price {
        min-width: 90px;
        font-size: ${props => props.theme.fontSize.font18};
        font-weight: 600;
        text-align: left;

        div {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    div.exchange-symbol {

        div.exchange-symbol-text {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;

            i {
                font-size: ${props => props.theme.fontSize.font10 + 16}px;
            }
        }

        div.exchange-symbol-icon {
            margin-top: 2px;
            display: flex;
            align-items: center;

            span.coin-alias {
                margin-left: ${props => props.theme.stuff.spacing}px;
                font-size: ${props => props.theme.fontSize.font10 + 3}px;
                height: 20px;
                padding-top: 2px;
            }

            span.coin-ico {
                width: 20px;
                height: 20px;

                img {
                    vertical-align: top;
                    height: 100%;
                    width: 100%;
                }
            }
        }
    }

    div.couple-symbol {
        color: ${props => props.theme.textAbsolute};
        display: flex;
        align-items: center;
        justify-content: space-around;
        font-size: ${props => props.theme.fontSize.font20};
        font-weight: 600;
        cursor: pointer;
        user-select: none !important;

        i {
            font-size: ${props => props.theme.fontSize.font10 + 16}px;
            margin: 0 ${props => props.theme.stuff.spacing}px;
        }
    }

    span.symbol_leverage {
        font-size: ${props => props.theme.fontSize.font12} !important;
        transition: all .25s ease;

        :hover {
            color: ${props => props.theme.textHover};
            background: ${props => props.theme.colors.mint};
        }
    }

    //div.h24-change {
    //  min-width: 150px;
    //}

    div.two-rows {
        display: flex;
        align-items: center;
        text-align: left;
        flex-direction: column;
        width: 100%;
        min-width: 100px;
        font-size: ${props => props.theme.fontSize.font10 + 3}px;

        .rows-title {
            width: 100%;
            color: ${props => props.theme.textSecondary};
            font-size: ${props => props.theme.fontSize.font12};
        }

        .rows-paragraph {
            font-size: 13px;
            color: ${props => props.theme.textAbsolute};
            width: 100%;
            font-weight: 500;
            font-family: Barlow, sans-serif;
        }
    }

    @media (min-width: ${props => props.theme.breakPoint.lg}) {
        margin-right: ${props => props.theme.stuff.spacing + 8}px;
    }

`

export const NeedLogin = styled(Container)`
    height: calc(100vh - ${navHeight});
    text-align: center;
    justify-content: center;
    align-items: center;
    position: relative;
    color: ${props => props.theme.textPrimary};

    section {
        position: absolute;
        min-width: 300px;
        width: auto;
        height: 300px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    a.button:hover, button.button:hover {
        background: ${props => props.theme.background};
    }
`

export const TransactionHistory = styled(Col)`
    //padding: 0;
    background: ${props => props.theme.background};
    border-radius: ${props => props.theme.stuff.radius};
    margin-top: ${props => props.theme.stuff.spacing - 2.5}px;
    color: ${props => props.theme.textPrimary} !important;
    padding-right: 0 !important;
    padding-left: 0 !important;
    overflow: hidden;
    height: calc(40% - 7.5px);

    .btn_ok {
        line-height: 34px !important;
        border-width: 2px !important;
        background-clip: unset !important;

        :hover {
            background: ${props => props.theme.background};
        }
    }

    .block_body {
            //padding: ${props => props.theme.stuff.spacing}px;
        padding: 0;
    }

    .block_header {
        box-shadow: none;
        border-bottom: none;
        padding: ${props => props.theme.stuff.spacing + 5}px 0 0 ${props => props.theme.stuff.spacing + 15}px;
    }

    .block_header h3.block_title {
        color: ${props => props.theme.textPrimary};
        margin: ${props => props.theme.stuff.spacing - 4}px 0 ${props => props.theme.stuff.spacing}px 0;
    }

    .tab_lst {
        //text-align: center;
        background-color: ${props => props.theme.body} !important;
        padding-left: ${props => props.theme.stuff.spacing}px;
        padding-right: 0 !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        height: 39px;
        user-select: none;
        border-bottom: none !important;
    }

    .tab_lst_item {
        padding: ${props => props.theme.stuff.spacing}px ${props => props.theme.stuff.spacing + 5}px;
        color: ${props => props.theme.textPrimary};
        background-color: ${props => props.theme.body} !important;
        cursor: pointer;
    }

    .tab_panel {
        background-color: transparent !important;
        height: calc(100% - 39px);
    }

    .tab_lst_item {
        outline: none;
    }

    .tab_main {
        height: 100%;
    }

    .tab_lst_item.react-tabs__tab--selected {
        background-color: ${props => props.theme.background} !important;
        color: ${props => props.theme.colors.mint};
        font-weight: 600;
        border-top-left-radius: 5px !important;
        border-top-right-radius: 5px !important;
        border: none !important;
        margin: 0 !important
    }

    // @media(min-height: 768px) and (min-width: 1600px){
        //   //height: calc(40% - ${7.5 + 'px'});
    // }

    @media (min-height: ${props => props.theme.breakPoint.lg}) and (min-width: ${props => props.theme.breakPoint.xl}) {
            //height: calc(30% - ${7.5 + 'px'});
        height: calc(30% - 7.5px);
    }
`

export const MaintainMessage = styled.div`

    svg {
        color: ${({ theme }) => theme.colors.reminder};
        width: 38px;
        height: auto;

        @media (min-width: 992px) {
            width: 48px;
        }
    }

    .maintain_message {
        margin-top: 14px;
        font-size: 15px;
        text-align: center;

        span {

            span {
                font-weight: 600;
            }
        }
    }

    .additional_content {
        margin-top: 15px;

        .additional_content__title {
            font-weight: 600;
        }

        .additional_content__timeline {
            font-family: Barlow, serif;
            font-weight: 500;

            span {
                display: inline-block;
                margin-top: 5px;

                span {
                    color: ${({ theme }) => theme.colors.mint};
                    font-weight: 600;
                }
            }
        }

    }
`
