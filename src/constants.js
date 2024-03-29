export const CONSTANTS = {
    REGEX: {
        NAME_WITH_SPACE: {
            PATTERN: /^[A-Za-z ]+$/,
            MESSAGE: field => {
                return `${field} cannot contains numbers and special characters`
            }
        },
        EMAIL: {
            PATTERN: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/,
            MESSAGE: field => {
                return `Email is invalid.`
            }
        },
        NUMBER: /^\d*[0-9]\d*$/,
        AADHAAR: {
            PATTERN: /^\d{12}$/,
            MESSAGE: field => {
                return `Aadhaar Number is invalid.`
            }
        },
        PAN: {
            PATTERN: /^([A-Z]{5}[0-9]{4}[A-Z]{1})$/,
            MESSAGE: field => {
                return `PAN number in invalid.`
            }
        },
        MOBILE: {
            PATTERN: /^\d{10}$/,
            MESSAGE: field => {
                return `${field} is invalid.`
            },
        },
        IFSC: {
            PATTERN: /^[A-Za-z]{4}\d{7}$/,
            MESSAGE: () => {
                return 'IFSC Code is invalid';
            },
        }
    }
}

const TEXTS = {
    TERMS: 'Click here to read the terms and conditions before you proceed to select payment type',
    UPLOAD_AREA_MSG: '(Use camera to capture or upload file from mobile phone)',
}

const {REGEX} = CONSTANTS;
export {REGEX, TEXTS};