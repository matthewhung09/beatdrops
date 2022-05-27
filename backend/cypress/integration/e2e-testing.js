describe("Login user", () => {
  context("Successful login", () => {
    it("GIVEN I navigate to the login page", () => {
      cy.visit("http://localhost:3000/");
    });

    it("WHEN I enter userame and password", () => {
      cy.get(
        ".MuiBox-root-2 > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input"
      ).type("r@gmail.com");
      cy.get(
        ".MuiBox-root-8 > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input"
      ).type("Password1!");
    });

    it("THEN I am redirected to the home page with my credentials", () => {
      cy.intercept("POST", "http://localhost:5000/login").as("login");
      cy.get(".MuiBox-root-10 > .MuiButtonBase-root").click();
      cy.wait("@login");
      cy.url().should("eq", "http://localhost:3000/home"); // => true
    });
  });

  context("Unsuccessfull login", () => {
    it("GIVEN I navigate to the login page", () => {
      cy.visit("http://localhost:3000/");
    });

    it("WHEN I enter userame and password", () => {
      cy.get(
        ".MuiBox-root-2 > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input"
      ).type("r@gmail.com");
      cy.get(
        ".MuiBox-root-8 > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input"
      ).type("incorrectpassword");
    });

    it("THEN I should be told my credentials are incorrect", () => {
      cy.intercept("POST", "http://localhost:5000/login").as("login");
      cy.get(".MuiBox-root-10 > .MuiButtonBase-root").click();
      cy.get(".MuiFormHelperText-root").contains("Password is incorrect.");
      cy.wait("@login");
    });
  });
});
