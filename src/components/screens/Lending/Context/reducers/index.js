import { globalActionTypes as actions } from '../actions';

const reducer = (state, action) => {
    switch (action.type) {
        case actions.UPDATE: {
            const { dataCollateral = {}, rsTotalDebt, rsTotalCollateralAmount } = action?.data || {};
            const { totalDebt, totalCollateralAmount, initialLTV } = dataCollateral;
            return {
                ...state,
                infoDet: { total: rsTotalDebt?.total, assetCode: rsTotalDebt?.symbol?.assetCode },
                infoCollateralAmount: {
                    total: rsTotalCollateralAmount?.total,
                    assetDigit: rsTotalCollateralAmount?.symbol?.assetDigit,
                    assetCode: rsTotalCollateralAmount?.symbol?.assetCode
                },
                totalDebt,
                totalAdjusted: totalCollateralAmount,
                initialLTV,
                current: { totalAdjusted: totalCollateralAmount }
            };
        }

        case actions.UPDATE_TOTAL_ADJUSTED: {
            const method = action.method;
            const amount = +action.amount;
            const getCurrentAdjusted = state?.current?.totalAdjusted;

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
        case actions.RESET_AMOUNT: {
            return { ...state, amount: '' };
        }
        case actions.TOGGLE_MODAL_ADJUST_MARGIN:
            return {
                ...state,
                modal: { ...state.modal, isAdjust: !state.modal?.isAdjust }
            };
        case actions.TOGGLE_MODAL_CONFIRM_ADJUST:
            return {
                ...state,
                modal: { ...state.modal, isAdjust: !state.modal?.isAdjust, isConfirmAdjust: !state.modal?.isConfirmAdjust }
            };
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
                    isAdjust: false,
                    isConfirmAdjust: false,
                    isSuccess: false,
                    isCancel: false
                }
            };
        case actions.TOGGLE_MODAL_CANCEL: {
            const isCancel = action.isCancel;
            const isAdjust = action.isAdjust;
            return {
                ...state,
                modal: {
                    isAdjust,
                    isConfirmAdjust: false,
                    isSuccess: false,
                    isCancel
                }
            };
        }
        case actions.REFETCH: {
            return { ...state, isRefetch: !state.isRefetch };
        }
        default:
            return { ...state, current: { totalAdjusted: totalCollateralAmount } };
    }
};

export default reducer;
