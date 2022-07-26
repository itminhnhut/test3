import React, { useState, useCallback, useEffect } from "react";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PCView from "../../components/reference/PCView";
import useWindowSize from "hooks/useWindowSize";
import { useSelector } from "react-redux";
import NavBar from "../../components/common/NavBar"
import { NAVBAR_USE_TYPE } from 'src/components/common/NavBar/NavBar';
import MaldivesLayout from 'src/components/common/layouts/MaldivesLayout';

const EXPORT_SVG = <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0)">
        <path
            d="M12.6563 4.6875H11.25V5.62501H12.1875V14.0625H2.81251V5.62501H3.75002V4.6875H2.34376C2.08465 4.6875 1.875 4.89715 1.875 5.15626V14.5312C1.875 14.7904 2.08465 15 2.34376 15H12.6563C12.9154 15 13.125 14.7904 13.125 14.5312V5.15626C13.125 4.89715 12.9154 4.6875 12.6563 4.6875Z"
            fill="#00B6C7" />
        <path
            d="M7.03113 1.79443V8.43751H7.96863V1.79443L9.98096 3.80676L10.6438 3.14392L7.49988 0L4.35596 3.14392L5.0188 3.80676L7.03113 1.79443Z"
            fill="#00B6C7" />
    </g>
    <defs>
        <clipPath id="clip0">
            <rect width="15" height="15" fill="white" />
        </clipPath>
    </defs>
</svg>

const REFERRAL_INFO = { referral_id: 69910150, referral_link: 'https://nami.exchange/referral?ref=WWZMGQ', referral_code: 'WWZMGQ' }

const Type = {
    SPOT: 'SPOT',
    FUTURES: 'FUTURES',
}

const Reference = () => {
    const [clipboard, setClipboard] = useState({ referralId: false, referralLink: false, referralCode: false })
    const { width } = useWindowSize();

    const user = useSelector(state => state.auth.user) || null;




    return (
        <MaldivesLayout navOverComponent navMode={NAVBAR_USE_TYPE.DARK}>
            <div >
                <PCView />
            </div>
        </MaldivesLayout>
    )
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar', 'wallet', 'modal', 'reference'])
    }
})

export default Reference;
