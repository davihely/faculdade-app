// Salvar em: app/entities/UsuarioEntity.js

// Funções utilitárias de ID (conforme padrão)
function normalizeId(raw) {
  if (!raw) return null;
  return String(raw);
}
function newId() {
  return `u_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export default class UsuarioEntity {
  constructor({ id = null, nome = '', email = '', senha = '' } = {}) {
    this.id = normalizeId(id) ?? newId();
    this.nome = nome;
    this.email = email;
    this.senha = senha; // Em um app real, nunca armazenar senha em plain text
  }

  /**
   * @param {object} d - DTO (Data Transfer Object)
   * @returns {UsuarioEntity | null}
   */
  static fromDto(d) {
    return d ? new UsuarioEntity(d) : null;
  }

  /**
   * @returns {string}
   */
  get key() {
    return String(this.id);
  }
}