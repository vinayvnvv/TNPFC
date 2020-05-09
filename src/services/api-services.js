import axios from 'axios';
import { CONFIG } from '../../config';
const {API} = CONFIG;
const {HOST, HDFC_TRASACTIONS_STATUS, S3_SIGNED_URL} = API;
class APIService {
    token;
    customerId;
    getConfig(token) {
        token = token ? token : (this.token || {});
        const config = {
            headers: {
                'x-access-token': token || '',
                'Content-Type': 'application/json',
            }
        }
        return (config);
    }
    setHeadersInfo(token, customerId) {
        console.log('setHeadersInfo', customerId)
        this.token = token;
        this.customerId = customerId;
    }
    fetch(url) {
        return axios.get(url, this.getConfig());
    }
    getOTP(panNumber) {
        return axios.post(HOST + 'otplogin', {panNumber, channel: 'app'});
    }
    verifyOTP(otp, panNumber) {
        return axios.post(HOST + 'verifyotp', {otp, panNumber});
    }
    fetchAllDeposites() {
        return axios.post(HOST + 'getallFdDetails', {customerId: this.customerId}, this.getConfig());
    }
    fetchCustomerDetails() {
        return axios.post(HOST + 'getCustomerDetails', {customerId: this.customerId}, this.getConfig());
    }
    fetchFDSummary(accountNumber) {
        return axios.post(HOST + 'getFdSummary', {accountNumber}, this.getConfig());
    }
    fetchCustomerNominees() {
        return axios.post(HOST + 'getCustomerNominees', {customerId: this.customerId}, this.getConfig());
    }
    fetchFdLoans() {
        return axios.post(HOST + 'getFdLoans', {customerId: this.customerId}, this.getConfig());
    }
    depositeRenewFD(data) {
        const dataBody = {
            ...data,
            customerId: this.customerId,
        };
        console.log(data, this.customerId);
        return axios.post(HOST + 'depositRenewFd', dataBody, this.getConfig());
    }
    applyLoan(depositNumber, loanAmt) {
        const data = {
            customerId: this.customerId,
            purpose: 'LOAN_ON_DEPOSIT',
            depositNumber,
            loanAmt,
        }
        return axios.post(HOST + 'loanAgainstDeposit', data, this.getConfig());
    }
    depositClosure(data) {
        const bodyData = {
            ...data,
            customerId: this.customerId,
        }
        return axios.post(HOST + 'depositClosure', bodyData, this.getConfig());
    }
    fetchRequestStatus() {
        return axios.post(HOST + 'requestStatus', {customerId: this.customerId}, this.getConfig());
    }
    fetchProductDetails() {
        return axios.post(HOST + 'getProductDetails', {}, this.getConfig());
    }
    getPGPayload(data) {
        console.log('getPGPayload', data, this.getConfig());
        data['customerId'] = this.customerId;
        return axios.post(HOST + 'getPGPayload', data, this.getConfig());
    }
    paymentSucess(transactionId, token, paymentType) {
        console.log('calling paymentSucess-->', {transactionId, token, paymentType})
        return axios.post(HOST + 'paymentSucess', {transactionId, paymentType}, this.getConfig(token));
    }
    getTxnDetails(merchantId, txnId) {
        console.log('getTxnDetails', merchantId, txnId);
        if(merchantId && txnId) {
            return axios.post(HDFC_TRASACTIONS_STATUS + `getTxnDetails?merchantId=${merchantId}&txnId=${txnId}`);
        } else {
            console.log('returing new promise')
            return new Promise((res) => {
                res({data: {}});
            });
        }
        
    }
    documentVerify(data) {
        return axios.post(HOST + 'documentVerify', data, this.getConfig());
    }
    fetchStates() {
        return axios.post(HOST + 'states', {}, this.getConfig());
    }
    fetchDistricts() {
        return axios.post(HOST + 'districts', {}, this.getConfig());
    }
    fetchRelationshipList() {
        return axios.post(HOST + 'getRelationshipList', {}, this.getConfig());
    }
    registerPhoneNumber(phoneNumber) {
        return axios.post(HOST + 'registerPhoneNumber', {phoneNumber}, this.getConfig());
    }
    verifyRegisterPhonenumber(phoneNumber, otp) {
        return axios.post(HOST + 'verifyRegisterPhonenumber', {phoneNumber, otp}, this.getConfig());
    }
    getResidentList() {
        return axios.post(HOST + 'getResidentList', {}, this.getConfig());
    }
    createUser(data, token) {
        return axios.post(HOST + 'createUser', data, this.getConfig(token));
    }
    getAddressProofDocList() {
        return axios.post(HOST + 'getAddressProofDocList', {}, this.getConfig());
    }
    createServiceRequest(data) {
        return axios.post(HOST + 'createServiceRequest', data, this.getConfig());
    }
    getCountriesList() {
        return axios.post(HOST + 'countries', {}, this.getConfig());
    }
    getBankDetails(ifscCode) {
        return axios.post(HOST + 'getBankDetails', {ifscCode}, this.getConfig());
    }
    getQrCodeUrl(encDepositNumber) {
        return axios.post(HOST + 'getQrCodeUrl', {encDepositNumber}, this.getConfig());
    }
    uploadToS3(url, file) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', url);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                if(xhr.status === 200) {
                    resolve(xhr.response);
                } else {
                    reject(true);
                }
                }
            };
            xhr.send(file);
        })
    }
    getSignedURL(docType, fileName) {
        const data ={
            docType, fileName, customerId: this.customerId || (new Date().toISOString()),
        };
        console.log('getSignedURL', data);
        return axios.post(S3_SIGNED_URL + 'getSignedURL', data, this.getConfig());
    }
    sendSms(data) {
        return axios.post(HOST + 'sendSms', data, this.getConfig());
    }

    checkMobileAppVersion() {
        return axios.get(HOST + 'check-mobile-app-version', this.getConfig());
    }
}
export default new APIService();