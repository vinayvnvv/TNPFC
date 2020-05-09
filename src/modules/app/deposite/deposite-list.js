import React from 'react';
import {connect} from 'react-redux';
import { Container, Text, Button, Icon, Left, Right, Header, Body, Title, Spinner} from 'native-base';
import {
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    View,
    Image,
  } from 'react-native';
import { CONFIG } from '../../../../config';
import {fetchAllDeposites} from './../../../store/actions/deposite-actions';
import utils from '../../../services/utils';
import icons from '../../../../assets/icons';
import { NAVIGATION } from '../../../navigation';
import FlexBox from '../../common/components/FlexBox';

const {THEME} = CONFIG.APP;

const Item = ({
    data,
    data: {
        productAliasName,
        openDate,
        maturityDate,
        accountStatus,
        accountNumber,
    } = {},
    onPress,
}) => (
    <View style={styles.listItemContainer}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => onPress(data)}>
            <View style={styles.listItem}>
                <View style={styles.listItemTop}>
                    <Text style={styles.listItemTitle}>Schema Name</Text>
                    <Text style={styles.listItemSubTitle}>{productAliasName}</Text>
                </View>
                <View style={styles.listItemBottom}>
                    <View style={styles.listItemDRow}>
                        <Text style={styles.listItemDRowLabel}>Account No</Text>
                        <Text style={styles.listItemDRowValue}>{accountNumber}</Text>
                    </View>
                    <View style={styles.listItemDRow}>
                        <Text style={styles.listItemDRowLabel}>Status</Text>
                        <Text style={styles.listItemDRowValue}>{accountStatus}</Text>
                    </View>
                    <View style={styles.listItemDRow}>
                        <Text style={styles.listItemDRowLabel}>Start Date</Text>
                        <Text style={styles.listItemDRowValue}>{utils.getAppCommonDateFormat(openDate)}</Text>
                    </View>
                    <View style={styles.listItemDRow}>
                        <Text style={styles.listItemDRowLabel}>Maturity Date</Text>
                        <Text style={styles.listItemDRowValue}>{utils.getAppCommonDateFormat(maturityDate)}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    </View>
);
const getActiveColor = status => {
    if(status) return {color: THEME.PRIMARY, fontWeight: '700'};
    else return {};
}
const ListHeader = ({headerList, onPress, selectedIndex}) => (
    <View>
        <View style={styles.headerContainer}>
            {headerList.map((item, index) =>
                // <TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => onPress(index)}
                        key={index + '-header-list'} 
                        activeOpacity={0.7}
                        style={[styles.headerListItemContainer]}>
                            <View style={[styles.headerListItem]}>
                                <View style={styles.headerListItemIcon}>
                                    <Image style={styles.headerListItemImage} source={item.icon}/>
                                </View>
                                <View style={styles.headerListItemDetails}>
                                    <Text style={[styles.headerListItemLabel, getActiveColor(index === selectedIndex)]}>{item.title}</Text>
                                    <Text style={styles.headerListItemValue}>{item.count}</Text>
                                </View>
                            </View>
                    </TouchableOpacity>
                // </TouchableOpacity>
            )}
        </View>
        <View style={styles.headerOverlap} />
    </View>
    
)

export class DepositeList extends React.Component {
    state = {
        selectedFilterIndex: 0,
    };
    componentDidMount() {
        const {fetchAllDeposites, depositeList} = this.props;
        if(!depositeList) fetchAllDeposites();
    }
    goBack = () => {
        const {navigation} = this.props;
        navigation.goBack();
    }
    onPress = data => {
        const {navigation} = this.props;
        navigation.navigate(NAVIGATION.FD_DETAILS, {selectedDeposite: data});
    }
    getHeaderList = data => {
        const all = data && data.length ? data.length : 0;
        let matured = 0;
        let closed = 0;
        let active = 0;
        data && data.length > 0 && data.forEach(i => {
            if(i.accountStatus === 'NEW') active++;
            if(i.accountStatus === 'MATURED') matured++;
            if(i.accountStatus === 'CLOSED') closed++;
        });
        return [
            {title: 'ALL', count: all, icon: icons.AllDepositeIcon},
            {title: 'Active FD', count: active, icon: icons.ActiveFDIcon},
            {title: 'Matured FD', count: matured, icon: icons.MaturedDepositeIcon},
            {title: 'Closed FD', count: closed, icon: icons.ClosedFdIcon},
        ]
    }
    onHeaderItemPress = index => {
        this.setState({selectedFilterIndex: index});
    }
    filterDepositeList = list => {
        const {selectedFilterIndex} = this.state;
        let filterLabel = 'ALL';
        if(selectedFilterIndex === 1) filterLabel = 'NEW';
        if(selectedFilterIndex === 2) filterLabel = 'MATURED';
        if(selectedFilterIndex === 3) filterLabel = 'CLOSED';
        if(filterLabel === 'ALL') return list;
        return list.filter(l=>l.accountStatus === filterLabel);
    }
    render() {
        const {depositeList} = this.props;
        const {selectedFilterIndex} = this.state;
        const headerList = this.getHeaderList(depositeList);
        const depositeFilterList = this.filterDepositeList(depositeList);
        console.log('depositeFilterList', depositeFilterList);
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={this.goBack}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                <Body>
                    <Title>Fixed Deposit</Title>
                </Body>
                    <Right />
                </Header>
                <SafeAreaView style={styles.container}>
                    {(!depositeFilterList || depositeFilterList.length === 0) && (
                        <ListHeader 
                            onPress={this.onHeaderItemPress} 
                            selectedIndex={selectedFilterIndex}
                            headerList={headerList}/>
                    )}
                    {depositeFilterList && depositeFilterList.length !== undefined  && depositeFilterList.length > 0 && (
                        <FlatList
                            data={depositeFilterList}
                            ListHeaderComponent={
                                <ListHeader 
                                    onPress={this.onHeaderItemPress} 
                                    selectedIndex={selectedFilterIndex}
                                    headerList={headerList}/>
                            }
                            renderItem={({ item }) => (
                            <Item
                                data={item}
                                onPress={this.onPress}
                            />
                            )}
                            keyExtractor={item => item.accountNumber}
                        />
                    )}

                    {!depositeList && <FlexBox 
                                        height={200} 
                                        centered 
                                        marginTop={100}><Spinner color={THEME.PRIMARY}/>
                                    </FlexBox>}
                    {depositeList && !Array.isArray(depositeList) && 
                                    <FlexBox 
                                        height={200} 
                                        centered 
                                        marginTop={100}>
                                            <Text>No Data Found!</Text>
                                    </FlexBox>}
                    
                </SafeAreaView>
            </Container>
        )
    }
}
const listItemPadding = 11;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerOverlap: {
        position: 'absolute',
        height: 50,
        padding: 2,
        width: "100%",
        backgroundColor: THEME.PRIMARY,
        top: "100%",
        zIndex: 0,
    },
    headerContainer: {
        padding: THEME.LAYOUT_PADDING - 10,
        backgroundColor: THEME.PRIMARY,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    headerListItemContainer: {
        width: "50%",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        zIndex: 2,
    },
    headerListItem: {
        backgroundColor: '#ffffff',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 3,
        paddingVertical: 11,
        paddingHorizontal: 5
    },
    headerListItemIcon: {
        width: 40,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'center'
    },
    headerListItemDetails: {
        flexGrow: 1,
        flexDirection: 'column',
        paddingLeft: 9
    },
    headerListItemLabel: {
        color: '#666666',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 0.4,
    },
    headerListItemValue: {
        textTransform: "uppercase",
        color: '#222222',
        fontSize: 13,
        fontWeight: 'bold',
        marginTop: 3
    },
    listItemContainer: {
        paddingHorizontal: THEME.LAYOUT_PADDING,
        marginVertical: 11,
    },
    listItem: {
        flexDirection: 'column',
        shadowColor: '#a9a9a9',
        shadowRadius: 5,
        shadowOpacity: 0.5,
        elevation: 5,
        position:'relative',
        backgroundColor: '#000000'
    },
    listItemTop: {
        padding: listItemPadding,
        backgroundColor: '#ecf1f9',
    },
    listItemBottom: {
        paddingHorizontal: listItemPadding - 5,
        paddingVertical: listItemPadding + 7,
        paddingBottom: 0,
        borderTopColor: '#e6e6e6',
        borderTopWidth: 1,
        borderStyle: 'solid',
        flexDirection: 'row',
        backgroundColor: "#ffffff",
        flexWrap: 'wrap'
    },
    listItemTitle: {
        color: THEME.PRIMARY,
        fontSize: 14,
        fontWeight: 'bold'
    },
    listItemSubTitle: {
        fontSize: 14,
        color: '#000000',
        marginTop: 2,
    },
    listItemDRow: {
        width: '50%',
        paddingHorizontal: 5,
        marginBottom: 17,
    },
    listItemDRowLabel: {
        fontSize: 12,
        color: THEME.PRIMARY,
    },
    listItemDRowValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333333',
        marginTop: 3
    },
    headerListItemImage: {
        width: 32,
        height: 32,
    }
});

const mapStateToProps = state => ({
    depositeList: state.depositeReducer.depositeList,
})
export default connect(
    mapStateToProps,
    {fetchAllDeposites}
)(DepositeList);