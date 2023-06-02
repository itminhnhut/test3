import React, { useState } from 'react';
import HrefButton from 'components/common/V2/ButtonV2/HrefButton';
import { X } from 'react-feather';
import { Trans } from 'next-i18next';
import { CheckedDoubleIcon } from '../../svg/SvgIcon';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { Eye, EyeOff } from 'react-feather';
import { getLoginUrl, getS3Url } from 'redux/actions/utils';
import { THEME_MODE } from 'hooks/useDarkMode';
import Image from 'next/image';
import Link from 'next/link';

import CheckBox from 'components/common/CheckBox';
import { PATHS } from '../../../constants/paths';

const HomeFirstAward = ({ t, theme }) => {
    const [state, set] = useState({
        focus: null,
        checkedTermAndPolicy: false,
        isPwShow: false,
        email: '',
        password: '',
        referral: ''
    });

    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));
    const onDeleteInput = (type) => setState({ [type]: '' });
    return (
        <section
            className="homepage-first_award relative"
            style={{ backgroundImage: `url('${getS3Url(`/images/screen/homepage/bg_first_award_${theme}.webp`)}')` }}
        >
            <div className="homepage-first_award__wrapper max-w-screen-v3 2xl:max-w-screen-xxl mx-auto">
                <div className="homepage-first_award___step relative flex-1">
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
                            <div>
                                <Trans i18nKey="home:first_award.rule_2">
                                    <span className="text-teal">40,000+</span>
                                </Trans>
                            </div>
                        </div>
                        <div className="homepage-first_award__manual__item">
                            <div className="mr-3">
                                <CheckedDoubleIcon size={19} />
                            </div>
                            <div>
                                <Trans i18nKey="home:first_award.rule_3">
                                    <span className="text-teal" />
                                    400+
                                </Trans>
                            </div>
                        </div>
                        <div className="homepage-first_award__manual__item">
                            <div className="mr-3">
                                <CheckedDoubleIcon size={19} />
                            </div>
                            <div>
                                <Trans i18nKey="home:first_award.rule_4">
                                    <span className="text-teal" />
                                </Trans>
                            </div>
                        </div>
                        <div className="homepage-first_award__manual__item">
                            <div className="mr-3">
                                <CheckedDoubleIcon size={19} />
                            </div>
                            <div>
                                <Trans i18nKey="home:first_award.rule_5">
                                    <span className="text-teal" />
                                </Trans>
                            </div>
                        </div>
                        <div className="homepage-first_award__manual__item">
                            <div className="mr-3">
                                <CheckedDoubleIcon size={19} />
                            </div>
                            <div>
                                <Trans i18nKey="home:first_award.rule_6">
                                    <span className="text-teal" />
                                </Trans>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="homepage-first_award___form relative">
                    <div
                        className={
                            // ${
                            //     theme === THEME_MODE.DARK ? 'left-[-24px] top-[-24px]' : 'right-[-48px] top-[-12px] rotate-90'
                            // }
                            `left-[-24px] top-[-24px] absolute  z-[-10] w-[228px] `
                        }
                    >
                        <Image alt="first_award_corner" width={228} height={185} src={getS3Url('/images/screen/homepage/first_award_corner.webp')} />
                    </div>
                    <div
                        className={
                            // ${
                            //     theme === THEME_MODE.DARK ? 'rotate-180 right-[-24px] bottom-[-24px] ' : 'left-[-48px] bottom-[-12px] -rotate-90'
                            // }

                            `rotate-180 right-[-24px] bottom-[-24px]    absolute z-[-10] w-[228px] `
                        }
                    >
                        <Image alt="first_award_corner_replicate" width={228} height={185} src={getS3Url('/images/screen/homepage/first_award_corner.webp')} />
                    </div>

                    <div className="homepage-first_award___form___input_group">
                        <div className="mb-4">
                            <label htmlFor="homepage-form-email" className="text-gray-9 dark:text-gray-7 mb-2 text-sm">
                                Email
                            </label>
                            <div
                                className={`homepage-first_award___form___input__wrapper
                                             ${state.focus === 'email' ? 'homepage-first_award___form___focus' : ''}`}
                            >
                                <input
                                    value={state.email}
                                    onChange={(e) => setState({ email: e.target.value })}
                                    id="homepage-form-email"
                                    className="homepage-first_award___form___input"
                                    onFocus={() => setState({ focus: 'email' })}
                                    onBlur={() => setState({ focus: null })}
                                    placeholder={t('input:email_placeholder')}
                                />
                                {Boolean(state.email) && <X className="cursor-pointer" onClick={() => onDeleteInput('email')} size={16} />}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="homepage-form-password" className="text-gray-9 dark:text-gray-7 mb-2 text-sm">
                                {t('input:password_label')}
                            </label>
                            <div
                                className={`homepage-first_award___form___input__wrapper
                                             ${state.focus === 'pwd' ? 'homepage-first_award___form___focus' : ''}`}
                            >
                                <input
                                    value={state.password}
                                    onChange={(e) => setState({ password: e.target.value })}
                                    id="homepage-form-password"
                                    type={state.isPwShow ? 'text' : 'password'}
                                    className="homepage-first_award___form___input"
                                    onFocus={() => setState({ focus: 'pwd' })}
                                    onBlur={() => setState({ focus: null })}
                                    placeholder={t('input:password_length_required')}
                                />
                                <div className="flex">
                                    {Boolean(state.password) && (
                                        <div
                                            onClick={() => onDeleteInput('password')}
                                            className="pr-2 mr-2 border-r cursor-pointer border-divider dark:border-divider-dark"
                                        >
                                            <X size={16} />
                                        </div>
                                    )}
                                    <div className="cursor-pointer" onClick={() => setState({ isPwShow: !state.isPwShow })}>
                                        {state.isPwShow ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="">
                            <label htmlFor="homepage-form-referral" className="text-gray-9 dark:text-gray-7 mb-2 text-sm">
                                {t('input:referral_label')}
                            </label>
                            <div
                                className={`homepage-first_award___form___input__wrapper
                                             ${state.focus === 'referral' ? 'homepage-first_award___form___focus' : ''}`}
                            >
                                <input
                                    value={state.referral}
                                    onChange={(e) => setState({ referral: e.target.value })}
                                    id="homepage-form-referral"
                                    className="homepage-first_award___form___input"
                                    onFocus={() => setState({ focus: 'referral' })}
                                    onBlur={() => setState({ focus: null })}
                                    placeholder={t('input:referral_placeholder')}
                                />
                                <div className="flex">
                                    {Boolean(state.referral) && (
                                        <div onClick={() => onDeleteInput('referral')} className="cursor-pointer">
                                            <X size={16} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center mt-6">
                            <div>
                                <CheckBox
                                    className="!w-auto "
                                    boxContainerClassName="min-w-[24px] min-h-[24px]"
                                    active={state.checkedTermAndPolicy}
                                    onChange={() => setState({ checkedTermAndPolicy: !state.checkedTermAndPolicy })}
                                    label={
                                        <div className="dark:text-darkBlue-5 text-gray-9 ">
                                            <Trans i18nKey="home:first_award.terms_of_service">
                                                <HrefButton
                                                    target="_blank"
                                                    className="!inline !p-0 !text-sm w-fit-content"
                                                    href={PATHS.TERM_OF_SERVICES.DEFAULT}
                                                    variants="blank"
                                                />
                                            </Trans>
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
                            {t('home:first_award.already_have_account')}
                            <Link href={getLoginUrl('sso', 'login')}>
                                <a className="ml-2 font-semibold text-dominant">{t('home:first_award.login')}</a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default React.memo(HomeFirstAward);
