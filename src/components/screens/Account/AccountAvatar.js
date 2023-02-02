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

const AccountAvatar = ({
    currentAvatar
}) => {
    const [avatarSets, setAvatarSets] = useState([]);
    const [avatar, setAvatar] = useState();
    const [uploadStatus, setUploadStatus] = useState(UPLOADING_STATUS.IDLE);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [currentCategoryId, setCurrentCategoryId] = useState(1);
    const [avatarIssues, setAvatarIssues] = useState('');

    const avatarRef = useRef();

    const dispatch = useDispatch();

    const {
        t,
        i18n: { language }
    } = useTranslation();

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

    const categories = useMemo(() => {
        return avatarSets.map(a => a.category);
    }, [avatarSets]);

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
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [uploadStatus]);

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

    const onValidatingAvatarSize = ({ size }) => {
        if (!size) return;
        if (size > AVATAR_SIZE_LIMIT) {
            setAvatarIssues(t('common:uploader.not_over', { limit: `${AVATAR_SIZE_LIMIT / 1e6} MB` }));
        } else {
            setAvatarIssues('');
        }
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
        setCurrentCategoryId(id);

        const element = document.getElementById(`category_${id}`);

        avatarRef.current?.scrollTo({
            top: element.offsetTop - 98,
            behavior: 'smooth'
        });

        event.target.parentElement.scrollTo({
            left: event.target.offsetLeft,
            behavior: 'smooth'
        });
    };

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

    return <>
        <div className='relative w-[8.75rem] h-[8.75rem] -mt-14'>
            {
                uploadStatus === UPLOADING_STATUS.UPLOADING ?
                    <div
                        className='flex items-center justify-center bg-darkBlue-3 rounded-full w-[8.75rem] h-[8.75rem]'>
                        <Spinner />
                    </div> :
                    <img src={currentAvatar} className='rounded-full w-[8.75rem] h-[8.75rem]' alt='Nami.Exchange' />
            }
            <div
                onClick={() => setOpenModal(true)}
                className='absolute bg-darkBlue-2 rounded-full p-[0.375rem] border-dark border-2 right-0 bottom-0 cursor-pointer'>
                <Edit />
            </div>
        </div>

        <ModalV2
            isVisible={openConfirmModal}
            onBackdropCb={cancelChangeAvatar}
            className='w-[30rem]'
            wrapClassName='text-center'
        >
            <img
                width={124}
                height={124}
                className='mx-auto mt-6 mb-3 rounded-full object-cover h-[124px]'
                src={avatar?.src}
                alt='Nami Exchange'
            />
            <p className='text-lg mb-4'>{t('profile:change_avatar_2')}</p>
            <span className='text-txtSecondary'>{t('profile:confirm_new_avatar')}</span>
            <div className='space-y-3 mt-8'>
                <ButtonV2
                    onClick={onConfirm}
                >{t('common:confirm')}</ButtonV2>
                <ButtonV2
                    variants='default'
                    className='bg-dark-2 text-txtSecondary'
                    onClick={reselect}
                >Chọn lại</ButtonV2>
            </div>
        </ModalV2>

        <ModalV2
            isVisible={openModal && !openConfirmModal}
            onBackdropCb={() => setOpenModal(false)}
            className='w-[50rem] h-[42.5rem]'
            wrapClassName='flex flex-col'
        >
            <p className='text-xl font-medium mb-8'>{t('profile:change_avatar')}</p>
            <div className='flex pb-10 flex-1 min-h-0'>
                <div
                    ref={avatarRef}
                    className='overflow-y-auto relative min-h-0 w-[25rem] pr-6'
                    onScroll={onScroll}
                >
                    <p className='font-medium mb-6'>{t('profile:choose_in_collection')}</p>
                    <div className='flex gap-2 my-3 py-3 overflow-x-auto sticky top-0 bg-dark no-scrollbar'>
                        {categories.map((category) => {
                            return <div
                                key={category.id}
                                onClick={(event) => scrollToCategory(event, category.id)}
                                className={classnames(
                                    'px-5 py-3 border rounded-full whitespace-nowrap cursor-pointer',
                                    'transition duration-100', {
                                        'border-teal bg-teal/[.1]': currentCategoryId === category.id,
                                        'border-namiv2-gray-3': currentCategoryId !== category.id
                                    })
                                }
                            >{category.name[language]}</div>;
                        })}
                    </div>
                    <div>
                        {avatarSets.map(avatarSet => {
                            return <div
                                id={`category_${avatarSet.category.id}`}
                                key={avatarSet.category.id}
                                className='py-3'
                            >
                                <div className='bg-darkBlue-3 p-4 rounded-xl'>
                                    <p className='text-darkBlue-5 mb-4'>{avatarSet.category.name[language]}</p>
                                    <div className='grid grid-cols-4 gap-4'>
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
                <div className='h-full flex flex-col flex-grow pl-8'>
                    <p className='font-medium mb-6'>{t('profile:or_upload_image')}</p>
                    <DashBorder className='flex-1' check={1}>
                        <Dropzone onDrop={onDropCustomAvatar}
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
                                <div {...getRootProps({ className: 'dropzone w-full h-full flex flex-col items-center justify-center cursor-pointer text-center' })}>
                                    <input {...getInputProps()} />
                                    <Upload size={32} />
                                    <p className='mt-2 font-medium mb-1'>{t('profile:drag_image')}</p>
                                    <span className='text-darkBlue-5'>{t('profile:support_image_type')}</span>
                                    {
                                        avatarIssues && <div className='flex items-center mt-2'>
                                            <WarningCircle />
                                            <span className='text-onus-orange text-sm ml-2'>{avatarIssues}</span>
                                        </div>
                                    }
                                </div>
                            )}
                        </Dropzone>
                    </DashBorder>
                </div>
            </div>
            <ButtonV2
                disabled={!avatar}
                onClick={() => setOpenConfirmModal(true)}
            >{t('common:confirm_2')}</ButtonV2>
        </ModalV2>
    </>;
};

const DashBorder = styled.div`
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='%2347cc85' stroke-width='1' stroke-dasharray='5%2c 8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
    border-radius: .725rem;
`;
export default AccountAvatar;
