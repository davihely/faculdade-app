// Salvar em: app/services/dataImportanteService.js
import DataImportanteEntity from "../entities/DataImportanteEntity";

// Armazenamento em memória
const mem = [
  { id: 'd_1', nome: 'Natal', data: '2025-12-25' },
  { id: 'd_2', nome: 'Ano Novo', data: '2026-01-01' },
];

// Regex para validar YYYY-MM-DD
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export default class DataImportanteService {
  /** @param {object} d */
  static toEntity(d) {
    return DataImportanteEntity.fromDto(d);
  }

  /** @returns {Promise<Array<DataImportanteEntity>>} */
  static async listar() {
    // Simula ordenação por data
    const sorted = [...mem].sort((a, b) => a.data.localeCompare(b.data));
    return sorted.map(this.toEntity);
  }

  /** * @param {string} id
   * @returns {Promise<DataImportanteEntity | null>} 
   */
  static async buscarPorId(id) {
    const d = mem.find(x => String(x.id) === String(id));
    return d ? this.toEntity(d) : null;
  }

  /** @param {object} dto */
  static validar(dto) {
    const erros = [];
    if (!dto.nome) erros.push("Nome é obrigatório");
    if (!dto.data) erros.push("Data é obrigatória");
    if (dto.data && !DATE_REGEX.test(dto.data)) {
      erros.push("Data deve estar no formato YYYY-MM-DD");
    }
    if (erros.length) throw new Error(erros.join("\n"));
  }

  /** * @param {object} dto
   * @returns {Promise<{ok: boolean, dataImportante: DataImportanteEntity}>} 
   */
  static async criar(dto) {
    this.validar(dto);
    const novo = { ...dto, id: DataImportanteEntity.fromDto(dto).id };
    mem.push(novo);
    return { ok: true, dataImportante: this.toEntity(novo) };
  }

  /** * @param {object} dto
   * @returns {Promise<{ok: boolean, dataImportante: DataImportanteEntity}>} 
   */
  static async atualizar(dto) {
    if (!dto.id) throw new Error("ID é obrigatório para atualizar");
    this.validar(dto);
    
    const idx = mem.findIndex(x => String(x.id) === String(dto.id));
    if (idx === -1) throw new Error("Data não encontrada");

    mem[idx] = { ...mem[idx], ...dto };
    return { ok: true, dataImportante: this.toEntity(mem[idx]) };
  }

  /** * @param {string} id
   * @returns {Promise<boolean>} 
   */
  static async remover(id) {
    const idx = mem.findIndex(x => String(x.id) === String(id));
    if (idx === -1) return false;
    mem.splice(idx, 1);
    return true;
  }
}