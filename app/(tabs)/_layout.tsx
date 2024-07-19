import { Tabs } from 'expo-router';
import { Text } from 'react-native'

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import Header from '@/components/header';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'green',
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Bitcoin',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
          headerShown: true,
          tabBarStyle: { display: 'none' }
        }}
      />
      <Tabs.Screen
        name="transaction"
        options={{
          headerShown: true,
          headerTitle: () => (<Header title="Transaction"/>),
          title: "Tab 2 Title",
          tabBarStyle: { display: 'none' }
        }}
      />
    </Tabs>
  );
}
