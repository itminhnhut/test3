import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { getS3Url, getV1Url, getLoginUrl } from 'redux/actions/utils';
import { PATHS } from 'constants/paths';
import SocialsLink from './SocialsLink';
import ScanQr from './ScanQr';
import { useSelector } from 'react-redux';
import HrefButton from '../V2/ButtonV2/HrefButton';
import ButtonV2 from '../V2/ButtonV2/Button';
import SvgIcon from 'src/components/svg';
import colors from 'styles/colors';
import { THEME_MODE } from 'hooks/useDarkMode';
import Image from 'next/image';
import { useRouter } from 'next/router';
import classNames from 'classnames';

const PocketFooter = ({ currentTheme, active, parentState, auth, width, t, language }) => {
    const router = useRouter();
    return (
        <>
            <div className="mal-footer___pocket">
                <div className={`mal-footer___pocket___company ${width >= 1200 ? '!w-[255px] tracking-normal' : ''} `}>
                    {auth ? (
                        width >= 1200 && (
                            <>
                                <div className="mal-footer___pocket__logo mb-6">
                                    <Image
                                        // src={getS3Url('/images/logo/nami-logo-v2.png')}
                                        src={getS3Url(`/images/logo/nami-logo-v2${currentTheme === THEME_MODE.DARK ? '' : '-light'}.png`)}
                                        width={188}
                                        height={60}
                                        alt="Nami Exchange"
                                    />
                                </div>
                                <div className="w-[188px]">
                                    <SocialsLink language={language} />
                                </div>
                            </>
                        )
                    ) : (
                        <div className={`${width >= 1200 ? ' ' : 'px-4 w-full'}`}>
                            <div className="font-semibold text-3xl lg:text-xl mb-6">{t('navbar:footer_title')}</div>
                            <div className="flex items-center">
                                <ButtonV2
                                    onClick={() => window.open(getLoginUrl('sso', 'register'), '_self')}
                                    className={classNames(
                                        'rounded-md',
                                        { 'w-[151px] !h-12 font-medium': width > 1200 },
                                        {
                                            'font-semibold !text-sm': width <= 1200
                                        }
                                    )}
                                >
                                    {t('common:create_account')}
                                </ButtonV2>
                            </div>

                            {width < 1200 && <hr className="border-divider dark:border-divider-dark my-6" />}
                        </div>
                    )}
                </div>

                <div className="mal-footer___pocket__links___group">
                    <div className="mal-footer___pocket__links___group__item">
                        <div
                            className={`mal-footer___pocket__links___group__item__expander ${active?.about ? 'bg-hover dark:bg-hover-dark ' : ' '}`}
                            onClick={() => parentState({ active: { about: !active.about } })}
                        >
                            {language === LANGUAGE_TAG.VI ? 'Về chúng tôi' : 'About Us'}
                            <SvgIcon
                                name="chevron_down"
                                size={16}
                                className={`${active?.about ? '!rotate-0 ' : ' '}`}
                                color={currentTheme === THEME_MODE.DARK ? colors.gray[4] : colors.darkBlue}
                            />
                        </div>
                        <div
                            className={`mal-footer___pocket__links___group__item__links
                                     ${active.about ? 'mal-footer___pocket__links___group__item__links__active' : ''}`}
                        >
                            <Link href="/terms-of-service">
                                <a>{language === LANGUAGE_TAG.VI ? 'Điều khoản' : 'Terms of Services'}</a>
                            </Link>
                            <Link href="/licences">
                                <a>{language === LANGUAGE_TAG.VI ? 'Giấy phép' : 'Licences'}</a>
                            </Link>
                            <Link href={auth ? PATHS.FEE_STRUCTURES.TRADING : PATHS.FEE_STRUCTURES.DEPWDL}>
                                <a>{t('navbar:menu.fee')}</a>
                            </Link>
                            <Link
                                href={
                                    language === LANGUAGE_TAG.VI
                                        ? '/support/announcement/thong-bao/ra-mat-chuong-trinh-doi-tac-phat-trien-cong-dong-nami'
                                        : '/support/announcement/nami-news/official-launching-of-nami-community-development-partnership-program'
                                }
                            >
                                <a className="">{language === LANGUAGE_TAG.VI ? 'Hợp tác kinh doanh' : 'Business Cooperation'}</a>
                            </Link>
                            {/* <Link href={`https://nami.exchange/files/whitepaper_${language}_1510.pdf`}>
                                <a className="invisible">Whitepaper</a>
                            </Link>

                            <Link href="/">
                                <a className="invisible">{language === LANGUAGE_TAG.VI ? 'Nền tảng của Nami' : 'Nami Platform'}</a>
                            </Link>
                            <Link href="/">
                                <a className="invisible">{language === LANGUAGE_TAG.VI ? 'Thông báo' : 'Notice'}</a>
                            </Link>
                            <Link href="https://ico.nami.trade/#nami-team">
                                <a target="_blank" className="invisible">
                                    {t('navbar:menu.about')}
                                </a>
                            </Link> */}
                        </div>
                    </div>

                    <div className="mal-footer___pocket__links___group__item">
                        <div
                            className={`mal-footer___pocket__links___group__item__expander ${active?.product ? 'bg-hover dark:bg-hover-dark ' : ' '}`}
                            onClick={() => parentState({ active: { product: !active.product } })}
                        >
                            {t('navbar:menu.product')}
                            <SvgIcon
                                name="chevron_down"
                                size={16}
                                className={`${active?.product ? '!rotate-0 ' : ' '}`}
                                color={currentTheme === THEME_MODE.DARK ? colors.gray[4] : colors.darkBlue}
                            />
                        </div>
                        <div
                            className={`mal-footer___pocket__links___group__item__links
                                     ${active.product ? 'mal-footer___pocket__links___group__item__links__active' : ''}`}
                        >
                            <Link href="/trade">
                                <a>{t('navbar:menu.spot')}</a>
                            </Link>
                            <Link href="/futures">
                                <a>{t('navbar:menu.futures')}</a>
                            </Link>
                            {/* <Link href="https://launchpad.nami.exchange/">
                                <a>Launchpad</a>
                            </Link>
                            <Link href="/">
                                <a>Copy Trade</a>
                            </Link>
                            <Link href={getV1Url('/farming')}>
                                <a>Farming</a>
                            </Link>
                            <Link href={getV1Url('/staking')}>
                                <a>Staking</a>
                            </Link> */}
                            <Link href={getV1Url('/reference')}>
                                <a>{t('navbar:submenu.referral')}</a>
                            </Link>
                            <Link href="/swap">
                                <a>{t('navbar:menu.swap')}</a>
                            </Link>
                        </div>
                    </div>

                    {/* <div className="mal-footer___pocket__links___group__item">
                    <div
                        className="mal-footer___pocket__links___group__item__expander"
                        onClick={() => parentState({ active: { community: !active.community } })}
                    >
                        {language === LANGUAGE_TAG.VI ? 'Cộng đồng' : 'Community'}
                        {active?.community ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  <div
                        className={`mal-footer___pocket__links___group__item__links
                                     ${active.community ? 'mal-footer___pocket__links___group__item__links__active' : ''}`}
                    >


                         <Link href="https://www.facebook.com/namifutures">
                            <a target="_blank" className="!flex items-center ">
                                <div className="mr-3 border p-2 rounded-full border-divider">
                                    <img src={getS3Url('/images/icon/ic_footer_fb.png')} alt="" width="16" height="16" />
                                </div>
                                Facebook Fanpage
                            </a>
                        </Link>
                        <Link href="https://www.facebook.com/groups/nami.exchange">
                            <a target="_blank" className="!flex items-center">
                                <img src={getS3Url('/images/icon/ic_footer_fb.png')} className="mr-3" alt="" width="16" height="16" /> Facebook Group
                            </a>
                        </Link>
                        <Link href="https://t.me/namitradevn">
                            <a target="_blank" className="!flex items-center">
                                <img src={getS3Url('/images/icon/ic_footer_telegram.png')} className="mr-3" alt="" width="16" height="16" /> Telegram Vietnam
                            </a>
                        </Link>
                        <Link href="https://t.me/namitrade">
                            <a target="_blank" className="!flex items-center">
                                <img src={getS3Url('/images/icon/ic_footer_telegram.png')} className="mr-3" alt="" width="16" height="16" /> Telegram Global
                            </a>
                        </Link>
                        <Link href="https://twitter.com/NamiTrade">
                            <a target="_blank" className="!flex items-center">
                                <img src={getS3Url('/images/icon/ic_footer_twitter.png')} className="mr-3" alt="" width="16" height="16" /> Twitter
                            </a>
                        </Link>
                        <Link href="https://www.reddit.com/r/NAMIcoin">
                            <a target="_blank" className="!flex items-center">
                                <img src={getS3Url('/images/icon/ic_footer_reddit.png')} className="mr-3" alt="" width="16" height="16" /> Reddit
                            </a>
                        </Link>
                        <Link href="/support">
                            <a target="_blank" className="!flex items-center">
                                <img src={getS3Url('/images/icon/ic_footer_globe.png')} className="mr-3" alt="" width="16" height="16" /> Blog
                            </a>
                        </Link>
                        <Link href={`https://www.coingecko.com/${language}/${language === LANGUAGE_TAG.VI ? 'ty_gia' : 'coins'}/nami-corporation-token`}>
                            <a target="_blank" className="!flex items-center">
                                <img src={getS3Url('/images/icon/ic_footer_coingecko.png')} className="mr-3" alt="" width="16" height="16" /> CoinGecko
                            </a>
                        </Link>
                    </div>
                </div>*/}

                    <div className="mal-footer___pocket__links___group__item">
                        <div
                            className={`mal-footer___pocket__links___group__item__expander ${active?.support ? 'bg-hover dark:bg-hover-dark ' : ' '}`}
                            onClick={() => parentState({ active: { support: !active.support } })}
                        >
                            {t('navbar:menu.support')}
                            <SvgIcon
                                name="chevron_down"
                                size={16}
                                className={`${active?.support ? '!rotate-0 ' : ' '}`}
                                color={currentTheme === THEME_MODE.DARK ? colors.gray[4] : colors.darkBlue}
                            />

                            {/* {active?.support ? <ChevronUp size={16} /> : <ChevronDown size={16} />} */}
                        </div>
                        <div
                            className={`mal-footer___pocket__links___group__item__links
                                     ${active.support ? 'mal-footer___pocket__links___group__item__links__active' : ''} `}
                        >
                            <Link href="/support/announcement" className="cursor-pointer">
                                {language === LANGUAGE_TAG.VI ? 'Thông báo' : 'Announcements'}
                            </Link>
                            <Link href="/support" className="cursor-pointer">
                                {language === LANGUAGE_TAG.VI ? 'Trung tâm hỗ trợ' : 'Support Center'}
                            </Link>
                            <a onClick={() => window.fcWidget.open()} className="cursor-pointer">
                                {language === LANGUAGE_TAG.VI ? 'Liên hệ hỗ trợ' : 'Chat with support'}
                            </a>
                            <Link href="/support/faq" className="cursor-pointer">
                                {language === LANGUAGE_TAG.VI ? 'FAQs' : 'FAQs'}
                            </Link>
                            <Link href="/futures/trading-rule" className="cursor-pointer">
                                {language === LANGUAGE_TAG.VI ? 'Quy tắc giao dịch' : 'Trading Rules'}
                            </Link>

                            <Link href="/futures/funding-history" className="cursor-pointer">
                                {language === LANGUAGE_TAG.VI ? 'Lịch sử Funding' : 'Funding Rate History'}
                            </Link>
                            <a className="cursor-pointer">Support@nami.exchange</a>
                        </div>
                    </div>

                    <div className="mal-footer___pocket__links___group__item">
                        {width >= 1200 ? (
                            <ScanQr t={t} />
                        ) : (
                            <div>
                                <div className="mal-footer___pocket__links___group__item__expander item_community  mb-3">
                                    {language === LANGUAGE_TAG.VI ? 'Cộng đồng' : 'Community'}
                                </div>
                                <SocialsLink language={language} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PocketFooter;
