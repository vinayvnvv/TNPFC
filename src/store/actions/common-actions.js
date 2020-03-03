import TYPES from "../types";
import apiServices from "../../services/api-services";
const {COMMON} = TYPES;

export const fetchCustomerDetails = () => {
    return (dispatch) => {
        dispatch({
            type: COMMON.ON_CUSTOMER_DETAILS_LOAD,
        });
        apiServices.fetchCustomerDetails().then(res => {
            console.log('fetchCustomerDetails', res);
            const {data} = res;
            if(data.responseCode === '200') {
                dispatch({
                    type: COMMON.ON_CUSTOMER_DETAILS_SUCCESS,
                    payload: data.response && data.response[0] ? data.response[0] : data.response,
                });
            } else {
                dispatch({
                    type: COMMON.ON_CUSTOMER_DETAILS_SUCCESS,
                    payload: data.response,
                });
            }
            
        }).catch(err => {
            console.log('fetchCustomerDetails err', err);
            dispatch({
                type: COMMON.ON_CUSTOMER_DETAILS_FAIL,
                payload: 'Error in Server',
            });
        });
    }
}

export const fetchCustomerNominees = () => {
    return (dispatch) => {
        dispatch({
            type: COMMON.ON_CUSTOMER_NOMINEEY_LOAD,
        });

        return apiServices.fetchCustomerNominees().then(res => {
            const {data} = res;
            if(data.responseCode === '200') {
                dispatch({
                    type: COMMON.ON_CUSTOMER_NOMINEE_SUCCESS,
                    payload: data.response,
                });
            } else {
                dispatch({
                    type: COMMON.ON_CUSTOMER_NOMINEE_SUCCESS,
                    payload: data.response,
                });
            }
            
        }).catch(err => {
            dispatch({
                type: COMMON.ON_CUSTOMER_NOMINEE_FAIL,
                payload: 'Error in Server',
            });
        });
    }
}
