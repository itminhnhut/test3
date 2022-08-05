import styled from "styled-components";
import colors from "../../../styles/colors"

export const DashboardWrapper = styled.div`
    margin-top: 40px;
    padding: 16px;
    border-radius: 3px;
    background: rgba(0, 182, 199, 0.05);
    display: flex;
    position: relative;
    flex-wrap: wrap;
    min-height: 256px;

    #rank-item {
        width: 100%;
    }

    @media (min-width: 1200px) {
        padding: 30px 29px 36px;
    }
`

export const DashboardGraphics = styled.div`
    position: absolute;
    right: 0;
    bottom: -5%;
    width: 180px;

    @media (min-width: 414px) {
        width: 250px;
    }

    @media (min-width: 576px) {
        width: 300px;
    }

    @media (min-width: 768px) {
        width: 230px;
    }

    @media (min-width: 992px) {
        width: 260px;
        bottom: -7px;
    }

    @media (min-width: 1200px) {
        width: 298px;
    }
`

export const DashboardItem = styled.div`
    width: 100%;
    margin-bottom: 32px;
    color: #000000;

    div:first-child {
        font-size: 12px;
        font-weight: 400;
        position: relative;
        width: fit-content;
        display: flex;
        align-items: center;

        img {
            margin-left: 6px;
        }

        :after {
            content: '';
            height: 1px;
            width: 100%;
            background: ${colors.mint};
            top: 100%;
            left: 0;
            position: absolute;
            margin-top: 1px;
        }

        @media (min-width: 992px) {
            font-size: 14px;
        }
    }

    div:last-child {
        margin-top: 10px;
        font-size: 20px;
        font-weight: 600;
        font-family: Barlow, serif;

        @media (min-width: 1200px) {
            font-size: 30px;
        }
    }

    @media (min-width: 768px) {
        width: calc(100% / 3);
    }
`
