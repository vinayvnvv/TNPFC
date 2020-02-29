import TYPES from "../types";

// Initial State
const initialState = {
    data: 'NOTHING',
};

const testReducer = (state = initialState, action) => {
    switch (action.type) {
        case TYPES.TEST.SAVE:
            return {
                ...state,
                data: action.payload,
            }
        default: 
            return {
                ...state,
            }
    }
}

export default testReducer;