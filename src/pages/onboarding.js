import { RadioGroup } from '@headlessui/react';
import { IconLoading } from 'components/common/Icons';
// import OnboardingLoader from 'components/loader/OnboardingLoader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAsync } from 'react-use';
import {
    getOnboardingPromotionStatus,
    getOnboardingQuestions,
    openOnboardingCase,
    submitOnboardingQuestions,
} from 'src/redux/actions/onboarding';
import { formatBalance } from 'src/redux/actions/utils';
import OnboardingSelector from 'src/redux/selectors/onboardingSelectors';
import AuthStorage from 'utils/auth-storage';

const Onboarding = () => {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const dispatch = useDispatch();

    const onBoardedData = useSelector(OnboardingSelector.onBoardedData);

    const token = AuthStorage.loggedIn;

    const ONBOARDING_STEPS = {
        EXPERIENCE: 0,
        BASE_ASSET: 1,
        ONBOARD_CASE: 2,
        ONBOARD_CASE_SELECT: 3,
        ONBOARD_CASE_OPEN: 4,
        ONBOARD_CASE_RECEIVE: 5,
        NOTHING: 6,
    };

    const [step, setStep] = useState(6);
    const [selected, setSelected] = useState(false);
    const [selectedCase, setSelectedCase] = useState({
        color: 'pink',
        index: 0,
    });
    const [volume, setVolume] = useState(10000);
    const [isLoading, setIsLoading] = useState(false);

    useAsync(async () => {
        if (token) {
            const onboardingPromotionStatus = await dispatch(await getOnboardingPromotionStatus());
            if (!onboardingPromotionStatus) {
                const questions = await dispatch(await getOnboardingQuestions());
                if (questions.length > 0) return setStep(ONBOARDING_STEPS.EXPERIENCE);
                return setStep(ONBOARDING_STEPS.ONBOARD_CASE);
            }
            return router.push('/markets', undefined, { shallow: true });
        }
        return router.push('/markets', undefined, { shallow: true });
    }, []);

    const handleAnswer = async (answer) => {
        let questionName;
        let questionValue;
        if (step === ONBOARDING_STEPS.EXPERIENCE) {
            setSelected(answer);
            questionName = onBoardedData?.[ONBOARDING_STEPS.EXPERIENCE]?.name;
            questionValue = answer?.value;
            await setIsLoading(true);
            const result = await dispatch(await submitOnboardingQuestions({ questionName, questionValue }));
            if (result) {
                setIsLoading(false);
                if (onBoardedData.length === 1) {
                    return setStep(step + 2);
                }
                return setStep(step + 1);
            }
            return null;
        }
        if (step === ONBOARDING_STEPS.BASE_ASSET) {
            setSelected(answer);
            questionName = onBoardedData?.[ONBOARDING_STEPS.BASE_ASSET]?.name;
            questionValue = answer?.value;
            await setIsLoading(true);
            const result = await dispatch(await submitOnboardingQuestions({ questionName, questionValue }));
            if (result) {
                setIsLoading(false);
                return setStep(step + 1);
            }
            return null;
        }

        if (step === ONBOARDING_STEPS.ONBOARD_CASE) {
            return setStep(step + 1);
        }
        if (step === ONBOARDING_STEPS.ONBOARD_CASE_SELECT) {
            setSelectedCase(answer);
            return setStep(step + 1);
        }
        if (step === ONBOARDING_STEPS.ONBOARD_CASE_OPEN) {
            await setIsLoading(true);
            const result = await dispatch(await openOnboardingCase({ boxIndex: selectedCase.index }));
            if (result) {
                setVolume(result?.prize?.value);
                setIsLoading(false);
                return setStep(step + 1);
            }
            return null;
        }
    };

    const renderStep = () => {
        switch (step) {
            case ONBOARDING_STEPS.EXPERIENCE: {
                const question = onBoardedData?.[ONBOARDING_STEPS.EXPERIENCE];
                return (
                    <>
                        <p className="mt-[72px] mb-[60px] text-[#02083D] text-xl font-bold px-[22px] text-center">{question?.title[i18n.language]}</p>
                        <RadioGroup value={selected} onChange={handleAnswer}>
                            <div className="space-y-2 mb-[72px]">
                                {question?.answers?.answerOptions?.map((answer) => (
                                    <RadioGroup.Option
                                        key={answer._id}
                                        value={answer}
                                        style={{ fontWeight: 500 }}
                                        disabled={isLoading}
                                        className={({ active, checked }) => `border ${checked ? 'bg-[#F7F6FD] border-[#4021D0]' : 'bg-white border-[#EEF2FA]'} relative rounded-md px-[22px] py-3 ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'} flex focus:outline-none`}
                                    >
                                        {({ active, checked }) => (
                                            <>
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center">
                                                        <div className="text-base">
                                                            <RadioGroup.Label
                                                                as="p"
                                                                className={checked ? 'text-[#4021D0]' : 'text-[#02083D]'}
                                                            >
                                                                {answer?.title[i18n.language]}
                                                            </RadioGroup.Label>
                                                        </div>
                                                    </div>
                                                    {checked && (
                                                        <div className="flex-shrink-0 text-white">
                                                            <IconLoading className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </RadioGroup.Option>
                                ))}
                            </div>
                        </RadioGroup>
                    </>
                );
            }
            case ONBOARDING_STEPS.BASE_ASSET: {
                const question = onBoardedData?.[ONBOARDING_STEPS.BASE_ASSET];
                return (
                    <>
                        <p className="mt-[72px] mb-[60px] text-[#02083D] text-xl font-bold px-[22px] text-center">{question?.title[i18n.language]}</p>
                        <RadioGroup value={selected} onChange={handleAnswer}>
                            <div className="space-y-2 mb-[72px]">
                                {question?.answers?.answerOptions?.map((answer) => (
                                    <RadioGroup.Option
                                        key={answer._id}
                                        value={answer}
                                        style={{ fontWeight: 500 }}
                                        disabled={isLoading}
                                        className={({ active, checked }) => `border ${checked ? 'bg-[#F7F6FD] border-[#4021D0]' : 'bg-white border-[#EEF2FA]'} relative rounded-md px-[22px] py-3 ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'} flex focus:outline-none`}
                                    >
                                        {({ active, checked }) => (
                                            <>
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center">
                                                        <div className="text-base">
                                                            <RadioGroup.Label
                                                                as="p"
                                                                className={checked ? 'text-[#4021D0]' : 'text-[#02083D]'}
                                                            >
                                                                {answer?.title[i18n.language]}
                                                            </RadioGroup.Label>
                                                        </div>
                                                    </div>
                                                    {checked && (
                                                        <div className="flex-shrink-0 text-white">
                                                            <IconLoading className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </RadioGroup.Option>
                                ))}
                            </div>
                        </RadioGroup>
                    </>
                );
            }
            case ONBOARDING_STEPS.ONBOARD_CASE: {
                return (
                    <div className="flex flex-col items-center justify-center mt-[46px] mb-[51px]">
                        <img src="/images/onboarding/cases.png" width={320} height={320} className="mb-[23px]" />
                        <p className="font-bold text-center text-xl mb-[60px]">{t('onboarding:promo_title')}</p>
                        <button type="button" onClick={handleAnswer} className="w-full mx-[32px] px-9 py-[11px] bg-[#DE6D8C] text-white text-sm font-bold rounded-md">{t('onboarding:start')}</button>
                    </div>
                );
            }
            case ONBOARDING_STEPS.ONBOARD_CASE_SELECT: {
                return (
                    <div className="flex flex-col items-center justify-center mt-[30px] mb-[26px]">
                        <p className="font-bold text-center text-xl mb-8">{t('onboarding:promo_selection')}</p>
                        <button
                            type="button"
                            onClick={() => handleAnswer({ color: 'pink', index: 0 })}
                            className="mb-[34px] transition-transform duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                        >
                            <img src="/images/onboarding/pink-case.png" width={154} height={98} />
                        </button>
                        <button
                            type="button"
                            onClick={() => handleAnswer({ color: 'violet', index: 1 })}
                            className="mb-[34px] transition-transform duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                        >
                            <img src="/images/onboarding/violet-case.png" width={154} height={98} />
                        </button>
                        <button
                            type="button"
                            onClick={() => handleAnswer({ color: 'blue', index: 2 })}
                            className="mb-[34px] transition-transform duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                        >
                            <img src="/images/onboarding/blue-case.png" width={154} height={98} />
                        </button>
                        <div className="w-full px-8 py-4 rounded-xl bg-[#F6F5FB]">
                            <p className="text-center tracking-[-0.01em]" style={{ fontWeight: 500 }}>{t('onboarding:promo_selection_desc')} <span className="font-bold text-violet-700">10,000 VNDC</span></p>
                            <p className="text-center tracking-[-0.01em]" style={{ fontWeight: 500 }}>{t('onboarding:promo_selection_desc')} <span className="font-bold text-violet-700">100,000 VNDC</span></p>
                            <p className="text-center tracking-[-0.01em]" style={{ fontWeight: 500 }}>{t('onboarding:promo_selection_desc')} <span className="font-bold text-violet-700">1,000,000 VNDC</span></p>
                        </div>
                    </div>
                );
            }
            case ONBOARDING_STEPS.ONBOARD_CASE_OPEN: {
                return (
                    <div className="flex flex-col items-center justify-center h-[640px]">
                        <button
                            type="button"
                            onClick={() => handleAnswer()}
                            className={`mb-[76px] relative group ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            disabled={isLoading}
                        >
                            <div className="w-[287px] h-[287px] bg-[#C0DEF9] rounded-full absolute top-0 left-0 z-0" />
                            <img src={`/images/onboarding/random-case-${selectedCase.color}.png`} width={280} height={280} className="z-50 transition duration-500 ease-in-out transform group-hover:-translate-y-1 group-hover:scale-110 mt-9" />
                        </button>
                        <p className="text-lg" style={{ fontWeight: 500 }}>{t('onboarding:clicK_to_open')}</p>
                    </div>
                );
            }
            case ONBOARDING_STEPS.ONBOARD_CASE_RECEIVE: {
                return (
                    <div className="flex flex-col items-center justify-center h-[640px]">
                        <img src={`/images/onboarding/${selectedCase.color}-${volume}.png`} width={280} height={280} className="mb-[25px] relative animate-bounceLow" />
                        <div className="w-full px-8 py-4 rounded-xl bg-[#F6F5FB] text-lg">
                            <p className="text-center tracking-[-0.01em]" style={{ fontWeight: 500 }}>{t('onboarding:promo_selection_congrat_1')}</p>
                            <p className="text-center tracking-[-0.01em] font-bold text-violet-700">{formatBalance(volume, 0)} VNDC</p>
                            <p className="text-center tracking-[-0.01em]" style={{ fontWeight: 500 }}>{t('onboarding:promo_selection_congrat_2')}</p>
                        </div>
                        <Link href="/markets">
                            <button type="button" className="bg-[#4021D0] rounded-md mt-[15px] px-10 py-[13px] w-full text-white font-bold">{t('onboarding:explore')}</button>
                        </Link>
                    </div>
                );
            }
            default:
                break;
        }
    };

    if (step === ONBOARDING_STEPS.NOTHING) return null;

    return (
        <div className="relative w-full h-full" style={{ background: "url('/images/bg/bg.png') no-repeat center", backgroundSize: 'cover' }}>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <div className="bg-white border border-[#EEF2FA] box-border px-8 rounded-[12px] w-[400px]">
                    {renderStep()}
                </div>
            </div>
            <div className="absolute bottom-7 left-0 w-full">
                <p className="text-[#E1E2ED] w-max mx-auto">©2021 Nami.io. All rights reserved</p>
            </div>
        </div>
    );
};

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...await serverSideTranslations(locale, ['common', 'onboarding']),
        },
    };
}

export default Onboarding;
