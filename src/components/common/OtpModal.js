import useWindowSize from 'hooks/useWindowSize'
import classNames from 'classnames'
import OtpInput from 'react-otp-input'
import Modal from './ReModal'
import ModalV2 from 'components/common/V2/ModalV2'
import Button from 'components/common/V2/ButtonV2/Button'

import { BREAK_POINTS } from 'constants/constants'
import { getLoginUrl } from 'redux/actions/utils'
import { Check, X } from 'react-feather'
import Copy from 'components/svg/Copy'
import colors from 'styles/colors'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'

const OtpModal = ({
    isVisible,
    label,
    value,
    onChange,
    placeholder = '',
    numberOnly = true,
    otpLength = 6,
    renderUpper,
    renderLower,
    className,
}) => {
    const { t } = useTranslation()
    const [copied, setCopied] = useState(false)
    const doPaste = async () => {
        const data = await navigator.clipboard.readText()
        onChange(data.replace(/\D/g,'').slice(0, 6))
        setCopied(true)
        setTimeout(() => setCopied(false), 1000)
    }

    return (
        <ModalV2
            isVisible={isVisible}
            containerClassName={classNames(
                'p-[32px] !translate-y-0 sm:min-w-[0px] !bg-[#000]',
                className
            )}
            className='!max-w-[488px]'
            customHeader={() =>
                <div className='flex items-end justify-end h-12 sticky top-0 z-10  pb-6 sm:pb-2 text-gray-4 bg-dark'>
                    <a href={getLoginUrl('sso', 'login')}>
                        <X size={24} className="cursor-pointer" />
                    </a>
                </div>
            }
            canBlur
            onBackdropCb={() => window?.location?.assign(getLoginUrl('sso', 'login'))}
        >
            <div className={classNames({ 'mb-4 text-gray-4 font-semibold text-[22px] leading-[30px] mt-6': !!renderUpper })}>
                {typeof renderUpper === 'function'
                    ? renderUpper()
                    : renderUpper}
            </div>
            {label && <div className='text-darkBlue-5 font-normal text-base max-w-lg'>{label}</div>}
            <OtpInput
                value={value}
                onChange={(otp) => onChange(otp)}
                numInputs={otpLength}
                placeholder={placeholder.repeat(otpLength)}
                isInputNum={numberOnly}
                containerStyle='mt-4 w-full justify-between'
                inputStyle='!h-[64px] !w-[64px] text-gray-4 font-semibold text-[22px] border border-divider-dark rounded-[4px] bg-dark-2 focus:!border-teal'
            />
            <div className='flex w-full justify-between items-center'>
                <div className={classNames({ 'mt-4': !!renderLower })}>
                    {typeof renderLower === 'function'
                        ? renderLower()
                        : renderLower}
                </div>
                <div className='w-full flex justify-end items-center space-x-2 mt-7 cursor-pointer'
                    onClick={async () => await doPaste()}
                >
                    {copied ? <Check size={16} color={colors.teal} />  :<Copy color={colors.teal} />}
                    <div className='text-teal font-semibold text-base'>
                        {t('common:paste')}
                    </div>
                </div>
            </div>
            <div className='mt-10'>
                <Button
                    disabled
                    loading={value?.length >= 6}
                >
                    {t('common:confirm')}
                </Button>
            </div>
        </ModalV2>
    )
}

export default OtpModal
