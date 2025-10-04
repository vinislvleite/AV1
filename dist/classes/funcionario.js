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
exports.Funcionario = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class Funcionario {
    constructor(id, nome, telefone, endereco, usuario, senha, nivelPermissao) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.usuario = usuario;
        this.senha = senha;
        this.nivelPermissao = nivelPermissao;
    }
    autenticar(usuario, senha) {
        return this.usuario === usuario && this.senha === senha;
    }
    salvar() {
        let funcionarios = [];
        try {
            const fileData = fs.readFileSync(Funcionario.dataFilePath, 'utf-8');
            funcionarios = JSON.parse(fileData);
        }
        catch {
            funcionarios = [];
        }
        const index = funcionarios.findIndex((f) => f.id === this.id);
        if (index >= 0) {
            funcionarios[index] = this;
        }
        else {
            funcionarios.push(this);
        }
        const dir = path.dirname(Funcionario.dataFilePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(Funcionario.dataFilePath, JSON.stringify(funcionarios, null, 2), 'utf-8');
    }
    carregar() {
        try {
            const fileData = fs.readFileSync(Funcionario.dataFilePath, 'utf-8');
            const funcionarios = JSON.parse(fileData);
            const encontrado = funcionarios.find((f) => f.id === this.id);
            if (encontrado) {
                this.nome = encontrado.nome;
                this.telefone = encontrado.telefone;
                this.endereco = encontrado.endereco;
                this.usuario = encontrado.usuario;
                this.senha = encontrado.senha;
                this.nivelPermissao = encontrado.nivelPermissao;
            }
        }
        catch {
        }
    }
}
exports.Funcionario = Funcionario;
Funcionario.dataFilePath = path.join(__dirname, '..', '..', 'data', 'funcionarios.json');
