import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getLoginUrl } from 'actions/utils';
import NextHead from 'next/head';
import { isMobile } from 'react-device-detect';

const Register = ({ query }) => {
    const router = useRouter();
    useEffect(() => {
        let referral = null;
        if (query?.ref) {
            referral = query?.ref;
            sessionStorage.setItem('REF_CODE', referral);
        }
        const registerUrl = getLoginUrl('sso', 'register', {
            ...query,
            referral,
            utm_medium: 'referral',
            redirect: process.env.APP_URL,
            mobile_web: isMobile,
        });
        router.push(registerUrl, undefined, { shallow: true });
    }, []);

    return (
        <>
            <NextHead>
                <meta property="og:image" content="https://nami.exchange/images/featured/referral-campaign-v2.png" key="fb-image" />
                <meta name="twitter:image" content="https://nami.exchange/images/featured/referral-campaign-v2.png" key="twitter-image" />
                <meta property="og:url" content={`https://nami.exchange/register?ref=${query?.ref}`} key="og-url" />
            </NextHead>
        </>
    );
};

export async function getServerSideProps(context) {
    return { props: { query: context?.query } };
}

export default Register;
