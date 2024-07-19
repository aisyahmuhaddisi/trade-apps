import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View, Text } from 'react-native'

const Header = (props) => {
    return (
        <View style={{flexDirection: 'row'}}>
            <Ionicons onPress={() => router.back()} size={20} style={[{ marginBottom: -3 }]} name="arrow-back" />
            <Text style={{width: '90%', textAlign: 'center', fontSize: 20}}>{props.title}</Text>
        </View>
    )
}

export default Header;