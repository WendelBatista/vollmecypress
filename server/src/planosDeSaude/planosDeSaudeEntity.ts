import {
  Column,
  Entity,
  PrimaryGeneratedColumn
} from "typeorm";

@Entity('planosaude')
export class PlanoSaude {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  
    @Column("varchar", { length: 100 })
    nome: string;
  
    @Column("varchar", { length: 18 })
    cnpj: string;
  
    @Column("varchar", { length: 20 })
    registroAns: string;
  
    @Column("text", { nullable: true })
    descricao: string;
  
    @Column({ type: "boolean", default: true })
    estaAtivo: boolean;

    @Column("varchar", { length: 100, nullable: true })
    email: string;
    
    constructor(nome, cnpj, registroAns, descricao, estaAtivo: boolean = true, email: string) {
      this.nome = nome;
      this.cnpj = cnpj;
      this.registroAns = registroAns;
      this.descricao = descricao;
      this.estaAtivo = estaAtivo;
      this.email = email;
    }
  }
  