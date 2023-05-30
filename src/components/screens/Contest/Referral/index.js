import MadivesLayout from 'components/common/layouts/MaldivesLayout';
import React, { useState } from 'react';
import ContesRules from './ContesRules';
import ContestPerRanks from './ContestPerRanks';
import styled from 'styled-components';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useWindowSize } from 'utils/customHooks';
import { getS3Url } from 'redux/actions/utils';

export const seasons = [
    {
        season: 1,
        start: '2023-06-04T17:00:00.000Z',
        end: '2023-06-30T17:00:00.000Z',
        contestId: 'contest0623',
        title_detail: { vi: 'NAO Futures - Đua Top Giới thiệu người dùng mùa 1', en: 'NAO Futures - Nami Referral Championship Season 1' },
        title: { vi: 'NAO Futures', en: 'NAO Futures' },
        title_champion: { vi: 'Đua Top Giới thiệu người dùng mùa 1', en: 'Nami Referral Championship Season 1' },
        minVolumeInd: {
            vi: 'Người dùng cần đạt đủ Điều kiện cơ bản để xếp hạng, xem chi tiết tại "Thể lệ chi tiết"',
            en: 'Traders need to meet the Basic Conditions to be ranked, see detail at "Detail Rules"',
            isHtml: false
        },
        rules: {
            vi: 'https://nami.exchange/vi/support/announcement/su-kien/khoi-tranh-giai-dau-nao-futures-vndc-nami-championship-mua-7',
            en: 'https://nami.exchange/support/announcement/events/launching-nao-futures-vndc-nami-championship-season-7'
        },
        total_rewards: '50,000,000 VNDC',
        quoteAsset: 'VNDC',
        active: true,
        top_ranks_per: 20,
        lastUpdated: true
    }
];

const index = (props) => {
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;
    const { width } = useWindowSize();
    const isMobile = width < 768;

    return (
        <MadivesLayout>
            {!isMobile && <Background isDark={isDark} className="h-screen absolute top-0 w-full z-0 max-h-[746px] 2xl:max-h-[1080px]" />}
            <ContesRules seasons={seasons} {...props} />
            <div className="container pb-[7.5rem] relative mt-[57px] lg:mt-0">
                <ContestPerRanks {...props} userID={'code'} />
            </div>
        </MadivesLayout>
    );
};

const Background = styled.div.attrs({
    className: ''
})`
    background-image: ${({ isDark }) => isDark && `url(${getS3Url('/images/contest/referral/bg_banner.png')})`};
    background-position: bottom;
    background-repeat: no-repeat;
    background-size: cover;
`;

export default index;
