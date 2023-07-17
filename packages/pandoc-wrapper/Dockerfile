FROM debian:latest
RUN apt-get update && apt-get install -y pandoc
WORKDIR /data
ENTRYPOINT ["pandoc"]
