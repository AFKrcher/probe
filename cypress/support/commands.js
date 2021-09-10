// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (username, password) =>{
    cy.get('#drop-down').click()
    cy.get('#login').click()
    cy.get('body').trigger('keydown', {keyCode: 27})
    cy.get("#username").type(username)
    cy.get('#password').type(password)
    cy.get("#login-button").click()
  })

  Cypress.Commands.add('register', (email, username, password)=>{
    cy.get('#drop-down').click()
    cy.get('#register').click().trigger('keydown', { keyCode: 27});
    cy.get('#email').click().type(email)
    cy.get('#username').type(username)
    cy.get('#password').type(password)
    cy.get('#confirm').type(password)
    cy.get('#register-button').click()
  })

  Cypress.Commands.add('logout', () =>{
    cy.get('#drop-down').click()
    cy.get('#logout').click()
    cy.reload()
  })
  Cypress.Commands.add('settings', () =>{
    cy.get('#drop-down').click()
    cy.get('#settings').click().trigger('keydown', {keyCode: 27})
  })

  Cypress.Commands.add('deleteUser', () =>{
    cy.settings()
    cy.get('#deleteButton').click()
  })