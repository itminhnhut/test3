import React, { useCallback, useEffect, useRef, useState } from 'react';
import Slider from 'components/trade/InputSlider';
import PopupModal from 'components/screens/NewReference/PopupModal';
import _ from 'lodash';
import FetchApi from 'utils/fetch-api';
import { API_NEW_REFERRAL_ADD_REF, API_NEW_REFERRAL_CHECK_REF } from 'redux/actions/apis';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';
import Modal from 'components/common/ReModal';
import { useMemo } from 'react';
import colors from 'styles/colors';
import { emitWebViewEvent } from 'redux/actions/utils';
import ModalV2 from 'components/common/V2/ModalV2';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import CheckBox from 'components/common/CheckBox';

// goodluck for who maintain this code
const AddNewRef = ({
    isShow = false,
    onClose,
    doRefresh,
    defaultRef,
    isDesktop
}) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const totalRate = 100;
    const [percent, setPercent] = useState(0);
    const onPercentChange = ({ x }) => {
        setPercent(x);
    };
    const [refCode, setRefCode] = useState('');
    const [error, setError] = useState('');
    const [note, setNote] = useState('');
    const [isDefault, setIsDefault] = useState(false);
    const handleInputRefCode = (e) => {
        const text = e?.target?.value;
        if (text.length > 8) return;
        setRefCode(text.toUpperCase());
    };
    const [resultData, setResultData] = useState({
        isSucess: false,
        message: ''

        // message: t('reference:referral.addref_success', { value: 'ACM' }),
        // isSucess: true
    });
    const handleInputNote = (e) => {
        const text = e?.target?.value;
        if (text.length > 30) return;
        console.log(text);
        setNote(text);
    };
    const handleCheckDefault = (e) => {
        setIsDefault(e.target.checked);
    };

    const doClose = () => {
        const elements = document.getElementsByTagName('input');
        elements[0].value = '';
        elements[1].value = '';
        onClose();
        setNote('');
        setRefCode('');
        setIsDefault(false);
        doRefresh();
    };

    const handleInput = (e, length) => {
        if (e.target.value.length > length) e.target.value = e.target.value.slice(0, length);
        e.target.value = e.target.value.toUpperCase();
        setError('');
    };

    const renderError = (error) => {
        switch (error) {
            case 'REFERRAL_CODE_EXISTED':
                return t('reference:referral.addref_error_3', { value: refCode });
            case 'CODE_EXISTED':
                return t('reference:referral.addref_error_2');
            case 'MIN_8':
                return t('reference:referral.addref_error_1');
            default:
                return language === 'vi' ? 'Đã có lỗi xảy ra, xin hãy liên hệ bộ phận hỗ trợ' : 'An error occurred, please contact support';
        }
    };

    const handleAddNewRef = useCallback(_.throttle(async () => {
        const {
            status,
            data
        } = await FetchApi({
            url: API_NEW_REFERRAL_ADD_REF,
            options: {
                method: 'POST'
            },
            params: {
                code: refCode,
                remunerationRate: percent,
                isDefault,
                note: note.length ? note : null
            }
        });
        if (status === 'ok') {
            setResultData({
                message: t('reference:referral.addref_success', { value: data.code ?? refCode }),
                isSucess: true
            });
            // doClose()
        } else {
            setResultData({
                message: renderError(status ?? ''),
                isSucess: false
            });
        }
    }, 1000), [refCode, percent, isDefault, note]);

    const checkRef = useCallback(_.debounce((refCode) => {
        FetchApi({
            url: API_NEW_REFERRAL_CHECK_REF,
            options: {
                method: 'GET'
            },
            params: {
                code: refCode
            }
        })
            .then(({ data }) => {
                if (!data) {
                    setError('');
                } else {
                    setError(renderError('CODE_EXISTED'));
                }
            });
    }, 200), []);

    const doCheckRef = useCallback((refCode) => {
        if (refCode.length === 8 && error.length) return setError('');
        if (refCode.length < 8 && refCode.length > 0) return setError(renderError('MIN_8'));
        if (refCode.length === 8) checkRef(refCode);
    }, []);

    const renderResult = useMemo(() => {
        if (!resultData.message.length) return null;
        const Icon = resultData.isSucess ? <SuccessIcon /> : <ErrorIcon />;
        const title = resultData.isSucess ? t('reference:referral.addref_success_title') : t('reference:referral.addref_error_title');

        return isDesktop ?
            <AlertModalV2
                isVisible
                onClose={onClose}
                title={title}
                type={resultData.isSucess ? 'success' : 'error'}
                textButton={resultData.isSucess ? t('common:confirm') : null}
                onConfirm={() => {
                    setResultData({
                        isSucess: false,
                        message: ''
                    });
                    resultData.isSucess && doClose();
                }}
                // containerClassName='!px-6 !py-8 top-[50%]'
            >
                <div className='text-txtSecondary dark:text-txtSecondary-dark'
                     dangerouslySetInnerHTML={{ __html: resultData.message }} />
                <div className='w-full flex justify-center text-teal font-medium mt-4 cursor-pointer'
                     onClick={() => window.fcWidget.open()}
                >
                    {language === 'vi' ? 'Liên hệ hỗ trợ' : 'Chat with support'}
                </div>
            </AlertModalV2>
            :
            <PopupModal
                isVisible={true}
                onBackdropCb={onClose}
                // useAboveAll
                isDesktop={isDesktop}
                useCenter={isDesktop}
                isMobile
                bgClassName='!z-[400]'
                containerClassName='!z-[401]'
            >
                <div className='w-full flex justify-center items-center flex-col text-center px-2'>
                    <div className='mt-6'>{Icon}</div>
                    <div className='text-gray-6 text-[20px] leading-8 font-semibold mt-6'>
                        {title}
                    </div>
                    <div className='text-sm font-medium mt-3 text-gray-7'>
                        <div dangerouslySetInnerHTML={{ __html: resultData.message }} />
                    </div>
                    {resultData.isSucess ?
                        null
                        :
                        <div className='w-full flex justify-center text-txtTextBtn font-semibold mt-6 cursor-pointer'
                             onClick={() => emitWebViewEvent('chat_with_support')}
                        >
                            {language === 'vi' ? 'Liên hệ hỗ trợ' : 'Chat with support'}
                        </div>
                    }
                </div>
            </PopupModal>;
    }, [resultData]);

    return (
        <>
            {renderResult}
            {isDesktop ? <ModalV2
                isVisible={isShow}
                onBackdropCb={onClose}
                className='w-[30rem]'
            >
                <div className={classNames('flex flex-col gap-4')}>
                    <div>
                        <p className='text-[22px] font-semibold mb-6 mt-4'>
                            {t('reference:referral.add_new_referral')}
                        </p>
                        <div className='mt-4 mb-2'>
                            <p className='text-sm text-txtSecondary dark:text-txtSecondary-dark mb-3'>{t('reference:referral.commission_rate')}</p>
                            <Slider axis='x' x={percent} xmax={totalRate} onChange={onPercentChange} />
                        </div>
                        <div
                            className='flex justify-between items-center text-sm text-txtSecondary dark:text-txtSecondary-dark'>
                            <span>
                                {t('reference:referral.you_get')}: {totalRate - percent}%
                            </span>
                            <span>
                                {t('reference:referral.friends_get')}: {percent}%
                            </span>
                        </div>
                    </div>
                    <div>
                        <p className='text-txtSecondary dark:text-txtSecondary-dark text-sm mb-2'>{t('reference:referral.addref_title')}</p>
                        <div
                            className={classNames('rounded px-3 h-12 flex justify-between items-center gap-4 bg-gray-10 dark:bg-dark-2', { 'border-red border-[1px]': error.length })}>
                            <div className='flex w-full justify-between items-center'>
                                <input id='refCode' className='w-full' maxLength={8}
                                       placeholder={t('reference:referral.ref_placeholder')}
                                       onChange={handleInputRefCode} value={refCode}
                                       onBlur={() => doCheckRef(refCode)}
                                       onInput={(e) => {
                                           handleInput(e, 8);
                                       }} />
                            </div>
                            <div className='w-10 text-txtSecondary dark:text-txtSecondary-dark'>
                                {refCode.length}/8
                            </div>
                        </div>
                        {error.length ? <div className='mt-1 text-red font-medium text-xs'>
                            {error}
                        </div> : null}
                    </div>
                    <div>
                        <p className='text-txtSecondary dark:text-txtSecondary-dark text-sm mb-2'>{t('reference:referral.note')}</p>
                        <div
                            className='rounded px-3 h-12 flex justify-between items-center gap-4 bg-gray-10 dark:bg-dark-2'>
                            <div className='w-full justify-between items-center flex'>
                                <input id='note' className='w-full' value={note} maxLength={30}
                                       onChange={handleInputNote} onInput={(e) => handleInput(e, 30)} />
                            </div>
                            <div className='w-10 text-txtSecondary dark:text-txtSecondary-dark'>
                                {note.length}/30
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center gap-2 text-xs font-medium'>
                        <CheckBox
                            boxContainerClassName='w-5 h-5'
                            label={t('reference:referral.set_default')}
                            onChange={() => setIsDefault(!isDefault)}
                            active={isDefault}
                        ></CheckBox>
                        {/* <input type="checkbox" className='rounded-sm h-4 w-4 font-medium' name="isDefault" /> */}
                    </div>
                    <div
                        className={classNames('w-full h-12 mt-8 bg-teal rounded-md text-white font-semibold text-sm leading-6 flex items-center justify-center cursor-pointer', { '!bg-gray-3': error.length || (refCode.length && refCode.length !== 8) })}
                        onClick={error.length || (refCode.length > 0 && refCode.length !== 8) ? null : () => handleAddNewRef()}
                    >
                        {t('reference:referral.addref')}
                    </div>
                </div>
            </ModalV2> : <PopupModal
                isVisible={isShow}
                onBackdropCb={onClose}
                title={isDesktop ? t('reference:referral.add_new_referral') : null}
                useAboveAll
                isDesktop={isDesktop}
                useCenter={isDesktop}
                contentClassname={isDesktop ? '!rounded !w-[390px] !px-0' : undefined}
                isMobile
            >
                <div
                    className={classNames('font-normal text-xs leading-4 text-gray-7 flex flex-col gap-4', { 'px-4': isDesktop })}>
                    <div>
                        {isDesktop ? null : <div className='font-semibold text-[18px] text-gray-6 mb-8'>
                            {t('reference:referral.add_new_referral')}
                        </div>}
                        {t('reference:referral.commission_rate')}
                        <div className='mt-4 mb-2'>
                            <Slider axis='x' x={percent} xmax={totalRate} onChange={onPercentChange}
                                    bgColorSlide={colors.teal} bgColorActive={colors.teal}
                                    BgColorLine={colors.hover.DEFAULT} bgColorDot={colors.hover.DEFAULT} />
                        </div>
                        <div className='flex justify-between items-center font-medium text-xs leading-5'>
                            <div>
                                {t('reference:referral.you_get')} {totalRate - percent}%
                            </div>
                            <div>
                                {t('reference:referral.friends_get')} {percent}%
                            </div>
                        </div>
                    </div>
                    <div>
                        {t('reference:referral.addref_title')}
                        <div
                            className={classNames('mt-1 rounded-[6px] px-3 h-11 flex justify-between items-center bg-hover-dark font-medium text-sm leading-6 gap-4', { 'border-red border-[1px]': error.length })}>
                            <div className='flex w-full justify-between items-center'>
                                <input id='refCode' className='text-gray-6 font-medium w-full' maxLength={8}
                                       placeholder={t('reference:referral.ref_placeholder')}
                                       onChange={handleInputRefCode} value={refCode}
                                       onBlur={() => doCheckRef(refCode)}
                                       onInput={(e) => {
                                           handleInput(e, 8);
                                       }}
                                       style={{
                                           outline: 'none'
                                       }}
                                />
                                {refCode.length ? <svg width='20' height='20' viewBox='0 0 24 24' fill='none'
                                                       xmlns='http://www.w3.org/2000/svg'
                                                       onClick={() => {
                                                           setRefCode('');
                                                           setError('');
                                                           document.getElementById('refCode')
                                                               .focus();
                                                       }}
                                >
                                    <path d='m6 6 12 12M6 18 18 6' stroke='#718096' strokeLinecap='round'
                                          strokeLinejoin='round' />
                                </svg> : null}
                            </div>
                            <div className='w-10'>
                                {refCode.length}/8
                            </div>
                        </div>
                        {error.length ? <div className='mt-1 text-red font-medium text-xs'>
                            {error}
                        </div> : null}
                    </div>
                    <div>
                        {t('reference:referral.note')}
                        <div
                            className='mt-1 rounded-[6px] px-3 h-11 flex justify-between items-center bg-hover-dark font-medium text-sm leading-6 gap-4'>
                            <div className='w-full justify-between items-center flex'>
                                <input id='note' className='text-gray-6 font-medium w-full' value={note} maxLength={30}
                                       onChange={handleInputNote} onInput={(e) => handleInput(e, 30)} />
                                {note.length ? <svg width='20' height='20' viewBox='0 0 24 24' fill='none'
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    onClick={() => {
                                                        setNote('');
                                                        document.getElementById('note')
                                                            .focus();
                                                    }}
                                                    style={{
                                                        outline: 'none'
                                                    }}
                                >
                                    <path d='m6 6 12 12M6 18 18 6' stroke='#718096' stroke-linecap='round'
                                          stroke-linejoin='round' />
                                </svg> : null}
                            </div>
                            <div className='w-10'>
                                {note.length}/30
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center gap-2 text-xs font-medium'>
                        <input type='checkbox' id='setdefault123'
                               className='bg-teal rounded-sm h-4 w-4 text-darkBlue font-medium' name='isDefault'
                               onChange={handleCheckDefault} checked={isDefault}
                               style={{
                                   outline: 'none'
                               }}
                        />
                        {t('reference:referral.set_default')}
                    </div>
                    <div
                        className={classNames('w-full h-11 mt-4 bg-teal rounded-md text-white font-semibold text-sm leading-6 flex items-center justify-center cursor-pointer', { '!bg-hover-dark !text-[#3e4351]': error.length || (refCode.length && refCode.length !== 8) })}
                        onClick={error.length || (refCode.length > 0 && refCode.length !== 8) ? null : () => handleAddNewRef()}
                    >
                        {t('reference:referral.addref')}
                    </div>
                </div>
            </PopupModal>}
        </>
    );
};

export const SuccessIcon = ({ color = '#47CC85' }) => (
    <svg width='80' height='80' viewBox='0 0 80 80' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path
            d='M40 6.667C21.6 6.667 6.665 21.6 6.665 40s14.933 33.333 33.333 33.333S73.333 58.4 73.333 40 58.399 6.667 39.999 6.667zm-6.667 50L16.666 40l4.7-4.7 11.967 11.933 25.3-25.3 4.7 4.734-30 30z'
            fill={color} />
    </svg>
);

export const ErrorIcon = () => {
    return (
        <svg width='80' height='80' viewBox='0 0 80 80' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
                d='M40 6.667C21.62 6.667 6.667 21.62 6.667 40S21.62 73.333 40 73.333 73.333 58.38 73.333 40 58.38 6.667 40 6.667zM54.023 49.31l-4.713 4.713-9.31-9.31-9.31 9.31-4.713-4.713 9.31-9.31-9.31-9.31 4.713-4.713 9.31 9.31 9.31-9.31 4.713 4.713-9.31 9.31 9.31 9.31z'
                fill='#F93636' />
        </svg>
    );
};

export default AddNewRef;
