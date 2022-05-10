import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import 'react-input-range/lib/css/index.css'
import OtpModal from 'components/common/OtpModal';
import { useState } from 'react';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import axios from 'axios';
import { API_AUTH_USER_OTP } from 'redux/actions/apis';
import { TfaResult } from 'redux/actions/const';
import _ from 'lodash'
import { PORTAL_MODAL_ID } from 'constants/constants';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
const  INITIAL_STATE ={
    redirectTo: null,
    value: null
}
const ExternalWithdrawal = (props) => {
    const router = useRouter();
    const {
        service,
    } = router.query;
    console.log('__ check service', service);
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({...prevState, ...state}))
    const doLoginWithOtp =  async (otp)=> {
        const SERVICE = service
        const {data} = await axios.get(API_AUTH_USER_OTP(SERVICE) + window.location.search, {
            params: {
                otp,
                shouldRedirect: false
            }
        })
        console.log('__ check data', data);
        if (data) {
            if (data.status === 'ok') {
                return {
                    verified: true,
                    redirectTo: _.get(data, 'data.redirectTo')
                }
            } else if (data.status === TfaResult.INVALID_OTP) {
                return {
                    verified: false,
                }
            } else {
                return {
                    verified: false,
                    message: 'flasher.login.failed',
                    redirectTo: _.get(data, 'data.redirectTo')
                }
            }
        } else {
            return false
        }
    }

    const onVerified = ({redirectTo})=> {
        if (redirectTo) {
            window.location.href = redirectTo
        } else {
            window.location.href = '/'
        }
    }

    const onDeclined = ({verified, redirectTo})=> {
        if (redirectTo) {
            let pathnameAndSearch
            if (redirectTo.startsWith('http')) {
                pathnameAndSearch = new URL(redirectTo)
                pathnameAndSearch = pathnameAndSearch.pathname + pathnameAndSearch.search
            } else {
                pathnameAndSearch = redirectTo
            }
            setState({ redirectTo: pathnameAndSearch })
        }
    }

    const onChange = (value)=> {
        setState({value})
        if(value && value.length === 6){
            doLoginWithOtp(value)
        }

    }


    return (
        <>
            <div
                className={`mal-layouts mal-layouts___light`}
            >
                <div className="flex flex-1 justify-center items-center h-full">
                    <div id={`${PORTAL_MODAL_ID}`} />
                    <OtpModal label={'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.'} isVisible={true} placeholder={'-'} value={state.value} onChange={onChange}
                              renderUpper={()=> <div className="font-bold text-lg">Authentication</div>}
                    />
                </div>
            </div>


        </>
    )
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            'common',
            'navbar',
            'modal',
        ])),
    },
})

export async function getStaticPaths() {
    return {
        paths: [
            { params: { service: 'nami' } },
        ],
        fallback: true,
    };
}

export default ExternalWithdrawal
