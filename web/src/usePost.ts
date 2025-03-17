import { useState } from 'react';

export default function usePost() {
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState(false);
    const [resposta, setResposta] = useState('');

    async function cadastrarDados<T>({ url, dados, token }: { url: string; dados: T; token?: string }) {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const resposta = await fetch(`http://localhost:8080/${url}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(dados),
            });

            const respostaConvertida = await resposta.json();

            // Atualiza o estado com a resposta
            setResposta(respostaConvertida.token);
            localStorage.setItem('token', respostaConvertida.token);

            setSucesso(true);

            // Retorna o status e os dados da resposta
            return {
                status: resposta.status,
                data: respostaConvertida,
            };
        } catch (erro) {
            setErro('Não foi possível enviar os dados');
            console.error('Erro ao enviar os dados:', erro);

            // Retorna um objeto de erro para o chamador
            return {
                status: 500,
                data: null,
            };
        }
    }

    return { cadastrarDados, sucesso, erro, resposta };
}
