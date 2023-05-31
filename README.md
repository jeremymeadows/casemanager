# download the project

```
git clone git@github.com:jeremymeadows/dkitsu-casemanager.git
```

# edit configuration

change the information to match your environment

```
cd dkitsu-casemanager
vi .env
```

```
DB_USER="admin"
DB_PASSWORD="passw0rd"

# host and database are only required if running outside of docker
#DB_HOST="192.0.0.10"
#DB_DATABASE="dkitsu"

# if both protocols are enabled, HTTP will simply redirect to HTTPS. disable one
# by explicitly setting it to have no port (ex `HTTPS_PORT=`). if left unset,
# http and https default to ports `80` and `443`, respectively. both protocols
# must be enabled if running in Docker.
#HTTP_PORT=80
#HTTPS_PORT=443

# tls certs are only required if the https server is enabled
#TLS_CERT="/.../cert.pem"
#TLS_CERT_KEY="/.../cert-key.pem"
```

# run the app

## in Docker (recommended)

```
npm run docker
```
then visit [https://localhost]

## in Node (for development)

```
npm install
npm run dev
```

## in Node (for production)

the server listens on ports `80` and `443` by default so it needs root access to
run, but that can be changed by setting port numbers to be greater the `1024`

```
npm install
npm run build
sudo npm run serve
```

# stop

## in Docker

`docker compose down`

## in Node

`Ctrl-C`
