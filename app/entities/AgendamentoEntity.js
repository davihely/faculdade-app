// app/entities/AgendamentoEntity.js

export default class AgendamentoEntity {
    constructor({
        id,
        estabelecimentoId,
        profissionalIndex,
        profissionalNome,
        profissionalArea,
        profissionalImagem,
        diaIndice,
        diaLabel,
        horario,
        observacao,
        clienteEmail,
        criadoEm,
    }) {
        this.id = id || `ag_${Date.now()}`;
        this.estabelecimentoId = String(estabelecimentoId || "");
        this.profissionalIndex = typeof profissionalIndex === "number"
            ? profissionalIndex
            : Number(profissionalIndex || 0);

        this.profissionalNome = profissionalNome || "";
        this.profissionalArea = profissionalArea || "";
        this.profissionalImagem = profissionalImagem || null;

        this.diaIndice = typeof diaIndice === "number"
            ? diaIndice
            : Number(diaIndice || 0);
        this.diaLabel = diaLabel || "";
        this.horario = horario || "";
        this.observacao = observacao || "";
        this.clienteEmail = (clienteEmail || "").toLowerCase();
        this.criadoEm = criadoEm || new Date().toISOString();
    }
}
