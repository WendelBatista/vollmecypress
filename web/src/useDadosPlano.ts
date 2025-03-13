import IPlano from "./types/IPlano"; // Supondo que o tipo IPlano esteja definido em um arquivo 'types/IPlano.ts'
import useFetch from "./useFetch"; // Reutilizando o hook useFetch

const useDadosPlano = () => {
  return useFetch<IPlano[]>({ url: 'planosdesaude' }); // Alterando o URL para o endpoint de planos de saúde
};

export default useDadosPlano;
