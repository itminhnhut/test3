import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ChevronLeft } from 'react-feather';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import sub from 'date-fns/sub';
import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import { IconCircle, IconLoading } from 'components/common/Icons';
import { iconColor500 } from 'config/colors';
import fetchAPI from 'utils/fetch-api';
import { ApiStatus, KYC_STATUS } from 'src/redux/actions/const';
import SelectFormik from 'src/components/common/input/SelectFormik';
import { useTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
    getKycCountry,
    getKycData,
    setKycBankInfo,
    setKycInformation,
    submitKyc,
} from 'src/redux/actions/user';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import VerificationSelector from 'src/redux/selectors/verificationSelectors';
import AuthSelector from 'src/redux/selectors/authSelectors';
import { FormLoader, TextLoader } from 'src/components/loader/VerificationLoader';
import showNotification from 'src/utils/notificationService';
import find from 'lodash/find';
import * as Error from 'src/redux/actions/apiError';
import { QRCode } from 'react-qrcode-logo';
import MyPage from '../my';

const MyVerification = () => {
    const { t } = useTranslation(['verification', 'common']);

    const documentTypes = [
        { label: t('kyc_type_id'), value: 'IDENTITY_CARD' },
        { label: t('kyc_type_passport'), value: 'PASSPORT' },
    ];

    const [country, setCountry] = useState({});
    const [countryList, setCountryList] = useState([]);
    const [documentType, setDocumentType] = useState(documentTypes[0]);
    const [selectedBankCode, setSelectedBankCode] = useState('');
    const [banks, setBanks] = useState([]);
    const [startDate, setStartDate] = useState(sub(new Date(), { years: 18 }));
    const [loadingBanks, setLoadingBanks] = useState(false);
    const [step, setStep] = useState(1);
    const [image, setImage] = useState({
        previewIdFront: '',
        previewIdBack: '',
        previewSelfie: '',
        loading: {
            idFront: false,
            idBack: false,
            selfie: false,
            passport: false,
        },
    });
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    const isAuth = useSelector(AuthSelector.isAuthSelector);
    const countries = useSelector(VerificationSelector.countrySelector);

    const isLoadingCountries = useSelector(VerificationSelector.countryLoadingSelector);
    const isLoadingKycInfo = useSelector(VerificationSelector.userKycIsLoadingSelector);
    const kycDocumentData = useSelector(VerificationSelector.userKycDocumentDataSelector);
    const kycInformationData = useSelector(VerificationSelector.userKycInformationDataSelector);
    const kycBankData = useSelector(VerificationSelector.userKycBankDataSelector);
    const kycStatus = useSelector(AuthSelector.userKycStatusSelector);
    // const isError = useSelector(VerificationSelector.userKycErrorSelector);

    const borderInputError = {
        border: '1px solid #E95F67',
    };

    const getBanks = async () => {
        setLoadingBanks(true);
        const {
            data,
            status,
        } = await fetchAPI({
            url: '/api/v1/deposit/available_banks',
            options: {
                method: 'GET',
            },
        });
        if (status === ApiStatus.SUCCESS) {
            setBanks(data);
            setLoadingBanks(false);
        }
    };

    useEffect(() => {
        getBanks();
        dispatch(getKycCountry());
    }, []);

    useEffect(() => {
        if (countries && countries.length > 0) {
            setCountryList(countries);
            if (!kycInformationData?.countryCode) {
                setCountry(countries.filter(option => option?.code === 'vn')?.[0] || countries?.[0]);
            }
        }
    }, [countries, kycInformationData]);

    // useEffect(() => {
    //     if (countries && countries.length > 0) {
    //         setCountryList(countries);
    //         setCountry(countries.filter(option => option?.code === 'vn')?.[0] || countries?.[0]);
    //     }
    // }, [countries]);

    useEffect(() => {
        dispatch(getKycData());
    }, [step]);

    const renderErrorNotification = (errorCode) => {
        const error = find(Error, { code: errorCode });
        const description = error
            ? t(`error:${error.message}`)
            : t('error:COMMON_ERROR');
        return showNotification({ message: `(${errorCode}) ${description}`, title: t('common:failure'), type: 'failure' });
    };

    const handleSubmit = async (data) => {
        const {
            countryCode,
            identityType,
            identityNumber,
            identityName,
            identityDateOfBirth,
            address,
            zipCode,
            city,
            accountNumber,
            bankCode,
        } = data;

        let finalData;

        switch (step) {
            case 1: {
                finalData = {
                    countryCode,
                    identityType,
                    identityNumber,
                    identityName,
                    identityDateOfBirth,
                    address,
                    zipCode: countryCode !== 'vn' ? zipCode : '',
                    city,
                };
                await setIsLoading(true);
                const errorCode = await dispatch(setKycInformation(finalData));
                setIsLoading(false);
                if (errorCode) {
                    return renderErrorNotification(errorCode);
                }
                if (countryCode === 'vn') {
                    return setStep(step + 1);
                }
                if (countryCode !== 'vn') {
                    return setStep(step + 2);
                }
                return null;
            }
            case 2: {
                finalData = {
                    accountNumber,
                    bankCode,
                };
                await setIsLoading(true);
                const errorCode = await dispatch(setKycBankInfo(finalData));
                setIsLoading(false);
                if (errorCode) {
                    return renderErrorNotification(errorCode);
                }
                return setStep(step + 1);
            }
            case 3: {
                await setIsLoading(true);
                const errorCode = await dispatch(submitKyc());
                setIsLoading(false);
                if (errorCode) {
                    renderErrorNotification(errorCode);
                }
                return setStep(step + 1);
            }
            default: {
                return null;
            }
        }
    };

    const handleChangeSelect = ({ value, type }) => {
        if (type === 'countryCode') return setCountry(value);
        if (type === 'identityType') return setDocumentType(value);
        if (type === 'bankCode') return setSelectedBankCode(value.bank_code);
    };

    const validate = values => {
        const errors = {};
        switch (step) {
            case 1: {
                if (!values.identityName) {
                    errors.identityName = t('kyc_error_full_name');
                }

                if (!values.identityNumber) {
                    errors.identityNumber = t('kyc_error_id');
                }

                if (!values.address) {
                    errors.address = t('kyc_error_address');
                }

                if (!values.zipCode && country?.code !== 'vn') {
                    errors.zipCode = t('kyc_error_postcode');
                }

                if (!values.city) {
                    errors.city = t('kyc_error_city');
                }
                return errors;
            }
            case 2: {
                if (!values.accountNumber) {
                    errors.accountNumber = t('kyc_error_account_number');
                }
                return errors;
            }
            default:
                return null;
        }
    };

    const formik = useFormik({
        initialValues: {
            countryCode: '',
            identityType: '',
            identityNumber: '',
            identityName: '',
            identityDateOfBirth: '',
            address: '',
            zipCode: '',
            city: '',
            accountNumber: '',
            bankCode: '',
        },
        validate,
        onSubmit: (values) => {
            handleSubmit(values);
        },
        validateOnChange: false,
    });

    useEffect(() => {
        if (kycDocumentData && (step === 3)) {
            setImage({
                ...image,
                previewIdFront: kycDocumentData?.front,
                previewIdBack: kycDocumentData?.back,
                previewSelfie: kycDocumentData?.portfolio,
                loading: {
                    idFront: false,
                    idBack: false,
                    selfie: false,
                    passport: false,
                },
            });
        }
        if (kycBankData && kycBankData?.accountNumber && kycBankData?.bankCode && (step === 2)) {
            setSelectedBankCode(kycBankData?.bankCode);
            formik.setValues({
                ...formik.values,
                accountNumber: kycBankData?.accountNumber,
                bankCode: kycBankData?.bankCode,
            });
        }
        if (kycInformationData && (step === 1)) {
            setDocumentType(documentTypes.filter(type => type.value === kycInformationData?.identityType)[0] || documentTypes[0]);
            let dateParts;
            if (kycInformationData?.identityDateOfBirth) {
                dateParts = kycInformationData?.identityDateOfBirth.split('-');
            }
            if (dateParts) {
                const dateReformatted = new Date(dateParts[1] + '/' + dateParts[0] + '/' + dateParts[2]);
                setStartDate(dateReformatted);
            }
            formik.setValues({
                ...formik.values,
                countryCode: kycInformationData?.countryCode,
                address: kycInformationData?.address,
                identityNumber: kycInformationData?.identityNumber || '',
                identityType: kycInformationData?.identityType,
                identityDateOfBirth: format(startDate, 'dd-MM-yyyy'),
                identityName: kycInformationData?.identityName,
                city: kycInformationData?.city,
                zipCode: kycInformationData?.zipCode,
            });
        }
    }, [kycDocumentData, kycInformationData, kycBankData, step]);

    useEffect(() => {
        formik.setValues({
            ...formik.values,
            countryCode: country?.code || kycInformationData?.countryCode || '',
            identityType: documentType?.value || '',
            identityDateOfBirth: format(startDate, 'dd-MM-yyyy'),
            bankCode: selectedBankCode || '',
        });
    }, [country, documentType, startDate, selectedBankCode]);

    useEffect(() => {
        if (
            kycStatus === KYC_STATUS.PENDING_APPROVAL
            || kycStatus === KYC_STATUS.APPROVED_PENDING_APPROVAL_ADVANCE
            || kycStatus === KYC_STATUS.PENDING_APPROVAL_ADVANCE
        ) setStep(4);
        if (kycStatus === KYC_STATUS.APPROVED) setStep(3);
    }, [kycStatus]);

    if (isAuth) {
        if (kycStatus === KYC_STATUS.NO_KYC || kycStatus === KYC_STATUS.APPROVED) {
            return (
                <MyPage>
                    {step !== 4 ? (
                        <div className="grid md:grid-cols-9 mb-10">
                            <div
                                className="md:col-span-4 p-5 md:px-14 md:py-10 bg-verification-left min-h-[calc(100vh-6rem)] flex flex-col"
                            >
                                <div className="text-2xl font-semibold letter-spacing-02 mb-10">
                                    {t('kyc_title')}
                                </div>
                                <div className="flex-grow">
                                    <div
                                        className={`flex items-center font-semibold mb-5 ${step === 1 ? 'text-violet' : 'text-black-500'}`}
                                    >
                                        <IconCircle />
                                        <span className="ml-2">
                                            {t('kyc_step_1')}
                                        </span>
                                    </div>
                                    <div
                                        className={`flex items-center font-semibold mb-5 ${step === 2 ? 'text-violet' : 'text-black-500'}`}
                                    >
                                        <IconCircle />
                                        <span className="ml-2">
                                            {t('kyc_step_2')}
                                        </span>
                                    </div>
                                    <div
                                        className={`flex items-center font-semibold mb-5 ${step === 3 ? 'text-violet' : 'text-black-500'}`}
                                    >
                                        <IconCircle />
                                        <span className="ml-2">
                                            {t('kyc_step_3')}
                                        </span>
                                    </div>
                                    {
                                        step === 3 ? (
                                            <>
                                                <div className="text-sm font-medium mb-2">
                                                    {t('kyc_note_title')}
                                                </div>
                                                <ul className="text-xs text-black-600 list-disc list-inside	mb-2.5">
                                                    <li>{t('kyc_note_1')}</li>
                                                    <li>{t('kyc_note_2')}</li>
                                                    <li>{t('kyc_note_3')}</li>
                                                    <li>{t('kyc_note_4')}</li>
                                                </ul>
                                                <div className="text-xs text-black-600">
                                                    {t('kyc_note_5')}
                                                </div>
                                            </>
                                        ) : null
                                    }
                                </div>
                                <Image src="/images/verification/bg-verification.svg" width={320} height={320} />
                            </div>
                            <div className="md:col-span-5 md:px-14 md:py-10 py-5 bg-verification-right text-black-700 ">
                                {
                                    step === 1 ? (
                                        <form onSubmit={(e) => { e.preventDefault(); formik.handleSubmit(e); }}>
                                            <div className="form-section mb-6">
                                                <div className="form-group">
                                                    <label htmlFor="countryCode">
                                                        {t('kyc_type_nationality')}
                                                    </label>
                                                    <SelectFormik
                                                        options={countryList.map(e => ({ ...e, label: e.name }))}
                                                        onChange={(value) => handleChangeSelect({ value, type: 'countryCode' })}
                                                        loading={isLoadingCountries}
                                                        id="countryCode"
                                                        name="countryCode"
                                                        initValue={countryList.filter(co => co.code === formik.values.countryCode)?.[0]}
                                                        type="country"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="identityType">
                                                        {t('kyc_type_paper')}
                                                    </label>
                                                    <SelectFormik
                                                        options={documentTypes}
                                                        onChange={(value) => handleChangeSelect({ value, type: 'identityType' })}
                                                        loading={false}
                                                        initValue={documentType}
                                                        id="identityType"
                                                        name="identityType"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="identityNumber">
                                                        {t('kyc_type_id_number')}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        style={formik.errors.identityNumber && borderInputError}
                                                        onChange={formik.handleChange}
                                                        value={formik.values.identityNumber}
                                                        id="identityNumber"
                                                        name="identityNumber"
                                                    />
                                                    {
                                                        formik.errors.identityNumber &&
                                                        <p className="text-xs text-red mt-1">{formik.errors.identityNumber}</p>
                                                    }
                                                </div>
                                            </div>
                                            <div className="form-section mb-6">
                                                <div className="form-section-title">
                                                    {t('kyc_type_personal_title')}
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="identityName">
                                                        {t('kyc_type_personal_full_name')}
                                                    </label>
                                                    <input
                                                        id="identityName"
                                                        name="identityName"
                                                        type="text"
                                                        style={formik.errors.identityName && borderInputError}
                                                        className="form-control"
                                                        onChange={formik.handleChange}
                                                        value={formik.values.identityName}
                                                    />
                                                    {
                                                        formik.errors.identityName &&
                                                        <p className="text-xs text-red mt-1">{formik.errors.identityName}</p>
                                                    }
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="">
                                                        {t('kyc_type_personal_dob')}
                                                    </label>
                                                    <DateTimePicker
                                                        className="form-control w-full"
                                                        onChange={date => setStartDate(date)}
                                                        value={startDate}
                                                        format="dd/MM/yyyy"
                                                        clearIcon={null}
                                                        calendarIcon={null}
                                                        maxDate={sub(new Date(), { years: 18 })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-section">
                                                <div className="form-section-title">{t('kyc_type_personal_address_title')}</div>
                                                <div className="form-group">
                                                    <label htmlFor="address">{t('kyc_type_personal_address')}</label>
                                                    <input
                                                        id="address"
                                                        name="address"
                                                        type="text"
                                                        style={formik.errors.address && borderInputError}
                                                        className="form-control"
                                                        onChange={formik.handleChange}
                                                        value={formik.values.address}
                                                    />
                                                    {
                                                        formik.errors.address &&
                                                        <p className="text-xs text-red mt-1">{formik.errors.address}</p>
                                                    }
                                                </div>
                                                <div className={country?.code === 'vn' ? 'grid grid-cols-1' : 'grid grid-cols-2 gap-x-2'}>
                                                    {country?.code === 'vn' ? null : (
                                                        <div className="form-group">
                                                            <label htmlFor="zipCode">{t('kyc_type_personal_postcode')}</label>
                                                            <input
                                                                id="zipCode"
                                                                name="zipCode"
                                                                type="text"
                                                                style={formik.errors.zipCode && borderInputError}
                                                                className="form-control"
                                                                onChange={formik.handleChange}
                                                                value={formik.values.zipCode}
                                                            />
                                                            {
                                                                formik.errors.zipCode &&
                                                                <p className="text-xs text-red mt-1">{formik.errors.zipCode}</p>
                                                            }
                                                        </div>
                                                    )}
                                                    <div className="form-group">
                                                        <label htmlFor="city">{t('kyc_type_personal_city')}</label>
                                                        <input
                                                            id="city"
                                                            name="city"
                                                            type="text"
                                                            className="form-control"
                                                            style={formik.errors.city && borderInputError}
                                                            onChange={formik.handleChange}
                                                            value={formik.values.city}
                                                        />
                                                        {
                                                            formik.errors.city &&
                                                            <p className="text-xs text-red mt-1">{formik.errors.city}</p>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-5">
                                                <button type="submit" disabled={isLoading} className={`${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'} btn btn-primary w-full flex flex-row items-center justify-center`}>
                                                    { isLoading && <IconLoading color="#FFFFFF" />} <span className="ml-2">{t('kyc_continue')}</span>
                                                </button>
                                            </div>
                                        </form>
                                    ) : null
                                }
                                {
                                    step === 2 ? (
                                        <form onSubmit={(e) => { e.preventDefault(); formik.handleSubmit(e); }}>
                                            <div
                                                className="flex items-center cursor-pointer mb-6"
                                                onClick={() => {
                                                    setStep(1);
                                                }}
                                            >
                                                <button className="btn btn-icon -ml-1 mr-4 !p-0" type="button">
                                                    <ChevronLeft color={iconColor500} size={20} />
                                                </button>
                                                <span className="text-black-500 text-sm">
                                                    {t('kyc_back')}
                                                </span>
                                            </div>
                                            <div className="form-note text-violet text-sm mb-6">
                                                {t('kyc_note_6')}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="accountNumber">
                                                    {t('kyc_bank_info_number')}
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    onChange={formik.handleChange}
                                                    id="accountNumber"
                                                    name="accountNumber"
                                                    style={formik.errors.accountNumber && borderInputError}
                                                    value={formik.values.accountNumber}
                                                />
                                                {
                                                    formik.errors.accountNumber &&
                                                    <p className="text-xs text-red mt-1">{formik.errors.accountNumber}</p>
                                                }
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="">{t('kyc_bank_info_name')}</label>
                                                <SelectFormik
                                                    options={banks.map(e => ({ ...e, label: e.bank_name }))}
                                                    onChange={(value) => handleChangeSelect({ value, type: 'bankCode' })}
                                                    loading={loadingBanks}
                                                    id="bankCode"
                                                    name="bankCode"
                                                    initValue={banks.filter(bank => bank.bank_code === formik.values.bankCode).map(e => ({ ...e, label: e.bank_name }))?.[0]}
                                                />
                                            </div>
                                            <div className="mt-5">
                                                <button type="submit" disabled={isLoading} className={`${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'} btn btn-primary w-full flex flex-row items-center justify-center`}>
                                                    { isLoading && <IconLoading color="#FFFFFF" />} <span className="ml-2">{t('kyc_continue')}</span>
                                                </button>
                                            </div>
                                        </form>
                                    ) : null
                                }
                                {
                                    step === 3 ? (
                                        <div className="flex flex-col items-center justify-center w-full h-full lg:px-[50px]">
                                            <p className="text-xl text-center mb-[80px]" style={{ fontWeight: 500 }}>{t('kyc_app_title')}</p>
                                            <p className="text-base text-center mb-6" style={{ fontWeight: 500 }}>{t('kyc_app_desc')}</p>
                                            <a href="https://apps.apple.com/vn/app/attlas-exchange/id1565481713" target="_blank" rel="noopener noreferrer" className="bg-[#02083D] flex items-center justify-center rounded-md w-full min-w-[250px] max-w-[300px] h-[48px] text-white text-sm mb-2" rel="noreferrer">
                                                <img src="/images/verification/applestore.png" alt="apple" className="w-6 h-6 min-w-[24px] mr-2" /><span style={{ fontWeight: 500 }}>{t('kyc_app_ios')}</span>
                                            </a>
                                            <a href="https://play.google.com/store/apps/details?id=io.attlas" target="_blank" rel="noopener noreferrer" className="bg-[#4021D0] flex items-center justify-center rounded-md w-full min-w-[250px] max-w-[300px] h-[48px] text-white text-sm" rel="noreferrer">
                                                <img src="/images/verification/playstore.png" alt="google" className="w-6 h-6 min-w-[24px] mr-2" /><span style={{ fontWeight: 500 }}>{t('kyc_app_android')}</span>
                                            </a>
                                            <p className="my-8 text-sm text-[#242642]">{t('kyc_app_or')}</p>
                                            <QRCode
                                                value="https://app.attlas.io/web_kyc"
                                                size={160}
                                                ecLevel="L"
                                            />
                                            <p className="my-8 text-sm text-[#52535C]">{t('kyc_app_qr')}</p>
                                        </div>
                                    ) : null
                                }
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg p-10 flex items-center justify-center md:py-[150px]">
                            <div className="max-w-[370px] text-center">
                                <img src="/images/verification/pending.png" alt="" className="w-20 h-20 mx-auto mb-12" />
                                <div className="text-2xl mb-6 font-semibold">{t('kyc_pending_title')}</div>
                                <div className="text-sm text-black-500">
                                    {t('kyc_pending_message')}
                                </div>
                            </div>
                        </div>
                    )}
                </MyPage>
            );
        }
        if (kycStatus === KYC_STATUS.PENDING_APPROVAL || kycStatus === KYC_STATUS.APPROVED_PENDING_APPROVAL_ADVANCE || kycStatus === KYC_STATUS.PENDING_APPROVAL_ADVANCE) {
            return (
                <MyPage>
                    <div className="bg-white rounded-lg p-10 flex items-center justify-center md:py-[150px]">
                        <div className="max-w-[370px] text-center">
                            <img src="/images/verification/pending.png" alt="pending" className="w-20 h-20 mx-auto mb-12" />
                            <div className="text-2xl mb-6 font-semibold">{t('kyc_pending_title')}</div>
                            <div className="text-sm text-black-500">
                                {t('kyc_pending_message')}
                            </div>
                        </div>
                    </div>
                </MyPage>
            );
        }
        if (kycStatus === KYC_STATUS.ADVANCE_KYC) {
            return (
                <MyPage>
                    <div className="bg-white rounded-lg p-10 flex items-center justify-center md:py-[150px]">
                        <div className="max-w-[370px] text-center">
                            <img src="/images/verification/success.png" alt="pending" className="w-20 h-20 mx-auto mb-12" />
                            <div className="text-2xl mb-6 font-semibold">{t('kyc_approve_title')}</div>
                            <div className="text-sm text-black-500">
                                {t('kyc_approve_message')}
                            </div>
                        </div>
                    </div>
                </MyPage>
            );
        }
        return null;
    }

    if (isLoadingKycInfo) {
        return (
            <MyPage>
                <div className="grid md:grid-cols-9 mb-10">
                    <div
                        className="md:col-span-4 p-5 md:px-14 md:py-10 bg-verification-left min-h-[calc(100vh-6rem)] flex flex-col"
                    >
                        <div className="my-0 mx-auto h-full">
                            <TextLoader />
                        </div>
                    </div>
                    <div className="md:col-span-5 md:px-14 md:py-10 bg-verification-right text-black-700 ">
                        <div className="my-0 mx-auto h-full">
                            <FormLoader />
                        </div>
                    </div>
                </div>
            </MyPage>
        );
    }

    return null;
};

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...await serverSideTranslations(locale, ['common', 'navbar', 'footer', 'my', 'verification', 'error']),
        },
    };
}

export default React.memo(MyVerification);
