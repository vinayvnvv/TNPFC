import React from 'react';
import {connect} from 'react-redux';
import { Button, Icon, Left, Right, Header, Container, Body, Title } from 'native-base';
import { CONFIG } from '../../../../config';
import {View, StyleSheet, ScrollView} from 'react-native';
import DashBoardListItem from './list-item';
import { NAVIGATION } from '../../../navigation';
import icons from '../../../../assets/icons';
import {removeAuth} from './../../../store/actions/auth-actions';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import authServices from '../../../services/authServices';


const lists = [
    {name: 'Fixed Deposit', navigation: NAVIGATION.DEPOSITE_LIST, icon: icons.FDIcon},
    {name: 'Loan Request', icon: icons.LoanReqIcon},
    {name: 'My Loans', navigation: NAVIGATION.MY_LOANS, icon: icons.MyLoansIcon},
    // {name: 'FD Calculator', icon: icons.FDCalcIcon},
    {name: 'Certificate', icon: icons.CertificateIcon},
    // {name: 'Activity', icon: icons.ActivityIcon},
    // {name: 'Application Status', icon: icons.AppStatusIcon},
    {name: 'Service Request', navigation: NAVIGATION.SERVICE_REQUEST, icon: icons.ServiceReqIcon},
    {name: 'Tax Documents', icon: icons.ReportsIcon},
    {name: 'Profile', icon: icons.ReportsIcon, navigation: NAVIGATION.PROFILE},
];

const menus = [
    {title: 'Profile'}, {title: 'Logout'},
]


class DashBoard extends React.Component {
    onListPress = name => {
        const {navigation} = this.props;
        if(navigation && name) {
            navigation.navigate(name);
        }
    }
    onDropDownSelect = async type => {
        const {navigation, removeAuth} = this.props;
        if(type === menus[0].title) navigation.navigate(NAVIGATION.PROFILE);
        if(type === menus[1].title) {
            await authServices.removeAuth();
            removeAuth();
        }
    }
    render() {
        return (
            <Container>
                <Header noLeft>
                    <Left />
                <Body>
                    <Title>{CONFIG.APP.TITLE}</Title>
                </Body>
                    <Right>
                        <Button transparent onPress={() => this.onDropDownSelect(menus[1].title)}>
                            <Icon name='power' />
                        </Button>
                        {/* <Button transparent>
                            <Menu>
                                <MenuTrigger>
                                    <Icon style={{color: '#ffffff'}} name='settings' />
                                </MenuTrigger>
                                <MenuOptions customStyles={optionsStyles}>
                                    {menus.map((m, idx) =>
                                        <MenuOption 
                                            key={'menu-' + idx} 
                                            onSelect={() => this.onDropDownSelect(m.title)} 
                                            text={m.title} />
                                    )}
                                </MenuOptions>
                            </Menu>
                        </Button> */}
                    </Right>
                </Header>
                <ScrollView>
                    <View style={styles.listContainer}>
                        {lists.map((item, index) => 
                            <View key={index + 'list'} style={styles.listItemContainer}>
                                <DashBoardListItem 
                                    onListPress={() => this.onListPress(item.navigation)} 
                                    title={item.name}
                                    icon={item.icon} />
                            </View>
                        )}
                    </View>
                </ScrollView>
          </Container>
        )
    }
}


const styles = StyleSheet.create({
    listContainer: {  
        height: "100%", 
        width: '100%',
        flexWrap: 'wrap',
        flexDirection: 'row',
        backgroundColor: "#f0f0f0",
        paddingHorizontal: 10
    },
    listItemContainer: {
        width: '50%',
        padding: 12,
    },
});
const optionsStyles = {
    optionsContainer: {
        maxWidth: 100,
    },
    optionWrapper: {
      paddingHorizontal: 9,
      paddingVertical: 13,
    },
  };


export default connect(
    null,
    {removeAuth}
)(DashBoard);