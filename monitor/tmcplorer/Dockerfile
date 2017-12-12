FROM php:7-apache

WORKDIR /build

RUN apt-get update && \
    apt-get install -y git && \
    git clone https://github.com/EverexIO/Ethplorer.git /var/www/html/

RUN a2enmod rewrite

COPY config.php /var/www/html/service
COPY .htaccess /var/www/html/.htaccess
