import React, { useState } from 'react';
import HrefButton from 'components/common/V2/ButtonV2/HrefButton';
import Link from 'next/link';
import { Trans } from 'next-i18next';
import { CheckedDoubleIcon } from '../../svg/SvgIcon';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { Eye, EyeOff } from 'react-feather';
import { getLoginUrl } from 'redux/actions/utils';

import CheckBox from 'components/common/CheckBox';

const HomeFirstAward = ({ t, language }) => {
    const [state, set] = useState({
        focus: null,
        checkedTermAndPolicy: false,
        isPwShow: false
    });

    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));
    return (
        <section className="homepage-first_award relative min-h-screen">
            <img src="/images/screen/homepage/half-circle.png" alt="half-circle" className="absolute z-[-1] w-full left-1/2 -translate-x-1/2 top-0 max-h-full" />
            <img src="/images/screen/homepage/form_splash.png" alt="form_splash" className="absolute z-[-1] w-1/2 left-0 bottom-0 h-[505px] max-h-full" />

            <div className="homepage-first_award__wrapper mal-container">
                <div className="homepage-first_award___step relative">
                

                    <div className="homepage-first_award__title">{t('home:first_award.title')}</div>
                    <div className="homepage-first_award__manual">
                        <div className="homepage-first_award__manual__item">
                            <div className="mr-3">
                                <CheckedDoubleIcon size={19} />
                            </div>
                            <Trans>{t('home:first_award.rule_1')}</Trans>
                        </div>
                        <div className="homepage-first_award__manual__item">
                            <div className="mr-3">
                                <CheckedDoubleIcon size={19} />
                            </div>
                            <Trans i18nKey="home:first_award.rule_2">
                                <span className="text-teal mx-1">40,000+</span>
                            </Trans>
                        </div>
                        <div className="homepage-first_award__manual__item">
                            <div className="mr-3">
                                <CheckedDoubleIcon size={19} />
                            </div>
                            <Trans i18nKey="home:first_award.rule_3">
                                <span className="text-teal mx-1">400+</span>
                            </Trans>
                        </div>
                        <div className="homepage-first_award__manual__item">
                            <div className="mr-3">
                                <CheckedDoubleIcon size={19} />
                            </div>
                            <Trans i18nKey="home:first_award.rule_4">
                                <span className="text-teal mx-1">125x</span>
                            </Trans>
                        </div>
                        <div className="homepage-first_award__manual__item">
                            <div className="mr-3">
                                <CheckedDoubleIcon size={19} />
                            </div>
                            <Trans i18nKey="home:first_award.rule_5">
                                <span className="text-teal mx-1">0,06%</span>
                            </Trans>
                        </div>
                        <div className="homepage-first_award__manual__item">
                            <div className="mr-3">
                                <CheckedDoubleIcon size={19} />
                            </div>
                            <Trans i18nKey="home:first_award.rule_6">
                                <span className="text-teal mx-1">24/7</span>
                            </Trans>
                        </div>
                    </div>
                </div>
                <div className="homepage-first_award___form">

                    <div className="homepage-first_award___form___input_group">
                        <label htmlFor="homepage-form-email" className="text-gray-9 dark:text-gray-7 mb-2 text-sm">
                            Email
                        </label>
                        <div
                            className={`homepage-first_award___form___input__wrapper
                                             ${state.focus === 'email' ? 'homepage-first_award___form___focus' : ''} mb-4`}
                        >
                            <input
                                id="homepage-form-email"
                                className="homepage-first_award___form___input"
                                onFocus={() => setState({ focus: 'email' })}
                                onBlur={() => setState({ focus: null })}
                                placeholder={t('input:email_placeholder')}
                            />
                        </div>

                        <div className="">
                            <label htmlFor="homepage-form-password" className="text-gray-9 dark:text-gray-7 mb-2 text-sm">
                                {t('input:password_placeholder')}
                            </label>
                            <div
                                className={`homepage-first_award___form___input__wrapper
                                             ${state.focus === 'pwd' ? 'homepage-first_award___form___focus' : ''}`}
                            >
                                <input
                                    id="homepage-form-password"
                                    type={state.isPwShow ? 'text' : 'password'}
                                    className="homepage-first_award___form___input"
                                    onFocus={() => setState({ focus: 'pwd' })}
                                    onBlur={() => setState({ focus: null })}
                                    placeholder={language === LANGUAGE_TAG.VI ? 'Nhập mật khẩu của bạn (8 - 50 ký tự)' : 'Your password (8 - 50 letters)'}
                                />
                                <div className="cursor-pointer" onClick={() => setState({ isPwShow: !state.isPwShow })}>
                                    {state.isPwShow ? <Eye size={16} /> : <EyeOff size={16} />}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center mt-6">
                            <div>
                                <CheckBox
                                    active={state.checkedTermAndPolicy}
                                    onChange={() => setState({ checkedTermAndPolicy: !state.checkedTermAndPolicy })}
                                    label={
                                        <div className="dark:text-darkBlue-5 text-gray-9 text-base">
                                            <span>Tôi đồng ý với</span>
                                            <Link href="/">
                                                <a className="mx-1 text-dominant">Điều kiện và điều khoản </a>
                                            </Link>
                                            <span className="block xl:inline">của Nami Exchange</span>
                                        </div>
                                    }
                                />
                            </div>
                        </div>

                        <div className="mt-10">
                            <HrefButton className="bg-dominant !text-white" href={getLoginUrl('sso', 'register')}>
                                {t('common:sign_up')}
                            </HrefButton>
                        </div>
                        <div className="text-center text-txtSecondary dark:text-txtSecondary-dark mt-6">
                            {t('common:already_have_account')}
                            <a href={getLoginUrl('sso', 'login')} className="ml-2 text-dominant">
                                {t('common:sign_in')}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeFirstAward;
