FROM rust:1.90
RUN cargo install --git https://github.com/MercuryWorkshop/epoxy-tls epoxy-server

WORKDIR /usr/src/server

RUN apt-get update -qq && \
    apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl wget && \
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg && \
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list && \
    chmod o+r /usr/share/keyrings/caddy-stable-archive-keyring.gpg && \
    chmod o+r /etc/apt/sources.list.d/caddy-stable.list && \
    apt-get update && \
    apt-get install caddy && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives 

RUN wget "https://github.com/MercuryWorkshop/Woeful/releases/download/v1.0.0/woeful-x86_64-linux-musl"

COPY . .

EXPOSE 443
EXPOSE 80
CMD ["bash", "start.sh"]
