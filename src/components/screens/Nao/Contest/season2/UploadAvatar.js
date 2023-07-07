import React, { useState, useContext, useEffect, useRef } from 'react';
import { AlertContext } from 'components/common/layouts/LayoutNaoToken';
import { BxsUserIcon } from 'components/svg/SvgIcon';
import classnames from 'classnames';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
import colors from 'styles/colors';
const support = ['image/jpeg', 'image/jpg', 'image/png'];

const UploadAvatar = ({ onChange }) => {
    const [avatar, setAvatar] = useState({ file: null, url: null });
    const context = useContext(AlertContext);
    const { t } = useTranslation();
    const container = useRef(null);

    const onAddAvatar = () => {
        const el = document.querySelector('#avatar_team');
        if (el) el.click();
    };

    const fileHandler = (file, name, type) => {
        try {
            if (!support.includes(type)) {
                context.alertV2.show('warning', t(`error:futures:INVALID_IMAGE`));
                return false;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const item = {
                    file: file,
                    url: reader.result
                };
                setAvatar(item);
                if (onChange) onChange(item);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.log(error);
        }
    };

    const onChangeAvatar = (e) => {
        const file = e.target.files[0];
        const size = Math.round(file?.size / 1024);
        if (size > 2048) {
            context.alertV2.show('warning', t(`error:futures:INVALID_IMAGE`));
        } else {
            if (file) {
                fileHandler(file, file.name, file.type);
            }
        }
    };

    const onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        container.current.classList.remove('active');
        const draggedData = e.dataTransfer;
        const files = draggedData.files;
        fileHandler(files[0], files[0].name, files[0].type);
    };

    const dragenter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        container.current.classList.add('active');
    };

    const dragleave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        container.current.classList.remove('active');
    };

    const dragover = (e) => {
        e.preventDefault();
        e.stopPropagation();
        container.current.classList.add('active');
    };

    useEffect(() => {
        if (!container.current) return;
        container.current.addEventListener('dragenter', dragenter, false);
        container.current.addEventListener('dragleave', dragleave, false);
        container.current.addEventListener('dragover', dragover, false);
        container.current.addEventListener('drop', onDrop, false);
        return () => {
            if (!container.current) return;
            container.current.removeEventListener('dragenter', dragenter, false);
            container.current.removeEventListener('dragleave', dragleave, false);
            container.current.removeEventListener('dragover', dragover, false);
            container.current.removeEventListener('drop', onDrop, false);
        };
    }, [container]);
    console.log(support.join(','));
    return (
        <WrapperUpload className="flex-1">
            <div
                ref={container}
                className="sm:bg-gray-13 sm:dark:bg-dark-4 rounded-xl sm:px-5 sm:py-12 flex flex-col items-center h-full border border-transparent"
            >
                <div
                    onClick={onAddAvatar}
                    style={{ backgroundImage: avatar?.url ? `url(${avatar.url})` : null }}
                    className={classnames(
                        `min-h-[80px] min-w-[80px] sm:min-h-[124px] sm:min-w-[124px] rounded-[50%] bg-bgPrimary dark:bg-dark-4 flex flex-col items-center justify-center`,
                        'bg-center bg-cover cursor-pointer',
                        {
                            'border-[1px] border-dashed border-teal': !avatar.url,
                            'bg-origin-padding': avatar.url
                        }
                    )}
                >
                    {!avatar.url && (
                        <div className="text-teal">
                            <BxsUserIcon size={40} />
                        </div>
                    )}
                </div>
                <div className="text-sm mt-12 hidden sm:flex flex-col space-y-1 text-center">
                    <span className="font-semibold">{t('nao:contest:drag_drop')}</span>
                    <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('nao:contest:format_support')} JPEG, JPG, PNG</span>
                </div>
                <input type="file" id="avatar_team" className="hidden" accept={support.join(',')} onChange={onChangeAvatar} />
            </div>
        </WrapperUpload>
    );
};

const WrapperUpload = styled.div`
    .active {
        border: ${() => `1px dashed ${colors.teal}`};
    }
`;

export default UploadAvatar;
