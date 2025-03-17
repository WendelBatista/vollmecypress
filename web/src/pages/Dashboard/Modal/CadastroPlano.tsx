import { useState } from "react";
import { Box, Modal, Snackbar, Alert } from "@mui/material"; // Import Snackbar e Alert
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
`;

const Container = styled.div`
  text-align: left;
`;

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
  const [sucesso, setSucesso] = useState(false); // Estado para controlar a mensagem de sucesso
  const { cadastrarDados } = usePost();
  const { usuario } = autenticaStore;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const plano: IPlano = {
      nome: nome,
      cnpj: cnpj,
      registroAns: registroAns,
      descricao: descricao,
    };

    //console.log("Usuário no autenticaStore:", usuario); // Verifica o estado do usuário
    //console.log("Token enviado:", usuario.token); // Verifica o token

    try {
      const response = await cadastrarDados({
        url: "planosdesaude",
        dados: plano,
        token: usuario.token,
      });

      // Verifica se o backend retornou sucesso
      if (response.status === 201) {
        console.log("Plano cadastrado com sucesso!");
        setNome("");
        setCnpj("");
        setRegistroAns("");
        setDescricao("");
        setSucesso(true); // Exibe a mensagem de sucesso
        handleClose();
      } else {
        console.error("Erro ao cadastrar plano de saúde:", response);
      }
    } catch (error) {
      console.error("Erro ao cadastrar plano de saúde:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setSucesso(false); // Fecha a mensagem de sucesso
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
                placeholder="Digite o nome do plano de saúde."
                onChange={setNome}
                dataTest="inputPlanoNome"
              />
              <CampoDigitacao
                tipo="text"
                label="CNPJ"
                valor={cnpj}
                placeholder="Digite o CNPJ do plano."
                onChange={setCnpj}
                dataTest="inputPlanoCNPJ"
              />
              <CampoDigitacao
                tipo="text"
                label="Registro ANS"
                valor={registroAns}
                placeholder="Digite o registro ANS."
                onChange={setRegistroAns}
                dataTest="inputPlanoRegistroANS"
              />
              <CampoDigitacao
                tipo="text"
                label="Descrição"
                valor={descricao}
                placeholder="Digite a descrição do plano."
                onChange={setDescricao}
                dataTest="inputPlanoDescricao"
              />
            </Container>
            <BotaoCustomizado data-test="botaoCadastrar" type="submit">Cadastrar</BotaoCustomizado>
          </form>
        </BoxCustomizado>
      </Modal>

      {/* Snackbar para exibir a mensagem de sucesso */}
      <Snackbar
        open={sucesso}
        autoHideDuration={3000} // Fecha automaticamente após 3 segundos
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          Plano de saúde cadastrado com sucesso!
        </Alert>
      </Snackbar>
    </>
  );
}