FROM ethereum/client-go

RUN apk add --update git bash nodejs nodejs-npm

RUN npm install -g pm2

RUN git clone https://github.com/cubedro/eth-net-intelligence-api /netapis && \
    cd /netapis && npm install

COPY ./apis.sh /netapis/apis.sh
COPY ./app.json /netapis/app.json
RUN chmod +x /netapis/apis.sh

RUN git clone https://github.com/cubedro/eth-netstats /netstats && \
    cd /netstats && npm install && npm install -g grunt-cli && grunt

EXPOSE 3000

WORKDIR /netstats

ENTRYPOINT ["/netapis/apis.sh"]

CMD ["npm", "start"]
