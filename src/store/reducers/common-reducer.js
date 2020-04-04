import TYPES from "../types";
const {COMMON} = TYPES;

// Initial State
const initialState = {
    userDetails: undefined,
    customerNominee: null,
    requestStatus: null,
    productDetails: [{"productId":"201","productName":"RIPS Regular Interest Payment","productAliasName":"RIPS","categoryId":"GENERAL_CATEGORY","tenure":24,"monthlyIntRate":0,"quarterlyIntRate":7.8,"yearlyIntRate":0,"onMaturityRate ":0,"remarks":"Minimum deposit amount 25000 and thereafter multiples of 1000."},{"productId":"201","productName":"RIPS Regular Interest Payment","productAliasName":"RIPS","categoryId":"GENERAL_CATEGORY","tenure":60,"monthlyIntRate":8.25,"quarterlyIntRate":8.31,"yearlyIntRate":8.57,"onMaturityRate ":0,"remarks":"Minimum deposit amount 25000 and thereafter multiples of 1000."},{"productId":"201","productName":"RIPS Regular Interest Payment","productAliasName":"RIPS","categoryId":"GENERAL_CATEGORY","tenure":48,"monthlyIntRate":8.25,"quarterlyIntRate":8.31,"yearlyIntRate":8.57,"onMaturityRate ":0,"remarks":"Minimum deposit amount 25000 and thereafter multiples of 1000."},{"productId":"201","productName":"RIPS Regular Interest Payment","productAliasName":"RIPS","categoryId":"GENERAL_CATEGORY","tenure":36,"monthlyIntRate":8.25,"quarterlyIntRate":8.31,"yearlyIntRate":8.57,"onMaturityRate ":0,"remarks":"Minimum deposit amount 25000 and thereafter multiples of 1000."},{"productId":"201","productName":"RIPS Regular Interest Payment","productAliasName":"RIPS","categoryId":"SENIOR_CITIZENS","tenure":24,"monthlyIntRate":0,"quarterlyIntRate":8.05,"yearlyIntRate":0,"onMaturityRate ":0,"remarks":"Minimum deposit amount 25000 and thereafter multiples of 1000."},{"productId":"201","productName":"RIPS Regular Interest Payment","productAliasName":"RIPS","categoryId":"SENIOR_CITIZENS","tenure":36,"monthlyIntRate":8.75,"quarterlyIntRate":8.81,"yearlyIntRate":9.11,"onMaturityRate ":0,"remarks":"Minimum deposit amount 25000 and thereafter multiples of 1000."},{"productId":"201","productName":"RIPS Regular Interest Payment","productAliasName":"RIPS","categoryId":"SENIOR_CITIZENS","tenure":60,"monthlyIntRate":8.75,"quarterlyIntRate":8.81,"yearlyIntRate":9.11,"onMaturityRate ":0,"remarks":"Minimum deposit amount 25000 and thereafter multiples of 1000."},{"productId":"201","productName":"RIPS Regular Interest Payment","productAliasName":"RIPS","categoryId":"SENIOR_CITIZENS","tenure":48,"monthlyIntRate":8.75,"quarterlyIntRate":8.81,"yearlyIntRate":9.11,"onMaturityRate ":0,"remarks":"Minimum deposit amount 25000 and thereafter multiples of 1000."},{"productId":"202","productName":"CIPS I Cummulative Interest Payment Scheme","productAliasName":"CIPS I","categoryId":"GENERAL_CATEGORY","tenure":12,"monthlyIntRate":0,"quarterlyIntRate":0,"yearlyIntRate":0,"onMaturityRate ":7.5,"remarks":"Minimum deposit amount 25000 and thereafter multiples of 1."},{"productId":"202","productName":"CIPS I Cummulative Interest Payment Scheme","productAliasName":"CIPS I","categoryId":"GENERAL_CATEGORY","tenure":48,"monthlyIntRate":0,"quarterlyIntRate":0,"yearlyIntRate":0,"onMaturityRate ":8.25,"remarks":"Minimum deposit amount 25000 and thereafter multiples of 1."},{"productId":"202","productName":"CIPS I Cummulative Interest Payment Scheme","productAliasName":"CIPS I","categoryId":"GENERAL_CATEGORY","tenure":24,"monthlyIntRate":0,"quarterlyIntRate":0,"yearlyIntRate":0,"onMaturityRate ":7.75,"remarks":"Minimum deposit amount 25000 and thereafter multiples of 1."},{"productId":"202","productName":"CIPS I Cummulative Interest Payment Scheme","productAliasName":"CIPS I","categoryId":"GENERAL_CATEGORY","tenure":36,"monthlyIntRate":0,"quarterlyIntRate":0,"yearlyIntRate":0,"onMaturityRate ":8.25,"remarks":"Minimum deposit amount 25000 and thereafter multiples of 1."},{"productId":"202","productName":"CIPS I Cummulative Interest Payment Scheme","productAliasName":"CIPS I","categoryId":"SENIOR_CITIZENS","tenure":48,"monthlyIntRate":0,"quarterlyIntRate":0,"yearlyIntRate":0,"onMaturityRate ":8.75,"remarks":"Minimum deposit amount 25000 and thereafter multiples of 1."},{"productId":"202","productName":"CIPS I Cummulative Interest Payment Scheme","productAliasName":"CIPS I","categoryId":"SENIOR_CITIZENS","tenure":36,"monthlyIntRate":0,"quarterlyIntRate":0,"yearlyIntRate":0,"onMaturityRate ":8.75,"remarks":"Minimum deposit amount 25000 and thereafter multiples of 1."},{"productId":"202","productName":"CIPS I Cummulative Interest Payment Scheme","productAliasName":"CIPS I","categoryId":"SENIOR_CITIZENS","tenure":12,"monthlyIntRate":0,"quarterlyIntRate":0,"yearlyIntRate":0,"onMaturityRate ":7.75,"remarks":"Minimum deposit amount 25000 and thereafter multiples of 1."},{"productId":"202","productName":"CIPS I Cummulative Interest Payment Scheme","productAliasName":"CIPS I","categoryId":"SENIOR_CITIZENS","tenure":24,"monthlyIntRate":0,"quarterlyIntRate":0,"yearlyIntRate":0,"onMaturityRate ":8,"remarks":"Minimum deposit amount 25000 and thereafter multiples of 1."},{"productId":"202","productName":"CIPS I Cummulative Interest Payment Scheme","productAliasName":"CIPS I","categoryId":"SENIOR_CITIZENS","tenure":60,"monthlyIntRate":0,"quarterlyIntRate":0,"yearlyIntRate":0,"onMaturityRate ":8.75,"remarks":"Minimum deposit amount 25000 and thereafter multiples of 1."},{"productId":"203","productName":"CIPS II Cummulative Interest Payment Scheme","productAliasName":"CIPS II","categoryId":"GENERAL_CATEGORY","tenure":48,"monthlyIntRate":0,"quarterlyIntRate":0,"yearlyIntRate":0,"onMaturityRate ":8.25,"remarks":"Minimum deposit amount 663 and thereafter multiples of 663."},{"productId":"203","productName":"CIPS II Cummulative Interest Payment Scheme","productAliasName":"CIPS II","categoryId":"GENERAL_CATEGORY","tenure":60,"monthlyIntRate":0,"quarterlyIntRate":0,"yearlyIntRate":0,"onMaturityRate ":8.25,"remarks":"Minimum deposit amount 663 and thereafter multiples of 663."},{"productId":"203","productName":"CIPS II Cummulative Interest Payment Scheme","productAliasName":"CIPS II","categoryId":"GENERAL_CATEGORY","tenure":36,"monthlyIntRate":0,"quarterlyIntRate":0,"yearlyIntRate":0,"onMaturityRate ":8.25,"remarks":"Minimum deposit amount 663 and thereafter multiples of 663."},{"productId":"203","productName":"CIPS II Cummulative Interest Payment Scheme","productAliasName":"CIPS II","categoryId":"GENERAL_CATEGORY","tenure":24,"monthlyIntRate":0,"quarterlyIntRate":0,"yearlyIntRate":0,"onMaturityRate ":7.75,"remarks":"Minimum deposit amount 663 and thereafter multiples of 663."},{"productId":"203","productName":"CIPS II Cummulative Interest Payment Scheme","productAliasName":"CIPS II","categoryId":"GENERAL_CATEGORY","tenure":12,"monthlyIntRate":0,"quarterlyIntRate":0,"yearlyIntRate":0,"onMaturityRate ":7.5,"remarks":"Minimum deposit amount 663 and thereafter multiples of 663."},{"productId":"203","productName":"CIPS II Cummulative Interest Payment Scheme","productAliasName":"CIPS II","categoryId":"SENIOR_CITIZENS","tenure":48,"monthlyIntRate":0,"quarterlyIntRate":0,"yearlyIntRate":0,"onMaturityRate ":8.75,"remarks":"Minimum deposit amount 663 and thereafter multiples of 663."},{"productId":"203","productName":"CIPS II Cummulative Interest Payment Scheme","productAliasName":"CIPS II","categoryId":"SENIOR_CITIZENS","tenure":24,"monthlyIntRate":0,"quarterlyIntRate":0,"yearlyIntRate":0,"onMaturityRate ":8,"remarks":"Minimum deposit amount 663 and thereafter multiples of 663."},{"productId":"203","productName":"CIPS II Cummulative Interest Payment Scheme","productAliasName":"CIPS II","categoryId":"SENIOR_CITIZENS","tenure":36,"monthlyIntRate":0,"quarterlyIntRate":0,"yearlyIntRate":0,"onMaturityRate ":8.75,"remarks":"Minimum deposit amount 663 and thereafter multiples of 663."},{"productId":"203","productName":"CIPS II Cummulative Interest Payment Scheme","productAliasName":"CIPS II","categoryId":"SENIOR_CITIZENS","tenure":12,"monthlyIntRate":0,"quarterlyIntRate":0,"yearlyIntRate":0,"onMaturityRate ":7.75,"remarks":"Minimum deposit amount 663 and thereafter multiples of 663."},{"productId":"203","productName":"CIPS II Cummulative Interest Payment Scheme","productAliasName":"CIPS II","categoryId":"SENIOR_CITIZENS","tenure":60,"monthlyIntRate":0,"quarterlyIntRate":0,"yearlyIntRate":0,"onMaturityRate ":8.75,"remarks":"Minimum deposit amount 663 and thereafter multiples of 663."}],
    // productDetails: null,
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
        case COMMON.ON_REQUEST_STATUS_LOAD:
            return {
                ...state,
                requestStatus: null,
            }
        case COMMON.ON_REQUEST_STATUS_SUCCESS: 
            return {
                ...state,
                requestStatus: action.payload
            }
        case COMMON.ON_REQUEST_STATUS_FAIL: 
            return {
                ...state,
                requestStatus: action.payload
            }
        case COMMON.ON_PRODUCT_DETAILS_LOAD:
            return {
                ...state,
                productDetails: null,
            }
        case COMMON.ON_PRODUCT_DETAILS_SUCCESS: 
            return {
                ...state,
                productDetails: action.payload
            }
        case COMMON.ON_PRODUCT_DETAILS_FAIL: 
            return {
                ...state,
                productDetails: action.payload
            }
        default: 
            return {
                ...state,
            }
    }
}

export default commonReducer;