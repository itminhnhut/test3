import React, { useState, useRef, useEffect, memo } from "react";
import styled from "styled-components";
import useLanguage, { LANGUAGE_TAG } from "hooks/useLanguage";
import { useTranslation } from "next-i18next";
import SvgMenu from "src/components/svg/Menu";
import { useWindowSize } from "utils/customHooks";
import colors from "styles/colors";
import Portal from "components/hoc/Portal";
import LanguageSetting from "components/common/NavBar/LanguageSetting"
import classNames from "classnames";
import { X } from "react-feather";
import {
    Divider,
    ButtonNao,
    useOutsideAlerter,
} from "components/screens/Nao/NaoStyle";
import { getS3Url } from "redux/actions/utils";
import { useRouter } from "next/router";
import SvgCross from "components/svg/Cross";
import { AppleIcon, GooglePlayIcon } from 'components/svg/SvgIcon';
import Image from "next/image";
import useApp from "hooks/useApp";
const category = [
    {
        label: "Whitepaper",
        link: "https://naotoken.gitbook.io/du-an-nao/thong-tin-co-ban/tokenomics",
        options: "_blank",
    },
    { label: 'announcement', link: 'https://nami.exchange/vi/support/announcement/thong-bao', options: '_blank' },
    // { label: "performance", el: "nao_performance", url: "/nao" },
    { label: "governance_pool", el: "nao_pool", url: "/nao" },
    // { label: 'buy_token', el: 'nao_token' },
    { label: "Stake NAO", link: "/nao/stake", options: "_self" },
    { label: "voting", el: "nao_proposal", url: "/nao" },
    { label: "contest_futures", link: "/contest", options: "_self" },
    { label: 'summary_2022', link: '/nao/summary-2022', options: '_self' }
];

const NaoHeader = memo(({ onDownload }) => {
    const isApp = useApp();
    const [currentLocale, onChangeLang] = useLanguage();
    const {
        t,
        i18n: { language },
    } = useTranslation();
    const { width } = useWindowSize();
    const [visible, setVisible] = useState(false);
    const router = useRouter();
    const el = useRef(null);

    const scrollToView = (item) => {
        if (!item?.el) {
            if (item.link)
                item?.options === "_self"
                    ? router.push(item.link)
                    : window.open(item.link, item.options);
        } else {
            if (item?.url && router.route !== item?.url) {
                el.current = item.el;
                router.push(item.url);
            } else {
                const _el = document.querySelector("#" + item.el);
                if (_el) _el.scrollIntoView();
            }
        }
        if (visible) setVisible(false);
    };
    useEffect(() => {
        router.events.on("routeChangeComplete", () => {
            const _el = document.querySelector("#" + el.current);
            if (_el) {
                _el.scrollIntoView();
                el.current = null;
            }
        });
    }, [router, el.current]);

    return (
        <div className="nao_header flex justify-between items-center h-[90px] relative z-10">
            <Drawer
                visible={visible}
                onClose={() => setVisible(false)}
                onChangeLang={onChangeLang}
                language={language}
                t={t}
                scrollToView={scrollToView}
                onDownload={onDownload}
            />
            <img
                onClick={() => router.push("/nao")}
                src={getS3Url("/images/nao/ic_nao.png")}
                width="40"
                height="40"
                className="min-w-[2.5rem]"
            />
            <div
                className={`flex items-center text-txtPrimary dark:text-txtPrimary-dark font-medium ${width > 820 ? "space-x-10" : "space-x-4"
                }`}
            >
                {width > 820 && (
                    <>
                        {category.map((item) => (
                            <div
                                key={item.label}
                                onClick={() => scrollToView(item)}
                                className="cursor-pointer"
                            >
                                {t(`nao:${item.label}`)}
                            </div>
                        ))}
                        <LanguageSetting />
                    </>
                )}
                {width <= 820 && (
                    <>
                        {isApp && <ButtonNao
                            onClick={() => router.push("/nao/stake")}
                            className="!rounded-md h-10 px-6"
                        >
                            Stake NAO
                        </ButtonNao>}
                        <div
                            className="relative"
                            onClick={() => setVisible(true)}
                        >
                            <SvgMenu
                                size={24}
                                className={"cursor-pointer select-none"}
                                color="currentColor"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
});

const Drawer = ({
    visible,
    onClose,
    language,
    onChangeLang,
    t,
    scrollToView,
    onDownload,
}) => {
    const wrapperRef = useRef(null);
    const timer = useRef(null);
    const handleOutside = () => {
        if (visible && onClose) {
            onClose();
        }
    };

    useEffect(() => {
        if (visible) {
            document.body.classList.add("overflow-hidden");
        } else {
            clearTimeout(timer.current);
            timer.current = setTimeout(() => {
                document.body.classList.remove("overflow-hidden");
            }, 300);
        }
    }, [visible]);

    useOutsideAlerter(wrapperRef, handleOutside.bind(this));

    const _scrollToView = (el) => {
        document.body.classList.remove("overflow-hidden");
        if (scrollToView) scrollToView(el);
    };

    return (
        <Portal portalId="PORTAL_MODAL">
            <div
                className={classNames(
                    'flex flex-col fixed top-0 right-0 h-full w-full z-[20] bg-black-800/[0.6] dark:bg-black-800/[0.8] overflow-hidden',
                    'ease-in-out transition-all flex items-end duration-300 z-30',
                    { invisible: !visible },
                    { visible: visible },
                    { 'translate-x-full': !visible },
                    { 'translate-x-0': visible }
                )}
            >
                <div ref={wrapperRef} className="flex-1 w-[284px] min-h-0 bg-bgPrimary dark:bg-bgPrimary-dark">
                    <div className="pt-8 px-4 flex justify-between items-center">
                        <img onClick={() => router.push('/nao')} src={getS3Url('/images/nao/ic_nao.png')} width="32" height="32" />
                        <SvgCross onClick={onClose} color="currentColor" size="24" />
                    </div>
                    <div className="pt-8 px-4 pb-[50px] flex flex-col h-[calc(100%-65px)] overflow-y-auto">
                        <div className="text-[0.875rem] font-medium text-txtPrimary dark:text-txtPrimary-dark space-y-3 w-full">
                            {category.map((item) => (
                                <div key={item.label} onClick={() => _scrollToView(item)} className="cursor-pointer leading-8">
                                    {t(`nao:${item.label}`)}
                                </div>
                            ))}
                            <div className="flex items-center select-none gap-2 justify-between" onClick={onChangeLang}>
                                <div className="flex flex-row items-center">{t('nao:language')}</div>
                                <div className="rounded-full">
                                    {language === LANGUAGE_TAG.EN ? (
                                        <Image src={getS3Url('/images/icon/ic_us_flag.png')} width="20" height="20" />
                                    ) : (
                                        <Image src={getS3Url('/images/icon/ic_vn_flag.png')} width="20" height="20" />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-full pt-10">
                            <hr className="border-t border-divider dark:border-divider-dark my-1" />
                            <div className="flex items-center py-4">
                                <img alt="" src={getS3Url('/images/nao/ic_nami.png')} height="32" width="32" />
                                <div className="text-txtPrimary dark:text-txtPrimary-dark text-xs font-semibold ml-2">{t('nao:nao_token:get_buy_now')}</div>
                            </div>
                            <div className="flex justify-between items-center w-full">
                                <button
                                    type="BUTTON"
                                    onClick={() => onDownload('app_store')}
                                    className="flex bg-gray-12 dark:bg-dark-2 rounded-md px-3 py-2 text-left"
                                >
                                    <AppleIcon color="currentColor" />
                                    <div className="font-SF-Pro">
                                        <div className="text-[0.5rem] font-semibold leading-none">{t('nao:down_on')}</div>
                                        <div className="text-sm font-semibold space-x-0">App Store</div>
                                    </div>
                                </button>
                                <button
                                    type="BUTTON"
                                    onClick={() => onDownload('google_play')}
                                    className="flex bg-gray-12 dark:bg-dark-2 rounded-md px-3 py-2 text-left"
                                >
                                    <GooglePlayIcon />
                                    <div className="font-SF-Pro">
                                        <div className="text-[0.5rem] uppercase leading-none">{t('nao:get_on')}</div>
                                        <div className="text-sm font-semibold space-x-0">Google Play</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    );
};

const Language = styled.div.attrs({
    className:
        "px-3 text-xs py-[3px] md:py-[1px] md:px-4 md:text-sm rounded-[4px] cursor-pointer text-gray-15 dark:text-gray-7 font-semibold nao:leading-[26px]",
})`
  background: ${({ active }) => (active ? colors.teal : "")};
  color: ${({ active }) => (active ? `${colors.white}` : "")}
`;

export default NaoHeader;
