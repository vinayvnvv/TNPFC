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

export const fetchRequestStatus = () => {
    return (dispatch) => {
        dispatch({
            type: COMMON.ON_REQUEST_STATUS_LOAD,
        });

        return apiServices.fetchRequestStatus().then(res => {
            const {data} = res;
            if(data.responseCode === '200') {
                dispatch({
                    type: COMMON.ON_REQUEST_STATUS_SUCCESS,
                    payload: data.response,
                });
            } else {
                dispatch({
                    type: COMMON.ON_REQUEST_STATUS_SUCCESS,
                    payload: data.response,
                });
            }
            
        }).catch(err => {
            dispatch({
                type: COMMON.ON_REQUEST_STATUS_FAIL,
                payload: 'Error in Server',
            });
        });
    }
}

export const fetchProductDetails = () => {
    return (dispatch) => {
        dispatch({
            type: COMMON.ON_PRODUCT_DETAILS_LOAD,
        });

        return apiServices.fetchProductDetails().then(res => {
            const {data} = res;
            if(data.responseCode === '200') {
                dispatch({
                    type: COMMON.ON_PRODUCT_DETAILS_SUCCESS,
                    payload: data.response,
                });
            } else {
                dispatch({
                    type: COMMON.ON_PRODUCT_DETAILS_SUCCESS,
                    payload: data.response,
                });
            }
            
        }).catch(err => {
            dispatch({
                type: COMMON.ON_PRODUCT_DETAILS_FAIL,
                payload: 'Error in Server',
            });
        });
    }
}

export const fetchStates = () => {
    return (dispatch) => {
        apiServices.fetchStates().then(res => {
            const {data} = res;
            if(data && data.responseCode === '200') {
                dispatch({
                    type: COMMON.ON_FETCH_STATES,
                    payload: data.response,
                });
            }
        })
    }
}

export const fetchDistricts = () => {
    return (dispatch) => {
        apiServices.fetchDistricts().then(res => {
            const {data} = res;
            if(data && data.responseCode === '200') {
                dispatch({
                    type: COMMON.ON_FETCH_DISTRICTS,
                    payload: data.response,
                });
            }
        })
    }
}

export const fetchRelationshipList = () => {
    return (dispatch) => {
        apiServices.fetchRelationshipList().then(res => {
            const {data} = res;
            if(data && data.responseCode === '200') {
                dispatch({
                    type: COMMON.ON_FETCH_RELATIONSHIP,
                    payload: data.response,
                });
            }
        })
    }
}

export const getResidentList = () => {
    return (dispatch) => {
        apiServices.getResidentList().then(res => {
            const {data} = res;
            if(data) {
                dispatch({
                    type: COMMON.ON_FETCH_RESIDENT_STATUS,
                    payload: data.response,
                });
            }
        })
    }
}

export const getCountriesList = () => {
    return (dispatch) => {
        apiServices.getCountriesList().then(res => {
            const {data} = res;
            if(data) {
                dispatch({
                    type: COMMON.ON_FETCH_COUNTRIES,
                    payload: data.response,
                });
            }
        })
    }
}

export const getAddressProofDocList = () => {
    return (dispatch) => {
        apiServices.getAddressProofDocList().then(res => {
            const {data} = res;
            if(data) {
                dispatch({
                    type: COMMON.ON_FETCH_ADDRESS_PROOF_DOCS,
                    payload: data.response,
                });
            }
        })
    }
}

export const checkMobileAppVersion = () => {
    return (dispatch) => {
        // setTimeout(()=>{
        //     dispatch({
        //         type: COMMON.ON_MOBILE_APP_VERSION_CHECK,
        //         payload: {"ios":{"version":"1.7.0","updateTitle":"New Version Found","updateDesc":"Please Update the app to newer version","actions":[{"text":"Update","link":"http://google.com"}],"updateFeatures":["Added QR Code","Added Closed FD"]},"android":{"version":"1.8.0","updateTitle":"New Version Found (1.7.0)","updateDesc":"To use the app, please update to the newer version(1.7.0)","actions":[{"text":"Update","link":"http://google.com","theme":"info"},{"text":"See WebView","link":"http://google.com","theme":"warning"}],"updateFeatures":["Added QR Code","Added Closed FD"]}},
        //     });
        // }, 1000);
        apiServices.checkMobileAppVersion().then(res => {
            const {data} = res;
            if(data && data.responseCode == '200') {
                dispatch({
                    type: COMMON.ON_MOBILE_APP_VERSION_CHECK,
                    payload: data.response,
                });
            }
        })
    }
}
