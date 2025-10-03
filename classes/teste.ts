import { TipoTeste } from "../enums/TipoTeste";
import { ResultadoTeste } from "../enums/ResultadoTeste";

export default class{
    public tipo: TipoTeste
    public resultado: ResultadoTeste

    constructor(tipo:TipoTeste,resultado:ResultadoTeste){
        this.tipo = tipo
        this.resultado = resultado
    }
}