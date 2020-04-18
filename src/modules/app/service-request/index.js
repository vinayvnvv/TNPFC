import React from 'react';
import {connect} from 'react-redux';
import { Container, Button, Icon, Left, Right, Header, Body, Title, Text, Spinner, View } from "native-base";
import {StyleSheet, SafeAreaView, FlatList} from 'react-native';
import { fetchRequestStatus } from '../../../store/actions/common-actions';
import ListItemPanel from '../../common/components/list-item-panel';
import utils from '../../../services/utils';
import { THEME } from '../../../../config';
import { COMMON_STYLES } from '../../common/styles';
import Modal from 'react-native-modal';
import { NAVIGATION } from '../../../navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';

const servicesTypes = [
    {name: 'TAX Form 15G/15H', icon: 'add', param: {type: 'tax'}},
    {name: 'Nominee Change', icon: 'add', param: {type: 'nominee'}},
    {name: 'Bank Account Change', icon: 'add', param: {type: 'bank_account'}},
    {name: 'Address Change', icon: 'add', param: {type: 'address'}},
];

const SelectModal = ({
    onSelect,
    onCancel,
    visible,
}) => (
    visible ? (
    <View style={COMMON_STYLES.modalContainer}>
        <Modal isVisible={true} coverScreen={false}>
            <View style={[COMMON_STYLES.modalContent, styles.selectModal]}>
                <Text style={styles.modalHeader}>Select Type of Request</Text>
                <View style={styles.serviceList}>
                    {servicesTypes.map((s, idx) =>
                        <TouchableOpacity key={'serv-req-' + idx} onPress={() => onSelect(s)}>
                            <View style={styles.typesItem}>
                                <Icon name={s.icon} style={styles.typesItemIcon}/>
                                <Text style={styles.typesItemText}>{s.name}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={onCancel}>
                        <View style={[styles.typesItem, {justifyContent: 'center'}]}>
                            <Text style={[styles.typesItemText, {color: THEME.DANGER}]}>Cancel</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    </View>
    ) : (<View />)
)

const Item = ({
    data: {
        acknowledgementId,
        purpose,
        depositNumber
    } = {},
}) => (
    <ListItemPanel 
        panelTitleValue={acknowledgementId}
        itemWidth={'50%'}
        style={styles.itemStyle}
        noHoverEffect
        lists={[
            ['Purpose', purpose],
            ['Deposit No.', depositNumber],
        ]}
        panelTitleLabel={'Ticket ID'} />
);

const ListHeader = ({
    onAdd,
}) => (
    <View style={styles.listHeader}>
        <Button iconLeft onPress={onAdd}>
            <Icon name={'add'}/>
            <Text>Create Service Request</Text>
        </Button>
    </View>
)

class ServiceRequest extends React.Component {
    state = {
        pageInit: false,
        typeModal: false,
        loading: false,
    }
    componentDidMount() {
        this.initPage();
        this.willFocusSubscription = this.props.navigation.addListener(
            'focus',
            () => {
              this.initPage();
            }
        );
    }
    componentWillUnmount() {
        if(this.willFocusSubscription && 'remove' in this.willFocusSubscription) this.willFocusSubscription.remove();
    }
    initPage = async () => {
        const {fetchRequestStatus} = this.props;
        this.setState({loading: true});
        await fetchRequestStatus();
        this.setState({pageInit: true, loading: false});
    }
    goBack = () => {
        const {navigation} = this.props;
        navigation.goBack();
    }
    toggleTypeModal = () => {
        this.setState({typeModal: !this.state.typeModal});
    }
    onSelectType = t => {
        const {navigation} = this.props;
        navigation.navigate(NAVIGATION.ADD_SERVICE, t.param);
        this.toggleTypeModal();
    }
    render() {
        const {requestStatus = []} = this.props;
        const {pageInit, typeModal, loading} = this.state;
        return (
            pageInit && !loading ? (
                <Container>
                    <SelectModal 
                        visible={typeModal} 
                        onSelect={this.onSelectType}
                        onCancel={this.toggleTypeModal}/>
                    <Header>
                        <Left>
                            <Button transparent onPress={this.goBack}>
                                <Icon name='arrow-back' />
                            </Button>
                        </Left>
                        <Body>
                            <Title>Service Request</Title>
                        </Body>
                        <Right />
                    </Header>
                    <Container style={styles.container}>
                        {requestStatus && requestStatus.length !== undefined  && (
                            <FlatList
                                data={requestStatus}
                                ListHeaderComponent={<ListHeader onAdd={this.toggleTypeModal}/>}
                                renderItem={({ item }) => (
                                <Item
                                    data={item}
                                />
                                )}
                                keyExtractor={item => item.acknowledgementId}
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
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: THEME.LAYOUT_PADDING,
    },
    itemStyle: {
        borderStyle: 'solid',
        borderColor: '#f0f0f0',
        borderWidth: 1,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    selectModal: {
        flexDirection: 'column'
    },
    modalHeader: {
        fontSize: 13,
        color: '#777',
        fontWeight: '300',
        textAlign: 'center',
        paddingVertical: 13,
        paddingHorizontal: 19,
        borderBottomColor: '#d9d9d955',
        borderBottomWidth: 1,
        borderStyle: 'solid'
    },
    typesItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 13,
        borderBottomColor: '#d9d9d955',
        borderBottomWidth: 1,
        borderStyle: 'solid'
    },
    typesItemIcon: {
        marginRight: 21,
        color: '#777'
    },
    typesItemText: {
        fontSize: 14,
        fontWeight: '700',
        color: THEME.PRIMARY
    },
})

const mapStateToProps = state => ({
    requestStatus: state.commonReducer.requestStatus,
})

export default connect(
    mapStateToProps,
    {fetchRequestStatus}
)(ServiceRequest);