// app/services/agendamentoService.js

import AsyncStorage from "@react-native-async-storage/async-storage";
import AgendamentoEntity from "../entities/AgendamentoEntity";

const STORAGE_KEY = "@agendamentos";

async function loadAll() {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
}

async function saveAll(list) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export default class agendamentoService {
    static toEntity(dto) {
        return new AgendamentoEntity(dto);
    }

    static async listar() {
        const list = await loadAll();
        return list.map(this.toEntity);
    }

    static async criar(dto) {
        const list = await loadAll();
        const novo = new AgendamentoEntity(dto);
        list.push(novo);
        await saveAll(list);
        return { ok: true, agendamento: this.toEntity(novo) };
    }
}
