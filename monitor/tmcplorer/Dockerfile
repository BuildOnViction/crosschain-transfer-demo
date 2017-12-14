FROM php:5-apache

WORKDIR /build

RUN apt-get update && \
    apt-get install -y git autoconf pkg-config libssl-dev php5-mongo php5-dev php5-cli php-pear&& \
    git clone https://github.com/EverexIO/Ethplorer.git /var/www/html/

RUN a2enmod rewrite

RUN pecl install mongo
RUN echo "extension=mongo.so" > /usr/local/etc/php/conf.d/mongo.ini 
RUN php5enmod mongo

COPY config.php /var/www/html/service
COPY .htaccess /var/www/html/.htaccess
