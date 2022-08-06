# TheFork backend test v1.1

**Please don't communicate this test nor your implementation publicly**
(even if you're very proud of it)

- You probably prefer your future team mates to write their own implemention than copy yours
- It saves us the hassle of updating this test too frequently

Thanks !

## Goal
Creation of a graphql API in NodeJS.

## Context
The purpose of this project is to create a simple graphQL API in charge of exposing Restaurant information fetched from an external service (`image-service`) and from a local database.

### Infrastructure
Infrastructure is available in the [docker-compose file](./docker-compose.yml) and composed as follow:
 - a NodeJs GraphQL micro-service ([restaurant-service](./restaurant-service)) You can use the playground to test it http://localhost:3000/graphql
 - a PostgreSQL database
 - a REST micro-service ([image-service](./image-service))

### Database

Database tables are created through migrations and the database is populated with test data through seeds (you don't need to modify migrations and seed directories)

> - restaurant (restaurant_uuid, name, country_code)
> - restaurant_has_images (restaurant_uuid, image_uuid)
> - country (country_code, locales) - (locales is an psql array of texts)


### Image service (DO NOT EDIT THIS PROJECT)
This service is exposing 2 endpoints:
- `GET /images` returning all images (no filter)

Expected response:
```json
{
    "images": [
        {
            "imageUuid": "imageUuid",
            "url": "url"
        }
    ]
}
```

Important information:
 - **This endpoint must NOT be modified** (even if it's badly designed)
 - This project has no database. Data are persisted in memory only. Every server restart will reset everything.

## TO DO

### Create a graphQL query
Create a graphQL query returning restaurant information.

Response must be paginated (set a default value if none is provided) and optionnaly filtered by:
 - the restaurant name
 - with images only (i.e. return only restaurants having images. By default, all restaurants are returned)

The field "allowReview" is not stored anywhere. It must be computed "on the fly" and set to true for french restaurants only.

Expected response:
```json
{
  "restaurants": [
      {
          "restaurantUuid": "restaurantUuid",
          "name": "name",
          "country": {
              "code": "code",
              "locales": ["fr_FR"]
          },
          "images": [ "http://image.url" ],
          "allowReview": true
      }
  ],
  "pagination": {
      "total": 1,
      "pageCount": 1,
      "currentPage": 1
  }
}
```

### Additional information
- This project is initialized with a basic config. You must keep this stack but feel free **to improve the project structure** if you see any improvement
- Please produce code with what is for you **production quality standards** as if you'll have to maintain codebase during the next coming years
- To provide discussion material for technical interview, you can list any optimizations that you don't have time to implement but consider important

## Things changed (to @RePrete)
- Remove db volume: on macOs there are permission issues when mapping postgres data folder with host folder (all docker volumes are owned by root)
- Removed node_modules volume (I needed to see the typescript definitions)
- I am assuming that *country_code* must be use to defined if the review is allowed
- Using a facroty lead to anemic model, but I still prefer to have a factory to create always valid models and models to have an "hard" layer before serialization
- DA FARE PAGINAZIONE E TEST

## Open points
- Simplify map-reduce operation on restaurant query using an ORM (objection.js)
- Port models to ORM models
- Find a better name and position for dataProviders
- Implement a more efficient provider (in-memory? redis?)
- RestaurantRowToModelFactory does not have an interface (static properties are not allowed on interfaces in Typescript https://github.com/microsoft/TypeScript/issues/3841)