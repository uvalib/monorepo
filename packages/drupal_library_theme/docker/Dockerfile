FROM drupal:9

# Install necessary packages
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*


# Copy the install script into the container
COPY scripts/install-drupal.sh /usr/local/bin/install-drupal.sh

# Run the install script
CMD ["/usr/local/bin/install-drupal.sh"]
