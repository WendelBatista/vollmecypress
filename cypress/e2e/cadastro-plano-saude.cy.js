import { fakerPT_BR as faker } from '@faker-js/faker';

describe('Usuário logado na página de cadastro de plano de saúde', () => {
    beforeEach(() => {
        // Realiza login antes de cada teste
        cy.login(Cypress.env('email'), Cypress.env('senha'));
                // Loga o usuário, senha e token no console
               // console.log('Usuário:', Cypress.env('email'));
                //console.log('Senha:', Cypress.env('senha'));
                        // Captura o token do localStorage
        cy.window().then((win) => {
            const token = win.localStorage.getItem('token'); // Substitua 'token' pela chave usada na aplicação
            Cypress.env('token', token); // Armazena o token no ambiente do Cypress
           //console.log('Token capturado do localStorage:', token);
        });
             //console.log('Token:', Cypress.env('token'));
           
    });

    context('Redirecionamento para a página de cadastro de plano de saúde', () => {
        it('Clica no botão "Cadastrar Plano de Saúde" e redireciona para a página de cadastro', () => {
            cy.visit('/dashboard');
            cy.get('.sc-pyfCe > :nth-child(3)').should('be.visible').click(); // Botão para abrir a tela de cadastro
            cy.url().should('eq', 'http://localhost:3000/dashboard'); // Ajuste a URL conforme necessário
        });
    });

    context('Sessão de cadastro de plano de saúde', () => {
        const nomePlano = faker.company.name();
        const cnpj = `${faker.string.numeric(2)}.${faker.string.numeric(3)}.${faker.string.numeric(3)}/${faker.string.numeric(4)}-${faker.string.numeric(2)}`; // Gera CNPJ formatado
        const registroAns = faker.string.numeric(6);
        const descricao = faker.lorem.sentence();

        it('Cadastra um plano de saúde com sucesso', () => {
            cy.visit('/dashboard');
            cy.get('.sc-pyfCe > :nth-child(3)').should('be.visible').click(); // Botão para abrir a tela de cadastro

            // Preenche o formulário de cadastro
            cy.get('[data-test="inputPlanoNome"]').type(nomePlano); // Campo Nome
            cy.get('[data-test="inputPlanoCNPJ"]').type(cnpj); // Campo CNPJ
            cy.get('[data-test="inputPlanoRegistroANS"]').type(registroAns); // Campo Registro ANS
            cy.get('[data-test="inputPlanoDescricao"]').type(descricao); // Campo Descrição


            // Intercepta a requisição POST e adiciona o token
            cy.intercept('POST', 'http://localhost:8080/planosdesaude', (req) => {
                const token = Cypress.env('token');
                req.headers['Authorization'] = `Bearer ${token}`;
                //console.log('Token enviado no cabeçalho:', token);
            }).as('postPlanoSaude');

            // Submete o formulário clicando no botão "Cadastrar"
            cy.xpath('/html/body/div[2]/div[3]/form/button').click({ force: true });

            // Aguarda a requisição POST
            cy.wait('@postPlanoSaude').then((interception) => {
               // console.log('Cabeçalhos da requisição:', interception.request.headers);
                expect(interception.request.headers['Authorization']).to.exist;
                expect(interception.request.headers['Authorization']).to.include('Bearer');
                expect(interception.response.statusCode).to.eq(201); // Ajuste conforme o esperado
            });
            // Verifica se a mensagem de sucesso aparece
            //cy.contains('Plano cadastrado com sucesso!').should('be.visible');

            // Verifica se o redirecionamento ocorreu corretamente
            cy.url().should('eq', 'http://localhost:3000/dashboard'); // Ajuste a URL de redirecionamento, se necessário
        });
    });
});