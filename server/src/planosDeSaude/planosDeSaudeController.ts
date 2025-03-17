import { type Request, type Response } from 'express'
import { AppDataSource } from '../data-source.js'
import { PlanoSaude } from './planosDeSaudeEntity.js'
import { AppError } from '../error/ErrorHandler.js'
import { encryptPassword } from '../utils/senhaUtils.js'

// Get All
export const planosSaude = async (req: Request, res: Response): Promise<void> => {
  const allPlanos = await AppDataSource.manager.find(PlanoSaude)
  if (allPlanos.length > 0) {
    res.status(200).json(allPlanos)
  } else {
    throw new AppError('Não encontramos planos de saúde')
  }
}

// Post
export const criarPlanoSaude = async (req: Request, res: Response): Promise<void> => {
  const { nome, cnpj, registroAns, descricao, estaAtivo, email } = req.body

  // Validação dos campos obrigatórios
  if (!nome || !cnpj || !registroAns) {
    res.status(400).json({ status: 400, message: 'Os campos nome, cnpj e registroAns são obrigatórios' })
    return
  }

  try {
    const planoSaude = new PlanoSaude(nome, cnpj, registroAns, descricao, estaAtivo ?? true, email)

    // Salva o plano de saúde no banco de dados
    await AppDataSource.manager.save(PlanoSaude, planoSaude)

    res.status(201).json({ status: 201, message: 'Plano de saúde criado com sucesso' })
  } catch (error) {
    console.error('Erro ao criar plano de saúde:', error)
    res.status(500).json({ status: 500, message: `Internal server error: ${error.message}` })
  }
}

// Get By Id
export const planoSaudeById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  const planoSaude = await AppDataSource.manager.findOneBy(PlanoSaude, { id })

  if (planoSaude !== null) {
    res.status(200).json(planoSaude)
  } else {
    throw new AppError('Id não encontrado')
  }
}

// Put planoSaude/:id
export const atualizarPlanoSaude = async (req: Request, res: Response): Promise<void> => {
  const { nome, cnpj, registroAns, descricao } = req.body
  const { id } = req.params

  const planoSaudeUpdate = await AppDataSource.manager.findOneBy(PlanoSaude, { id })
  if (planoSaudeUpdate !== null) {
    planoSaudeUpdate.nome = nome
    planoSaudeUpdate.cnpj = cnpj
    planoSaudeUpdate.registroAns = registroAns
    planoSaudeUpdate.descricao = descricao

    await AppDataSource.manager.save(PlanoSaude, planoSaudeUpdate)
    res.json(planoSaudeUpdate)
  } else {
    throw new AppError('Id não encontrado')
  }
}

// Delete por id planoSaude/:id
export const apagarPlanoSaude = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  const planoSaudeDel = await AppDataSource.manager.findOneBy(PlanoSaude, { id })

  if (planoSaudeDel !== null) {
    await AppDataSource.manager.remove(PlanoSaude, planoSaudeDel)
    res.json({ message: 'Plano de saúde apagado!' })
  } else {
    throw new AppError('Id não encontrado')
  }
}

