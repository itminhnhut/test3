import React from 'react';

import ButtonV2 from '../V2/ButtonV2/Button';
import { getLoginUrl } from 'redux/actions/utils';
import { useWindowSize } from 'react-use';
import { useRouter } from 'next/router';

const AuthButton = ({ t, showSignInBreakPoint = 0, showSignUpBreakPoint = 0 }) => {
    const { width } = useWindowSize();
    const router = useRouter();

    return (
        <>
            {width >= showSignInBreakPoint && (
                <ButtonV2
                    className="px-0 w-auto hover:opacity-80 !text-sm"
                    variants="text"
                    onClick={() => {
                        router.push(getLoginUrl('sso', 'login'));
                    }}
                >
                    {t('common:sign_in')}
                </ButtonV2>
            )}
            {width >= showSignUpBreakPoint && (
                <ButtonV2 onClick={() => router.push(getLoginUrl('sso', 'register'))} className="ml-4 py-2 w-[105px] !h-[36px] rounded-md !text-sm">
                    {t('common:sign_up')}
                </ButtonV2>
            )}
        </>
    );
};

export default AuthButton;
