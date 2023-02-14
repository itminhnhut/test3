import HrefButton from 'components/common/V2/ButtonV2/HrefButton';
import ModalV2 from 'components/common/V2/ModalV2';
import useLanguage from 'hooks/useLanguage';
import { useTranslation } from 'next-i18next';

const ModalNeedKyc = ({ isOpenModalKyc, onBackdropCb }) => {
    const { t } = useTranslation(['common']);

    const [currentLocale] = useLanguage();

    return (
        <ModalV2 isVisible={isOpenModalKyc} onBackdropCb={onBackdropCb} className="!max-w-[400px]" wrapClassName="px-6 flex flex-col">
            {/* <ReModal isVisible={isVisible} containerClassName="p-6 max-w-[400px]"> */}
            <div className="mb-4 font-bold text-lg text-center capitalize">{t('modal:notice')}</div>
            <div className="text-center px-4">{t('wallet:errors.invalid_kyc_status')}</div>
            <div className="mt-6 flex items-center justify-between">
                <div className="w-[47%]">
                    <HrefButton
                        href={
                            currentLocale === 'en'
                                ? 'https://nami.exchange/support/announcement/announcement/important-update-about-nami-exchange-identity-verification-kyc'
                                : 'https://nami.exchange/vi/support/announcement/thong-bao/cap-nhat-quy-dinh-ve-xac-thuc-tai-khoan-kyc'
                        }
                        target="_blank"
                    >
                        {t('common:view_manual')}
                    </HrefButton>
                </div>
                <div className="w-[47%]">
                    <HrefButton href="https://nami.exchange/account/identification" target="_blank">
                        {t('common:kyc_now')}
                    </HrefButton>
                </div>
            </div>
            {/* </ReModal> */}
        </ModalV2>
    );
};

export default ModalNeedKyc;
