import TYPES from "../types";
const {DEPOSITE} = TYPES;

// Initial State
const initialState = {
    depositeList: null,
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
        default: 
            return {
                ...state,
            }
    }
}

export default depositeReducer;