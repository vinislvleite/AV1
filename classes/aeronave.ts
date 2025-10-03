import { TipoAeronave } from "../enums/TipoAeronave";
import { FileManager } from "./fileManager";
import * as path from 'path';

export class Aeronave {
    private static readonly dataFilePath = path.join(__dirname, '..', '..', 'data', 'aeronaves.json');

    public codigo: string;
    public modelo: string;
    public tipo: TipoAeronave;
    public capacidade: number;
    public alcance: number;

    constructor(codigo: string, modelo: string, tipo: TipoAeronave, capacidade: number, alcance: number) {
        this.codigo = codigo;
        this.modelo = modelo;
        this.tipo = this.validarTipo(tipo);
        this.capacidade = capacidade;
        this.alcance = alcance;
    }

    private validarTipo(tipo: TipoAeronave): TipoAeronave {
        return tipo;
    }
    
    public detalhes(): void {
        console.log(`--- Detalhes da Aeronave ${this.codigo} ---`);
        console.log(`Modelo: ${this.modelo}`);
        console.log(`Tipo: ${this.tipo}`);
        console.log(`Capacidade: ${this.capacidade}`);
        console.log(`Alcance: ${this.alcance}`);
        console.log("------------------------------------");
    }

    public static carregar(arrayDestino: Aeronave[]): void {
        const aeronavesObjeto = FileManager.carregar<Aeronave>(this.dataFilePath);
        const aeronavesCarregadas = aeronavesObjeto.map(a => new Aeronave(
            a.codigo,
            a.modelo,
            a.tipo,
            a.capacidade,
            a.alcance
        ));
    }

    public static salvar(aeronaves: Aeronave[]): void {
        FileManager.salvar(this.dataFilePath, aeronaves);
    }
}