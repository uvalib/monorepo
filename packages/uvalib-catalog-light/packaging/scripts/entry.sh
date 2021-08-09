#
# main entry point
#

# rewrite the config as appropriate
if [ -n "$APPLICATION_ENV" -a -n "$SEARCH_URL" ]; then
   echo "Rewriting env.js"
   echo "APPLICATION_ENV: $APPLICATION_ENV"
   echo "SEARCH_URL: $SEARCH_URL"
   cat /home/webservice/env.json.template | sed -e "s&__APPLICATION_ENV__&$APPLICATION_ENV&g" | sed -e "s&__SEARCH_URL__&$SEARCH_URL&g" > /var/www/localhost/htdocs/env.json
else
   echo "Using default env.js"
fi

# handle logging which we want to go to stdout (and we cant configure this in lighttpd)
mkfifo -m 600 /tmp/logpipe
cat <> /tmp/logpipe 1>&2 &
chown lighttpd /tmp/logpipe

# run the httpd server
lighttpd -D -f /etc/lighttpd/lighttpd.conf

#
# end of file
#
