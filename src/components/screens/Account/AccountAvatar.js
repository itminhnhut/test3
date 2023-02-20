import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
    API_GET_USER_AVATAR_PRESET,
    SET_USER_AVATAR,
    USER_AVATAR_PRESET
} from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import { getMe } from 'redux/actions/user';

import Dropzone from 'react-dropzone';
import Axios from 'axios';
import ModalV2 from 'components/common/V2/ModalV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import styled from 'styled-components';
import Upload from 'components/svg/Upload';
import classnames from 'classnames';
import throttle from 'lodash/throttle';
import Edit from 'components/svg/Edit';
import Spinner from 'components/svg/Spinner';
import axios from 'axios';
import WarningCircle from 'components/svg/WarningCircle';
import toast from 'utils/toast';
import colors from 'styles/colors';
import { useWindowSize } from 'react-use';

const UPLOAD_TIMEOUT = 4000;

const AVATAR_SIZE_LIMIT = 2e6;

const AVATAR_TYPE = {
    CUSTOM: 'custom',
    PRESET: 'preset'
};

const UPLOADING_STATUS = {
    IDLE: 'idle',
    UPLOADING: 'uploading',
    DONE: 'done',
    FAILURE: 'failure'
};

const UploadAvatar = ({
    t,
    onDropCustomAvatar,
    className = ''
}) => {
    const [avatarIssues, setAvatarIssues] = useState('');

    const onValidatingAvatarSize = ({ size }) => {
        if (!size) return;
        if (size > AVATAR_SIZE_LIMIT) {
            setAvatarIssues(t('common:uploader.not_over', { limit: `${AVATAR_SIZE_LIMIT / 1e6} MB` }));
        } else {
            setAvatarIssues('');
        }
    };

    return <Dropzone onDrop={onDropCustomAvatar}
                     validator={onValidatingAvatarSize}
                     maxFiles={1}
                     maxSize={AVATAR_SIZE_LIMIT}
                     multiple={false}
                     accept='image/jpeg, image/png'
    >
        {({
            getRootProps,
            getInputProps
        }) => (
            <DashBorder {...getRootProps({
                className: 'w-full flex-1 flex flex-col items-center justify-center cursor-pointer text-center px-2 ' + className
            })}>
                <input {...getInputProps()} />
                <Upload size={32} />
                <p className='mt-2 text-sm font-semibold mb-1'>{t('profile:drag_image')}</p>
                <span
                    className='text-sm text-txtSecondary dark:text-txtSecondary-dark'>{t('profile:support_image_type')}</span>
                {
                    avatarIssues && <div className='flex items-center mt-2'>
                        <WarningCircle />
                        <span className='text-yellow-100 text-sm ml-2'>{avatarIssues}</span>
                    </div>
                }
            </DashBorder>
        )}
    </Dropzone>;
};

const AccountAvatar = ({
    currentAvatar
}) => {
    const [avatarSets, setAvatarSets] = useState([]);
    const [avatar, setAvatar] = useState();
    const [uploadStatus, setUploadStatus] = useState(UPLOADING_STATUS.IDLE);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [currentCategoryId, setCurrentCategoryId] = useState(1);

    const avatarRef = useRef();

    const dispatch = useDispatch();

    const {
        t,
        i18n: { language }
    } = useTranslation();

    const { width } = useWindowSize();
    const isMobile = width <= 768;

    const categories = useMemo(() => {
        return avatarSets.map(a => a.category);
    }, [avatarSets]);

    const setAvatarPreset = async (image) => {
        setUploadStatus(UPLOADING_STATUS.UPLOADING);

        try {
            const { data } = await Axios.post(USER_AVATAR_PRESET, { image });
            if (data?.status === ApiStatus.SUCCESS) {
                await dispatch(getMe());
                setTimeout(() => {
                    setUploadStatus(UPLOADING_STATUS.DONE);
                }, 1800);
            } else {
                setUploadStatus(UPLOADING_STATUS.FAILURE);
            }
        } catch (e) {
            setUploadStatus(UPLOADING_STATUS.FAILURE);
        }
    };

    const setCustomAvatar = async (image) => {
        setUploadStatus(UPLOADING_STATUS.UPLOADING);

        if (!(image || image?.length)) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append('image', image[0]);

            const { data } = await Axios.post(SET_USER_AVATAR, formData);

            if (data?.status === ApiStatus.SUCCESS) {
                await dispatch(getMe());
                setTimeout(() => {
                    setUploadStatus(UPLOADING_STATUS.DONE);
                }, 1800);
            } else {
                setUploadStatus(UPLOADING_STATUS.FAILURE);
            }
        } catch (e) {
            console.log(`Can't set custom avatar `, e);
            setUploadStatus(UPLOADING_STATUS.FAILURE);
        }
    };

    const onDropCustomAvatar = (images) => {
        if (!images || !images?.length) return;
        let file = images[0];
        const reader = new FileReader();

        // Set preview data
        reader.onload = (event) => {
            setAvatar({
                raw: images, // Init file to upload
                src: event?.target?.result,
                type: AVATAR_TYPE.CUSTOM
            });
            setOpenConfirmModal(true);
        };
        reader.readAsDataURL(file);
    };

    const reselect = () => {
        setOpenConfirmModal(false);
        setAvatar(null);
    };

    const cancelChangeAvatar = () => {
        setOpenConfirmModal(false);
        setOpenModal(false);
        setAvatar(null);
    };

    const onConfirm = () => {
        if (avatar?.type === AVATAR_TYPE.PRESET) setAvatarPreset(avatar.src);
        if (avatar?.type === AVATAR_TYPE.CUSTOM) setCustomAvatar(avatar.raw);
        setAvatar(null);
        setOpenConfirmModal(false);
        setOpenModal(false);
    };

    const scrollToCategory = (event, id) => {
        const element = document.getElementById(`category_${id}`);

        avatarRef.current?.scrollTo({
            top: element.offsetTop - 98,
            behavior: 'smooth'
        });
    };

    const scrollCategoryTab = (categoryId) => {
        const element = document.getElementById(`category_tab_${categoryId}`)
        if (!element) return;
        const targetWidth = element.getBoundingClientRect().width;

        element.parentElement.scrollTo({
            left: element.offsetLeft - targetWidth / 2,
            behavior: 'smooth'
        });
    }

    const onScroll = throttle((event) => {
        const { offsetHeight } = event.target;
        const headerHeight = 98;
        const mid = (offsetHeight + headerHeight) / 2;
        const parentTop = event.target.getBoundingClientRect().top;

        const category = categories.find(c => {
            const element = document.getElementById(`category_${c.id}`);
            const top = element.getBoundingClientRect().top - parentTop;
            return mid < top + element.offsetHeight && mid > top;
        });

        setCurrentCategoryId(category?.id);
    }, 200, {
        trailing: true
    });

    useEffect(() => {
        const {
            DONE,
            FAILURE,
            IDLE
        } = UPLOADING_STATUS;
        let timeoutId;
        if ([DONE, FAILURE].includes(uploadStatus)) {
            timeoutId = setTimeout(() => {
                setUploadStatus(IDLE);
            }, UPLOAD_TIMEOUT);

            const toastObj = {
                [DONE]: {
                    text: t('profile:change_avatar_success'),
                    type: 'success'
                },
                [FAILURE]: {
                    text: t('profile:change_avatar_failure'),
                    type: 'error'
                }
            }[uploadStatus];

            toast(toastObj);
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [uploadStatus]);

    useEffect(() => {
        axios.get(API_GET_USER_AVATAR_PRESET, {
            params: {
                skip: 0,
                limit: 999
            }
        })
            .then(({ data: res }) => {
                if (res.status === 'ok' && res.data) {
                    setAvatarSets(res.data);
                }
            });
    }, []);

    useEffect(() => {
        scrollCategoryTab(currentCategoryId)
    }, [currentCategoryId])


    return <>
        <div className='relative w-[6.5rem] h-[6.5rem] md:w-[8.75rem] md:h-[8.75rem] -mt-14'>
            <div className='w-full h-full rounded-full border-4 border-white dark:border-dark overflow-hidden'>
                {
                    uploadStatus === UPLOADING_STATUS.UPLOADING ?
                        <div
                            className='flex items-center justify-center bg-white dark:bg-darkBlue-3 w-full h-full rounded-full'>
                            <Spinner color={colors.darkBlue5} />
                        </div> :
                        <img src={currentAvatar}
                             className='bg-white dark:bg-darkBlue-3 object-cover w-full h-full'
                             alt='Nami.Exchange' />
                }
            </div>
            <div
                onClick={() => setOpenModal(true)}
                className={classnames(
                    'absolute bg-gray-13 dark:bg-darkBlue-2 rounded-full p-[0.375rem]',
                    'border-white dark:border-dark border-2 right-0 md:right-2 bottom-0 cursor-pointer'
                )}>
                <Edit />
            </div>
        </div>

        <ModalV2
            isVisible={openConfirmModal}
            onBackdropCb={cancelChangeAvatar}
            className='md:w-[30rem]'
            wrapClassName='text-center'
            isMobile={isMobile}
        >
            <img
                width={124}
                height={124}
                className='mx-auto mt-6 mb-3 rounded-full object-cover h-[124px]'
                src={avatar?.src}
                alt='Nami Exchange'
            />
            <p className='text-lg mb-4'>{t('profile:change_avatar_2')}</p>
            <span className='text-txtSecondary dark:text-txtSecondary-dark'>{t('profile:confirm_new_avatar')}</span>
            <div className='space-y-3 mt-8'>
                <ButtonV2
                    onClick={onConfirm}
                >{t('common:confirm')}</ButtonV2>
                <ButtonV2
                    variants='secondary'
                    onClick={reselect}
                >{t('profile:reselect')}</ButtonV2>
            </div>
        </ModalV2>

        <ModalV2
            isMobile={isMobile}
            isVisible={openModal && !openConfirmModal}
            onBackdropCb={() => setOpenModal(false)}
            className='md:w-[50rem] h-full md:h-[42.5rem]'
            wrapClassName='flex flex-col select-none !px-4'
        >
            <div className='flex flex-col flex-1 min-h-0'>
                <p className='text-xl md:text-2xl font-semibold mb-8'>{t('profile:change_avatar')}</p>
                <div
                    className='flex flex-col flex-col-reverse md:flex-row md:pb-10 flex-1 min-h-0'>
                    <div
                        ref={avatarRef}
                        className='overflow-y-auto relative -mr-3 pr-2 min-h-0 md:w-[25rem] pb-8 md:pr-6'
                        onScroll={onScroll}
                    >
                        {isMobile && <UploadAvatar t={t} className='h-44 mb-14' onDropCustomAvatar={onDropCustomAvatar} />}
                        <p className='font-semibold mb-6'>{t('profile:choose_in_collection')}</p>
                        <div
                            className='flex gap-2 my-3 py-3 overflow-x-auto sticky top-0 bg-white dark:bg-dark no-scrollbar'>
                            {categories.map((category) => {
                                return <div
                                    key={category.id}
                                    id={`category_tab_${category.id}`}
                                    onClick={(event) => scrollToCategory(event, category.id)}
                                    className={classnames(
                                        'px-5 py-3 border rounded-full font-semibold whitespace-nowrap cursor-pointer',
                                        'transition duration-100', {
                                            'border-teal bg-teal/[.1] text-teal': currentCategoryId === category.id,
                                            'border-divider text-txtSecondary dark:text-txtSecondary-dark dark:border-divider-dark': currentCategoryId !== category.id
                                        })
                                    }
                                >{category.name[language]}</div>;
                            })}
                        </div>
                        <div className='space-y-6'>
                            {avatarSets.map(avatarSet => {
                                return <div
                                    id={`category_${avatarSet.category.id}`}
                                    data-id={avatarSet.category.id}
                                    key={avatarSet.category.id}
                                >
                                    <div className='bg-white dark:bg-darkBlue-3 border border-divider dark:border-none p-4 rounded-xl'>
                                        <p className='text-txtSecondary dark:text-txtSecondary-dark mb-4'>{avatarSet.category.name[language]}</p>
                                        <div className='flex flex-wrap'>
                                            {avatarSet.images.map((image, index) => {
                                                const isSelected = avatar?.type === AVATAR_TYPE.PRESET && image === avatar?.src;
                                                return <div
                                                    key={index}
                                                    onClick={() => setAvatar({
                                                        src: image,
                                                        type: AVATAR_TYPE.PRESET
                                                    })}
                                                    className={classnames('border border-transparent rounded-full cursor-pointer p-[3px]', {
                                                        '!border-teal': isSelected
                                                    })}
                                                >
                                                    <img className='rounded-full' width={68} height={68} src={image}
                                                         alt='Nami Exchange' />
                                                </div>;
                                            })}
                                        </div>
                                    </div>
                                </div>;
                            })}
                        </div>

                    </div>
                    <div className='hidden md:flex flex-col flex-grow md:pl-8 mb-14 md:mb-0'>
                        <p className='hidden md:inline-block font-semibold mb-6'>{t('profile:or_upload_image')}</p>
                        <UploadAvatar t={t} onDropCustomAvatar={onDropCustomAvatar} />
                    </div>
                </div>

                <div className='pt-4 md:pt-0 border-t md:border-none border-divider dark:border-divider-dark'>
                    <ButtonV2
                        disabled={!avatar}
                        onClick={() => setOpenConfirmModal(true)}
                    >{t('common:confirm_2')}</ButtonV2>
                </div>
            </div>
        </ModalV2>
    </>;
};

const DashBorder = styled.div`
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%2347cc85' stroke-width='1' stroke-dasharray='5%2c 8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
    border-radius: .725rem;
`;
export default AccountAvatar;
