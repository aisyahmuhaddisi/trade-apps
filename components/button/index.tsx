import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native"

type StylesType = {
    button: (color: string) => ViewStyle,
    text: TextStyle
};

type Props = {
    title: string,
    color: string,
    onPress: () => void,
    style?: TextStyle
};

const Button = (props: Props) => {
    return (
        <TouchableOpacity style={[styles.button(props.color), props.style]} onPress={props.onPress} >
            <Text style={styles.text}>{props.title}</Text>
        </TouchableOpacity >
    )
};

const styles = StyleSheet.create<StylesType>({
    button: (color) => ({
        width: '100%',
        backgroundColor: color,
        borderRadius: 4,
        paddingVertical: 10,
        marginTop: 10
    }),
    text: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center'
    }
});

export default Button;