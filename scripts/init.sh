#!/bin/bash

cd /usr/src/peerprep
git pull > test.txt
docker compose down >> test.txt
docker compose pull >> test.txt
docker compose up -d >> test.txt