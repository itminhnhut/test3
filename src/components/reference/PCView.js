import React, { useState } from 'react'
import {
    AnalyticCommission,
    AnalyticTitle,
    AnalyticTopLine,
    AnalyticWrapper,
    BannerButtonGroup,
    BannerContainer,
    BannerLeft,
    BannerRight, ContainerFluid, Containerz, ContentWrapper,
    CopyIcon, DesktopWrapper,
    ReferralCatergories,
    ReferralCatergoriesItem,
    ReferralCatergoriesWrapper,
    ReferralID,
    ReferralLink,
    SubParagrapgh,
    TextTransparent
} from './styledReference'
import ReferralDashboard from "./Dashboard";
import useWindowSize from "../../hooks/useWindowSize"
import { useSelector } from 'react-redux';
import Footer from "../common/Footer"

const Type = {
    SPOT: 'SPOT',
    FUTURES: 'FUTURES',
}

const PCView = () => {
    const [dashboardData, setDashboardData] = useState(null)
    const [typeSort, setTypeSort] = useState({dashboard: 2, friendsList: 2, commissionHistory: 2})
    const [timeSort, setTimeSort] = useState(1); // 1-all, 2-yesterday, 3-this week, 4-this month
    const [pageFriendList, setPageFriendList] = useState(0)
    const [pageCommission, setPageCommission] = useState(0)
    const [state, setState] = useState({ pageSize: 6, type: Type.SPOT})
    const [friendsListData, setFriendsListData] = useState(null)
    const [commissionData, setCommissionData] = useState(null)

    const user = useSelector(state => state.auth.user) || null;

    const {width} = useWindowSize();

    return (
        <>
            <DesktopWrapper>
                <Containerz>
                    <ContentWrapper id='dashboard'>
                        <ReferralDashboard data={dashboardData} width={width} typeSort={typeSort} setTypeSort={setTypeSort}
                            timeSort={timeSort} setTimeSort={setTimeSort} user={user} />
                    </ContentWrapper>
                    {/* <ContentWrapper id='friendslist'>
                        <ReferralFriendsList data={friendsListData} width={width} ExportSvg={EXPORT_SVG}
                            state={state} setState={setState} page={pageFriendList} setPage={setPageFriendList}
                            typeSort={typeSort} setTypeSort={setTypeSort} user={user} />
                    </ContentWrapper>
                    <ContentWrapper id='commission-history'>
                        <ReferralCommission data={commissionData} width={width} ExportSvg={EXPORT_SVG}
                            state={state} setState={setState} page={pageCommission} setPage={setPageCommission}
                            typeSort={typeSort} setTypeSort={setTypeSort} user={user} />
                    </ContentWrapper> */}
                </Containerz>
            </DesktopWrapper>
            <Footer />
        </>
    )
}

export default PCView