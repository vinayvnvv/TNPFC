import React from 'react';
import { Container, View, Header, Left, Button, Icon, Title, Body, Right, Toast, Spinner } from 'native-base';
import { StyleSheet, Text, BackHandler } from 'react-native';
import utils from './../../../services/utils';
import { THEME } from '../../../../config';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import apiServices from '../../../services/api-services';
import { COMMON_STYLES } from '../styles';

const DEFAULT_S3_FOLDER = 'extras';
const INVALID_FILE_ERR = 'Invalid file type.';

class Uploader extends React.Component {
    state = {
        loading: false,
    };
    close = () => {
        const {
            navigation,
        } = this.props;
        navigation.goBack();
    }
    launchCamera = () => {
        ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }).then(result => {
            if (result.cancelled) {
                return;
            }
            this.upload(result);
            console.log(result);
        });
    }
    pickDocument = () => {
        const {
            route : {
                params: {
                    accept,
                    invalidFileErrMsg,
                } = {},
            } = {}
        } = this.props;
        DocumentPicker.getDocumentAsync({
            type: accept && Array.isArray(accept) && accept.length === 1 ? accept[0] : '*/*',
        }).then(result => {
            const { name, size, cancelled } = result;
            if (cancelled) {
                return;
            }
            if(accept && Array.isArray(accept) && accept.length > 1) {
                if(!this.isValidFileTypes(name, accept)) {
                    console.log('invalid file type');
                    Toast.show({
                        text: invalidFileErrMsg || INVALID_FILE_ERR,
                        type: 'warning',
                        duration: 5000,
                    });
                    return;
                }
            }
            this.upload(result);
            console.log('pickDocument', result);
        })
    }

    isValidFileTypes = (name, types) => {
        const fileType = name.split('.').pop();
        for(let i=0;i<types.length;i++) {
            const t = types[i].split('/').pop();
            if(t === fileType) return true;
        }
        return false;
    }

    getFileBlob = (url, cb) => {
        console.log('getFileBlob');
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.addEventListener('load', function() {
            cb(xhr.response);
        });
        xhr.send();
    };

    blobToFile = (blob, name) =>  {
        console.log('blobToFile')
            blob.lastModifiedDate = new Date();
            blob.name = name;
            return blob;
    };

    getFileObject = (filePathOrUrl, filename, cb) => {
        console.log('getFileObject');
        this.getFileBlob(filePathOrUrl,  (blob) => {
            cb(this.blobToFile(blob, filename));
        });
    };

    upload = async (result) => {
        const {
            navigation,
            route : {
                params: {
                    onUpload,
                    name,
                    s3Folder,
                } = {},
            } = {}
        } = this.props;
        // ImagePicker saves the taken photo to disk and returns a local URI to it
        let localUri = result.uri;
        let filename = localUri.split('/').pop();
        this.setState({loading: true});
        try {
            this.getFileObject(localUri, filename,  (fileObject) => {
                apiServices.getSignedURL(
                    s3Folder || DEFAULT_S3_FOLDER,
                    filename
                ).then(res1 => {
                    console.log(res1);
                    const {data: {
                        docLink, signedURL,
                    } = {}} = res1;
                    console.log('res1', docLink, signedURL);
                    if(docLink && signedURL) {
                        apiServices.uploadToS3(docLink, fileObject).then(res2 => {
                            console.log('uploaod success');
                            if(onUpload) {
                                this.setState({loading: false}, () => {
                                    onUpload(name, signedURL);
                                    navigation.goBack();
                                });
                            } else {
                                this.setState({loading: false});
                            }
                        }).catch(err => {
                            this.setState({loading: false});
                            this.showError();
                            console.log('upload err');
                        })
                    } else {
                        this.setState({loading: false});
                        this.showError();
                    }
                }).catch(err => {
                    this.setState({loading: false});
                    this.showError();
                    console.log(err.response);
                })
            }); 
        } catch(err) {
            console.log(err);
            this.setState({loading: false});
        }
    }
    showError = () => {
        Toast.show({
            text: 'We have trouble in uploading a file, Please try again!',
            type: 'danger',
            duration: 5000,
        });
    }
    render() {
        const {loading} = this.state;
        const {
            route : {
                params: {
                    helpText,
                } = {},
            } = {}
        } = this.props;
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={this.close}>
                            <Icon name='close' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Upload</Title>
                    </Body>
                    <Right />
                </Header>
                {!loading ?  (
                    <Container style={styles.container}>
                        <View style={styles.card}>
                            <View style={styles.item}>
                                <TouchableOpacity activeOpacity={0.5} style={styles.itemClick} onPress={this.pickDocument}>
                                    <Icon style={styles.icn} name={'document'}/>
                                    <Text style={styles.cardTtl}>Local File</Text>
                                    {helpText && <Text style={styles.helpText}>{helpText}</Text>}
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.card}>
                            <View style={styles.item}>
                                <TouchableOpacity activeOpacity={0.5} style={styles.itemClick} onPress={this.launchCamera}>
                                    <Icon style={styles.icn} name={'camera'}/>
                                    <Text style={styles.cardTtl}>Camera</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Container>
                ) : (
                    <Container>
                        <View style={COMMON_STYLES.spinnerContainerFullScreen}>
                            <Spinner />
                            <Text style={COMMON_STYLES.spinnerContainerFullScreenText}>Uploading...</Text>
                        </View>
                    </Container>
                )}
                
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: THEME.LAYOUT_PADDING,
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center"
    },
    card: {
        flex: 1,
        height: '50%',
        paddingVertical: 21,
        paddingHorizontal: 31,
        width: '100%',
        justifyContent: "center",
        alignItems: 'center',
        position: 'relative'
    },
    item: {
        // ...utils.getBoxShadow(9, '#999'),
        backgroundColor: '#fff',
        borderRadius: 5,
        width: '100%',
        height: '100%',
        maxWidth: 200,
        maxHeight: 200,
        flexDirection: 'row',
        // alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#d0d0d0',
        borderStyle: 'solid',
        borderWidth: 1,
    },
    cardTtl: {
        fontSize: 22,
        fontWeight: '700',
        color: THEME.PRIMARY,
        marginTop: 21,
    },
    icn: {
        fontSize: 42,
        color: '#666'
    },
    itemClick: {
        minHeight: '100%',
        minWidth: 200,
        flexDirection: 'column',
        flexGrow: 1,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    helpText: {
        color: THEME.INFO,
        fontWeight: '700',
        fontSize: 10,
        marginTop: 9,
    }
});


export {Uploader};