#!/bin/sh
apt-get install -y sudo
sudo apt-get install -y vim
sudo apt-get install -y msmtp

chmod 600 /usr/setupServer/.msmtprc


mv /usr/setupServer/.msmtprc /etc/.msmtp_php

chown www-data:www-data /etc/.msmtp_php

mv /usr/setupServer/php.ini /usr/local/etc/php/php.ini

touch /var/log/msmtp.log

chown www-data:www-data /var/log/msmtp.log

#apachectl restart
