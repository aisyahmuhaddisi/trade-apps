import { Ionicons } from '@expo/vector-icons';
import { useNavigationState } from '@react-navigation/core';
import { router, useRouter } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native'

type Props = {
    title: string
}

type ParamsType = {
    customFunction: () => void
}

const Header = (props: Props) => {
    const route = useNavigationState(state => state.routes[state?.index]);

    const params: ParamsType = route?.params;

    return (
        <View style={style.headerContainer}>
            <Ionicons
                onPress={() => {
                    router.back()
                    if (params && params?.customFunction) params.customFunction()
                }}
                size={20}
                name="arrow-back"
            />
            <Text style={style.textStyle}>{props.title}</Text>
        </View>
    )
}

const style = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row'
    },
    textStyle: {
        width: '90%',
        textAlign: 'center',
        fontSize: 20
    }
})

export default Header;