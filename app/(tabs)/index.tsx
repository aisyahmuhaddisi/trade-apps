import React from 'react'
import { Image, StyleSheet, Platform, View, useWindowDimensions, TouchableOpacity, Animated, Text } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import BitcoinContainer from '@/containers/Bitcoin/bitcoinScreen.container';

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: '#673ab7' }} />
);

const renderScene = SceneMap({
  general: BitcoinContainer,
  about: SecondRoute,
});

const _renderTabBar = (props, state) => {
  const inputRange = props.navigationState.routes.map((x, i) => i);

  console.log(inputRange, 'cek')
  return (
    <View style={styles.tabBar}>
      {props.navigationState.routes.map((route, i) => {
        const opacity = props.position.interpolate({
          inputRange,
          outputRange: inputRange.map((inputIndex) =>
            inputIndex === i ? 1 : 0.5
          ),
        });
        const isActive = i === state.index

        return (
          <TouchableOpacity
            style={styles.tabItem(isActive)}
            onPress={() => state.setIndex(i)}>
            <Animated.Text style={{ opacity }}>{route.title}</Animated.Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const HomeScreen = () => {
  const layout = useWindowDimensions();
  const [routes] = React.useState([
    { key: 'general', title: 'General' },
    { key: 'about', title: 'About' },
  ]);
  const [index, setIndex] = React.useState(0);

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

const styles = StyleSheet.create({
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
  tabItem: (isActive) => ({
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