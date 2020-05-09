import moment from 'moment';
import { Linking, Platform } from 'react-native';
import { CONFIG } from './../../config';
import icons from '../../assets/icons';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import { Toast } from 'native-base';
import { Linking as ExpoLinking } from 'expo';
class Utils {
    getAppCommonDateFormat(date) {
        if(!this.isIsoDate(date)) return date;
        return moment(date ? date : new Date()).format('DD-MMM-YYYY');
    }
    getBoxShadow(radius, color, opacity) {
        return {
            shadowColor: color ? color : '#d9d9d9',
            shadowRadius: radius ? radius : 0,
            shadowOpacity: opacity ? opacity : 0.5,
            elevation: radius ? radius : 0,
            position: 'relative',
            backgroundColor: color ? color : '#d9d9d9',
        }
    }

    domain_from_url(url) {
        var result;
        var match;
        if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
            result = match[1];
            if (match = result.match(/^[^\.]+\.(.+\..+)$/)) {
                result = match[1];
            }
        }
        return result;
    }

    convertToINRFormat(number) {
        return String(number).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
    }

    getPieChartAsHTML(slices) {
        let cumulativePercent = 0;

        function getCoordinatesForPercent(percent) {
            const x = Math.cos(2 * Math.PI * percent);
            const y = Math.sin(2 * Math.PI * percent);
            return [x, y];
        }
        let p = '';
        slices.forEach(slice => {
            // destructuring assignment sets the two variables at once
            const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
            
            // each slice starts where the last slice ended, so keep a cumulative percent
            cumulativePercent += slice.percent;
            
            const [endX, endY] = getCoordinatesForPercent(cumulativePercent);

            // if the slice is more than 50%, take the large arc (the long way around)
            const largeArcFlag = slice.percent > .5 ? 1 : 0;
            console.log('startX', startX);
            console.log('startY', startY);
            console.log('endX', endX);
            console.log('endY', endY);
            console.log('largeArcFlag', largeArcFlag);
            console.log(startX, startY, endX, endY, '-----')

            let xTextPos = ((startX + endX + largeArcFlag) / 3);
            let yTextPos = ((startY + endY + largeArcFlag) / 3);
            if(largeArcFlag === 1) {
                xTextPos = xTextPos * -1;
                yTextPos = yTextPos * -1;
            }

                // create an array and join it just for code readability
            const pathData = [
                `M ${startX} ${startY}`, // Move
                `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
                `L 0 0`, // Line
            ].join(' ');
            p = p + `<path d="${pathData}" fill="${slice.color}"></path>`;
            // p = p + `<text x="${xTextPos}" y="${yTextPos}" fill="#fff" style='font-size: 0.2'>${parseInt(slice.percent * 100)}%</text>`
        });
        return `<html>
                    <head>
                        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
                    </head>
                    <body>
                        <svg width="200" height="200" viewBox="-1 -1 2 2">${p}</svg>
                    </body>
                </html>`;
        }

        getPaymentHTML(data) {
            return `
                <div>
                    <form #form ngNoForm action="${CONFIG.API.HDFC_FORM_PAYMENT}" method="POST">
                                    
                        <input type="text" type="hidden" name="reqData" value="${data.reqData}">
                        <input type="text" type="hidden" name="merchantId" value="${data.merchantId}">
                    
                    </form>
                    <div class="_load">
                        <h1>Loading</h1>
                    </div>
                </div>
                    <style>
                        input {
                            height: 0px;
                            width: 0px;
                            pointer-events: none;
                            opacity: 0;
                        }
                        ._load {
                            position: fixed;
                            top: 0;
                            left: 0;
                            height: 100%;
                            width: 100%;
                            background-color: #fff;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                    </style>
                    <script>
                        window.document.forms[0].submit();
                    </script>
                `;
        }
        openLink = async (url) => {
            // Checking if the link is supported for links with custom URL scheme.
            const supported = await Linking.canOpenURL(url);
        
            if (supported) {
              // Opening the link with some app, if the URL scheme is "http" the web link should be opened
              // by some browser in the mobile
              await Linking.openURL(url);
            } else {
              Alert.alert(`Don't know how to open this URL: ${url}`);
            }
        }

        isProductionEnv(host) {
            return (host || '').indexOf('portal-api') !== -1;
        }

        findArrayIndexWithAttr(array, attr, value) {
            for(var i = 0; i < array.length; i += 1) {
                if(array[i][attr] === value) {
                    return i;
                }
            }
            return -1;
        }

        getFileType(uri) {
            if(uri) {
                return uri.split('.').pop();
            } else {
                return 'unknown';
            }
        }
        getFileImage(uri) {
            const type = this.getFileType(uri);
            if(type === 'pdf') {
                return icons.PdfIcon;
            }
            if(type === 'png' || type === 'jpg' || type === 'jpeg') {
                return {uri};
            }
        }
        isIsoDate(str) {
            if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return true;
            return false;
        }
        downloadFile(url, callback) {
            if(Platform.OS === 'web') {
                window.open(url, '_blank');
                callback(true);
            }
            const uri = url ? url : "https://d6m921ss8dr76.cloudfront.net/paymentAdvice/TNPFCL1588661289237966-paymentAdvice.pdf";
            let fileUri = FileSystem.documentDirectory + uri.split('/').pop();
            FileSystem.downloadAsync(uri, fileUri)
            .then(({ uri }) => {
                this.saveFile(uri, callback);
              })
              .catch(error => {
                console.error(error);
                callback(true);
              })
        }
        
        saveFile = async (fileUri, callback) => {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status === "granted") {
                const asset = await MediaLibrary.createAssetAsync(fileUri);
                // console.log(asset)
                // const uriArr = asset.uri.split('/');
                // const fileN = uriArr.pop();
                // uriArr.pop();
                // const loc = uriArr.join('/') + '/Download/' + fileN;
                // const a = await MediaLibrary.createAlbumAsync("Download", asset, false);
                // console.log(loc, a);
                callback(false, asset);
                Toast.show({
                    text: 'Saved to Downloads.',
                    position: 'bottom',
                    duration: 5000,
                    buttonText: 'CLOSE',
                    buttonTextStyle: {
                        fontWeight: '700',
                    },
                });
            }
        }

        isOldVersion(versionData = {}) {
            console.log('checking version ', versionData, CONFIG.APP.APP_VERSION);
            if(Platform.OS === 'ios') {
                const {version} = versionData['ios'];
                if(version !== CONFIG.APP.APP_VERSION) return true;
            } else {
                const {version} = versionData['android'];
                if(version !== CONFIG.APP.APP_VERSION) return true;
            }
        }
}

export default new Utils();