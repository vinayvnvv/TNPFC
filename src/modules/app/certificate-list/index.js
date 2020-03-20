import React from 'react';
import {connect} from 'react-redux';
import { Text, Container, Button, Left, Right, Body, Header, Icon, Title, View, Spinner } from 'native-base';
import {StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { THEME } from '../../../../config';
import { fetchAllDeposites } from '../../../store/actions/deposite-actions';
import { COMMON_STYLES } from '../../common/styles';
import { NAVIGATION } from '../../../navigation';


const Item = ({
    data,
    data: {
        accountNumber,
        productDesc,
    } = {},
    onItemClick,
}) => (
    <TouchableOpacity 
        style={styles.item} 
        activeOpacity={0.7}
        onPress={()=>onItemClick(data)}>
            <Text style={styles.itemAcc}>{accountNumber}</Text>
            <Text style={styles.productDesc}>{productDesc}</Text>
    </TouchableOpacity>
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
                                ListHeaderComponent={
                                    <View style={styles.listHeader}>
                                        <Text style={styles.listHeaderT}>Total ({depositeList && depositeList.length})</Text>
                                    </View>
                                }
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
        // padding: THEME.LAYOUT_PADDING,
    },
    listHeader: {
        backgroundColor: '#e6e6e6',
        paddingVertical: 11,
        paddingHorizontal: THEME.LAYOUT_PADDING,
    },
    listHeaderT: {
        color: '#444',
        fontWeight: '700'
    },
    item: {
        paddingHorizontal: THEME.LAYOUT_PADDING,
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 11,
        borderBottomWidth: 1,
        borderColor: '#d9d9d988',
        borderStyle: 'solid'
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