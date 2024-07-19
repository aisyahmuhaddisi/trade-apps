import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'

import NumericPad from 'react-native-numeric-pad'

const Transaction = () => {
    const numpadRef = useRef(null)
    const [amount, setAmount] = useState(0)

    console.log(amount, 'cek')
    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            <Text style={{ top: '20%', fontSize: 40, fontWeight: '700', textAlign: 'center' }}>USD {amount}</Text>
            <View
                style={{ bottom: '10%', position: 'absolute' }}
            >
                <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
                    <Text style={{ fontSize: 16, color: 'white', textAlign: 'center' }}>Confirm</Text>
                </TouchableOpacity>
                <NumericPad
                    ref={numpadRef}
                    numLength={8}
                    onValueChange={(v) => { if (v) setAmount(v) }}
                    allowDecimal={true}
                    buttonAreaStyle={{ backgroundColor: 'white' }}
                    rightBottomButton={<Ionicons name={'backspace'} size={28} color={'#000'} />}
                    onRightBottomButtonPress={() => { numpadRef.current.clear() }
                    }
                />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    button: {
        width: '80%',
        backgroundColor: 'blue',
        borderRadius: 4,
        paddingVertical: 10,
        marginTop: 10,
        alignSelf: 'center'
    }
})


export default Transaction