import { globalActionTypes as actions } from '../actions';

import { INIT_DATA_REDUCER } from '../index';

const reducer = (state, action) => {
    switch (action.type) {
        case actions.DETAIL_ADJUST: {
            const { dataCollateral = {} } = action?.data || {};
            const { totalCollateralAmount } = dataCollateral;

            return {
                ...dataCollateral,
                totalAdjusted: totalCollateralAmount,
                initial: { adjusted: totalCollateralAmount },
                amount: '',
                modal: {
                    ...state.modal,
                    isAdjust: true
                }
            };
        }
        case actions.UPDATE_TOTAL_ADJUSTED: {
            const method = action.method;
            const amount = +action.amount;
            const getCurrentAdjusted = state?.initial?.adjusted;

            let totalAdjusted = method === 'add' ? getCurrentAdjusted + amount : getCurrentAdjusted - amount;
            if (action.amount === 0) {
                totalAdjusted = getCurrentAdjusted;
            }

            return {
                ...state,
                totalAdjusted
            };
        }
        case actions.UPDATE_AMOUNT: {
            return { ...state, amount: action.amount };
        }
        case actions.RESET_AMOUNT:
            return { ...state, amount: '' };
        case actions.TOGGLE_MODAL_ADJUST_MARGIN:
            return {
                ...state,
                modal: { ...state.modal, isAdjust: !state.modal?.isAdjust }
            };
        case actions.TOGGLE_MODAL_CONFIRM_ADJUST: {
            const isConfirmAdjust = !state.modal?.isConfirmAdjust;
            const isAdjust = !state.modal?.isAdjust;

            return {
                ...state,
                modal: { ...state.modal, isAdjust, isConfirmAdjust }
            };
        }
        case actions.TOGGLE_MODAL_SUCCESS_ADJUST:
            return {
                ...state,
                modal: {
                    ...state.modal,
                    isAdjust: false,
                    isConfirmAdjust: false,
                    isSuccess: true
                }
            };
        case actions.TOGGLE_MODAL_RESET:
            return {
                ...state,
                modal: {
                    ...INIT_DATA_REDUCER.modal
                }
            };
        case actions.TOGGLE_MODAL_CANCEL: {
            const modal = action.modal;
            return {
                ...state,
                modal: {
                    ...state.modal,
                    ...modal
                }
            };
        }
        case actions.TOGGLE_MODAL_ERROR: {
            const modal = action.modal;
            const error = action?.error;
            return {
                ...state,
                modal: {
                    ...state.modal,
                    ...modal
                },
                error: { ...error }
            };
        }
        case actions.REFETCH: {
            return { ...state, isRefetch: !state.isRefetch };
        }
        case actions.RESET: {
            return { ...INIT_DATA_REDUCER };
        }
        default:
            return { ...state, current: { totalAdjusted: totalCollateralAmount } };
    }
};

export default reducer;
