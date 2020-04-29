export const DEV_ENV = http => (http ? {
    HOST: 'http://test-node-api.tnpowerfinance.com/tnpfc/v1/',
    HDFC_TRASACTIONS_STATUS: 'http://hdfcprodsigning.in/onepayVAS/',
    HDFC_FORM_PAYMENT: 'http://hdfcprodsigning.in/onepayVAS/payprocessorV2', 
} : {
    HOST: 'https://test-node-api.tnpowerfinance.com/tnpfc/v1/',
    HDFC_TRASACTIONS_STATUS: 'https://hdfcprodsigning.in/onepayVAS/',
    HDFC_FORM_PAYMENT: 'https://hdfcprodsigning.in/onepayVAS/payprocessorV2', 
});