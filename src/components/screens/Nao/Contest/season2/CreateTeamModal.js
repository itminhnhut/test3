import React, { useState } from 'react';
import Modal from 'components/common/ReModal';
import { TextField, ButtonNao } from 'components/screens/Nao/NaoStyle';
import { getS3Url } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import _ from 'lodash';
import classnames from 'classnames'

const CreateTeamModal = ({ isVisible, onCancel, userData }) => {
    const { t } = useTranslation();
    const [errors, setErros] = useState({});
    const [avatar, setAvatar] = useState({ file: null, url: null });
    const [data, setData] = useState({

    });

    const onAddAvatar = () => {
        const el = document.querySelector('#avatar_team');
        if (el) el.click();
    }

    const onChangeAvatar = (e) => {
        const reader = new FileReader();
        const file = e.target.files[0];
        if (file) {
            reader.onloadend = () => {
                const item = {
                    file: file,
                    url: reader.result
                }
                setAvatar(item)
            }
            reader.readAsDataURL(file)
        }

    }

    const onSubmit = () => {
        console.log(avatar)
    }

    return (
        <Modal onusMode={true} isVisible={true} onBackdropCb={onCancel}
            onusClassName="!px-6 pb-[3.75rem] !bg-nao-tooltip"
        >
            <div className="text-2xl leading-8 font-semibold">Tạo đội đua TOP</div>
            <div className="form-team mt-8">
                <div>
                    <div className="text-sm font-medium leading-6">Thông tin đội</div>
                    <div className="mt-4 flex items-center justify-between space-x-4">
                        <div onClick={onAddAvatar}
                            style={{ backgroundImage: `url(${avatar.url})`, backgroundOrigin: 'initial' }}
                            className={classnames(
                                `min-h-[58px] min-w-[58px] rounded-[50%] bg-onus flex flex-col items-center justify-center`,
                                'bg-center bg-cover ',
                                {
                                    'border-[1px] border-dashed border-nao-blue2': !avatar.url,
                                    'bg-origin-content': avatar.url,
                                },
                            )}>
                            {!avatar.url && <>
                                <div className="mt-[7px]"> <UploadIcon /></div>
                                <span className="text-[11px] leading-6">Thêm</span>
                            </>
                            }
                        </div>
                        <TextField className="capitalize" maxLength={20} label="Tên đội (tối đa 20 kí tự)" />
                        <input type="file" id="avatar_team" className='hidden' accept="image/*" onChange={onChangeAvatar} />
                    </div>
                </div>
                <div className="mt-8">
                    <div className="text-sm font-medium leading-6 flex items-center space-x-2">
                        <span>Danh sách thành viên</span>
                        <img data-tip={''} data-for="tooltip-personal-rank" className="cursor-pointer" src={getS3Url('/images/nao/ic_info.png')} width="16" height="16" alt="" />
                    </div>
                    <div className="flex flex-col space-y-4 mt-4">
                        <TextField label="ID đội trưởng" value={userData?.onus_user_id} prefix={userData?.name} readOnly />
                        <TextField label="ID thành viên 1" value={''} prefix={''} />
                        <TextField label="ID thành viên 2" value={''} prefix={''} />
                        <TextField label="ID thành viên 3" value={''} prefix={''} />
                    </div>
                </div>
            </div>
            <div className='flex items-center space-x-4 mt-8'>
                <ButtonNao border className="w-full !rounded-md">{t('common:close')}</ButtonNao>
                <ButtonNao onClick={onSubmit} disabled={_.isEmpty(errors)} className="w-full !rounded-md">{t('nao:contest:create_team')}</ButtonNao>
            </div>
        </Modal>
    );
};

const UploadIcon = () => {
    return <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 2C8.23858 2 6 4.23858 6 7C6 7.55228 5.55228 8 5 8C3.21354 8 2 9.24054 2 10.5C2 11.7595 3.21354 13 5 13C5.55229 13 6 13.4477 6 14C6 14.5523 5.55229 15 5 15C2.36818 15 0 13.1065 0 10.5C0 8.20892 1.82965 6.46876 4.05977 6.08111C4.50974 2.64936 7.44547 0 11 0C14.5545 0 17.4903 2.64936 17.9402 6.08111C20.1703 6.46876 22 8.20892 22 10.5C22 13.1065 19.6318 15 17 15C16.4477 15 16 14.5523 16 14C16 13.4477 16.4477 13 17 13C18.7865 13 20 11.7595 20 10.5C20 9.24054 18.7865 8 17 8C16.4477 8 16 7.55228 16 7C16 4.23858 13.7614 2 11 2Z" fill="#49E8D5" />
        <path d="M14.7071 11.7071C14.3166 12.0976 13.6834 12.0976 13.2929 11.7071L12 10.4142V19C12 19.5523 11.5523 20 11 20C10.4477 20 10 19.5523 10 19V10.4142L8.70711 11.7071C8.31658 12.0976 7.68342 12.0976 7.29289 11.7071C6.90237 11.3166 6.90237 10.6834 7.29289 10.2929L10.2929 7.29289C10.4804 7.10536 10.7348 7 11 7C11.2652 7 11.5196 7.10536 11.7071 7.29289L14.7071 10.2929C15.0976 10.6834 15.0976 11.3166 14.7071 11.7071Z" fill="#49E8D5" />
    </svg>

}

export default CreateTeamModal;