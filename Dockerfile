FROM node:20.8.0-alpine
WORKDIR /app
COPY . .
RUN ls -a
ENV PORT=80
EXPOSE 80
RUN [ "yarn", "install", "--frozen-lockfile" ]
CMD [ "yarn", "start" ]