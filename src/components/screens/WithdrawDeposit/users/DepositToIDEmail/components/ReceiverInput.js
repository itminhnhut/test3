import InputV2 from 'components/common/V2/InputV2';
import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { MAX_NOTE_LENGTH } from './DepositInputCard';
import TextArea from 'components/common/V2/InputV2/TextArea';
import ReceiverInfor from './ReceiverInfor';
import useFetchApi from 'hooks/useFetchApi';
import { API_DEPOSIT_CRYPTO, API_SEARCH_USER } from 'redux/actions/apis';
import Spinner from 'components/svg/Spinner';
import Button from 'components/common/V2/ButtonV2/Button';
import axios from 'axios';
import ModalOtp from 'components/screens/WithdrawDeposit/components/ModalOtp';
import { ApiResultCreateOrder, ApiStatus } from 'redux/actions/const';
import toast from 'utils/toast';
import { useTranslation } from 'next-i18next';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import Emitter from 'redux/actions/emitter';

const initialReceiverState = {
    input: '',
    isTypingInput: false,
    noteValue: '',
    error: ''
};

const ReceiverInput = React.memo(({ assetId, amount, setAmount, isDepositAble }) => {
    const {
        t,
        i18n: { language: lang }
    } = useTranslation();
    // DEBOUNCE Value
    const [debounceReceiverInput, setDebounceReceiverInput] = useState('');

    const [state, _setState] = useState({
        showOtp: false,
        otpExpireTime: null,
        loadingConfirm: false,
        showAlert: false,
        needSmartOtp: false
    });
    const setState = (_state) => _setState((prev) => ({ ...prev, ..._state }));

    const [receiver, _setReceiver] = useState(initialReceiverState);

    const setReceiver = (receiverState) => _setReceiver((prev) => ({ ...prev, ...receiverState }));

    useEffect(() => {
        if (receiver.input) {
            setReceiver({ isTypingInput: true });
        } else {
            setReceiver({ isTypingInput: false });
        }
        let timeout = setTimeout(() => {
            setDebounceReceiverInput(receiver.input);
        }, 500);
        return () => clearTimeout(timeout);
    }, [receiver.input]);

    const { data: user, loading } = useFetchApi(
        {
            url: API_SEARCH_USER,
            params: {
                searchUser: debounceReceiverInput
            },
            successCallBack: (response) => {
                let error = '';

                if (response?.status === ApiStatus.SUCCESS) {
                } else if (response?.status === 'TOO_MANY_REQUEST') {
                    error = 'Bạn đã gửi quá nhiều yêu cầu!';
                } else if (response?.status === 'user_not_found') {
                    error = 'Không tìm thấy user!';
                } else {
                    error = 'Lỗi không xác định';
                }

                setReceiver({ isTypingInput: false, error });
            }
        },
        Boolean(debounceReceiverInput),
        [debounceReceiverInput]
    );

    const isUserFound = !loading && user && Boolean(debounceReceiverInput);

    const onChangeNoteHandler = (value) => {
        let noteValue = value;
        // prevent from paste
        if (value.length > MAX_NOTE_LENGTH) {
            noteValue = noteValue.slice(0, MAX_NOTE_LENGTH);
        }
        setReceiver({
            noteValue
        });
    };

    const onDepositOffChainHandler = async (otp) => {
        setState({ loadingConfirm: true });
        try {
            const response = await axios.post(API_DEPOSIT_CRYPTO, {
                searchUser: debounceReceiverInput, // String: email | namiID
                assetId: +assetId, // asset transfer
                amount: +amount,
                note: receiver.noteValue,
                lang,
                otp
            });

            // MISSING [EMAIL,TFA] OTP
            if (response.data?.data?.remaining_time) {
                setState({
                    otpExpireTime: new Date().getTime() + response.data?.data?.remaining_time,
                    showOtp: true
                });
            }

            // NEED SMART OTP
            if (response.data?.data?.use_smart_otp) {
                setState({
                    showOtp: true,
                    needSmartOtp: true
                });
            }

            // SUCCESS
            if (response.data?.data?.txId) {
                setState({
                    showOtp: false,
                    showAlert: true
                });

                setReceiver(initialReceiverState);
                setAmount('');

                // Emitter deposit successfully to handle refetch deposit history
                Emitter.emit('depositSuccess', response.data);
            }
            const handlingResponseStatus = {
                INVALID_OTP: () => {
                    toast({ text: t('common:otp_verify_expired'), type: 'warning' });
                },
                SECRET_INVALID: () => {
                    toast({
                        text: t('dw_partner:error.invalid_secret', { timesErr: response.data?.data?.count ?? 1 }),
                        type: 'warning'
                    });
                }
            };

            handlingResponseStatus[response.data?.status?.toUpperCase()]?.();

            setState({ loadingConfirm: false });
            return response.data;
        } catch (error) {
        } finally {
            setState({ loadingConfirm: false });
        }
    };

    return (
        <div>
            <div className="mb-6">
                <label htmlFor="receiver-input" className="text-txtSecondary  dark:text-txtSecondary-dark inline-block mb-2 text-sm">
                    Thông tin người nhận
                </label>

                <InputV2
                    id="receiver-input"
                    className="!pb-0"
                    placeholder="Nhập Nami ID"
                    canPaste
                    onChange={(value) => setReceiver({ input: value, error: '' })}
                    value={receiver.input}
                    suffix={
                        receiver.isTypingInput && (
                            <div className="text-txtSecondary dark:text-TxtSecondary-dark">
                                <Spinner color="currentColor" />
                            </div>
                        )
                    }
                    error={receiver.error}
                />

                {isUserFound && (
                    <div className="mt-2 ">
                        <ReceiverInfor user={user} />
                    </div>
                )}
            </div>
            <div className="">
                <div className="flex justify-between items-center mb-2 ">
                    <label htmlFor="note-input" className="text-txtSecondary  dark:text-txtSecondary-dark text-sm inline-block">
                        Ghi chú
                    </label>

                    <div className="text-txtSecondary dark:text-txtSecondary-dark">
                        {receiver.noteValue.length}/{MAX_NOTE_LENGTH}
                    </div>
                </div>

                <TextArea
                    value={receiver.noteValue}
                    onChange={onChangeNoteHandler}
                    placeholder="Nhập ghi chú"
                    className="pb-0 w-full"
                    classNameInput="h-14 resize-none"
                    rows={2}
                    id="note-input"
                />
            </div>
            <div className="mt-10">
                <Button disabled={!isUserFound || !isDepositAble || state.loadingConfirm} onClick={() => onDepositOffChainHandler()}>
                    Rút
                    {state.loadingConfirm && <Spinner color="currentColor" />}
                </Button>
            </div>
            <ModalOtp
                onConfirm={(otp) => onDepositOffChainHandler(otp)}
                isVisible={state.showOtp}
                otpExpireTime={state.otpExpireTime}
                onClose={() => {
                    setState({ showOtp: false });
                }}
                loading={state.loadingConfirm}
                isUseSmartOtp={state.needSmartOtp}
            />
            <AlertModalV2
                isVisible={state.showAlert}
                onClose={() => setState({ showAlert: false })}
                type="success"
                title="Thành công"
                message="Lệnh rút thực hiện thành công"
                customButton={<Button onClick={() => setState({ showAlert: false })}>Tạo lệnh rút mới</Button>}
            />
        </div>
    );
});

export default ReceiverInput;
