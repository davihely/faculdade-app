// Salvar em: app/entities/EstabelecimentoEntity.js

function normalizeId(raw) {
  if (!raw) return null;
  return String(raw);
}
function newId() {
  return `e_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export default class EstabelecimentoEntity {
  constructor({ id = null, nome = '', endereco = '', telefone = '' } = {}) {
    this.id = normalizeId(id) ?? newId();
    this.nome = nome;
    this.endereco = endereco;
    this.telefone = telefone;
  }

  static fromDto(d) {
    return d ? new EstabelecimentoEntity(d) : null;
  }

  get key() {
    return String(this.id);
  }
}