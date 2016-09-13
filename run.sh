#!/bin/sh

APP_DIR="$(cd `dirname $0`; pwd)"
cd $APP_DIR


pm2 start --name="pokemon-elfjane" --no-daemon main.js
