#!/bin/bash

# The directory where the SQLite database will be stored.
DATABASE_DIR="/var/www/html/sites/default/files"

# Check if Drupal is already installed
if [ ! -f /var/www/html/sites/default/settings.php ]; then

    cd /opt/drupal && composer require drush/drush:^10.3

    # Install Drupal
    cd /opt/drupal && drush site:install standard --db-url=sqlite://sites/default/files/.ht.sqlite --site-name="My Drupal Site" --account-name=admin --account-pass=admin --no-interaction

    # Make sure the SQLite database and its directory are writable by the web server
    chown -R www-data:www-data "$DATABASE_DIR"
    chmod -R 755 "$DATABASE_DIR"
    
else
  echo "Drupal is already installed."
fi

# Keep Apache running in the foreground
echo "Starting Apache..."
exec apache2-foreground
