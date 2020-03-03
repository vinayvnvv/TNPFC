import {AsyncStorage} from 'react-native';
class AuthService {
    key = 'auth-token';

    setAuth(token, customerId) {
        const data = {token, customerId};
        return AsyncStorage.setItem(this.key, JSON.stringify(data));
    }

    getAuth() {
        return new Promise(async (res, rej) => {
            try {
                const data = await AsyncStorage.getItem(this.key);
                res(JSON.parse(data));
            } catch(err) {
                rej(err);
            } 
        })
    }
    removeAuth() {
        return new Promise(async (res, rej) => {
            try {
                await AsyncStorage.removeItem(this.key);
                res();
            } catch(err) {
                rej();
            } 
        })
    }
}
export default new AuthService();