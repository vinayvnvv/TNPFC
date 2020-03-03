import TYPES from "../types";
const {DEPOSITE} = TYPES;

// Initial State
const initialState = {
    depositeList: null,
    fdSummary: null,
    fdLoans: null,
};

const depositeReducer = (state = initialState, action) => {
    switch (action.type) {
        case DEPOSITE.ON_DEPOSITE_LIST_LOAD:
            return {
                ...state,
                depositeList: null,
            }
        case DEPOSITE.ON_DEPOSITE_LIST_SUCCESS: 
            return {
                ...state,
                depositeList: action.payload
            }
        case DEPOSITE.ON_DEPOSITE_LIST_FAIL: 
            return {
                ...state,
                depositeList: action.payload
            }
        case DEPOSITE.ON_FD_SUMMARY_LOAD:
            return {
                ...state,
                fdSummary: null,
            }
        case DEPOSITE.ON_FD_SUMMARY_SUCCESS: 
            return {
                ...state,
                fdSummary: action.payload
            }
        case DEPOSITE.ON_FD_SUMMARY_FAIL: 
            return {
                ...state,
                fdSummary: action.payload
            }
        case DEPOSITE.ON_FD_LOAN_LOAD:
            return {
                ...state,
                fdLoans: null,
            }
        case DEPOSITE.ON_FD_LOAN_SUCCESS: 
            return {
                ...state,
                fdLoans: action.payload
            }
        case DEPOSITE.ON_FD_LOAN_FAIL: 
            return {
                ...state,
                fdLoans: action.payload
            }
        default: 
            return {
                ...state,
            }
    }
}

export default depositeReducer;