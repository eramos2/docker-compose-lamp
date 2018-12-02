chmod 600 .msmtprc

mv .msmtprc /etc/.msmtp_php

chown www-data:www-data /etc/.msmtp_php

mv php.ini /etc/php5/php.ini

touch /var/log/msmtp.log

chown www-data:www-data /var/log/msmtp.log

apachectl restart

