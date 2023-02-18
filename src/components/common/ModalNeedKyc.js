import HrefButton from 'components/common/V2/ButtonV2/HrefButton';
import ModalV2 from 'components/common/V2/ModalV2';
import useLanguage from 'hooks/useLanguage';
import { useTranslation } from 'next-i18next';
import { getS3Url } from 'redux/actions/utils';

const ModalNeedKyc = ({ isOpenModalKyc, onBackdropCb }) => {
    const { t } = useTranslation(['common', 'wallet']);
    const [currentLocale] = useLanguage();

    return (
        <ModalV2 isVisible={isOpenModalKyc} onBackdropCb={onBackdropCb} className="!max-w-[488px]" wrapClassName="p-8 flex flex-col tracking-normal">
            <img width={124} height={124} src={getS3Url('/images/screen/account/kyc_require.png')} className="mx-auto mt-4" />

            <div className="mb-4 mt-6 font-semibold text-2xl leading-[30px] text-center capitalize">{t('wallet:required_kyc')}</div>
            <div className="text-center text-gray-16 text-base">{t('wallet:errors.invalid_kyc_status')}</div>
            <HrefButton className="mt-10 mb-3" href="https://nami.exchange/account/identification" target="_blank">
                {t('common:kyc_now')}
            </HrefButton>
            <HrefButton
                href={
                    currentLocale === 'en'
                        ? 'https://nami.exchange/support/announcement/announcement/important-update-about-nami-exchange-identity-verification-kyc'
                        : 'https://nami.exchange/vi/support/announcement/thong-bao/cap-nhat-quy-dinh-ve-xac-thuc-tai-khoan-kyc'
                }
                target="_blank"
                variants="secondary"
            >
                {t('common:view_manual')}
            </HrefButton>
        </ModalV2>
    );
};

export default ModalNeedKyc;
