// Salvar em: app/entities/DataImportanteEntity.js

// Funções utilitárias de ID (podem ser compartilhadas em um utils.js)
function normalizeId(raw) {
  if (!raw) return null;
  return String(raw);
}
function newId() {
  return `d_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export default class DataImportanteEntity {
  /**
   * @param {object} [params]
   * @param {string | null} [params.id]
   * @param {string} [params.nome]
   * @param {string} [params.data] - Formato YYYY-MM-DD
   */
  constructor({ id = null, nome = '', data = '' } = {}) {
    this.id = normalizeId(id) ?? newId();
    this.nome = nome;
    this.data = data; // Deve ser string YYYY-MM-DD
  }

  /**
   * @param {object} d - DTO (Data Transfer Object)
   * @returns {DataImportanteEntity | null}
   */
  static fromDto(d) {
    return d ? new DataImportanteEntity(d) : null;
  }

  /**
   * @returns {string}
   */
  get key() {
    return String(this.id);
  }
}