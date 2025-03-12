import { fakerPT_BR as faker } from '@faker-js/faker';

describe('API - Clínicas', () => {

    it('Deve criar uma nova clínica com sucesso', () => {
        // Lista de planos de saúde disponíveis
        const planosDisponiveis = ["Unimed", "Bradesco", "Amil", "Biosaude"];
        
        // Função para gerar um array aleatório de planos
        function gerarPlanoDeSaude() {
            const numeroDePlanos = Math.floor(Math.random() * planosDisponiveis.length) + 1; // Garante pelo menos 1 plano
            const planosAleatorios = planosDisponiveis.sort(() => Math.random() - 0.5).slice(0, numeroDePlanos); // Embaralha e seleciona
            return planosAleatorios;
        }
    
        // Gerando os planos de saúde aleatórios
        const planosValidos = gerarPlanoDeSaude();
    
        // Criando o objeto da nova clínica
        const novaClinica = {
            nome: faker.company.name(),
            email: faker.internet.email(),
            senha: faker.internet.password(),
            endereco: {
                cep: faker.location.zipCode(),
                rua: faker.location.street(),
                numero: faker.string.numeric(3),
                complemento: 'Sala ' + faker.string.numeric(2),
                estado: faker.location.state()
            },
            planoDeSaudeAceitos: planosValidos // Usando planosValidos gerados aleatoriamente
        };
    
        console.log(novaClinica);  // Para verificar o resultado 
 
        cy.request('POST', Cypress.env('api_clinica'), novaClinica)
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('nome').that.is.a('string');
          expect(response.body).to.have.property('email').that.is.a('string');
          expect(response.body).to.have.property('senha').that.is.a('string');
          expect(response.body).to.have.property('endereco').that.is.an('object');
          expect(response.body.endereco).to.have.property('cep').that.is.a('string');
          expect(response.body.endereco).to.have.property('rua').that.is.a('string');
          expect(response.body.endereco).to.have.property('estado').that.is.a('string');
          expect(response.body.endereco).to.have.property('numero').that.is.a('string');
          expect(response.body.endereco).to.have.property('complemento').that.is.a('string');
          expect(response.body.endereco).to.have.property('id').that.is.a('string');
          expect(response.body).to.have.property('planoDeSaudeAceitos').that.is.an('array').and.to.include(1, 2);
          expect(response.body).to.have.property('id').that.is.a('string');
          expect(response.body).to.have.property('role').that.equals('CLINICA');
        });
      
    });
});
