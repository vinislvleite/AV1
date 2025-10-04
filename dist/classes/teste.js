"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Teste = void 0;
const TipoTeste_1 = require("../enums/TipoTeste");
const ResultadoTeste_1 = require("../enums/ResultadoTeste");
class Teste {
    constructor(tipo, resultado) {
        if (!Object.values(TipoTeste_1.TipoTeste).includes(tipo)) {
            throw new Error(`Tipo de teste inválido!\nValores aceitos: ${Object.values(TipoTeste_1.TipoTeste).join(", ")}.`);
        }
        this.tipo = tipo;
        if (!Object.values(ResultadoTeste_1.ResultadoTeste).includes(resultado)) {
            throw new Error(`Resultado de teste inválido!\nValores aceitos: ${Object.values(ResultadoTeste_1.ResultadoTeste).join(", ")}.`);
        }
        this.resultado = resultado;
    }
    salvar() {
        console.log(`Teste do tipo "${this.tipo}" salvo com resultado "${this.resultado}".`);
    }
    carregar() {
        console.log(`Teste do tipo "${this.tipo}" carregado.`);
    }
}
exports.Teste = Teste;
