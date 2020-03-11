FROM node:13.8.0-alpine3.10

COPY ./frontend /app
WORKDIR /app
RUN yarn install

ENTRYPOINT [ "npm" ]
CMD [ "start" ]