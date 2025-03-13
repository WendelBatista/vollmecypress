import { Router } from 'express'
import {
  planosSaude,
  criarPlanoSaude,
  planoSaudeById,
  atualizarPlanoSaude,
  apagarPlanoSaude
} from './planosDeSaudeController.js'
import { Role } from '../auth/roles.js'
import { verificaTokenJWT } from '../auth/verificaTokenJWT.js'

export const planoSaudeRouter = Router()

planoSaudeRouter.get('/', planosSaude)
planoSaudeRouter.post('/', verificaTokenJWT(Role.planoSaude), criarPlanoSaude)
//planoSaudeRouter.get('/busca', buscarPlanosSaude)
planoSaudeRouter.get('/:id', planoSaudeById)
planoSaudeRouter.put(
  '/:id',
  verificaTokenJWT(Role.planoSaude),
  atualizarPlanoSaude
)
planoSaudeRouter.delete(
  '/:id',
  verificaTokenJWT(Role.planoSaude),
  apagarPlanoSaude
)

export default (app) => {
  app.use('/planosdesaude', planoSaudeRouter)
}
