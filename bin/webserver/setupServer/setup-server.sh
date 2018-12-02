#!/bin/sh
apt-get -y install --fix-missing vim

apt-get -y install --fix-missing msmtp

chmod 600 .msmtprc

mv ./.msmtprc /etc/.msmtp_php

chown www-data:www-data /etc/.msmtp_php

mv ./php.ini /usr/local/etc/php/php.ini

touch /var/log/msmtp.log

chown www-data:www-data /var/log/msmtp.log

apachectl restart
