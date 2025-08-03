# download the project

```sh
git clone git@github.com:jeremymeadows/casemanager.git
cd casemanager
```

# edit configuration

create a `.env` file and change the information to match your environment

```conf
# initial credentials for the admin account, can be changed in the app
ADMIN_EMAIL="admin@example.com"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="passw0rd"

# this is the message shown on the signin page (will render HTML and parse environment variables)
SPLASH_MESSAGE='The admin of this site must grant new users access. If you need an account or forgot your password, contact the office at <a href="mailto:$ADMIN_EMAIL">$ADMIN_EMAIL</a>.'

# demo mode allows cases to be randomly generated (empty string means disabled: `DEMO_MODE=""`)
DEMO_MODE="true"
```

# build/run the app

## with Bun

```sh
bun install
bun --bun run build
bun ./build/index.js
```

## with Docker

```sh
./build.sh --run
```