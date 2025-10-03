import { Aeronave } from "./src/classes/aeronave";
import { EtapaProducao } from "./src/classes/etapasproducao";
import { Funcionario } from "./src/classes/funcionario";
import { Permissao } from "./src/enums/NivelPermissao";
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})