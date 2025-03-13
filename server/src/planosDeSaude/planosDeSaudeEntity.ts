import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Relation
  } from "typeorm";
  import { type IAutenticavel } from "../auth/IAutencavel.js";
  import { Role } from "../auth/roles.js";
   
  @Entity()
  export class PlanoSaude implements IAutenticavel {
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
  
    @Column("varchar", { length: 100, select: false })
    senha: string; // Criptografia?

    @Column("varchar", { nullable: false })
    role: Role;
    
    constructor(nome, cnpj, registroAns, descricao, estaAtivo) {
      this.nome = nome;
      this.cnpj = cnpj;
      this.registroAns = registroAns;
      this.descricao = descricao;
      this.estaAtivo = estaAtivo;
      this.role = Role.planoSaude;
    }
  }
  