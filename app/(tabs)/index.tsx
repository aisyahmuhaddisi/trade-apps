import React, { Dispatch, SetStateAction } from 'react'
import { StyleSheet, View, useWindowDimensions, TouchableOpacity, Animated, TextStyle, ViewStyle } from 'react-native';
import { TabView, SceneMap, SceneRendererProps } from 'react-native-tab-view';

import BitcoinContainer from '@/containers/Bitcoin/bitcoinScreen.container';

type HomeStyle = {
  container: ViewStyle,
  tabContainer: ViewStyle,
  tabBar: ViewStyle,
  tabItem: (isActive: boolean) => ViewStyle,
};

type RouteType = {
  key: string,
  title: string
}

type State = {
  routes: Array<RouteType>,
  index: number,
  setIndex: Dispatch<SetStateAction<number>>
};

type NavigationState = {
  navigationState: {
    routes: RouteType[]
  }
}

type Props = NavigationState & SceneRendererProps

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#673ab7' }} />
);

const renderScene = SceneMap({
  general: BitcoinContainer,
  about: SecondRoute,
});

const _renderTabBar = (props: Props, state: State) => {
  const inputRange = props.navigationState.routes.map((x: RouteType, i: number) => i);

  return (
    <>
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route: RouteType, i: number) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex: number) =>
              inputIndex === i ? 1 : 0.5
            ),
          });
          const isActive: boolean = i === state.index

          return (
            <TouchableOpacity
              style={styles.tabItem(isActive)}
              onPress={() => state.setIndex(i)}>
              <Animated.Text style={{ opacity }}>{route.title}</Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
};

const HomeScreen = () => {
  const layout = useWindowDimensions();
  const routes = [
    { key: 'general', title: 'General' },
    { key: 'about', title: 'About' },
  ];
  const [index, setIndex]: [number, Dispatch<SetStateAction<number>>] = React.useState(0);

  const state = { routes, index, setIndex }

  return (
    <View style={styles.container}>
      <TabView
        renderTabBar={(props) => _renderTabBar(props, state)}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        style={styles.tabContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create<HomeStyle>({
  container: {
    backgroundColor: 'white',
    minHeight: '100%'
  },
  tabContainer: {
    backgroundColor: 'white'
  },
  tabBar: {
    flexDirection: 'row'
  },
  tabItem: (isActive: boolean) => ({
    flex: 1,
    alignItems: 'center',
    padding: 16,
    ...(isActive && {
      borderBottomColor: 'black',
      borderBottomWidth: 1
    })
  }),
});

export default HomeScreen