import React, { useState, useEffect } from 'react';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';
import { PATHS } from 'constants/paths';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import HrefButton from 'components/common/V2/ButtonV2/HrefButton';
import NeedLoginV2 from 'components/common/NeedLoginV2';
import ModalNeedKyc from 'components/common/ModalNeedKyc';
import { useSelector } from 'react-redux';
import { BxsBookIcon } from 'components/svg/SvgIcon';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { TYPE_DW } from '../constants';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import { dwLinkBuilder, getS3Url } from 'redux/actions/utils';
import { API_GET_USER_BANK_LIST } from 'redux/actions/apis';
import Spinner from 'components/svg/Spinner';
import colors from 'styles/colors';
import ModalV2 from 'components/common/V2/ModalV2';
import FetchApi from 'utils/fetch-api';
import { ApiStatus } from 'redux/actions/const';

const getLinkSupport = (isVi) =>
    isVi ? 'https://nami.exchange/vi/support/faq/nap-rut-tien-ma-hoa' : 'https://nami.exchange/support/faq/crypto-deposit-withdrawal';

const TABS = [
    {
        localized: 'Crypto',
        key: 1,
        href: PATHS.WITHDRAW_DEPOSIT.DEFAULT,
        value: TYPE_DW.CRYPTO
    },
    {
        localized: 'dw_partner:partner',
        key: 2,
        href: PATHS.WITHDRAW_DEPOSIT.PARTNER,
        value: TYPE_DW.PARTNER
    }
];

const UserWD = ({ type, children, side }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const router = useRouter();
    const auth = useSelector((state) => state.auth.user) || null;
    const isOpenModalKyc = auth && auth?.kyc_status !== 2
    const [currentTheme] = useDarkMode();
    const isDark = currentTheme === THEME_MODE.DARK;

    const [loadingListUserBank, setLoadingListUserBank] = useState(false);
    const [isMustHaveBank, setIsMustHaveBank] = useState(false);
    const fetchListUserBank = () => {
        setLoadingListUserBank(true);

        // Fetch list bank accounts
        FetchApi({
            url: API_GET_USER_BANK_LIST,
            options: {
                method: 'GET'
            }
        })
            .then(({ status, data }) => {
                if (status === ApiStatus.SUCCESS) setIsMustHaveBank(!data || data?.length === 0);
            })
            .finally(() => setLoadingListUserBank(false));
    };

    useEffect(() => {
        if (type === TYPE_DW.CRYPTO) return;
        fetchListUserBank();
    }, [type]);

    return (
        // Set up Container styled: max-w, text, background
        <div className="px-4 pt-20 pb-[120px] bg-gray-13 dark:bg-dark font-normal text-base text-gray-15 dark:text-gray-4 tracking-normal">
            {loadingListUserBank ? (
                <div className="min-h-[50vh] flex w-full justify-center items-center">
                    <Spinner size={50} color={isDark ? colors.darkBlue5 : colors.gray['1']} />
                </div>
            ) : auth && auth?.kyc_status === 2 ? (
                <div className="max-w-screen-v3 mx-auto 2xl:max-w-screen-xxl">
                    <h1 className="mb-8 font-semibold text-[32px] leading-[38px]">{side === SIDE.BUY ? t('common:deposit') : t('common:withdraw')}</h1>

                    <div className="relative justify-between items-center flex flex-wrap sm:flex-nowrap tracking-normal mb-8">
                        <Tabs tab={type} className="gap-8 border-b border-divider dark:border-divider-dark">
                            {TABS?.map((item) => (
                                <TabItem
                                    V2
                                    className="md:!text-left !px-0 !text-base select-none"
                                    value={item.value}
                                    onClick={(isClick) => isClick && router.push(dwLinkBuilder(item?.value, side))}
                                >
                                    {t(item.localized)}
                                </TabItem>
                            ))}
                        </Tabs>
                        <div className="sm:border-b border-divider dark:border-divider-dark flex justify-center ">
                            <HrefButton variants="blank" target="_blank" className="!w-auto !py-4 !text-base" href={getLinkSupport(language === 'vi')}>
                                <BxsBookIcon size={16} isButton={true} className="mr-2" />
                                {t(`dw_partner:deposit_withdraw_guide.crypto`)}
                                {/* {
                                type === 'partner'
                                    ? t(`dw_partner:deposit_withdraw_guide.partner_${side?.toLowerCase()}`)
                                    : t(`dw_partner:deposit_withdraw_guide.crypto`)} */}
                            </HrefButton>
                        </div>
                    </div>
                    {children}
                </div>
            ) : isOpenModalKyc ? (
                <></>
            ) : isMustHaveBank ? (
                <></>
            ) : (
                <div className="h-[480px] flex items-center justify-center">
                    <NeedLoginV2 addClass="flex items-center justify-center" />
                </div>
            )}

            <ModalNeedKyc isOpenModalKyc={isOpenModalKyc} auth={auth} />
            <ModalAddPaymentMethod isVisible={!isOpenModalKyc && isMustHaveBank} t={t} isDark={isDark} />
        </div>
    );
};

export default UserWD;

const ModalAddPaymentMethod = ({ isVisible, t, isDark }) => {
    return (
        <ModalV2 isVisible={isVisible} className="!max-w-[488px]" wrapClassName="p-8 flex flex-col tracking-normal" closeButton={false}>
            <img
                width={124}
                height={124}
                src={
                    process.env.NODE_ENV === 'development'
                        ? `/images/screen/payment/phone_${isDark ? 'dark' : 'light'}.png`
                        : getS3Url(`/images/screen/payment/phone_${isDark ? 'dark' : 'light'}.png`)
                }
                className="mx-auto"
            />
            <div className="mb-4 mt-6 txtPri-3 text-center capitalize">{t('common:notice')}</div>
            <div className="text-center txtSecond-2">{t('dw_partner:not_have_payment_content')}</div>
            <HrefButton className="mt-10" href="/account/payment-method?isAdd=true">
                {t('dw_partner:verify_now')}
            </HrefButton>
        </ModalV2>
    );
};
