import TYPES from "../types"
import apiServices from "../../services/api-services"


export const setAuth = (token, customerId) => {
    apiServices.setHeadersInfo(token, customerId);
    return (dispatch) => {
        dispatch({
            type: TYPES.AUTH.TOKEN,
            payload: {token, customerId},
        })
    }
}

export const loadAuth = () => {
    return (dispatch) => {
        dispatch({
            type: TYPES.AUTH.LOAD,
        })
    }
}

export const removeAuth = () => {
    return (dispatch) => {
        dispatch({
            type: TYPES.AUTH.REMOVE,
        })
    }
}