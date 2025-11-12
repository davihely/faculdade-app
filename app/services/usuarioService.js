import AsyncStorage from "@react-native-async-storage/async-storage";
import UsuarioEntity from "../entities/UsuarioEntity";

const STORAGE_KEY = "@usuarios";

async function loadAll() {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
}

async function saveAll(list) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export default class usuarioService {
    static toEntity(d) {
        return UsuarioEntity.fromDto(d);
    }

    static async listar() {
        return (await loadAll()).map(this.toEntity);
    }

    static async buscarPorEmail(email) {
        const list = await loadAll();
        const d = list.find((x) => String(x.email).toLowerCase() === String(email).toLowerCase());
        return d ? this.toEntity(d) : null;
    }

    static validar(dto) {
        const erros = [];
        if (!dto.nome) erros.push("Nome é obrigatório");
        if (!dto.email) erros.push("E-mail é obrigatório");
        if (!dto.senha) erros.push("Senha é obrigatória");
        if (erros.length) throw new Error(erros.join("\n"));
    }

    static async criar(dto) {
        this.validar(dto);
        const list = await loadAll();
        const existe = list.some(
            (x) => String(x.email).toLowerCase() === String(dto.email).toLowerCase()
        );
        if (existe) throw new Error("E-mail já cadastrado");
        const novo = new UsuarioEntity(dto);
        list.push(novo);
        await saveAll(list);
        return { ok: true, usuario: this.toEntity(novo) };
    }

    static async autenticar(email, senha) {
        const user = await this.buscarPorEmail(email);
        if (!user) throw new Error("Usuária(o) não encontrada(o)");
        if (user.senha !== senha) throw new Error("Senha incorreta");
        return { ok: true, usuario: user };
    }
}
