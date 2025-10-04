"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aeronave = void 0;
const fileManager_1 = require("./fileManager");
const path = __importStar(require("path"));
class Aeronave {
    constructor(codigo, modelo, tipo, capacidade, alcance, cliente, dataEntrega) {
        this.codigo = codigo;
        this.modelo = modelo;
        this.tipo = this.validarTipo(tipo);
        this.capacidade = capacidade;
        this.alcance = alcance;
        this.cliente = cliente;
        this.dataEntrega = dataEntrega;
    }
    validarTipo(tipo) {
        return tipo;
    }
    detalhes() {
        return `
--- Detalhes da Aeronave ${this.codigo} ---
Modelo: ${this.modelo}
Tipo: ${this.tipo}
Capacidade: ${this.capacidade}
Alcance: ${this.alcance}
Cliente: ${this.cliente}
Data de Entrega: ${this.dataEntrega}
------------------------------------`;
    }
    static carregar(arrayDestino) {
        const aeronavesObjeto = fileManager_1.FileManager.carregar(this.dataFilePath);
        const aeronavesCarregadas = aeronavesObjeto.map(a => new Aeronave(a.codigo, a.modelo, a.tipo, a.capacidade, a.alcance, a.cliente, a.dataEntrega));
        arrayDestino.push(...aeronavesCarregadas);
    }
    static salvar(aeronaves) {
        fileManager_1.FileManager.salvar(this.dataFilePath, aeronaves);
    }
}
exports.Aeronave = Aeronave;
Aeronave.dataFilePath = path.join(__dirname, '..', '..', 'data', 'aeronaves.json');
