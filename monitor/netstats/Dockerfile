FROM node:8

RUN apt-get update && apt-get install -y git python-pip

RUN npm install -g pm2
RUN pip install honcho

RUN git clone https://github.com/cubedro/eth-net-intelligence-api /netapis && \
    cd /netapis && npm install

RUN git clone https://github.com/cubedro/eth-netstats /netstats

RUN cd /netstats && \
    npm install && npm install -g grunt-cli && grunt

COPY ./app.json /netapis/app.json
COPY Procfile /Procfile

EXPOSE 3000

ENV WS_SECRET eth-net-stats-secret

CMD ["honcho", "start"]
