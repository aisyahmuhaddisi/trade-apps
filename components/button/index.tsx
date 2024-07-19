import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native"

type StylesType = {
    button: (color: string) => ViewStyle,
    text: (color: string) => TextStyle
};

type Props = {
    title: string,
    color: string,
    textColor?: string,
    onPress: () => void,
    style?: TextStyle
};

const Button = (props: Props) => {
    return (
        <TouchableOpacity style={[styles.button(props.color), props.style]} onPress={props.onPress} >
            <Text style={styles.text(props.textColor)}>{props.title}</Text>
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
    text: (color) => ({
        fontSize: 16,
        color: color || 'black',
        textAlign: 'center'
    })
});

export default Button;