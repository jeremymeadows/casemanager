# download the project

`git clone https://github.com/jeremymeadows/dkitsu-casemanager.git`
or
`git clone git@github.com:jeremymeadows/dkitsu-casemanager.git`

# edit configuration

`cd dkitsu-casemanager`

`vi .env` and change the information to match your environment

```
DB_USER="admin"
DB_PASSWORD="passw0rd"

TLS_CERT="/.../cert.pem"
TLS_CERT_KEY="/.../cert-key.pem"
```

# run

`npm run docker`
then visit [https://localhost]
