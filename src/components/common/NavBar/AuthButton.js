import React from 'react';
import TextButton from '../V2/ButtonV2/TextButton';
import HrefButton from '../V2/ButtonV2/HrefButton';
import { getLoginUrl } from 'redux/actions/utils';
import { useWindowSize } from 'react-use';

const AuthButton = ({ t, showSignInBreakPoint = 0, showSignUpBreakPoint = 0 }) => {
    const { width } = useWindowSize();

    return (
        <>
            {width >= showSignInBreakPoint && (
                <TextButton
                    className="px-0 w-auto hover:opacity-80"
                    onClick={() => {
                        window.open(getLoginUrl('sso', 'login'), '_self');
                    }}
                >
                    {t('common:sign_in')}
                </TextButton>
            )}
            {width >= showSignUpBreakPoint && (
                <HrefButton href={getLoginUrl('sso', 'register')} className="ml-4 py-2 w-[105px] !h-[36px] rounded-md !text-sm">
                    {t('common:sign_up')}
                </HrefButton>
            )}
        </>
    );
};

export default AuthButton;
