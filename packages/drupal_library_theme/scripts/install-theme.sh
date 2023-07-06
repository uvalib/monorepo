#!/bin/bash

docker-compose exec drupal drush en my_theme -y
docker-compose exec drupal drush config-set system.theme default my_theme -y