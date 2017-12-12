FROM node:8
MAINTAINER ToMo Team

RUN npm install -g pm2

WORKDIR /build
COPY ./package.json /build
RUN npm install
COPY ./ /build
RUN npm run build

EXPOSE 80

RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
