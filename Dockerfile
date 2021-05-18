FROM node:14.15.1-alpine as base

WORKDIR /app

COPY ./package.json ./package.json
RUN yarn install --prod --silent --no-lockfile
RUN cp -RL ./node_modules/ /tmp/node_modules/
RUN yarn

COPY ./tsconfig.json ./tsconfig.json
COPY ./src ./src
RUN yarn build

FROM base
WORKDIR /app

COPY --from=base /tmp/node_modules /app/node_modules
COPY --from=base /app/dist /app/dist

COPY ./wait /wait
RUN chmod +x /wait

CMD /wait && npm start