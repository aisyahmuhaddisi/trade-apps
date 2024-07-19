import Button from '@/components/button';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'

import NumericPad from 'react-native-numeric-pad'

type NumpadRef = {
    clearAll: () => void,
    clear: () => void,
    setValue: (val: string) => void
}

const Transaction = () => {
    const numpadRef = useRef<NumpadRef>(null)
    const [amount, setAmount] = useState('0')

    const resetValue = () => {
        numpadRef?.current?.clearAll();
        setAmount('0')
    };

    const onPressButton = () => {
        resetValue()
        router.push('/')
    }

    useEffect(() => {
        router.setParams({ customFunction: resetValue })
    }, [])

    return (
        <View style={styles.transactionContainer}>
            <Text style={styles.amountStyle}>USD {amount}</Text>
            <View
                style={styles.numpadContainer}
            >
                <Button style={styles.button} title="Confirm" color="blue" onPress={onPressButton} />
                <TouchableOpacity style={styles.button} onPress={() => {
                    resetValue()
                    router.push('/')
                }}>
                    <Text style={{ fontSize: 16, color: 'white', textAlign: 'center' }}>Confirm</Text>
                </TouchableOpacity>
                <NumericPad
                    ref={numpadRef}
                    numLength={8}
                    onValueChange={(v) => { if (v) setAmount(v) }}
                    allowDecimal={true}
                    buttonAreaStyle={{ backgroundColor: 'white' }}
                    rightBottomButton={<Ionicons name={'backspace'} size={28} color={'#000'} />}
                    onRightBottomButtonPress={() => { amount.length === 1 ? resetValue() : numpadRef?.current?.clear() }
                    }
                />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    button: {
        width: '80%',
        alignSelf: 'center'
    },
    amountStyle: {
        top: '20%',
        fontSize: 40,
        fontWeight: '700',
        textAlign: 'center'
    },
    numpadContainer: {
        bottom: '10%',
        position: 'absolute'
    },
    transactionContainer: {
        backgroundColor: 'white',
        flex: 1
    }
})


export default Transaction