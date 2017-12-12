FROM php:7-apache-stretch

WORKDIR /build

RUN apt-get update && \
    apt-get install -y git && \
    git clone https://github.com/EverexIO/Ethplorer.git /var/www/html/

COPY config.php /var/www/html/service
    
