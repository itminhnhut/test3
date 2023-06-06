import { useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { getLoginUrl, getS3Url } from 'redux/actions/utils';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

const NeedLoginV2 = ({ message, addClass }) => {
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
                <img src={getS3Url('/images/screen/swap/login-success.png')} alt="" className="mx-auto h-[124px] w-[124px]" />
                <a
                    href={getLoginUrl('sso')}
                    className="mt-4 flex whitespace-nowrap items-center justify-center rounded-md font-semibold text-[14px] leading-[18px] md:text-base w-full py-3 px-6 bg-green-3 hover:bg-green-4 dark:bg-green-2 dark:hover:bg-green-4 text-white hover:text-white"
                >
                    {_message}
                </a>
            </div>
        </div>
    );
};

export default NeedLoginV2;
