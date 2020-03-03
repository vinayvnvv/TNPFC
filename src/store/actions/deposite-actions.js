import TYPES from "../types";
import apiServices from "../../services/api-services";
const {DEPOSITE} = TYPES;

export const fetchAllDeposites = () => {
    return (dispatch) => {
        dispatch({
            type: DEPOSITE.ON_DEPOSITE_LIST_LOAD,
        });
        apiServices.fetchAllDeposites().then(res => {
            console.log('fetchAllDeposites', res);
            const {data} = res;
            if(data.responseCode === '200') {
                dispatch({
                    type: DEPOSITE.ON_DEPOSITE_LIST_SUCCESS,
                    payload: data.response,
                });
            } else {
                dispatch({
                    type: DEPOSITE.ON_DEPOSITE_LIST_SUCCESS,
                    payload: data.response,
                });
            }
            
        }).catch(err => {
            dispatch({
                type: DEPOSITE.ON_DEPOSITE_LIST_FAIL,
                payload: 'Error in Server',
            });
        });
    }
}

export const fetchFDSummary = (accountNumber) => {
    return (dispatch) => {
        dispatch({
            type: DEPOSITE.ON_FD_SUMMARY_LOAD,
        });

        return apiServices.fetchFDSummary(accountNumber).then(res => {
            const {data} = res;
            if(data.responseCode === '200') {
                dispatch({
                    type: DEPOSITE.ON_FD_SUMMARY_SUCCESS,
                    payload: data.response,
                });
            } else {
                dispatch({
                    type: DEPOSITE.ON_FD_SUMMARY_SUCCESS,
                    payload: data.response,
                });
            }
            
        }).catch(err => {
            dispatch({
                type: DEPOSITE.ON_FD_SUMMARY_FAIL,
                payload: 'Error in Server',
            });
        });
    }
}
export const fetchFdLoans = (accountNumber) => {
    return (dispatch) => {
        dispatch({
            type: DEPOSITE.ON_FD_LOAN_LOAD,
        });

        return apiServices.fetchFdLoans(accountNumber).then(res => {
            const {data} = res;
            if(data.responseCode === '200') {
                dispatch({
                    type: DEPOSITE.ON_FD_LOAN_SUCCESS,
                    payload: data.response,
                });
            } else {
                dispatch({
                    type: DEPOSITE.ON_FD_LOAN_SUCCESS,
                    payload: data.response,
                });
            }
            
        }).catch(err => {
            dispatch({
                type: DEPOSITE.ON_FD_LOAN_FAIL,
                payload: 'Error in Server',
            });
        });
    }
}
