// app/entities/AgendamentoEntity.js

export default class AgendamentoEntity {
    constructor({
        id,
        estabelecimentoId,
        estabelecimentoNome,
        estabelecimentoEndereco,
        estabelecimentoImagem,

        profissionalIndex,
        profissionalNome,
        profissionalArea,
        profissionalImagem,

        diaIndice,
        diaLabel,
        horario,
        observacao,
        clienteEmail,
        dataISO,

        status,
        criadoEm,
    }) {
        this.id = id || `ag_${Date.now()}`;

        this.estabelecimentoId = String(estabelecimentoId || "");
        this.estabelecimentoNome = estabelecimentoNome || "";
        this.estabelecimentoEndereco = estabelecimentoEndereco || "";
        this.estabelecimentoImagem = estabelecimentoImagem || null;

        this.profissionalIndex = Number(profissionalIndex ?? -1);
        this.profissionalNome = profissionalNome || "";
        this.profissionalArea = profissionalArea || "";
        this.profissionalImagem = profissionalImagem || null;

        this.diaIndice = Number(diaIndice || 0);
        this.diaLabel = diaLabel || "";
        this.horario = horario || "";
        this.observacao = observacao || "";
        this.dataISO = dataISO || "";

        this.clienteEmail = (clienteEmail || "").toLowerCase();
        this.status = status || "Agendado";

        this.criadoEm = criadoEm || new Date().toISOString();
    }
}
