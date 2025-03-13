import { useState } from "react";
import Avaliacao from "../../components/Avaliacao";
import Botao from "../../components/Botao";
import Cabecalho from "../../components/Cabecalho";
import Container from "../../components/Container";
import Grafico from "../../components/Grafico";
import Rodape from "../../components/Rodape";
import Subtitulo from "../../components/Subtitulo";
import Tabela from "../../components/Tabela";
import Titulo from "../../components/Titulo";
import useDadosConsulta from "../../useDadosConsulta";
import useDadosProfissional from "../../useDadosProfissional";
import ModalCadastroEspecialista from "./Modal"; // Importando o ModalCadastroEspecialista
import ModalCadastroPlano from "./Modal/CadastroPlano"; // Importando o ModalCadastroPlano

export default function Dashboard() {
  const { dados: consultas, erro: consultasErro } = useDadosConsulta();
  const { dados: profissionais, erro: profissionaisErro } = useDadosProfissional();

  if (consultasErro || profissionaisErro) {
    console.log("Ocorreu um erro na requisição");
  }

  const [openEspecialista, setOpenEspecialista] = useState(false); // Estado para abrir o modal de especialista
  const [openPlano, setOpenPlano] = useState(false); // Estado para abrir o modal de plano de saúde

  const handleOpenEspecialista = () => {
    setOpenEspecialista(true); // Abre o modal de cadastro de especialista
  };

  const handleCloseEspecialista = () => {
    setOpenEspecialista(false); // Fecha o modal de cadastro de especialista
  };

  const handleOpenPlano = () => {
    setOpenPlano(true); // Abre o modal de cadastro de plano de saúde
  };

  const handleClosePlano = () => {
    setOpenPlano(false); // Fecha o modal de cadastro de plano de saúde
  };

  return (
    <Container>
      <Titulo>Área Administrativa</Titulo>
      
      {/* Botões para abrir os modais de cadastro */}
      <Botao onClick={handleOpenEspecialista}>Cadastrar especialista</Botao>
      <Botao onClick={handleOpenPlano}>Cadastrar Plano de Saúde</Botao>

      {/* Modais de cadastro */}
      <ModalCadastroEspecialista open={openEspecialista} handleClose={handleCloseEspecialista} />
      <ModalCadastroPlano open={openPlano} handleClose={handleClosePlano} />

      <Titulo imagem="consulta">Consultas do Dia</Titulo>
      <Tabela consultas={consultas} />

      <Titulo imagem="grafico">Consultas mensais por especialista</Titulo>
      <Subtitulo>Dezembro/22</Subtitulo>
      <Grafico consultas={consultas} profissionais={profissionais} />

      <Titulo imagem="avaliacao">Avaliações de especialistas</Titulo>
      <Avaliacao profissionais={profissionais} />
    </Container>
  );
}
