import React from 'react';
import { Text, View, Button, Image, StyleSheet, AsyncStorage, StatusBar,Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator, createStackNavigator, createDrawerNavigator,createAppContainer, createSwitchNavigator, withNavigation } from 'react-navigation';
// import AuthLoadingScreen from './AuthLoadingScreen'
import {SignInScreen, AuthLoadingScreen} from './SignInScreen'

class DetailsScreen extends React.Component {
    static navigationOptions = (navigation) =>{
      return {
          headerTitle: 'Details',
      }
    };
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Details!</Text>
                <StatusBar barStyle="default" backgroundColor = "#00BCD4" />
            </View>
        );
    }
}


class HomeScreen extends React.Component {

    static navigationOptions = (navigation) => {

        return {
            headerTitle: 'Home',
            headerLeft: (
                <Button title="Info" onPress={()=> navigation.navigation.toggleDrawer()} color="#fff"/>
            ),
        };
    };

    render() {
        const isAndroid = Platform.OS==='android';
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="#6a51ae"
                />
                <Text>Home!</Text>
                <Button
                    title="Go to Details"
                    onPress={() => this.props.navigation.navigate('Details')}
                    color={isAndroid ? "blue" : "#f4511e"}
                />
                <Button
                    title="Open Drawer"
                    onPress={() => this.props.navigation.toggleDrawer()}
                />
                <Button title="Actually, sign me out :)" onPress={this._signOutAsync} />
            </View>
        );
    }

    _signOutAsync = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    };
}

class SettingsScreen extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Settings!</Text>
                <Button
                    title="Go to Details"
                    onPress={() => this.props.navigation.navigate('Details')}
                />
            </View>
        );
    }
}

class IconWithBadge extends React.Component {
    render() {
        const { name, badgeCount, color, size } = this.props;
        return (
            <View style={{ width: 24, height: 24, margin: 5 }}>
                <Ionicons name={name} size={size} color={color} />
                {badgeCount > 0 && (
                    <View
                        style={{
                            // /If you're using react-native < 0.57 overflow outside of the parent
                            // will not work on Android, see https://git.io/fhLJ8
                            position: 'absolute',
                            right: -6,
                            top: -3,
                            backgroundColor: 'red',
                            borderRadius: 6,
                            width: 12,
                            height: 12,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                            {badgeCount}
                        </Text>
                    </View>
                )}
            </View>
        );
    }
}

const HomeIconWithBadge = props => {
    // You should pass down the badgeCount in some other ways like context, redux, mobx or event emitters.
    return <IconWithBadge {...props} badgeCount={3} />;
};

const getTabBarIcon = (navigation, focused, tintColor) => {
    const { routeName } = navigation.state;
    let IconComponent = Ionicons;
    let iconName;
    if (routeName === 'Home') {
        iconName = `ios-information-circle${focused ? '' : '-outline'}`;
        // We want to add badges to home tab icon
        IconComponent = HomeIconWithBadge;
    } else if (routeName === 'Settings') {
        iconName = `ios-options${focused ? '' : '-outline'}`;
    }

    // You can return any component that you like here!
    return <IconComponent name={iconName} size={25} color={tintColor} />;
};

const styles = StyleSheet.create({
    icon: {
        width:24,
        height:24,
    },
});


const HomeStack = createStackNavigator(
    {
        Home: HomeScreen,
        Details: DetailsScreen,
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

);

const HomeDrawerStack = createDrawerNavigator(
    {
        Home:
            {
                screen: HomeStack,
            },
    },
    {
        defaultNavigationOptions:{
            drawerLabel: 'Home menu',
            drawerIcon: ({ tintColor }) => (
                <Image
                    source={require('./spiro.png')}
                    style={[styles.icon, {tintColor:tintColor}]}
                />

            ),
        }
    }
)



const SettingsStack = createStackNavigator({
    Settings: SettingsScreen,
    Details: DetailsScreen,
});

const AuthStack = createStackNavigator({ SignIn : SignInScreen})

const TabNavigator = createBottomTabNavigator(
    {
        Home: HomeDrawerStack,
        Settings: SettingsStack,
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor}) =>
                getTabBarIcon(navigation, focused, tintColor),
            // tabBarIcon: ({ focused, horizontal, tintColor }) => {
            //     const { routeName } = navigation.state;
            //     let IconComponent = Ionicons;
            //     let iconName;
            //     if (routeName === 'Home') {
            //         iconName = `ios-information-circle${focused ? '' : '-outline'}`;
            //         // Sometimes we want to add badges to some icons.
            //         // You can check the implementation below.
            //         IconComponent = HomeIconWithBadge;
            //     } else if (routeName === 'Settings') {
            //         iconName = `ios-options${focused ? '' : '-outline'}`;
            //     }
            //
            //     // You can return any component that you like here!
            //     return <IconComponent name={iconName} size={25} color={tintColor} />;
            // },
        }),
        tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
        },
    }
);




export default createAppContainer(createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        App: TabNavigator,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'AuthLoading'
    },
    )
)


