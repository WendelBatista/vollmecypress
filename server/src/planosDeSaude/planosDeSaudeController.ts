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
  let { nome, cnpj, registroAns, descricao, senha } = req.body

  const senhaCriptografada = encryptPassword(senha)
  const planoSaude = new PlanoSaude (nome, cnpj, registroAns, descricao, senhaCriptografada)

  try {
    await AppDataSource.manager.save(PlanoSaude, planoSaude)
    res.status(200).json(planoSaude)
  } catch (error) {
    if ((await AppDataSource.manager.findOne(PlanoSaude, { where: { cnpj } })) != null) {
      res.status(422).json({ message: 'CNPJ já cadastrado' })
    } else {
      throw new AppError('Plano de saúde não foi criado')
    }
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

