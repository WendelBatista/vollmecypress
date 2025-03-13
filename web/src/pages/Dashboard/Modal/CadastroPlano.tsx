import { useState } from "react";
import { Box,  Modal } from "@mui/material";
import Titulo from "../../../components/Titulo";
import CampoDigitacao from "../../../components/CampoDigitacao";
import Botao from "../../../components/Botao";
import IPlano from "../../../types/IPlano";
import styled from "styled-components";
import usePost from "../../../usePost";
import autenticaStore from "../../../stores/autentica.store";

const BoxCustomizado = styled(Box)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30vw;
  max-height: 90vh;
  overflow-y: auto;
  background-color: var(--branco);
  border: none;
  border-radius: 16px;
  padding: 1em 5em;
`;

const BotaoCustomizado = styled(Botao)`
    width: 50%;
    display: block;
    margin: 0 auto;
`
const Container = styled.div`
text-align: left;
`

export default function CadastroPlano({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [registroAns, setRegistroAns] = useState("");
  const [descricao, setDescricao] = useState("");
  const {cadastrarDados} = usePost();
  const {usuario} = autenticaStore;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const plano: IPlano = {
      nome :nome,
      cnpj :cnpj,
      registroAns :registroAns,
      descricao :descricao,
    };

    await cadastrarDados({ url: "planosdesaude", dados: plano, token: usuario.token });
    
  };

  return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <BoxCustomizado>
                    <Titulo>Cadastre um novo plano de saúde:</Titulo>
                    <form onSubmit={handleSubmit}>
        <Container>
            <CampoDigitacao
              tipo="text"
              label="Nome"
              valor={nome}
              placeholder="Digite do plano de saúde."
              onChange={setNome}
              dataTest="inputEspecialistaNome"
            />
            <CampoDigitacao
              tipo="text"
              label="CNPJ"
              valor={cnpj}
              placeholder="Digite o CNPJ da empresa."
              onChange={setCnpj}
              dataTest="inputEspecialistaCNPJ"
            />
            <CampoDigitacao
              tipo="text"
              label="Registro ANS"
              valor={registroAns}
              placeholder="Digite o registro ANS."
              onChange={setRegistroAns}
              dataTest="inputEspecialistaRegistroANS"
            />
            <CampoDigitacao
              tipo="text"
              label="Descrição"
              valor={descricao}
              placeholder="Digite a descrição do plano."
              onChange={setDescricao}
              dataTest="inputEspecialistaDescricao"
            />
            </Container>
                    <BotaoCustomizado>Cadastrar</BotaoCustomizado>
            </form>
                </BoxCustomizado>
            </Modal >
        </>
    );
}