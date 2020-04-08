export const CONFIG = {
    APP: {
        TITLE: 'TNPFC',
        THEME: {
            PRIMARY: '#1338a3',
            PRIMARY_INVERT: '#ffffff',
            LAYOUT_PADDING: 21,
            SUCCESS: '#36b28a',
            ORANGE: '#eb9d3f',
            DANGER: '#ce3c3e',
            INFO: '#17a2b8'
        }
    },
    API: {
        // HOST: 'http://13.233.57.109:3001/tnpfc/v1/',
        // HOST: 'https://portal-api.tnpowerfinance.com/tnpfc/v1/',
        HOST: 'https://test-node-api.tnpowerfinance.com/tnpfc/v1/',
        HDFC_TRASACTIONS_STATUS: 'https://hdfcprodsigning.in/onepayVAS/',
    }
}
const THEME = CONFIG.APP.THEME;
export {THEME};