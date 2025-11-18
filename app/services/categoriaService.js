// app/services/categoriaService.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import CategoriaEntity from "../entities/CategoriaEntity";

const STORAGE_KEY = "@categorias";

async function loadAll() {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
}

async function saveAll(list) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export default class categoriaService {

    static toEntity(dto) {
        return CategoriaEntity.fromDto(dto);
    }

    static async listar() {
        const categorias = await loadAll();
        return categorias.map(this.toEntity);
    }

    static async buscarPorId(id) {
        const list = await loadAll();
        const item = list.find(x => String(x.id) === String(id));
        return item ? this.toEntity(item) : null;
    }

    static validar(dto) {
        const erros = [];
        if (!dto.nome) erros.push("Nome da categoria é obrigatório");
        if (erros.length) throw new Error(erros.join("\n"));
    }

    static async criar(dto) {
        this.validar(dto);
        const list = await loadAll();
        const nova = new CategoriaEntity(dto);
        list.push(nova);
        await saveAll(list);
        return { ok: true, categoria: this.toEntity(nova) };
    }

    static async atualizar(id, dto) {
        this.validar(dto);
        const list = await loadAll();
        const index = list.findIndex(x => String(x.id) === String(id));
        if (index < 0) throw new Error("Categoria não encontrada");
        
        list[index] = { ...list[index], ...dto };
        await saveAll(list);
        
        return { ok: true, categoria: this.toEntity(list[index]) };
    }

    static async excluir(id) {
        const list = await loadAll();
        const novo = list.filter(x => String(x.id) !== String(id));
        await saveAll(novo);
        return { ok: true };
    }
}
