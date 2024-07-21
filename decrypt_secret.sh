#!/bin/sh

gpg --quiet --batch --yes --decrypt --passphrase="$ENV_DECODE_PASSPHRASE" \
  --output ./src/environments/environment.prod.ts ./src/environments/environment.prod.ts.gpg
