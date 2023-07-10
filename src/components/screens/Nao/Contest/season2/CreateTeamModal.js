import React, { useState, useRef, useContext } from 'react';
import ModalV2 from 'components/common/V2/ModalV2';
import { TextField, ButtonNao, Tooltip, capitalize } from 'components/screens/Nao/NaoStyle';
import { useTranslation } from 'next-i18next';
import _ from 'lodash';
import { API_CONTEST_CHECK_MEMBER, API_CONTEST_UPLOAD, API_CONTEST_CREATE_GROUP } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import fetchApi from 'utils/fetch-api';
import { useMemo } from 'react';
import { AlertContext } from 'components/common/layouts/LayoutNaoToken';
import { IconLoading } from 'components/common/Icons';
import useWindowSize from 'hooks/useWindowSize';
import UploadAvatar from './UploadAvatar';
import classNames from 'classnames';

const initMember = {
    member1: '',
    member2: '',
    member3: ''
};
const CreateTeamModal = ({ isVisible, onClose, userData, onShowDetail, contest_id, userID }) => {
    const { t } = useTranslation();
    const { width } = useWindowSize();
    const context = useContext(AlertContext);
    const [errors, setErros] = useState({});
    const [avatar, setAvatar] = useState({ file: null, url: null });
    const [name, setName] = useState('');
    const fullname = useRef({});
    const [member, setMember] = useState(initMember);
    const oldData = useRef({});
    const [loading, setLoading] = useState(false);
    const isLoading = useRef(false);

    const timer = useRef(null);
    const onHandleChange = (e, key) => {
        const value = e.target.value;
        const name = e.target.name;
        switch (key) {
            case 'name':
                setName(
                    String(value)
                        .trimStart()
                        .replace(/[&#,+()$!~%.;_'":*?<>[\]\{}@`|\/\\^=-]/g, '')
                );
                break;
            case 'member':
                const _value = String(value).trim();
                // .replace(/[^0-9]/g, '');
                isLoading.current = true;
                setMember({ ...member, [name]: _value });
                clearTimeout(timer.current);
                timer.current = setTimeout(() => {
                    e.target.blur();
                }, 1000);
                break;
            default:
                break;
        }
    };

    const checkDup = (value, name) => {
        return Object.keys(member).find((rs) => (value === member[rs] && rs !== String(name)) || value === userData?.onus_user_id);
    };

    const onBlur = async (e) => {
        const value = e.target.value;
        const name = e.target.name;
        if (value === oldData.current[name]) return;
        oldData.current[name] = value;
        const _errors = { ...errors };
        _errors[name] = { error: false, message: '', duplicate: false };
        // if (value.length <= 20 && value) {
        //     delete fullname.current[name]
        //     _errors[name]['error'] = true;
        //     _errors[name]['message'] = t('nao:contest:invalid_id')
        // } else {
        if (value) {
            await checkMember(value, (data) => {
                if (data?.name) {
                    Object.keys(_errors).map((key) => {
                        if (_errors[key]['duplicate']) {
                            if (!checkDup(member[key], key)) {
                                _errors[key]['duplicate'] = false;
                                _errors[key]['error'] = false;
                            }
                        }
                    });
                    fullname.current[name] = data?.username ?? data?.name;
                    if (checkDup(value, name)) {
                        _errors[name]['duplicate'] = true;
                        _errors[name]['error'] = true;
                        _errors[name]['message'] = t('error:futures:DUPLICATED_USER');
                    } else {
                        _errors[name]['message'] = !data?.result ? t('nao:contest:invalid_member') : '';
                        _errors[name]['error'] = !data?.result;
                    }
                } else {
                    _errors[name]['error'] = true;
                    _errors[name]['message'] = t('nao:contest:invalid_id');
                    delete fullname.current[name];
                }
            });
        } else {
            delete fullname.current[name];
            delete _errors[name];
        }
        // }
        isLoading.current = false;
        setErros(_errors);
    };

    const checkMember = async (id, cb) => {
        try {
            const { data, status } = await fetchApi({
                url: API_CONTEST_CHECK_MEMBER,
                options: { method: 'GET' },
                params: { contest_id: contest_id, code_or_email: id }
            });
            if (status === ApiStatus.SUCCESS) {
                if (cb) cb(data);
            }
        } catch (e) {
            console.error('__ error', e);
        } finally {
        }
    };

    const upload = async (file) => {
        const formData = new FormData();
        formData?.append('image', file);
        setLoading(true);
        // return 'https://nami-dev.sgp1.digitaloceanspaces.com/upload/avatar/18-6Q0PLSxbtNTC.jpeg'
        try {
            const { data, status } = await fetchApi({
                url: API_CONTEST_UPLOAD,
                options: { method: 'POST' },
                params: formData
            });
            if (status === ApiStatus.SUCCESS) {
                return data?.avatar;
            }
            context.alertV2.show('error', t('common:failed'), t(`error:futures:${status || 'UNKNOWN'}`));
        } catch (e) {
            console.error('__ error', e);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async () => {
        if (disabled || loading) return;
        let _avatar = null;
        if (avatar.file) {
            _avatar = await upload(avatar.file);
            if (!_avatar) return;
        }
        const params = {
            avatar: _avatar,
            leader_name: userData?.name,
            name: name.toUpperCase(),
            list_member_id: Object.keys(member).map((rs) => member[rs]),
            contest_id: contest_id
        };
        try {
            const { data, status } = await fetchApi({
                url: API_CONTEST_CREATE_GROUP,
                options: { method: 'POST' },
                params: params
            });
            if (status === ApiStatus.SUCCESS) {
                onClose(true);
                context.alertV2.show(
                    'success',
                    t('nao:contest:team_successfully'),
                    null,
                    null,
                    () => {
                        onShowDetail({ displaying_id: data?.group_displaying_id, is_leader: 1, ...data });
                    },
                    null,
                    { confirmTitle: t('nao:contest:team_details'), messages: t('nao:contest:team_successfully_msg') }
                );
            } else {
                context.alertV2.show('error', t('common:failed'), t(`error:futures:${status || 'UNKNOWN'}`));
            }
        } catch (e) {
            console.error('__ error', e);
        } finally {
            setLoading(false);
        }
    };

    const disabled = useMemo(() => {
        return !name || Object.keys(member).find((rs) => !member[rs]) || Object.keys(errors).find((e) => errors[e]?.['error']);
    }, [member, name, avatar, errors]);

    const isMobile = width <= 640;

    return (
        <ModalV2
            isMobile={isMobile}
            isVisible={true}
            onBackdropCb={() => onClose()}
            className="max-w-[884px] sm:max-h-[860px] h-full overflow-hidden"
            wrapClassName="flex flex-col"
        >
            <div className="text-xl sm:text-2xl font-semibold">{t('nao:contest:create_a_team')}</div>
            <div
                className={classNames(
                    'flex flex-col sm:flex-row sm:space-x-8 max-h-[calc(100%-170px)] overflow-auto sm:max-h-[calc(100%-192px)] pt-6 sm:pt-8',
                    { '-mx-4 px-4 pb-2': isMobile }
                )}
            >
                <div className="sm:min-w-[300px] flex flex-col mb-4 sm:mb-0">
                    <div className="font-semibold mb-6 hidden sm:flex">{t('nao:contest:team_avatar')}</div>
                    <div className="font-semibold mb-4 text-sm flex sm:hidden">{t('nao:contest:team_information')}</div>
                    <UploadAvatar onChange={setAvatar} />
                </div>
                <div className="w-full flex flex-col">
                    <div className="font-semibold mb-6 hidden sm:flex">{t('nao:contest:team_information')}</div>
                    <div className="flex-1 w-full form-team overflow-y-auto sm:pr-4">
                        <TextField
                            className="uppercase"
                            value={name}
                            maxLength={20}
                            label={t('nao:contest:invalid_name')}
                            onChange={(e) => onHandleChange(e, 'name')}
                            placeholder={t('nao:contest:team')}
                        />
                        <div className="mt-8">
                            <Tooltip
                                place={isMobile ? 'right' : 'top'}
                                className="!p-[10px] sm:min-w-[282px] sm:!max-w-[282px]"
                                arrowColor="transparent"
                                id="tooltip-list-team"
                            >
                                <div className="text-sm">{t('nao:contest:tooltip_create_team')}</div>
                            </Tooltip>
                            <div
                                className="text-sm sm:text-sm w-max border-b border-dashed border-divider dark:border-gray-7"
                                data-tip=""
                                data-for="tooltip-list-team"
                            >
                                {t('nao:contest:member_list')}
                            </div>
                            <div className="flex flex-col space-y-4 mt-6">
                                <TextField label={t('nao:contest:captain_id')} value={userData?.[userID]} prefix={userData?.name} readOnly />
                                {Object.keys(initMember).map((m, idx) => (
                                    <TextField
                                        key={idx}
                                        label={t(`nao:contest:id_member`, { value: idx + 1 })}
                                        error={errors?.[m]?.['error']}
                                        helperText={errors?.[m]?.['message']}
                                        onBlur={onBlur}
                                        name={m}
                                        value={member[m]}
                                        prefix={fullname.current[m]}
                                        onChange={(e) => onHandleChange(e, 'member')}
                                        placeholder="ID"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-4 mt-8 sm:mt-auto">
                {/* <ButtonNao onClick={() => onClose()} variant={ButtonNaoVariants.SECONDARY} className="w-full !rounded-md">{t('common:close')}</ButtonNao> */}
                <ButtonNao onClick={onSubmit} disabled={disabled || loading || isLoading.current} className="w-full !rounded-md">
                    {loading && <IconLoading className="!m-0" color="currentColor" />} {t('nao:contest:create_team')}
                </ButtonNao>
            </div>
        </ModalV2>
    );
};

// const UploadIcon = () => {
//     return (
//         <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path
//                 d="M11 2C8.23858 2 6 4.23858 6 7C6 7.55228 5.55228 8 5 8C3.21354 8 2 9.24054 2 10.5C2 11.7595 3.21354 13 5 13C5.55229 13 6 13.4477 6 14C6 14.5523 5.55229 15 5 15C2.36818 15 0 13.1065 0 10.5C0 8.20892 1.82965 6.46876 4.05977 6.08111C4.50974 2.64936 7.44547 0 11 0C14.5545 0 17.4903 2.64936 17.9402 6.08111C20.1703 6.46876 22 8.20892 22 10.5C22 13.1065 19.6318 15 17 15C16.4477 15 16 14.5523 16 14C16 13.4477 16.4477 13 17 13C18.7865 13 20 11.7595 20 10.5C20 9.24054 18.7865 8 17 8C16.4477 8 16 7.55228 16 7C16 4.23858 13.7614 2 11 2Z"
//                 fill="#49E8D5"
//             />
//             <path
//                 d="M14.7071 11.7071C14.3166 12.0976 13.6834 12.0976 13.2929 11.7071L12 10.4142V19C12 19.5523 11.5523 20 11 20C10.4477 20 10 19.5523 10 19V10.4142L8.70711 11.7071C8.31658 12.0976 7.68342 12.0976 7.29289 11.7071C6.90237 11.3166 6.90237 10.6834 7.29289 10.2929L10.2929 7.29289C10.4804 7.10536 10.7348 7 11 7C11.2652 7 11.5196 7.10536 11.7071 7.29289L14.7071 10.2929C15.0976 10.6834 15.0976 11.3166 14.7071 11.7071Z"
//                 fill="#49E8D5"
//             />
//         </svg>
//     );
// };

export default CreateTeamModal;
