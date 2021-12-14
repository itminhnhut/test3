import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { PulseLoader } from 'react-spinners'
import { SET_USER_AVATAR, USER_AVATAR_PRESET } from 'redux/actions/apis'
import { BREAK_POINTS } from 'constants/constants'
import { LANGUAGE_TAG } from 'hooks/useLanguage'
import { ApiStatus } from 'redux/actions/const'
import { isMobile } from 'react-device-detect'
import { Share } from 'react-feather'
import { getMe } from 'redux/actions/user'

import useWindowSize from 'hooks/useWindowSize'
import CheckSuccess from 'components/svg/CheckSuccess'
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import Dropzone from 'react-dropzone'
import Skeletor from 'components/common/Skeletor'
import ReModal, { REMODAL_BUTTON_GROUP, REMODAL_POSITION } from 'components/common/ReModal'
import colors from 'styles/colors'
import Axios from 'axios'

const INITIAL_STATE = {
    avatar: {},
    avatarIssues: null,
    uploading: false,
    uploadingPercent: 0,
    avatarPreset: null,
    loadingAvatarPreset: false,
    acceptedFiles: null,
    completeFlag: null,
    isAvatarUsed: false,

    //
}

const AvatarModal = ({ isVisible, onCloseModal }) => {
    // Init State
    const [state, set] = useState(INITIAL_STATE)
    const setState = state => set(prevState => ({ ...prevState, ...state }))

    // Rdx
    const user = useSelector(state => state.auth?.user)
    const dispatch = useDispatch()

    // Use hooks
    const { t, i18n: { language } } = useTranslation()
    const [currentTheme, ] = useDarkMode()
    const { width } = useWindowSize()

    // Data Helper
    const getAvatarPreset = async () => {
        !state.avatarPreset && setState({ loadingAvatarPreset: true })

        try {
            const { data: { status, data: avatarPreset } } = await Axios.get(USER_AVATAR_PRESET)
            if (status === ApiStatus.SUCCESS && avatarPreset) {
                setState({ avatarPreset })
            }
        } catch (e) {
            console.log(`Cant't get avatar preset`)
        } finally {
            setState({ loadingAvatarPreset: false })
        }
    }

    const setAvatarPreset = async (image) => {
        setState({ uploading: true })

        try {
            const { data } = await Axios.post(USER_AVATAR_PRESET, { image })
            if (data?.status === ApiStatus.SUCCESS) {
                await dispatch(getMe())
                setState({ completeFlag: data?.status })
            }
        } catch (e) {
            console.log(`Can't set preset avatar ${image} `, e)
        } finally {
            setTimeout(() => {
                setState({ uploading: false })
            }, UPLOAD_TIMEOUT)
        }
    }

    const setCustomAvatar = async (image) => {
        setState({ uploading: true })

        if (!(image || image?.length)) {
            console.log('namidev-DEBUG: Not found files')
            return
        }

        try {
            const formData = new FormData()
            formData.append('image', image[0])

            const { data } = await Axios.post(SET_USER_AVATAR, formData)

            if (data?.status === ApiStatus.SUCCESS) {
                await dispatch(getMe())
                setState({ completeFlag: data?.status })
            }
        } catch (e) {
            console.log(`Can't set custom avatar `, e)
        } finally {
            setTimeout(() => {
                setState({ uploading: false })
            }, UPLOAD_TIMEOUT)
        }
    }

    // Utilities
    const customAvatarTips = useMemo(() => {
        let text1, text2

        if (language === LANGUAGE_TAG.VI) {
            text1 = <>
                Kéo thả hình ảnh vào đây hoặc <span className="text-dominant">{isMobile ? 'chạm' : 'click'} để duyệt</span>
            </>
            text2 = <>
                Nhấn "Lưu" để cập nhật ảnh đại diện này hoặc "Đặt lại" để hoàn tác.
            </>
        } else {
            text1 = <>
                Drag your image here, or <span className="text-dominant">{isMobile ? 'touch' : 'click'} to browse</span>
            </>
            text2 = <>
                Press "Save" to use this avatar or "Reset" to undo.
            </>
        }

        return { text1, text2 }
    }, [language])

    const currentAvatarType = useMemo(() => {
        switch (state.avatar?.type) {
            case AVATAR_TYPE.PRESET:
                return `${t('profile:using_avatar_preset')} ${+state.avatar?.presetId + 1}`
            case AVATAR_TYPE.CUSTOM:
                return t('profile:set_custom_avatar')
            default:
                return t('profile:your_avatar')

    }
    }, [state.avatar?.type, state.avatar?.presetId])

    const buttonGroupStatus = useMemo(() => {
        let status = REMODAL_BUTTON_GROUP.SINGLE_CONFIRM

        if (state.avatar?.source === user?.avatar) {
            status = REMODAL_BUTTON_GROUP.ALERT
        }

        return status
    }, [state.avatar?.source])

    const setAvatar = (payload) => {

        if (payload?.type === AVATAR_TYPE.CUSTOM) {
            setCustomAvatar(payload?.raw)
        }

        if (payload?.type === AVATAR_TYPE.PRESET) {
            setAvatarPreset(payload?.source)
        }

        // Set default after change
        setState({ avatar: { source: user?.avatar, type: AVATAR_TYPE.CURRENT } })
    }

    const onSetCustomAvatar = () => setState({ avatar: { source: null, type: AVATAR_TYPE.CUSTOM } })

    const onClearAvatar = () => setState({ avatar: { source: user?.avatar, type: AVATAR_TYPE.CURRENT } })

    const onUsePresetAvatar = (index, url) => {
        setState({
                     avatar: {
                         [`${AVATAR_KEY}${index}`]: !state.avatar?.[`${AVATAR_KEY}${index}`],
                         presetId: index,
                         type: AVATAR_TYPE.PRESET,
                         source: url
                     }
                 })
    }

    const onDropCustomAvatar = (images) => {
        let file = images[0]
        const reader = new FileReader()

        // Set preview data
        reader.onload = (event) => setState({
            uploadedSrc: event?.target?.result ,
            avatar: {
                raw: images, // Init file to upload
                source: event?.target?.result,
                type: AVATAR_TYPE.CUSTOM
        }})
        reader.readAsDataURL(file)
    }

    const onValidatingAvatarSize = ({ size }) => {
        if (!size) return
        if (size > AVATAR_SIZE_LIMIT) {
            setState({ avatarIssues: t('common:uploader.not_over', { limit: `${AVATAR_SIZE_LIMIT / 10000} MB` }) })
        } else {
            setState({ avatarIssues: null })
        }
    }

    // Render handler
    const renderCurrentAvatar = useCallback(() => {
        const isCustom = state.avatar?.type === AVATAR_TYPE.CUSTOM
        const isCurrent = state.avatar?.type === AVATAR_TYPE.CURRENT
        const isPreset = state.avatar?.type === AVATAR_TYPE.PRESET

        return (
            <div className="mt-5 flex flex-col items-center justify-center">
                <div className="w-[132px] h-[132px] drop-shadow-common dark:drop-shadow-none dark:border-[2px] dark:border-dominant rounded-full overflow-hidden">
                    {state.uploading ?
                    <Skeletor circle width={132} height={132} />
                    : <img src={!isCurrent ? state.avatar?.source : user?.avatar} alt={null}/>}
                </div>
                {isCustom &&
                <div className="m-2 px-5 text-center text-xs sm:text-sm font-medium">
                    {customAvatarTips?.text2}
                </div>}
                <div className="mt-4 flex items-center justify-center">
                    {(isCurrent || isPreset) &&
                    <div className="py-2 px-3.5 min-w-[90px] sm:min-w-[100px] font-medium text-center text-xs sm:text-sm text-white bg-dominant hover:opacity-80 cursor-pointer select-none rounded-lg"
                         onClick={onSetCustomAvatar}>
                        {t('profile:set_custom_avatar')}
                    </div>}
                    {(isCustom || isPreset) && <div className="ml-3 py-2 px-3.5 min-w-[90px] sm:min-w-[100px] font-medium text-center text-xs sm:text-sm text-white bg-red hover:opacity-80 cursor-pointer select-none rounded-lg"
                        onClick={onClearAvatar}>
                        {t('common:reset')}
                    </div>}
                </div>
            </div>
        )
    }, [user?.avatar, state.avatar?.source, state.avatar?.type, state.uploading])

    const renderUploadAvatar = useCallback(() => {
        return (
            <Dropzone onDrop={onDropCustomAvatar}
                      validator={onValidatingAvatarSize}
                      maxFiles={1}
                      maxSize={AVATAR_SIZE_LIMIT}
                      multiple={false}
                      accept="image/jpeg, image/png"
            >
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <div className="mt-3 py-8 flex flex-col justify-center items-center rounded-xl border border-dashed border-dominant cursor-pointer">
                            <Share className="text-dominant"/>
                            <div className="mt-3.5 font-medium text-sm lg:text-[16px] xl:text-[18px]">
                                {customAvatarTips?.text1}
                            </div>
                            <div className="mt-2 text-xs lg:text-sm text-txtSecondary dark:text-txtSecondary-dark">
                                {t('common:support_type', { types: 'JPG, PNG' })}
                            </div>
                            {state.avatarIssues &&
                            <div className="mt-2.5 text-xs sm:text-sm text-red">
                                {state.avatarIssues}
                            </div>}
                        </div>
                    </div>
                )}
            </Dropzone>
        )
    }, [state.uploading, state.uploadingPercent, state.avatarIssues, customAvatarTips, currentTheme])

    const renderAvatarPreset = useCallback(() => {
        if (!state.avatarPreset || state.loadingAvatarPreset) {
            const skeleton = []
            for (let i = 0; i < 12; ++i) {
                skeleton.push(
                    <div key={`avatar_list__${i}`} className="relative w-1/4 p-2 flex items-center justify-center">
                        <Skeletor circle className="!w-[58px] !h-[58px] sm:!w-[78px] sm:!h-[78px]" />
                    </div>
                )
            }
            return skeleton
        } else {
            return state.avatarPreset?.map((avt, index) => (
                <div key={`avatar_list__${index}`} className="relative w-1/4 p-2 cursor-pointer hover:opacity-80">
                    <img className={state.avatar?.[`${AVATAR_KEY}${index}`] ? 'rounded-full border border-dominant' : 'rounded-full border border-transparent'}
                         onClick={() => onUsePresetAvatar(index, avt)}
                         src={avt}
                         alt={null}/>
                    {avt === state.avatar?.source &&
                    <CheckSuccess className="absolute bottom-[12.5%] right-[12.5%]" size={width >= BREAK_POINTS.sm ? 16 : 14}/>}
                </div>
            ))
        }
    }, [state.avatar, state.avatarPreset, state.loadingAvatarPreset, width])

    const renderUploadControl = useCallback(() => {
        const DEFAULT = 'w-full font-medium rounded-xl bg-teal-lightTeal dark:bg-teal-opacity max-h-[0px] invisible opacity-0 transition-all duration-200 '
        let className

        if (state.uploading) {
            className = DEFAULT + 'mt-3.5 xl:mt-5 px-5 py-2.5 !visible !opacity-100 !max-h-[100px]'
        } else {
            className = DEFAULT
        }

        return (
            <div className={className}>
                <span className="text-sm flex items-end">
                    {t('common:uploader.uploading')}
                    <PulseLoader size={2.2} color={currentTheme === THEME_MODE.LIGHT ? colors.darkBlue : colors.grey1}/>
                </span>
                <div className="text-txtSecondary dark:text-txtSecondary-dark text-sm">
                    {state.uploadingPercent}% - {t('common:uploader.time_remain', { time: 0 })}
                </div>
                <div className="mt-1 relative w-full h-[2px] bg-gray-3 dark:bg-darkBlue-5">
                    <div style={{ width: `${state.uploadingPercent}%` }}
                         className="absolute transition-all duration-200 h-full left-0 top-0 bg-dominant"/>
                </div>
            </div>
        )
    }, [state.uploading, state.uploadingPercent, currentTheme])

    useEffect(() => {
        console.log('namidev-DEBUG: => ', state)
    }, [state])

    useEffect(() => {
        if (!isVisible) {
            setState({ avatar: {}, completeFlag: null })
        }
    }, [isVisible])

    useEffect(() => {
        if (isVisible && user?.avatar) {
            const selectedIndex = state.avatarPreset?.findIndex(o => o === user?.avatar)
            console.log('namidev-DEBUG: Selected Preset ', selectedIndex)
            if (selectedIndex >= 0) {
                setState({
                   avatar: {
                       type: AVATAR_TYPE.PRESET,
                       presetId: selectedIndex,
                       source: state.avatarPreset?.[selectedIndex],
                       [`${AVATAR_KEY}${selectedIndex}`]: true,
                   }})
            } else {
                setState({ avatar: { source: user?.avatar, type: AVATAR_TYPE.CURRENT } })
            }
        }
    }, [user, state.avatarPreset, isVisible])

    useEffect(() => {
        isVisible && getAvatarPreset()
    }, [isVisible])

    return (
        <ReModal useOverlay
                 useCrossButton
                 useButtonGroup={buttonGroupStatus}
                 buttonGroupWrapper="max-w-[350px] m-auto"
                 position={
                     width >= BREAK_POINTS.lg ?
                         REMODAL_POSITION.CENTER
                         : {
                             mode: REMODAL_POSITION.FULLSCREEN.MODE,
                             from: REMODAL_POSITION.FULLSCREEN.FROM.RIGHT
                         }
                 }
                 isVisible={!!isVisible}
                 className={width >= BREAK_POINTS.lg ? 'min-w-[979px]' : ''}
                 onNegativeCb={onCloseModal}
                 onBackdropCb={onCloseModal}
                 onPositiveCb={() => setAvatar(state.avatar)}
                 title={t('profile:set_avatar_title')}
                 positiveLabel={t('common:save')}
        >
            <div className="pt-5 h-full min-h-[540px] flex flex-col lg:flex-row">
                <div className="w-full lg:w-1/2">
                    <div className="font-medium text-center text-dominant text-sm lg:text-[16px] xl:text-[18px]">
                        {currentAvatarType}
                    </div>
                    {state.avatar?.source && renderCurrentAvatar()}
                    {state.avatar?.type === AVATAR_TYPE.CUSTOM && !state.avatar?.source && renderUploadAvatar()}
                    {renderUploadControl()}
                </div>
                <div className="mt-8 pb-5 w-full lg:w-1/2">
                    <div className="pb-3 font-medium text-center text-dominant text-sm lg:text-[16px] xl:text-[18px]">
                        {t('profile:nami_default_avatar')}
                    </div>
                    <div className="flex flex-wrap select-none">
                        {renderAvatarPreset()}
                    </div>
                </div>
            </div>
        </ReModal>
    )
}

const UPLOAD_TIMEOUT = 2000

const AVATAR_KEY = 'avatar_index_'

const AVATAR_SIZE_LIMIT = 20000

const AVATAR_TYPE = {
    CURRENT: 'current',
    CUSTOM: 'custom',
    PRESET: 'preset'
}

export default AvatarModal
