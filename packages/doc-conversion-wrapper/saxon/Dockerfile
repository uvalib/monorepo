# In saxon/Dockerfile
FROM openjdk:11-jre-slim
WORKDIR /data

# Install necessary utilities and Java
RUN apt-get update && apt-get install -y wget unzip

# Download Saxon-HE (Home Edition)
RUN wget https://github.com/Saxonica/Saxon-HE/releases/download/SaxonHE12-3/SaxonHE12-3J.zip

# Unzip Saxon and clean up the zip file
RUN unzip SaxonHE12-3J.zip && rm SaxonHE12-3J.zip

ENTRYPOINT ["java", "-jar", "/SaxonHE12-3J/saxon-he-12.3.jar"]