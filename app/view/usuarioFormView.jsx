import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import { Appbar, Button, Menu, Text, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import usuarioService from '../services/usuarioService';

const C = {
    primary: '#E36AC3',
    bg: '#FFF0FB',
    text: '#3C2A4D',
    outline: '#E6CFE0',
};

export default function usuarioFormView() {
    const router = useRouter();
    const { email: emailParam } = useLocalSearchParams();

    const [nome, setNome] = useState('');
    const [genero, setGenero] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const [dataNascimento, setDataNascimento] = useState('');
    const [cpf, setCpf] = useState('');
    const [ddi, setDdi] = useState('55');
    const [celular, setCelular] = useState('');
    const [email] = useState(String(emailParam || ''));
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);

    async function handleSalvar() {
        try {
            const { ok } = await usuarioService.criar({
                nome, genero, dataNascimento, cpf, ddi, celular, email, senha,
            });
            if (ok) {
                Toast.show({ type: 'success', text1: 'Cadastro realizado com sucesso!' });
                router.replace('/view/loginView'); // volta ao login após cadastro
            }
        } catch (e) {
            Toast.show({ type: 'error', text1: e.message });
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: C.bg }}>
            <Appbar.Header style={{ backgroundColor: C.bg, elevation: 0 }}>
                <Appbar.BackAction onPress={() => router.back()} color={C.text} />
                <Appbar.Content title="Cadastrar" titleStyle={{ color: C.text, fontWeight: '600' }} />
            </Appbar.Header>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    {/* Nome */}
                    <Text style={styles.label}>Nome completo</Text>
                    <TextInput
                        mode="outlined"
                        placeholder="Seu nome"
                        value={nome}
                        onChangeText={setNome}
                        style={styles.input}
                        outlineColor={C.outline}
                        activeOutlineColor={C.primary}
                    />

                    {/* Gênero */}
                    <Text style={styles.label}>Gênero</Text>
                    <Menu
                        visible={menuVisible}
                        onDismiss={() => setMenuVisible(false)}
                        anchor={
                            <TextInput
                                mode="outlined"
                                placeholder="Selecione"
                                value={genero}
                                right={<TextInput.Icon icon="menu-down" onPress={() => setMenuVisible(true)} />}
                                style={styles.input}
                                outlineColor={C.outline}
                                activeOutlineColor={C.primary}
                                editable={false}
                            />
                        }
                    >
                        <Menu.Item onPress={() => { setGenero('Feminino'); setMenuVisible(false); }} title="Feminino" />
                        <Menu.Item onPress={() => { setGenero('Masculino'); setMenuVisible(false); }} title="Masculino" />
                        <Menu.Item onPress={() => { setGenero('Outro'); setMenuVisible(false); }} title="Outro" />
                    </Menu>

                    {/* Data de nascimento */}
                    <Text style={styles.label}>Data de nascimento</Text>
                    <MaskedTextInput
                        mask="99/99/9999"
                        placeholder="dd/mm/aaaa"
                        keyboardType="numeric"
                        value={dataNascimento}
                        onChangeText={setDataNascimento}
                        style={styles.inputMask}
                    />

                    {/* CPF */}
                    <Text style={styles.label}>CPF</Text>
                    <MaskedTextInput
                        mask="999.999.999-99"
                        keyboardType="numeric"
                        placeholder="000.000.000-00"
                        value={cpf}
                        onChangeText={setCpf}
                        style={styles.inputMask}
                    />

                    {/* DDI + Celular */}
                    <View style={styles.row}>
                        <View style={[styles.col, { flex: 1 }]}>
                            <Text style={styles.label}>DDI</Text>
                            <TextInput
                                mode="outlined"
                                value={ddi}
                                onChangeText={setDdi}
                                style={styles.input}
                                outlineColor={C.outline}
                                activeOutlineColor={C.primary}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={[styles.col, { flex: 3, marginLeft: 10 }]}>
                            <Text style={styles.label}>Celular</Text>
                            <MaskedTextInput
                                mask="(99) 99999-9999"
                                keyboardType="phone-pad"
                                placeholder="(00) 00000-0000"
                                value={celular}
                                onChangeText={setCelular}
                                style={styles.inputMask}
                            />
                        </View>
                    </View>

                    {/* E-mail (vind o da etapa anterior, bloqueado) */}
                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                        mode="outlined"
                        value={email}
                        disabled
                        right={<TextInput.Icon icon="close-circle" disabled />}
                        style={styles.input}
                        outlineColor={C.outline}
                    />

                    {/* Senha */}
                    <Text style={styles.label}>Senha</Text>
                    <TextInput
                        mode="outlined"
                        placeholder="••••••"
                        secureTextEntry={!mostrarSenha}
                        value={senha}
                        onChangeText={setSenha}
                        right={<TextInput.Icon icon={mostrarSenha ? 'eye-off' : 'eye'} onPress={() => setMostrarSenha(!mostrarSenha)} />}
                        style={styles.input}
                        outlineColor={C.outline}
                        activeOutlineColor={C.primary}
                    />

                    {/* Salvar */}
                    <Button
                        mode="contained"
                        onPress={handleSalvar}
                        style={styles.saveButton}
                        contentStyle={{ height: 48 }}
                        labelStyle={{ color: '#FFF', fontWeight: '600' }}
                    >
                        Salvar minhas informações
                    </Button>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 24, flexGrow: 1 },
    label: { fontWeight: '600', color: C.text, marginBottom: 4 },
    input: { backgroundColor: '#FFF', borderRadius: 0, marginBottom: 16 },
    inputMask: {
        borderWidth: 1, borderColor: C.outline, padding: 14,
        backgroundColor: '#FFF', fontSize: 16, marginBottom: 16
    },
    row: { flexDirection: 'row', alignItems: 'center' },
    col: { flex: 1 },
    saveButton: { width: '100%', backgroundColor: C.primary, borderRadius: 0, marginTop: 10 },
});
