import TYPES from "../types";

// Initial State
const initialState = {
    token: null,
    customerId: null,
};

const authReducer = (state = initialState, action) => {
    console.log('authReducer', action);
    switch (action.type) {
        case TYPES.AUTH.TOKEN:
            return {
                ...state,
                token: action.payload.token,
                customerId: action.payload.customerId,
            }
        case TYPES.AUTH.LOAD:
            return {
                ...state,
                token: null,
            }
        case TYPES.AUTH.REMOVE:
            return {
                ...state,
                token: false,
                customerId: null,
            }  
        default: 
            return {
                ...state,
            }
    }
}

export default authReducer;