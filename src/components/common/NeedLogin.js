import { useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { getLoginUrl } from 'redux/actions/utils';
import { UserDeleteOutlined } from '@ant-design/icons';
import classNames from 'classnames';

const NeedLogin = ({ message, addClass, isnamiv2 = false }) => {
    const { i18n: { language } } = useTranslation()

    const _message = useMemo(() => {
        if (!message) {
            if (language === LANGUAGE_TAG.EN) {
                return 'Login Now'
            } else {
                return 'Đăng nhập ngay'
            }
        }
        return message
    }, [message, language]);


    return (
        <div className={addClass ? 'relative w-full h-full ' + addClass : 'relative w-full h-full '}>
            <div className={classNames("flex flex-col items-center justify-center text-txtSecondary dark:text-txtSecondary-dark", {
                'flex justify-center items-center': isnamiv2
            })}>
                {/*<Key size={50} color={colors.teal}/>*/}
                <UserDeleteOutlined style={{ fontSize: 58, color: isnamiv2 ? 'white' : undefined }} />
                <a href={getLoginUrl('sso', 'login')} className={classNames("mt-4 rounded-md bg-dominant text-white text-sm px-4 py-2", { '!text-white !bg-namiv2-green-1 w-full h-12 flex items-center justify-center': isnamiv2 })}>
                    {_message}
                </a>
            </div>
        </div>
    )
}

export default NeedLogin
