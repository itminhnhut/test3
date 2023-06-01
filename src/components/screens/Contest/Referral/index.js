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
        // title_detail: { vi: 'Đua TOP giới thiệu tháng 06/2023', en: 'Top Referral 06/2023' },
        // title: { vi: 'NAO Futures', en: 'NAO Futures' },
        title_champion: { vi: 'Đua TOP giới thiệu tháng 06/2023', en: 'Top Referral 06/2023' },
        minVolumeInd: {
            vi: 'Người dùng cần đạt đủ Điều kiện cơ bản về số lượng bạn bè để được xếp hạng, đọc thêm tại "Thể lệ chi tiết".',
            en: 'User need to meet basic requirements of number of friends to be ranked, read more at "Detail Rules"',
            isHtml: false
        },
        rules: {
            vi: 'https://nami.exchange/vi/support/announcement/su-kien/cong-bo-chuong-trinh-dua-top-gioi-thieu-thang-6-2023',
            en: 'https://nami.exchange/support/announcement/events/launching-the-top-referral-tournament-of-june-2023'
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
