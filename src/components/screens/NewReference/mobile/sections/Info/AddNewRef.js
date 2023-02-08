import React, { useCallback, useEffect, useRef, useState } from 'react'
import Slider from 'components/trade/InputSlider'
import PopupModal from 'components/screens/NewReference/PopupModal'
import _ from 'lodash'
import FetchApi from 'utils/fetch-api';
import { API_NEW_REFERRAL_ADD_REF, API_NEW_REFERRAL_CHECK_REF } from 'redux/actions/apis';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';
import Modal from 'components/common/ReModal';
import { useMemo } from 'react';
import colors from 'styles/colors';

// goodluck for who maintain this code
const AddNewRef = ({ isShow = false, onClose, doRefresh, defaultRef, isDesktop }) => {
    const { t } = useTranslation()
    const totalRate = 100
    const [percent, setPercent] = useState(0)
    const onPercentChange = ({ x }) => {
        setPercent(x)
    }
    const [refCode, setRefCode] = useState('')
    const [error, setError] = useState('')
    const [note, setNote] = useState('')
    const [isDefault, setIsDefault] = useState(false)
    const handleInputRefCode = (e) => {
        const text = e?.target?.value
        if (text.length > 8) return
        setRefCode(text.toUpperCase())
    }
    const [resultData, setResultData] = useState({
        isSucess: false,
        message: ''
    })
    const handleInputNote = (e) => {
        const text = e?.target?.value
        if (text.length > 30) return
        setNote(text)
    }
    const handleCheckDefault = (e) => {
        setIsDefault(e.target.checked)
    }

    const doClose = () => {
        const elements = document.getElementsByTagName("input");
        elements[0].value = "";
        elements[1].value = "";
        onClose()
        setNote('')
        setRefCode('')
        setIsDefault(false)
        doRefresh()
    }

    const handleInput = (e, length) => {
        if (e.target.value.length > length) e.target.value = e.target.value.slice(0, length)
        e.target.value = e.target.value.toUpperCase()
        setError('')
    }

    const renderError = (error) => {
        switch (error) {
            case 'REFERRAL_CODE_EXISTED':
                return t('reference:referral.addref_error_3', { value: refCode })
            case 'CODE_EXISTED':
                return t('reference:referral.addref_error_2')
            case 'MIN_8':
                return t('reference:referral.addref_error_1')
            default:
                return 'Error'
        }
    }

    const handleAddNewRef = useCallback(_.throttle(async () => {
        const { status, data } = await FetchApi({
            url: API_NEW_REFERRAL_ADD_REF,
            options: {
                method: 'POST',
            },
            params: {
                code: refCode,
                remunerationRate: percent,
                isDefault
            }
        })
        if (status === 'ok') {
            setResultData({
                message: t('reference:referral.addref_success', { value: data.code ?? refCode }),
                isSucess: true
            })
            // doClose()
        } else {
            setResultData({
                message: renderError(status ?? ''),
                isSucess: false
            })
        }
    }, 1000), [refCode, percent, isDefault])

    const checkRef = useCallback(_.debounce((refCode) => {
        FetchApi({
            url: API_NEW_REFERRAL_CHECK_REF,
            options: {
                method: 'GET',
            },
            params: {
                code: refCode,
            }
        }).then(({ data }) => {
            if (!data) {
                setError('')
            } else {
                setError(renderError('CODE_EXISTED'))
            }
        })
    }, 200), [])


    const doCheckRef = useCallback((refCode) => {
        if (refCode.length === 8 && error.length) return setError('')
        if (refCode.length < 8 && refCode.length > 0) return setError(renderError('MIN_8'))
        if (refCode.length === 8) checkRef(refCode)
    }, [])

    const renderResult = useMemo(() => {
        if (!resultData.message.length) return null
        const Icon = resultData.isSucess ? <SuccessIcon /> : <ErrorIcon />
        const title = resultData.isSucess ? t('reference:referral.success') : t('reference:referral.error')
        return <PopupModal
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
                <div className='w-full h-11 flex justify-center items-center bg-teal text-white font-semibold text-sm rounded-md mt-8'
                    onClick={() => {
                        setResultData({
                            isSucess: false,
                            message: ''
                        })
                        resultData.isSucess && doClose()
                    }}
                >
                    {t('common:confirm')}
                </div>
            </div>
        </PopupModal>
    }, [resultData])

    return (
        <>
            {renderResult}
            <PopupModal
                isVisible={isShow}
                onBackdropCb={onClose}
                title={t('reference:referral.add_new_referral')}
                useAboveAll
                isDesktop={isDesktop}
                useCenter={isDesktop}
                contentClassname={isDesktop ? "!rounded !w-[390px] !px-0" : undefined}
                isMobile
            >
                <div className={classNames('font-normal text-xs leading-4 text-gray-7 flex flex-col gap-4', { 'px-4': isDesktop })}>
                    <div>
                        {t('reference:referral.commission_rate')}
                        <div className='mt-4 mb-2'>
                            <Slider axis='x' x={percent} xmax={totalRate} onChange={onPercentChange} bgColorSlide={colors.namiv2.green[1]} bgColorActive={colors.namiv2.green[1]} BgColorLine={colors.namiv2.black[2]} bgColorDot={colors.namiv2.black[2]} />
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
                        <div className={classNames('mt-1 rounded-[6px] px-3 h-11 flex justify-between items-center bg-hover-dark font-medium text-sm leading-6 gap-4', { 'border-red border-[1px]': error.length })}>
                            <div className='flex w-full justify-between items-center'>
                                <input id='refCode' className='text-gray-6 font-medium w-full' maxLength={8} placeholder={t('reference:referral.ref_placeholder')} onChange={handleInputRefCode} value={refCode}
                                    onBlur={() => doCheckRef(refCode)}
                                    onInput={(e) => {
                                        handleInput(e, 8)
                                    }}
                                    style={{
                                        outline: 'none'
                                    }}
                                />
                                {refCode.length ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                    onClick={() => {
                                        setRefCode('')
                                        setError('')
                                        document.getElementById("refCode").focus();
                                    }}
                                >
                                    <path d="m6 6 12 12M6 18 18 6" stroke='#718096' stroke-linecap="round" stroke-linejoin="round" />
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
                        <div className='mt-1 rounded-[6px] px-3 h-11 flex justify-between items-center bg-hover-dark font-medium text-sm leading-6 gap-4'>
                            <div className='w-full justify-between items-center flex'>
                                <input id='note' className='text-gray-6 font-medium w-full' value={note} maxLength={30} onChange={handleInputNote} onInput={(e) => handleInput(e, 30)} />
                                {note.length ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                                    onClick={() => {
                                        setNote('')
                                        document.getElementById("note").focus();
                                    }}
                                    style={{
                                        outline: 'none'
                                    }}
                                >
                                    <path d="m6 6 12 12M6 18 18 6" stroke='#718096' stroke-linecap="round" stroke-linejoin="round" />
                                </svg> : null}
                            </div>
                            <div className='w-10'>
                                {note.length}/30
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center gap-2 text-xs font-medium'>
                        <input type="checkbox" id="setdefault123" className='bg-teal rounded-sm h-4 w-4 text-darkBlue font-medium' name="isDefault" onChange={handleCheckDefault} checked={isDefault}
                            style={{
                                outline: 'none'
                            }}
                        />
                        {t('reference:referral.set_default')}
                    </div>
                    <div className={classNames('w-full h-11 mt-4 bg-teal rounded-md text-white font-semibold text-sm leading-6 flex items-center justify-center cursor-pointer', { '!bg-hover-dark !text-[#3e4351]': error.length || (refCode.length && refCode.length !== 8) })}
                        onClick={error.length || (refCode.length > 0 && refCode.length !== 8) ? null : () => handleAddNewRef()}
                    >
                        {t('reference:referral.addref')}
                    </div>
                </div>
            </PopupModal>
        </>
    )
}

const SuccessIcon = () => (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 6.667C21.6 6.667 6.665 21.6 6.665 40s14.933 33.333 33.333 33.333S73.333 58.4 73.333 40 58.399 6.667 39.999 6.667zm-6.667 50L16.666 40l4.7-4.7 11.967 11.933 25.3-25.3 4.7 4.734-30 30z" fill="#47CC85" />
    </svg>
)

export const ErrorIcon = () => {
    return (
        <svg width="66" height="66" viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#rvts3wdada)">
                <g clip-path="url(#deas3nvn3b)">
                    <path d="M33 63.459c16.822 0 30.458-13.637 30.458-30.459C63.458 16.18 49.822 2.542 33 2.542S2.54 16.179 2.54 33C2.541 49.822 16.178 63.46 33 63.46z" fill="#E5544B" />
                    <path d="M33 65.999c-8.455 0-16.91-3.217-23.346-9.652-12.872-12.871-12.872-33.819 0-46.693 12.871-12.869 33.821-12.871 46.692 0 12.872 12.874 12.872 33.819 0 46.693C49.91 62.781 41.453 65.999 33 65.999zM13.27 13.27c-10.877 10.88-10.877 28.582 0 39.46 10.881 10.877 28.584 10.88 39.46 0 10.877-10.878 10.877-28.58 0-39.46-10.881-10.876-28.581-10.876-39.46 0z" fill="#E5544B" />
                    <path d="M24.12 44.432a2.55 2.55 0 0 1-1.808-.75c-1-1-1-2.616 0-3.615l18.081-18.081c1-1 2.616-1 3.616 0s1 2.616 0 3.616l-18.08 18.08a2.555 2.555 0 0 1-1.808.75z" fill="#fff" />
                    <path d="M42.199 44.432a2.55 2.55 0 0 1-1.808-.75L22.31 25.603c-1-1-1-2.616 0-3.616s2.616-1 3.616 0l18.08 18.08c1 1 1 2.617 0 3.617a2.55 2.55 0 0 1-1.807.75z" fill="#fff" />
                </g>
            </g>
            <defs>
                <clipPath id="rvts3wdada">
                    <path fill="#fff" d="M0 0h66v66H0z" />
                </clipPath>
                <clipPath id="deas3nvn3b">
                    <path fill="#fff" d="M0 0h66v66H0z" />
                </clipPath>
            </defs>
        </svg>

    )
}

export default AddNewRef