#!/usr/bin/env bash
#

touch .env

for envvar in "$@" 
do
   echo "$envvar" >> .env
done