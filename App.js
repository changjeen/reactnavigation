import React from 'react';
import { Button, View, Text, Image} from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

class LogoTitle extends React.Component{
    render(){
        return (
            <Image
                source={require('./spiro.png')}
                style={{ width:30, height:30}}
            />
        );
    }
}

class HomeScreen extends React.Component {
    // Title bar Options
    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
            headerTitle: <LogoTitle />,
            headerRight: (
                <Button
                    title="+1"
                    onPress={() => navigation.getParam('increaseCount')}
                    color="#fff"/>
            ),
            headerLeft: (
              <Button title="Info" onPress={()=> navigation.navigate('MyModal')} color="#fff"/>
            ),
        };

        // title: 'Homes',
        // headerStyle: {
        //     backgroundColor: '#f4511e',
        // },
        // headerTintColor: '#fff',
        // headerTitleStyle: {
        //     fontWeight: 'bold',
        // },
    };

    componentDidMount() {
        this.props.navigation.setParams({ increaseCount: this._increaseCount });
    }

    state = {
        count : 0,
    };

    _increaseCount = () => {
        this.setState({ count: this.state.count + 1 });
    }
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Home Screen {this.state.count}</Text>
                <Button
                    title="Go to Details"
                    onPress={() => {
                        /* 1. Navigate to the Details route with params */
                        this.props.navigation.navigate('Details', {
                            itemId: 86,
                            otherParam: 'anything you want here',
                        });
                    }}
                />
            </View>
        );
    }
}

class ModalScreen extends React.Component {
    render() {
        return(
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontsize: 30}}>This is a modal </Text>
                <Button
                    onPress={() => this.props.navigation.goBack()}
                    title="Dismiss"
                />
            </View>
        );
    }

}


class DetailsScreen extends React.Component {
    // Title bar Options
    static navigationOptions = ({ navigation , navigationOptions}) => {
        const { params } = navigation.state;

        return {
            title: params ? params.otherParam : 'A Nested Details Screen',
            headerStyle: {
                backgroundColor: navigationOptions.headerTintColor,
            },
            headerTintColor: navigationOptions.headerStyle.backgroundColor,
        };
    };
    render() {
        /* 2. Get the param, provide a fallback value if not available */
        const { navigation } = this.props;
        const itemId = navigation.getParam('itemId', 'NO-ID');
        const otherParam = navigation.getParam('otherParam', 'some default value');

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Details Screen</Text>
                <Text>itemId: {JSON.stringify(itemId)}</Text>
                <Text>otherParam: {JSON.stringify(otherParam)}</Text>
                <Button
                    title="Go to Details... again"
                    onPress={() =>
                        this.props.navigation.push('Details', {
                            itemId: Math.floor(Math.random() * 100),
                        })}
                />
                <Button
                    title="Go to Home"
                    onPress={() => this.props.navigation.navigate('Home')}
                />
                <Button
                    title="Go back"
                    onPress={() => this.props.navigation.goBack()}
                />
                <Button
                    title="Update the title"
                    onPress={() => this.props.navigation.setParams({otherParam: 'Updated!'})}
                />
            </View>
        );
    }
}

const MainStack = createStackNavigator(
    {
        Home: {
            screen: HomeScreen,
        },
        Details: {
            screen: DetailsScreen,
        },
    },
    {
        initialRouteName: 'Home',
        /* The header config from HomeScreen is now here */
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },
    }
)




const RootStack = createStackNavigator(
    {
        Main: {
            screen: MainStack
        },
        MyModal: {
            screen: ModalScreen,
        }
    },
    {
        mode: 'modal',
        headerMode: 'none',
    }

);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
