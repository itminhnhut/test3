import * as types from 'src/redux/actions/types';
import fetchAPI from 'utils/fetch-api';
import AuthStorage from 'utils/auth-storage';
import { ApiStatus, WalletType } from './const';
import {
    API_CHECK_PASS,
    API_CHECK_PASS_AUTH,
    API_GET_ALL_USER_WALLET,
    API_GET_ASSET_CONFIG,
    API_GET_ME,
    API_GET_USER_WALLET,
    API_KYC_BANK_INFORMATION,
    API_KYC_COUNTRY_LIST,
    API_KYC_IMAGES,
    API_KYC_INFORMATION,
    API_KYC_STATUS,
    API_KYC_SUBMIT,
    API_LOG_OUT,
    API_PROFILE_NAME,
    API_PROFILE_PHONE,
    API_REFRESH_TOKEN,
    API_PROFILE_PASSWORD,
    API_GET_AVATAR_LIST,
    API_PROFILE_AVATAR,
    API_2FA_GENERATE_SECRET,
    API_2FA_CHECK_PASS,
    API_PROFILE_EMAIL,
    API_PROFILE_USERNAME,
    API_USER_REFERRAL,
    API_WITHDRAW_ONCHAIN,
} from './apis';
import ApiError from './apiError';

export const setUser = (user) => (dispatch) => dispatch({ type: types.SET_USER, payload: user });

export function refreshToken() {
    return async dispatch => {
        if (!AuthStorage.refreshToken) {
            AuthStorage.destroy();
        }
        try {
            const res = await fetchAPI({
                url: API_REFRESH_TOKEN,
                options: {
                    method: 'POST',
                },
                params: {
                    refreshToken: AuthStorage.refreshToken,
                    clientId: AuthStorage.clientId,
                },
            });
            const { status, data } = res;
            if (status === ApiStatus.SUCCESS) {
                AuthStorage.value = {
                    ...data,
                    clientId: AuthStorage.clientId,
                };
                dispatch({
                    type: types.SET_ACCESS_TOKEN,
                    payload: data.accessToken,
                });
            } else {
                AuthStorage.destroy();
            }
        } catch (e) {
            AuthStorage.destroy();
            // console.error('__ error ', e);
        }
    };
}
export function getMe() {
    return async dispatch => {
        try {
            console.log('__ check api', API_GET_ME);
            const { status, data } = await fetchAPI({
                url: API_GET_ME,
                options: {
                    method: 'GET',
                },
            });
            console.log('__ check data 111', data);
            if (status === 'ok') {
                dispatch({
                    type: SET_USER,
                    payload: data,
                });
            }
        } catch (e) {
            console.log('__ get me error', e);
            dispatch({
                type: SET_USER,
                payload: null,
            });
        }
    };
}

export async function actionLogout() {
    return async dispatch => {
        try {
            const res = await fetchAPI({
                url: API_LOG_OUT,
                options: {
                    method: 'GET',
                },
            });
            const { status } = res;
            if (status === ApiStatus.SUCCESS) {
                AuthStorage.destroy();
                dispatch({
                    type: types.SET_USER,
                    payload: null,
                });
            }
        } catch (e) {
            // console.error('LOGOUT_ERROR', e);
        }
    };
}

export function getWallet() {
    return async dispatch => {
        try {
            const res = await fetchAPI({
                url: API_GET_USER_WALLET,
                options: {
                    method: 'GET',
                },
            });
            const { status, data } = res;
            if (status === ApiStatus.SUCCESS) {
                dispatch({
                    type: types.UPDATE_WALLET,
                    walletType: WalletType.SPOT,
                    payload: data,
                });
            }
        } catch (e) {
            dispatch({
                type: types.UPDATE_WALLET,
                payload: null,
            });
        }
    };
}

export function getAllWallet() {
    return async dispatch => {
        try {
            const res = await fetchAPI({
                url: API_GET_ALL_USER_WALLET,
                options: {
                    method: 'GET',
                },
            });
            const { status, data } = res;
            if (status === ApiStatus.SUCCESS) {
                dispatch({
                    type: types.UPDATE_ALL_WALLET,
                    payload: data,
                });
            }
        } catch (e) {
            // dispatch({
            //     type: types.UPDATE_WALLET,
            //     payload: null,
            // });
        }
    };
}

export function getAssetConfig() {
    return async dispatch => {
        try {
            const res = await fetchAPI({
                url: API_GET_ASSET_CONFIG,
                options: {
                    method: 'GET',
                },
            });
            const { status, data } = res;
            if (status === ApiStatus.SUCCESS) {
                dispatch({
                    type: types.UPDATE_WALLET,
                    payload: data,
                });
            }
        } catch (e) {
            dispatch({
                type: types.UPDATE_WALLET,
                payload: [],
            });
        }
    };
}

export function setQuoteAsset(asset) {
    return async dispatch => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('wallet:quote_asset', asset);
        }
        dispatch({
            type: types.SET_QUOTE_ASSET,
            payload: asset,
        });
    };
}

export const getKycCountry = () => async (dispatch) => {
    try {
        dispatch({ type: types.GET_KYC_COUNTRY_REQUEST });
        const res = await fetchAPI({
            url: API_KYC_COUNTRY_LIST,
            options: {
                method: 'GET',
            },
        });
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.GET_KYC_COUNTRY_SUCCESS,
                payload: data,
            });
        }
    } catch (error) {
        dispatch({
            type: types.GET_KYC_COUNTRY_FAILURE,
        });
    }
};

export const getKycData = () => async (dispatch) => {
    try {
        dispatch({ type: types.GET_KYC_STATUS_REQUEST });
        const res = await fetchAPI({
            url: API_KYC_STATUS,
            options: {
                method: 'GET',
            },
        });
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.GET_KYC_STATUS_SUCCESS,
                payload: data,
            });
        }
    } catch (error) {
        dispatch({
            type: types.GET_KYC_STATUS_FAILURE,
        });
    }
};

export const setKycInformation = (information) => async (dispatch) => {
    try {
        dispatch({ type: types.SET_KYC_INFORMATION_REQUEST });
        const res = await fetchAPI({
            url: API_KYC_INFORMATION,
            options: {
                method: 'POST',
            },
            params: information,
        });
        const { status, data, message, code } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.SET_KYC_INFORMATION_SUCCESS,
                payload: data,
            });
            return null;
        }
        dispatch({
            type: types.SET_KYC_INFORMATION_FAILURE,
            payload: message,
        });
        return code;
    } catch (error) {
        return dispatch({
            type: types.SET_KYC_INFORMATION_FAILURE,
            payload: error,
        });
    }
};

export const setKycBankInfo = (bank) => async (dispatch) => {
    try {
        dispatch({ type: types.SET_KYC_BANK_REQUEST });
        const res = await fetchAPI({
            url: API_KYC_BANK_INFORMATION,
            options: {
                method: 'POST',
            },
            params: bank,
        });
        const { status, data, message, code } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.SET_KYC_BANK_SUCCESS,
                payload: data,
            });
            return null;
        }
        dispatch({
            type: types.SET_KYC_BANK_FAILURE,
            payload: message,
        });
        return code;
    } catch (error) {
        dispatch({
            type: types.SET_KYC_BANK_FAILURE,
            payload: error,
        });
    }
};

export const setKycImages = (image) => async (dispatch) => {
    try {
        dispatch({ type: types.SET_KYC_IMAGE_REQUEST });
        const formData = new FormData();
        await formData.append('image', image?.image);
        const res = await fetchAPI({
            url: `${API_KYC_IMAGES}/${image?.type}`,
            options: {
                method: 'POST',
            },
            params: formData,
        });
        const { status, data, message, code } = res;
        if (status === ApiStatus.SUCCESS) {
            if (image?.actionType === 'front') {
                dispatch({
                    type: types.SET_KYC_IMAGE_FRONT_SUCCESS,
                    payload: data?.metadata?.front,
                });
            }
            if (image?.actionType === 'passport') {
                dispatch({
                    type: types.SET_KYC_IMAGE_PASSPORT_SUCCESS,
                    payload: data?.metadata?.front,
                });
            }
            if (image?.actionType === 'back') {
                dispatch({
                    type: types.SET_KYC_IMAGE_BACK_SUCCESS,
                    payload: data?.metadata?.back,
                });
            }
            if (image?.actionType === 'selfie') {
                dispatch({
                    type: types.SET_KYC_IMAGE_SELFIE_SUCCESS,
                    payload: data?.metadata?.portfolio,
                });
            }
            return null;
        }
        dispatch({
            type: types.SET_KYC_IMAGE_FAILURE,
            payload: message,
        });
        return code;
    } catch (error) {
        dispatch({
            type: types.SET_KYC_IMAGE_FAILURE,
            payload: error,
        });
    }
};

export const submitKyc = () => async (dispatch) => {
    try {
        dispatch({ type: types.SUBMIT_KYC_REQUEST });
        const res = await fetchAPI({
            url: API_KYC_SUBMIT,
            options: {
                method: 'POST',
            },
        });
        const { status, data, message, code } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.SUBMIT_KYC_SUCCESS,
                payload: data,
            });
            return null;
        }
        dispatch({
            type: types.SUBMIT_KYC_FAILURE,
            payload: message,
        });
        return code;
    } catch (error) {
        dispatch({
            type: types.SUBMIT_KYC_FAILURE,
            payload: error,
        });
    }
};

export const updateName = ({ name }) => async (dispatch) => {
    try {
        dispatch({ type: types.UPDATE_PROFILE_NAME_REQUEST });
        const res = await fetchAPI({
            url: API_PROFILE_NAME,
            options: {
                method: 'PUT',
            },
            params: {
                name,
            },
        });
        const { status, data, message, code } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.UPDATE_PROFILE_NAME_SUCCESS,
                payload: data?.user?.name,
            });
            return data?.user;
        }
        dispatch({
            type: types.UPDATE_PROFILE_NAME_FAILURE,
            payload: message,
        });
        return code;
    } catch (error) {
        dispatch({
            type: types.UPDATE_PROFILE_NAME_FAILURE,
            payload: error,
        });
    }
};

export const getPhoneCheckPassId = ({ phone, countryCode }) => async (dispatch) => {
    try {
        dispatch({ type: types.GET_PROFILE_PHONE_CHECK_PASS_ID_REQUEST });
        const res = await fetchAPI({
            url: API_PROFILE_PHONE,
            options: {
                method: 'PUT',
            },
            params: {
                phone,
                countryCode,
            },
        });
        const { data, code } = res;
        if (data?.checkpass) {
            dispatch({
                type: types.GET_PROFILE_PHONE_CHECK_PASS_ID_SUCCESS,
            });
            return data?.checkpass;
        }
        dispatch({
            type: types.GET_PROFILE_PHONE_CHECK_PASS_ID_FAILURE,
        });
        return code;
    } catch (error) {
        dispatch({
            type: types.GET_PROFILE_PHONE_CHECK_PASS_ID_FAILURE,
        });
    }
};

export const getPasswordCheckPassId = ({ currentPassword, newPassword }) => async (dispatch) => {
    try {
        dispatch({ type: types.GET_PROFILE_PASSWORD_CHECK_PASS_ID_REQUEST });
        const res = await fetchAPI({
            url: API_PROFILE_PASSWORD,
            options: {
                method: 'PUT',
            },
            params: {
                currentPassword,
                newPassword,
            },
        });
        const { data, code } = res;
        if (data?.checkpass) {
            dispatch({
                type: types.GET_PROFILE_PASSWORD_CHECK_PASS_ID_SUCCESS,
            });
            return data?.checkpass;
        }
        dispatch({
            type: types.GET_PROFILE_PASSWORD_CHECK_PASS_ID_FAILURE,
        });
        return code;
    } catch (error) {
        dispatch({
            type: types.GET_PROFILE_PASSWORD_CHECK_PASS_ID_FAILURE,
        });
    }
};

export const getCheckPassCode = ({ checkpassId, method }) => async (dispatch) => {
    try {
        dispatch({ type: types.GET_PROFILE_CHECK_PASS_CODE_REQUEST });
        const res = await fetchAPI({
            url: API_CHECK_PASS,
            options: {
                method: 'POST',
            },
            params: {
                checkpassId,
                method,
            },
        });
        const { status, data, message, code } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.GET_PROFILE_CHECK_PASS_CODE_SUCCESS,
                payload: data,
            });
            return null;
        }
        dispatch({
            type: types.GET_PROFILE_CHECK_PASS_CODE_FAILURE,
            payload: message,
        });
        return code;
    } catch (error) {
        dispatch({
            type: types.GET_PROFILE_CHECK_PASS_CODE_FAILURE,
            payload: error,
        });
    }
};

export const verifyCheckPassCode = ({ checkpassId, methods }) => async (dispatch) => {
    try {
        dispatch({ type: types.VERIFY_CHECK_PASS_CODE_REQUEST });
        const res = await fetchAPI({
            url: API_CHECK_PASS_AUTH,
            options: {
                method: 'POST',
            },
            params: {
                checkpassId,
                methods,
            },
        });
        const { status, data, message, code } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.VERIFY_CHECK_PASS_CODE_SUCCESS,
                payload: data,
            });
            return null;
        }
        dispatch({
            type: types.VERIFY_CHECK_PASS_CODE_FAILURE,
            payload: message,
        });
        return code;
    } catch (error) {
        dispatch({
            type: types.VERIFY_CHECK_PASS_CODE_FAILURE,
            payload: error,
        });
    }
};

export const updatePhoneNumber = ({ phone, countryCode, checkpassId }) => async (dispatch) => {
    try {
        dispatch({ type: types.UPDATE_PROFILE_PHONE_REQUEST });
        const res = await fetchAPI({
            url: API_PROFILE_PHONE,
            options: {
                method: 'PUT',
            },
            params: {
                phone,
                countryCode,
                checkpassId,
            },
        });
        const { status, data, message, code } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.UPDATE_PROFILE_PHONE_SUCCESS,
                payload: data?.user?.phone,
            });
            return null;
        }
        dispatch({
            type: types.UPDATE_PROFILE_PHONE_FAILURE,
            payload: message,
        });
        return code;
    } catch (error) {
        dispatch({
            type: types.UPDATE_PROFILE_PHONE_FAILURE,
            payload: error,
        });
    }
};

export const updatePassword = ({ currentPassword, newPassword, checkpassId }) => async (dispatch) => {
    try {
        dispatch({ type: types.UPDATE_PROFILE_PASSWORD_REQUEST });
        const res = await fetchAPI({
            url: API_PROFILE_PASSWORD,
            options: {
                method: 'PUT',
            },
            params: {
                currentPassword, newPassword, checkpassId,
            },
        });
        const { status, data, message, code } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.UPDATE_PROFILE_PASSWORD_SUCCESS,
                payload: data?.user?.name,
            });
            return null;
        }
        dispatch({
            type: types.UPDATE_PROFILE_PASSWORD_FAILURE,
            payload: message,
        });
        return code;
    } catch (error) {
        dispatch({
            type: types.UPDATE_PROFILE_PASSWORD_FAILURE,
            payload: error,
        });
    }
};

export const getAvatarList = () => async (dispatch) => {
    try {
        dispatch({ type: types.GET_AVATAR_LIST_REQUEST });
        const res = await fetchAPI({
            url: API_GET_AVATAR_LIST,
            options: {
                method: 'GET',
            },
        });
        const { status, data, message } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.GET_AVATAR_LIST_SUCCESS,
                payload: data?.avatars,
            });
            return data?.avatars;
        }
        dispatch({
            type: types.GET_AVATAR_LIST_FAILURE,
            payload: message,
        });
        return null;
    } catch (error) {
        dispatch({
            type: types.GET_AVATAR_LIST_FAILURE,
            payload: error,
        });
    }
};

export const setProfileAvatar = ({ avatarUrl }) => async (dispatch) => {
    try {
        dispatch({ type: types.SET_PROFILE_AVATAR_REQUEST });
        const res = await fetchAPI({
            url: API_PROFILE_AVATAR,
            options: {
                method: 'PUT',
            },
            params: {
                avatarUrl,
            },
        });
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.SET_PROFILE_AVATAR_SUCCESS,
                payload: data?.user?.avatar,
            });
            return true;
        }
        dispatch({
            type: types.SET_PROFILE_AVATAR_FAILURE,
        });
        return false;
    } catch (error) {
        dispatch({
            type: types.SET_PROFILE_AVATAR_FAILURE,
        });
    }
};

export const generate2FASecret = () => async (dispatch) => {
    try {
        dispatch({ type: types.GENERATE_2_FA_REQUEST });
        const res = await fetchAPI({
            url: API_2FA_GENERATE_SECRET,
            options: {
                method: 'POST',
            },
        });
        const { status, data, code } = res;
        if (status === ApiStatus.SUCCESS && data?.secret) {
            dispatch({
                type: types.GENERATE_2_FA_SUCCESS,
            });
            return data;
        }
        dispatch({
            type: types.GENERATE_2_FA_FAILURE,
        });
        return code;
    } catch (error) {
        dispatch({
            type: types.GENERATE_2_FA_FAILURE,
        });
    }
};

export const get2FACheckPassId = ({ secretKey }) => async (dispatch) => {
    try {
        dispatch({ type: types.GET_2FA_CHECK_PASS_ID_REQUEST });
        const res = await fetchAPI({
            url: API_2FA_CHECK_PASS,
            options: {
                method: 'POST',
            },
            params: {
                secretKey,
            },
        });
        const { code, data } = res;
        if (data?.checkpass) {
            dispatch({
                type: types.GET_2FA_CHECK_PASS_ID_SUCCESS,
            });
            return data?.checkpass;
        }
        dispatch({
            type: types.GET_2FA_CHECK_PASS_ID_FAILURE,
        });
        return code;
    } catch (error) {
        dispatch({
            type: types.GET_2FA_CHECK_PASS_ID_FAILURE,
        });
    }
};

export const enable2FA = ({ secretKey, checkpassId }) => async (dispatch) => {
    try {
        dispatch({ type: types.ENABLE_2FA_REQUEST });
        const res = await fetchAPI({
            url: API_2FA_CHECK_PASS,
            options: {
                method: 'POST',
            },
            params: {
                secretKey,
                checkpassId,
            },
        });
        const { status, code } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.ENABLE_2FA_SUCCESS,
            });
            return null;
        }
        dispatch({
            type: types.ENABLE_2FA_FAILURE,
        });
        return code;
    } catch (error) {
        dispatch({
            type: types.ENABLE_2FA_FAILURE,
        });
    }
};

export const getEmailCheckPassId = ({ email }) => async (dispatch) => {
    try {
        dispatch({ type: types.GET_PROFILE_EMAIL_CHECK_PASS_ID_REQUEST });
        const res = await fetchAPI({
            url: API_PROFILE_EMAIL,
            options: {
                method: 'PUT',
            },
            params: {
                email,
            },
        });
        const { data, code } = res;
        if (data?.checkpass) {
            dispatch({
                type: types.GET_PROFILE_EMAIL_CHECK_PASS_ID_SUCCESS,
            });
            return data?.checkpass;
        }
        dispatch({
            type: types.GET_PROFILE_EMAIL_CHECK_PASS_ID_FAILURE,
        });
        return code;
    } catch (error) {
        dispatch({
            type: types.GET_PROFILE_EMAIL_CHECK_PASS_ID_FAILURE,
        });
    }
};

export const updateEmail = ({ email, checkpassId }) => async (dispatch) => {
    try {
        dispatch({ type: types.UPDATE_PROFILE_EMAIL_REQUEST });
        const res = await fetchAPI({
            url: API_PROFILE_EMAIL,
            options: {
                method: 'PUT',
            },
            params: {
                email,
                checkpassId,
            },
        });
        const { status, data, message, code } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.UPDATE_PROFILE_EMAIL_SUCCESS,
                payload: data?.user?.email,
            });
            return null;
        }
        dispatch({
            type: types.UPDATE_PROFILE_EMAIL_FAILURE,
            payload: message,
        });
        return code;
    } catch (error) {
        dispatch({
            type: types.UPDATE_PROFILE_EMAIL_FAILURE,
            payload: error,
        });
    }
};

export const updateUsername = ({ username }) => async (dispatch) => {
    try {
        dispatch({ type: types.UPDATE_PROFILE_USERNAME_REQUEST });
        const res = await fetchAPI({
            url: API_PROFILE_USERNAME,
            options: {
                method: 'PUT',
            },
            params: {
                username,
            },
        });
        const { status, data, message, code } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.UPDATE_PROFILE_USERNAME_SUCCESS,
                payload: data?.user?.username,
            });
            return data?.user;
        }
        dispatch({
            type: types.UPDATE_PROFILE_USERNAME_FAILURE,
            payload: message,
        });
        return code;
    } catch (error) {
        dispatch({
            type: types.UPDATE_PROFILE_USERNAME_FAILURE,
            payload: error,
        });
    }
};

export const getUserReferral = () => async (dispatch) => {
    try {
        dispatch({ type: types.GET_USER_REFERRAL_REQUEST });
        const res = await fetchAPI({
            url: API_USER_REFERRAL,
            options: {
                method: 'GET',
            },
        });
        const { data, code, status } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.GET_USER_REFERRAL_SUCCESS,
                payload: data,
            });
            return null;
        }
        dispatch({
            type: types.GET_USER_REFERRAL_FAILURE,
        });
        return code;
    } catch (error) {
        dispatch({
            type: types.GET_USER_REFERRAL_FAILURE,
        });
    }
};

export const setUserReferral = ({ refTerm }) => async (dispatch) => {
    try {
        dispatch({ type: types.SET_USER_REFERRAL_REQUEST });
        const res = await fetchAPI({
            url: API_USER_REFERRAL,
            options: {
                method: 'PUT',
            },
            params: {
                refTerm,
            },
        });
        const { data, code, status } = res;
        if (status === ApiStatus.SUCCESS) {
            dispatch({
                type: types.SET_USER_REFERRAL_SUCCESS,
                payload: data,
            });
            return null;
        }
        dispatch({
            type: types.SET_USER_REFERRAL_FAILURE,
        });
        return code;
    } catch (error) {
        dispatch({
            type: types.SET_USER_REFERRAL_FAILURE,
        });
    }
};

export const getWithdrawOnchainCheckPassId = ({ assetId, amount, network, withdrawTo, tag }) => async (dispatch) => {
    try {
        dispatch({ type: types.GET_WITHDRAW_ONCHAIN_CHECK_PASS_ID_REQUEST });
        const res = await fetchAPI({
            url: API_WITHDRAW_ONCHAIN,
            options: {
                method: 'POST',
            },
            params: {
                assetId,
                amount,
                network,
                withdrawTo,
                tag,
            },
        });
        const { data, code } = res;
        if (data?.checkpass) {
            dispatch({
                type: types.GET_WITHDRAW_ONCHAIN_CHECK_PASS_ID_SUCCESS,
            });
            return data?.checkpass;
        }
        dispatch({
            type: types.GET_WITHDRAW_ONCHAIN_CHECK_PASS_ID_FAILURE,
        });
        return code;
    } catch (error) {
        dispatch({
            type: types.GET_WITHDRAW_ONCHAIN_CHECK_PASS_ID_FAILURE,
        });
    }
};

export const withdrawOnchain = ({ assetId, amount, network, withdrawTo, tag, checkpassId }) => async (dispatch) => {
    try {
        dispatch({ type: types.WITHDRAW_ONCHAIN_REQUEST });
        const res = await fetchAPI({
            url: API_WITHDRAW_ONCHAIN,
            options: {
                method: 'POST',
            },
            params: {
                assetId,
                amount,
                network,
                withdrawTo,
                tag,
                checkpassId,
            },
        });
        const { data, code } = res;
        if (data?.checkpass) {
            dispatch({
                type: types.WITHDRAW_ONCHAIN_SUCCESS,
            });
            return data?.checkpass;
        }
        dispatch({
            type: types.WITHDRAW_ONCHAIN_FAILURE,
        });
        return code;
    } catch (error) {
        dispatch({
            type: types.WITHDRAW_ONCHAIN_FAILURE,
        });
    }
};
