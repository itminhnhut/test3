import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard/lib/Component';
import Copy from 'components/svg/Copy';
import SwitchV2 from 'components/common/V2/SwitchV2';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import HelpCircle from 'components/svg/HelpCircle';
import Button from 'components/common/V2/ButtonV2/Button';
import Link from 'next/link';
import { formatNumber, getS3Url } from 'redux/actions/utils';
import { Check } from 'react-feather';
import colors from 'styles/colors';
import AccountLayout from 'components/screens/Account/AccountLayout';
import { useTranslation } from 'next-i18next';
import { PATHS } from 'constants/paths';
import { FEE_TABLE, ROOT_TOKEN } from 'constants/constants';
import axios from 'axios';
import {
    API_CHECK_REFERRAL,
    API_GET_VIP,
    API_NEW_REFERRAL_CREATE_INVITE,
    API_SET_ASSET_AS_FEE
} from 'redux/actions/apis';
import { ApiStatus, KYC_STATUS } from 'redux/actions/const';
import debounce from 'lodash/debounce';
import Axios from 'axios';
import Activity from 'components/screens/Account/Activity';
import Announcement from 'components/screens/Account/Announcement';
import Edit from 'components/svg/Edit';
import ModalV2 from 'components/common/V2/ModalV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import InputV2 from 'components/common/V2/InputV2';
import fetchApi from 'utils/fetch-api';
import toast from 'utils/toast';
import { useDispatch } from 'react-redux';
import { getMe } from 'redux/actions/user';
import Spinner from 'components/svg/Spinner';

const TextCopyable = ({
    text = '',
    className = ''
}) => {
    const [copied, setCopied] = useState(false);
    const onCopy = () => {
        setCopied(true);
    };

    useEffect(() => {
        let timer;
        if (copied) {
            timer = setTimeout(() => setCopied(false), 3000);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [copied]);

    return (<span className={className + ' flex items-center'}>
      <span className={'mr-1'}>{text}</span>
      <CopyToClipboard text={text} onCopy={onCopy} className='cursor-pointer inline-block'>
        {copied ? <Check size={16} color={colors.teal} /> : <Copy />}
      </CopyToClipboard>
    </span>);
};

const SwitchUseNamiFee = ({
    t
}) => {
    const [checked, setChecked] = useState(false);

    const getAssetFee = () => {
        axios.get(API_SET_ASSET_AS_FEE)
            .then(({ data: res }) => {
                if (res.status === ApiStatus.SUCCESS && !!res.data) {
                    const check = res.data?.feeCurrency === 1;
                    if (check !== checked) setChecked(check);
                }
            })
            .catch(err => {
                console.log('[Error] Get asset as fee', err);
            });
    };

    const setAssetFee = useCallback(debounce((currency) => {
        axios.post(API_SET_ASSET_AS_FEE, { currency })
            .catch(err => {
                console.log('[Error] Set asset as fee', err);
            });
    }, 300), []);

    useEffect(() => {
        getAssetFee();
    }, []);

    useEffect(() => {
        setAssetFee(checked ? 1 : 0);
    }, [checked]);

    return <div className='flex items-center'>
        <SwitchV2
            onChange={() => {
                setChecked(!checked);
            }}
            checked={checked}
        />
        <div className='text-txtSecondary ml-3'>
            <span>{t('profile:use_nami_to_reduce_fees')}</span>
            <span className='text-teal ml-1'>({t('profile:25p_discount')})</span>
        </div>
    </div>;
};

const ModalChangeReferee = ({
    t,
    open,
    onClose
}) => {
    const [refCode, setRefCode] = useState('');
    const [referrer, setReferrer] = useState(null);
    const [checking, setChecking] = useState(false);
    const dispatch = useDispatch();

    const checkRef = useCallback(debounce((code) => {
        setChecking(true);
        fetchApi({
            url: API_CHECK_REFERRAL,
            params: { code }
        })
            .then((res) => {
                setReferrer(res.data);
            })
            .catch(err => console.log(err))
            .finally(() => {
                setChecking(false);
            });
    }, 300), []);

    const setInvite = () => {
        fetchApi({
            url: API_NEW_REFERRAL_CREATE_INVITE,
            options: {
                method: 'POST'
            },
            params: { code: refCode }
        })
            .then(async (res) => {
                if (res.status === ApiStatus.SUCCESS) {
                    await dispatch(getMe());
                    const referrer = res.data.referrer || {};
                    const referralName = referrer.name || referrer.username || referrer.code || '--';

                    toast({
                        text: t('profile:add_ref_code_success', { referralName }),
                        type: 'success'
                    });
                } else {
                    toast({
                        text: t(`profile:error:${res.status}`),
                        type: 'warning'
                    });
                }
            })
            .catch(err => {
                toast({
                    text: t('profile:error:failed'),
                    type: 'warning'
                });
            })
            .finally(() => {
                setRefCode('');
                onClose();
            });
    };

    const handleRefCodeChange = (code = '') => {
        code = code.trim().toUpperCase();
        setRefCode(code);
        if (code) checkRef(code);
    };

    const suffixInput = useMemo(() => {
        if (checking) return <Spinner size={20}/>
        if (!referrer) return <span className='text-txtSecondary'>{referrer?.username}</span>
        return null
    }, [referrer, checking])

    return <ModalV2 isVisible={open} onBackdropCb={onClose} className='w-[30rem]'>
        <p className='text-xl font-medium py-6'>{t('profile:referrer')}</p>
        <InputV2
            value={refCode}
            onChange={handleRefCodeChange}
            label={t('profile:ref_code_optional')}
            placeholder={t('profile:enter_ref_code')}
            canPaste={!referrer && !checking}
            suffix={suffixInput}
            error={(!referrer && !!refCode) ? t('profile:error.REFERRAL_CODE_NOT_FOUND') : null}
        />
        <ButtonV2
            onClick={setInvite}
            disabled={!refCode || !referrer}
            className='mt-4'>{t('common:confirm')
        }</ButtonV2>
    </ModalV2>;
};

const Profile = () => {
    const [state, set] = useState({
        loadingLevel: false,
        showSetReferrerModal: false,
        level: 0,
        namiBalance: 0
    });

    const user = useSelector((state) => state.auth?.user);
    const { t } = useTranslation();

    const setState = obj => set(prevState => ({ ...prevState, ...obj }));

    const getLevel = async () => {
        setState({ loadingLevel: true });
        try {
            const { data } = await Axios.get(API_GET_VIP);
            if (data?.status === ApiStatus.SUCCESS && data?.data) {
                setState({
                    level: data?.data?.level,
                    namiBalance: data?.data?.metadata?.namiBalance
                });
            }
        } catch (error) {
            console.log(`Cant get user vip level: ${error}`);
        } finally {
            setState({ loadingLevel: false });
        }
    };

    useEffect(() => {
        getLevel();
    }, []);

    const nextLevel = FEE_TABLE.find(e => e?.level === state.level + 1);
    const currentPercent = state.namiBalance ? state.namiBalance * 100 / nextLevel?.nami_holding : '--';

    return (<AccountLayout>
        <ModalChangeReferee
            t={t}
            open={state.showSetReferrerModal}
            onClose={() => setState({ showSetReferrerModal: false })}
        />
        <div className='p-6 rounded-xl bg-darkBlue-3 mt-12'>
            <div className='flex'>
                <div className='flex-1 space-y-4'>
                    <div>
                        <span className='text-txtSecondary'>{t('profile:name')}</span>
                        <span className='font-bold text-right float-right'>{user?.name}</span>
                    </div>

                    <div>
                        <span className='text-txtSecondary'>{t('profile:username')}</span>
                        <span className='font-bold text-right float-right'>{user?.username}</span>
                    </div>

                    <div>
                        <span className='text-txtSecondary'>Nami ID</span>
                        <TextCopyable className='font-bold text-right float-right' text={user?.code} />
                    </div>

                    <div>
                        <span className='text-txtSecondary'>Email</span>
                        <span className='font-bold text-right float-right'>{user?.email}</span>
                    </div>

                    <div>
                        <span className='text-txtSecondary'>Người giới thiệu</span>
                        <div
                            className='flex items-end float-right cursor-pointer'
                            onClick={() => setState({ showSetReferrerModal: true })}
                        >
                            {
                                !user?.referal_id ?
                                    <>
                                        <div className='w-[10px] h-[1px] bg-white mr-[10px]' />
                                        <Edit className='' size={16} />
                                    </>
                                    : <span className='font-semibold'>{user?.referral_username}</span>
                            }

                        </div>
                    </div>
                </div>
                <div className='w-[1px] bg-divider-dark mx-10' />
                <div className='flex-1 flex flex-col justify-between'>
                    <div className='space-y-3'>
                            <span
                                className='text-txtSecondary'>{t('fee-structure:your_fee_level')} VIP {state.level}</span>
                        <div>
                            <span className='text-txtSecondary mr-2'>Marker</span>
                            <span className='text-xl font-semibold'>0.075%</span>
                        </div>

                        <div>
                            <span className='text-txtSecondary mr-2'>Trader</span>
                            <span className='text-xl font-semibold'>0.075%</span>
                        </div>
                    </div>
                    <SwitchUseNamiFee t={t} />
                </div>
            </div>

            <div className='mt-6'>
                <div>
                    <span
                        className='text-txtSecondary'>{t('fee-structure:current_fee_level')}: VIP {state.level}</span>
                    <span className='text-right float-right text-teal font-medium'>
                        <Link href={PATHS.EXCHANGE.SWAP.getSwapPair({
                            fromAsset: 'VNDC',
                            toAsset: ROOT_TOKEN
                        })}>
                            <a className='text-dominant hover:!underline'>{t('common:buy')} NAMI</a>
                        </Link>
                    </span>
                </div>
                <div
                    className='my-4 relative w-full h-[4px] xl:h-[4px] rounded-xl bg-dark-2 overflow-hidden'>
                    <div
                        style={{ width: `${currentPercent}%` }}
                        className='absolute left-0 top-0 bg-dominant h-full rounded-xl transition-all duration-700 ease-in'
                    />
                </div>

                <div>
                    <span
                        className='text-teal text-sm'>VIP {state.level}: {formatNumber(state.namiBalance)} {ROOT_TOKEN} / {formatNumber(currentPercent)} %</span>
                    <span
                        className='text-right float-right text-teal text-sm'>VIP {state.level}: {formatNumber(nextLevel?.nami_holding, 0)} {ROOT_TOKEN}</span>
                </div>
            </div>
        </div>

        <div
            className={classnames('border border-divider-dark rounded-xl p-6 mt-12 hidden', {
                '!block': user?.kyc_status === KYC_STATUS.APPROVED
            })}
            style={{
                backgroundImage: `url(${getS3Url('/images/screen/account/bg-banner-2.png')})`,
                backgroundSize: 'cover'
            }}
        >
            <div>
                <p className='font-medium mb-2'>{t('profile:deposit_banner:title')}</p>
                <span className='text-txtSecondary'>{t('profile:deposit_banner:description')}</span>
            </div>
            <div className='grid grid-cols-2 gap-16 mt-9'>
                <div className='flex items-center justify-between'>
                    <Image width={58} height={58} src='/images/screen/profile/ic_transfer.png' />
                    <div className='ml-4 flex-1'>
                        <div className='flex items-center mb-2'>
                            <span>{t('profile:deposit_banner:transfer')}</span>
                            <div className='flex items-center ml-2 cursor-pointer hover:underline'>
                                <HelpCircle />
                                <span className='text-teal ml-2'>{t('profile:deposit_banner:instruction')}</span>
                            </div>
                        </div>
                        <span
                            className='text-txtSecondary'>{t('profile:deposit_banner:transfer_description')}</span>
                    </div>
                    <Button className='w-auto px-6'>{t('profile:deposit_banner:deposit')}</Button>
                </div>
                <div className='flex items-center justify-between'>
                    <Image width={58} height={58} src='/images/screen/profile/ic_swap.png' />
                    <div className='ml-4 flex-1'>
                        <div className='flex items-center mb-2'>
                            <span>{t('profile:deposit_banner:swap')}</span>
                            <div className='flex items-center ml-2 cursor-pointer hover:underline'>
                                <HelpCircle />
                                <span className='text-teal ml-2'>{t('profile:deposit_banner:instruction')}</span>
                            </div>
                        </div>
                        <span className='text-txtSecondary'>{t('profile:deposit_banner:swap_description')}</span>
                    </div>
                    <Button className='w-auto px-6'>{t('profile:deposit_banner:deposit')}</Button>
                </div>
            </div>
        </div>

        <div className='grid grid-cols-2 gap-8 mt-14'>
            <Activity t={t} />
            <Announcement />
        </div>
    </AccountLayout>);
};
export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'navbar', 'profile', 'fee-structure', 'reward-center', 'identification']))
    }
});

export default Profile;
