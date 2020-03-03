import TYPES from "../types";
const {COMMON} = TYPES;

// Initial State
const initialState = {
    userDetails: undefined,
    customerNominee: null,
};

const commonReducer = (state = initialState, action) => {
    switch (action.type) {
        case COMMON.ON_CUSTOMER_DETAILS_LOAD:
            return {
                ...state,
                userDetails: undefined,
            }
        case COMMON.ON_CUSTOMER_DETAILS_SUCCESS: 
            return {
                ...state,
                userDetails: action.payload
            }
        case COMMON.ON_CUSTOMER_DETAILS_FAIL: 
            return {
                ...state,
                userDetails: action.payload
            }
        case COMMON.ON_CUSTOMER_NOMINEEY_LOAD:
            return {
                ...state,
                customerNominee: null,
            }
        case COMMON.ON_CUSTOMER_NOMINEE_SUCCESS: 
            return {
                ...state,
                customerNominee: action.payload
            }
        case COMMON.ON_CUSTOMER_NOMINEE_FAIL: 
            return {
                ...state,
                customerNominee: action.payload
            }
        default: 
            return {
                ...state,
            }
    }
}

export default commonReducer;