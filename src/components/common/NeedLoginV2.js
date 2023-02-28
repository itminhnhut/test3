import { useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { getLoginUrl } from 'redux/actions/utils';
import { UserDeleteOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import HrefButton from 'components/common/V2/ButtonV2/HrefButton';

const NeedLoginV2 = ({ message, addClass, isNamiapp = false }) => {
    const {
        i18n: { language }
    } = useTranslation();

    const _message = useMemo(() => {
        if (!message) {
            if (language === LANGUAGE_TAG.EN) {
                return 'Sign In Now';
            } else {
                return 'Đăng nhập ngay';
            }
        }
        return message;
    }, [message, language]);

    return (
        <div className={addClass ? 'relative w-full h-full ' + addClass : 'relative w-full h-full '}>
            <div>
                <img src={'/images/screen/swap/login-success.png'} alt="" className="mx-auto h-[124px] w-[124px]" />
                <HrefButton className="mt-4" href={getLoginUrl('sso', 'login')}>
                    {_message}
                </HrefButton>
            </div>
        </div>
    );
};

export default NeedLoginV2;
