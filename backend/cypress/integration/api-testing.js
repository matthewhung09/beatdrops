/*
Feature: Post song to homepage
As a student, I want to be able to see my post on the homepage so that I can be able to share the song I am currently listening to. 
Scenario: Successful song post.
	GIVEN I have chosen to post a song to the homepage.
	WHEN I spell the song and title correctly, and the song exists on Spotify.
	THEN I am able to see my song post on the homepage.
Scenario: Unsuccessful song post.
GIVEN I have chosen to post a song.
	WHEN I spell a song name incorrectly. 
	THEN I get an error message telling me that I spelled the song incorrectly.
*/

describe("Post song to homepage", () => {
  context("Successful song post.", () => {
    before(() => {});

    let post = {};

    it("GIVEN I have chosen to post a song to the homepage.", () => {
      post = {
        title: "food court",
        artist: "potsu",
        location: {
          name: "Dexter Lawn",
          lat: 0,
          long: 0,
          onCampus: true,
        },
      };
    });

    it("WHEN I spell the song and title correctly, and the song exists on Spotify.", () => {
      cy.request("POST", "http://localhost:5000/create", post).then((response) => {
        //Using matchers from Chai: https://www.chaijs.com/guide/styles/#assert
        // All Cypress supported matchers here: https://docs.cypress.io/guides/references/assertions
        assert.equal(response.status, 200, "THEN I am able to see my song post on the homepage.");
        assert.exists(response.body._id, "AND the response object contains the property _id");
        assert.equal(
          response.body.title,
          post.title,
          "AND the response object contains the same song title I passed"
        );
        assert.equal(
          response.body.artist,
          post.artist,
          "AND the response object contains the same artist I passed"
        );
        assert.equal(
          response.body.location.name,
          post.location.name,
          "AND the response object contains the same location I passed"
        );
      });
    });
  });

  context("Unsuccessful song post", () => {
    before(() => {});

    let post = {};

    it("GIVEN I have chosen to post a song.", () => {
      post = {
        title: "fed kourt",
        artist: "potsu",
        location: {
          name: "Dexter Lawn",
          lat: 0,
          long: 0,
          onCampus: true,
        },
      };
    });

    it("WHEN I spell a song name incorrectly.", () => {
      cy.request({
        method: "POST",
        url: "http://localhost:5000/users",
        body: post,
        failOnStatusCode: false,
      }).then((response) => {
        //Using matchers from Chai: https://www.chaijs.com/guide/styles/#assert
        //All Cypress supported matchers here: https://docs.cypress.io/guides/references/assertions
        assert.equal(
          response.status,
          404,
          "THEN I get an error message telling me that I spelled the song incorrectly."
        );
        assert.notExists(response.body.title, "AND there's no response obj");
      });
    });
  });
});

describe("Get posts", () => {
  context("Successfully get posts.", () => {
    it("GIVEN I am on the homepage.", () => {});

    it("WHEN I look at the list of posts.", () => {
      cy.request("GET", "http://localhost:5000/posts-test?lat=35.3018296&long=-120.6634004").then(
        (response) => {
          assert.equal(response.status, 201, "THEN I am able to see the posts on the homepage.");
          assert.isAtLeast(
            response.body.posts.length,
            1,
            "AND the response object contains the same song title I passed"
          );
        }
      );
    });
  });

  context("Unsuccessfully get posts", () => {
    it("GIVEN I am on the homepage.", () => {});

    it("WHEN I look at the list of posts.", () => {
      cy.request({
        method: "GET",
        url: "http://localhost:5000/posts?lat=35.3018296&long=-120.6634004",
        failOnStatusCode: false,
      }).then((resp) => {
        expect(resp.status).to.eq(401);
      });
    });
  });
});
