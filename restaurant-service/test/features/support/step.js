const { When, Then, After } = require('@cucumber/cucumber');
const axios = require('axios');
const assert = require('assert');

async function doQuery(query, parent) {
  const response = await axios.post('http://localhost:3000/graphql', query);
  parent.response = response.data.data.restaurants;
}

When('I execute restaurants with hasImage = true', async () => {
  await doQuery({
    query: `
        query {
          restaurants(hasImage: true) {
            restaurants {
              images
            }
          }
        }
      `,
  }, this);
});

Then('I should get only restaurants with image links', async () => {
  const restaurants = this.response.restaurants;
  assert.ok(restaurants.length > 0);
  for (const restaurant of restaurants) {
    assert.ok(restaurant.images.length > 0);
    for (const image of restaurant.images) {
      assert.ok(image.startsWith('http'));
    }
  }
});

When('I execute restaurants with name = {string}', async (name) => {
  await doQuery({
    query: `
        query {
          restaurants(name: "${name}") {
            restaurants {
              name
            }
          }
        }
      `,
  }, this);
});

Then('I should get only one restaurant', async () => {
  const restaurants = await this.response.restaurants;
  assert.ok(restaurants.length === 1);
});

Then('I should get only restaurants with name {string}', async (name) => {
  const restaurants = await this.response.restaurants;
  assert.ok(restaurants.length > 0);
  for (const restaurant of restaurants) {
    assert.ok(restaurant.name === name);
  }
});

When('I execute restaurants with page size = {int}', async (limit) => {
  await doQuery({
    query: `
        query {
          restaurants(pagination: { limit: ${limit}} ) {
            restaurants {
              name
              allowReviews
              country {
                code
              }
            }
          }
        }
      `,
  }, this);
});

Then('I should get only french restaurants with allowReviews as true', async () => {
  const restaurants = await this.response.restaurants;
  assert.ok(restaurants.length > 0);
  for (const restaurant of restaurants) {
    assert.ok(restaurant.allowReviews === (restaurant.country.code === 'FR'));
  }
});

When('I execute restaurants without pagination arguments', async () => {
  await doQuery({
    query: `
        query {
          restaurants {
            restaurants {
              name
            }
            pagination {
              pageCount,
              currentPage
            }
          }
        }
      `,
  }, this);
});

Then('I should get 10 restaurants', async () => {
  const restaurants = await this.response.restaurants;
  assert.ok(restaurants.length === 10);
});

Then('I should get the first page of restaurants', async () => {
  const pagination = await this.response.pagination;
  assert.ok(pagination.currentPage === 1);
});

When('I execute restaurants with page size = {int} and page = {int}', async (size, page) => {
  await doQuery({
    query: `
        query {
          restaurants(pagination: { limit: ${size}, page: ${page}} ) {
            restaurants {
              name
            }
            pagination {
              pageCount,
              currentPage
            }
          }
        }
      `,
  }, this);
});

Then('I should get 5 restaurants', async () => {
  const restaurants = await this.response.restaurants;
  assert.ok(restaurants.length === 5);
});

Then('I should get the second page of restaurants', async () => {
  const pagination = await this.response.pagination;
  assert.ok(pagination.currentPage === 2);
});
