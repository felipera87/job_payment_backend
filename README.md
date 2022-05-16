# Backend task

## How to run this project
```
yarn install
yarn seed
yarn start
```

## How to run the tests
```
yarn test
```

## Development environment
Consider using VS Code with these plugins installed for a better experience:
- [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Prettier ESLint](https://marketplace.visualstudio.com/items?itemName=rvest.vs-code-prettier-eslint)

## Dev notes

- As you'll notice, I took more than 3 to 4 hours on this. Got carried away, sorry, hope it's worth it. In 5 hours I had the endpoints, the rest took about extra 5 hours.
- Refactored the project to Typescript, had to redefine some things like the models. I decided to go with Typescript because for me it increases productivity, I hope it's ok.
- I tried to organize the project the best I could, not sure if that was allowed but there's nothing telling me not to. I know there's room to improve but I didn't want to lose too much time here.
- I stick to the endpoint rules, so I did not implement pagination, filters or queries. This was a decision based on effort/available time.
- Admin routes are open, since there was nothing on the specs about an admin profile/authentication it just checks `getProfile`.
- In some cases tests may seem incomplete since main rules are in the query, it was unnecessary to test all possibilities on those cases because the focus would be testing my fake repositories instead of the services.
- Wanted to do so many things like a swagger ui, a simple frontend in react, a Dockerfile running pm2... but it's getting way too far from the time window of this project :(
- There's a postman collection just for the lack of a better documentation of the endpoints, need to declare the environment variable `baseUrl` as `http://localhost:3001`.
