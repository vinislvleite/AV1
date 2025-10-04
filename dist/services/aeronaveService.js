"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AeronaveService = void 0;
const aeronave_1 = require("../classes/aeronave");
class AeronaveService {
    constructor() {
        this.aeronaves = [];
        aeronave_1.Aeronave.carregar(this.aeronaves);
    }
    cadastrar(aeronave) {
        const existente = this.aeronaves.find(a => a.codigo === aeronave.codigo);
        if (existente) {
            console.log(`Aeronave com código ${aeronave.codigo} já existe!`);
            return;
        }
        this.aeronaves.push(aeronave);
        aeronave_1.Aeronave.salvar(this.aeronaves);
    }
    listar() {
        return this.aeronaves;
    }
    buscarPorCodigo(codigo) {
        return this.aeronaves.find(a => a.codigo === codigo);
    }
    remover(codigo) {
        const index = this.aeronaves.findIndex(a => a.codigo === codigo);
        if (index !== -1) {
            this.aeronaves.splice(index, 1);
            aeronave_1.Aeronave.salvar(this.aeronaves);
            console.log(`Aeronave ${codigo} removida!`);
        }
        else {
            console.log(`Aeronave com código ${codigo} não encontrada!`);
        }
    }
    atualizar(codigo, dados) {
        const aeronave = this.buscarPorCodigo(codigo);
        if (!aeronave) {
            console.log(`Aeronave ${codigo} não encontrada!`);
            return;
        }
        Object.assign(aeronave, dados);
        aeronave_1.Aeronave.salvar(this.aeronaves);
        console.log(`Aeronave ${codigo} atualizada!`);
    }
}
exports.AeronaveService = AeronaveService;
