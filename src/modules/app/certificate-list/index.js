import React from 'react';
import {connect} from 'react-redux';
import { Text, Container, Button, Left, Right, Body, Header, Icon, Title, View, Spinner } from 'native-base';
import {StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { THEME } from '../../../../config';
import { fetchAllDeposites } from '../../../store/actions/deposite-actions';
import { COMMON_STYLES } from '../../common/styles';
import { NAVIGATION } from '../../../navigation';
import utils from '../../../services/utils';


const Item = ({
    data,
    data: {
        accountNumber,
        productDesc,
        depositAmount,
        openDate,
    } = {},
    onItemClick,
}) => (
    <View 
        style={styles.item} >
            <View style={styles.left}>
                <View style={styles.dtls}>
                    <Text style={styles.dtlsLabel}>Scheme Name</Text>
                    <Text style={styles.dtlsValue}>{productDesc}</Text>
                </View>
                <View style={styles.dtls}>
                    <Text style={styles.dtlsLabel}>FD No.</Text>
                    <Text style={styles.dtlsValue}>{accountNumber}</Text>
                </View>
                <View style={styles.dtls}>
                    <Text style={styles.dtlsLabel}>Deposited Amount</Text>
                    <Text style={styles.dtlsValue}>{depositAmount}</Text>
                </View>
                <View style={styles.dtls}>
                    <Text style={styles.dtlsLabel}>Date</Text>
                    <Text style={styles.dtlsValue}>{utils.getAppCommonDateFormat(openDate)}</Text>
                </View>
                
            </View>
            <View style={styles.right}>
                <Button 
                    onPress={()=>onItemClick(data)} 
                    style={styles.btnOpen} 
                    small><Text>Open</Text></Button>
            </View>
    </View>
);

class CertificateList extends React.Component {
    state = {
        pageInit: false,
    }
    async componentDidMount() {
        const {fetchAllDeposites, depositeList} = this.props;
        if(!depositeList) await fetchAllDeposites();
        this.setState({pageInit: true});
    }
    goBack = () => {
        const {navigation} = this.props;
        navigation.goBack();
    }
    onItemClick = data => {
        const {navigation} = this.props;
        navigation.navigate(NAVIGATION.VIEW_CERTIFICATE, {
            title: data.productDesc,
            url: data.eFdrUrl, 
        })
    }
    render() {
        const {pageInit} = this.state;
        const {depositeList} = this.props;
        return (
            pageInit ? (
                <Container>
                    <Header>
                        <Left>
                            <Button transparent onPress={this.goBack}>
                                <Icon name='arrow-back' />
                            </Button>
                        </Left>
                        <Body>
                            <Title>Certificates</Title>
                        </Body>
                        <Right />
                    </Header>
                    <Container style={styles.container}>
                        {depositeList && depositeList.length > 0 && (
                            <FlatList
                                data={depositeList}
                                // ListHeaderComponent={
                                //     <View style={styles.listHeader}>
                                //         <Text style={styles.listHeaderT}>Total ({depositeList && depositeList.length})</Text>
                                //     </View>
                                // }
                                renderItem={({ item }) => (
                                <Item
                                    onItemClick={this.onItemClick}
                                    data={item}
                                />
                                )}
                                keyExtractor={item => item.accountNumber}
                            />
                        )}
                    </Container>
                </Container>
            ) : (
                <Container>
                    <View style={COMMON_STYLES.spinnerContainerFullScreen}>
                        <Spinner />
                        <Text style={COMMON_STYLES.spinnerContainerFullScreenText}>Loading Data...</Text>
                    </View>
                </Container>
            )
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: (THEME.LAYOUT_PADDING - 5),
        paddingTop: 0
    },
    listHeader: {
        backgroundColor: '#e6e6e6',
        paddingVertical: 11,
        paddingHorizontal: THEME.LAYOUT_PADDING,
        marginTop: (THEME.LAYOUT_PADDING * 2),
    },
    listHeaderT: {
        color: '#444',
        fontWeight: '700'
    },
    item: {
        ...utils.getBoxShadow(2, '#000000'),
        paddingHorizontal: THEME.LAYOUT_PADDING,
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 11,
        marginHorizontal: 5,
        marginVertical: 11,
        backgroundColor: '#ecf1f9',
        borderRadius: 3,
        // borderBottomWidth: 1,
        // borderColor: '#d9d9d988',
        // borderStyle: 'solid',
    },
    left: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        maxWidth: '100%'
    },
    right: {
        marginTop: 9,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    dtls: {
        flexDirection: 'column',
        marginVertical: 7,
        paddingHorizontal: 2,
        width: '50%'
    },
    dtlsLabel: {
        color: THEME.PRIMARY,
        fontWeight: 'bold',
        fontSize: 14,
    },
    dtlsValue: {
        color: '#666',
        fontSize: 14,
    },
    btnOpen: {
        paddingHorizontal: 3,
    },
    itemAcc: {
        width: '40%',
    },
    productDesc: {
        width: '60%'
    }
});

const mapStateToProps = state => ({
    depositeList: state.depositeReducer.depositeList,
});

export default connect(
    mapStateToProps,
    {fetchAllDeposites}
)(CertificateList);