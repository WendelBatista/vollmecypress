import { type Request, type Response } from 'express'
import { AppDataSource } from '../data-source.js'
import { PlanoSaude } from './planosDeSaudeEntity.js'
import { AppError } from '../error/ErrorHandler.js'
import { encryptPassword } from '../utils/senhaUtils.js'

// Get All
export const planosSaude = async (req: Request, res: Response): Promise<void> => {
  try {
    const allPlanos = await AppDataSource.manager.find(PlanoSaude);

    if (allPlanos.length > 0) {
      res.status(200).json(allPlanos);
    } else {
      res.status(404).json({
        type: "https://example.com/probs/planos-nao-encontrados",
        title: "Planos de saúde não encontrados",
        status: 404,
        detail: "Nenhum plano de saúde foi encontrado no sistema.",
      });
    }
  } catch (error) {
    console.error("Erro ao buscar planos de saúde:", error);
    res.status(500).json({
      type: "https://example.com/probs/erro-interno",
      title: "Erro interno no servidor",
      status: 500,
      detail: `Ocorreu um erro ao buscar os planos de saúde: ${error.message}`,
    });
  }
};

// Post
export const criarPlanoSaude = async (req: Request, res: Response): Promise<void> => {
  const { nome, cnpj, registroAns, descricao, estaAtivo, email } = req.body;

  // Validação dos campos obrigatórios
  if (!nome || !cnpj || !registroAns) {
    res.status(400).json({
      type: "https://example.com/probs/parametros-invalidos",
      title: "Parâmetros inválidos",
      status: 400,
      detail: "Os campos 'nome', 'cnpj' e 'registroAns' são obrigatórios para criar um plano de saúde.",
    });
    return;
  }

  try {
    const planoSaude = new PlanoSaude(nome, cnpj, registroAns, descricao, estaAtivo ?? true, email);

    // Salva o plano de saúde no banco de dados
    await AppDataSource.manager.save(PlanoSaude, planoSaude);

    res.status(201).json({
      type: "https://example.com/probs/sucesso",
      title: "Plano de saúde criado com sucesso",
      status: 201,
      detail: `O plano de saúde '${nome}' foi criado com sucesso.`,
    });
  } catch (error) {
    console.error("Erro ao criar plano de saúde:", error);
    res.status(500).json({
      type: "https://example.com/probs/erro-interno",
      title: "Erro interno no servidor",
      status: 500,
      detail: `Ocorreu um erro ao criar o plano de saúde: ${error.message}`,
    });
  }
};

// Get By Id
export const planoSaudeById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const planoSaude = await AppDataSource.manager.findOneBy(PlanoSaude, { id });

    if (planoSaude !== null) {
      res.status(200).json(planoSaude);
    } else {
      res.status(404).json({
        type: "https://example.com/probs/plano-nao-encontrado",
        title: "Plano de saúde não encontrado",
        status: 404,
        detail: `O plano de saúde com ID ${id} não foi encontrado no sistema.`,
      });
    }
  } catch (error) {
    console.error("Erro ao buscar plano de saúde:", error);
    res.status(500).json({
      type: "https://example.com/probs/erro-interno",
      title: "Erro interno no servidor",
      status: 500,
      detail: `Ocorreu um erro ao buscar o plano de saúde com ID ${id}: ${error.message}`,
    });
  }
};

// Put planoSaude/:id
export const atualizarPlanoSaude = async (req: Request, res: Response): Promise<void> => {
  const { nome, cnpj, registroAns, descricao } = req.body;
  const { id } = req.params;

  try {
    const planoSaudeUpdate = await AppDataSource.manager.findOneBy(PlanoSaude, { id });

    if (planoSaudeUpdate !== null) {
      planoSaudeUpdate.nome = nome;
      planoSaudeUpdate.cnpj = cnpj;
      planoSaudeUpdate.registroAns = registroAns;
      planoSaudeUpdate.descricao = descricao;

      await AppDataSource.manager.save(PlanoSaude, planoSaudeUpdate);

      res.status(200).json({
        type: "https://example.com/probs/sucesso",
        title: "Plano de saúde atualizado com sucesso",
        status: 200,
        detail: `O plano de saúde com ID ${id} foi atualizado com sucesso.`,
      });
    } else {
      res.status(404).json({
        type: "https://example.com/probs/plano-nao-encontrado",
        title: "Plano de saúde não encontrado",
        status: 404,
        detail: `O plano de saúde com ID ${id} não foi encontrado no sistema.`,
      });
    }
  } catch (error) {
    console.error("Erro ao atualizar plano de saúde:", error);
    res.status(500).json({
      type: "https://example.com/probs/erro-interno",
      title: "Erro interno no servidor",
      status: 500,
      detail: `Ocorreu um erro ao atualizar o plano de saúde com ID ${id}: ${error.message}`,
    });
  }
};

// Delete por id planoSaude/:id
export const apagarPlanoSaude = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // Verifica se o ID foi fornecido
  if (!id) {
    res.status(400).json({
      type: "https://example.com/probs/parametro-invalido",
      title: "Parâmetro inválido",
      status: 400,
      detail: "O parâmetro 'id' é obrigatório para apagar um plano de saúde.",
    });
    return;
  }

  try {
    const planoSaudeDel = await AppDataSource.manager.findOneBy(PlanoSaude, { id });

    if (planoSaudeDel !== null) {
      await AppDataSource.manager.remove(PlanoSaude, planoSaudeDel);
      res.status(200).json({
        type: "https://example.com/probs/sucesso",
        title: "Plano de saúde apagado com sucesso",
        status: 200,
        detail: `O plano de saúde com ID ${id} foi removido com sucesso.`,
      });
    } else {
      res.status(404).json({
        type: "https://example.com/probs/plano-nao-encontrado",
        title: "Plano de saúde não encontrado",
        status: 404,
        detail: `O plano de saúde com ID ${id} não foi encontrado no sistema.`,
      });
    }
  } catch (error) {
    console.error("Erro ao apagar plano de saúde:", error);
    res.status(500).json({
      type: "https://example.com/probs/erro-interno",
      title: "Erro interno no servidor",
      status: 500,
      detail: `Ocorreu um erro ao tentar apagar o plano de saúde com ID ${id}.`,
    });
  }
};

