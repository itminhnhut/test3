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
                <ButtonV2 className="mt-4" onClick={() => router.push(getLoginUrl('sso'))} variants="primary">
                    {_message}
                </ButtonV2>
            </div>
        </div>
    );
};

export default NeedLoginV2;
