import React from 'react';
import { Button, Icon, Left, Right, Header, Container, Body, Title } from 'native-base';
import { CONFIG } from '../../../../config';
import {View, StyleSheet, ScrollView} from 'react-native';
import DashBoardListItem from './list-item';
import { NAVIGATION } from '../../../navigation';
import icons from '../../../../assets/icons';


const lists = [
    {name: 'Fixed Deposit', navigation: NAVIGATION.DEPOSITE_LIST, icon: icons.FDIcon},
    {name: 'Loan Request', icon: icons.LoanReqIcon},
    {name: 'My Loans', icon: icons.MyLoansIcon},
    {name: 'FD Calculator', icon: icons.FDCalcIcon},
    {name: 'Certificate', icon: icons.CertificateIcon},
    {name: 'Activity', icon: icons.ActivityIcon},
    {name: 'Application Status', icon: icons.AppStatusIcon},
    {name: 'Service Request', icon: icons.ServiceReqIcon},
    {name: 'Reports', icon: icons.ReportsIcon},
]


class DashBoard extends React.Component {
    onListPress = name => {
        const {navigation} = this.props;
        console.log('onListPress', name, navigation);
        if(navigation && name) {
            navigation.navigate(name);
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
                        <Button transparent>
                            <Icon name='notifications-outline' />
                        </Button>
                        <Button transparent>
                            <Icon name='settings' />
                        </Button>
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
})


export default DashBoard