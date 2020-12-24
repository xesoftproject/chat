FROM node:12-alpine3.12
ENV PROJECT_NAME=ServiceChat
ENV PROJECT_VERSION=0.0.1
WORKDIR /_root/app
COPY /_root/app .
RUN npm install
EXPOSE 3000
CMD npm start

