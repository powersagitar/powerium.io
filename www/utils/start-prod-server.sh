#!/bin/zsh

BASEDIR=$(dirname "$0")

$BASEDIR/build-prod-artifacts.sh

bun start
