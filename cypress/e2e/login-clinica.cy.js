describe('Página de Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000'); // Substitua pela URL correta
    cy.contains('Entrar', { timeout: 10000 }).should('be.visible').click();
   
  });

  it('Digita email e senha corretos para efetuar o login', { browser: 'chrome' }, () => {
    // cy.log('Iniciando o login');
    cy.login(Cypress.env('email'), Cypress.env('senha'));
    //cy.log('Login realizado, verificando redirecionamento');
    //cy.url({ timeout: 10000 }).should('eq', 'http://localhost:3000/dashboard');
    //cy.log('Teste concluído');
  });
});