FROM node:8

RUN apt-get update && apt-get install -y git

RUN npm install -g pm2

COPY ./ /netstats

RUN cd /netstats && \
    npm install && npm install -g grunt-cli && grunt

EXPOSE 3000

WORKDIR /netstats

CMD ["npm", "start"]
