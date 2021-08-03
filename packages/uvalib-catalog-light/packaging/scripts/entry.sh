#
# main entry point
#

# rewrite the config as necessary

# handle logging which we want to go to stdout (and we cant configure this in lighttpd)
mkfifo -m 600 /tmp/logpipe
cat <> /tmp/logpipe 1>&2 &
chown lighttpd /tmp/logpipe

# run the httpd server
lighttpd -D -f /etc/lighttpd/lighttpd.conf

#
# end of file
#
