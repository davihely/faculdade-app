import { Image, StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';

const C = {
    primary: '#E36AC3', // cor da logo GlowMap
    text: '#FFFFFF',
};

export default function TopDropDownMenu() {
    return (
        <View style={styles.header}>
            <Image
                source={require('../logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <View style={styles.right}>
                <IconButton icon="magnify" size={24} iconColor={C.text} onPress={() => { }} />
                <IconButton icon="account-outline" size={26} iconColor={C.text} onPress={() => { }} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: C.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        elevation: 3,
    },
    logo: {
        width: 130,   // 🔼 aumentado
        height: 60,   // 🔼 aumentado
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
