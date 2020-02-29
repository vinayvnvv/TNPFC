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
            console.log('fetchAllDeposites err', err);
            dispatch({
                type: DEPOSITE.ON_DEPOSITE_LIST_FAIL,
                payload: 'Error in Server',
            });
        });
    }
}
