import HrefButton from 'components/common/V2/ButtonV2/HrefButton';
import ModalV2 from 'components/common/V2/ModalV2';
import useLanguage from 'hooks/useLanguage';
import { useTranslation } from 'next-i18next';
import { getS3Url } from 'redux/actions/utils';
import { WIDTH_MD } from 'components/screens/Wallet';
import useWindowSize from 'hooks/useWindowSize';
import { isFunction } from 'lodash';

const ModalNeedKyc = ({ isOpenModalKyc, onBackdropCb, isMobile }) => {
    const { t } = useTranslation(['common', 'wallet']);
    const [currentLocale] = useLanguage();
    const { width } = useWindowSize();

    return (
        <ModalV2
            isMobile={isMobile || width < WIDTH_MD}
            isVisible={isOpenModalKyc}
            onBackdropCb={onBackdropCb}
            className="!max-w-[488px]"
            wrapClassName="p-8 flex flex-col tracking-normal"
            customHeader={isFunction(onBackdropCb) ? null : () => <></>}
            btnCloseclassName="!pt-0"
        >
            <img width={isMobile ? 80 : 124} height={isMobile ? 80 : 124} src={getS3Url('/images/screen/account/kyc_require.png')} className="mx-auto mt-4" />

            <div className="mb-4 mt-6 txtPri-3 text-center capitalize">{t('wallet:required_kyc')}</div>
            <div className="text-center txtSecond-2">{t('wallet:errors.invalid_kyc_status')}</div>
            <HrefButton className="mt-10 mb-3" href="https://nami.exchange/account/identification">
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
