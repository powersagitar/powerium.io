#!/bin/bash

bun install

if [[ "$MODE" == 'development' ]]; then
  bun dev
elif [[ "$MODE" == 'production' ]]; then
  echo "bun docker image wouldn't produce a full next.js production build"
  echo "bug is reported at https://github.com/oven-sh/bun/issues/4795"
  exit 1

  bun run build
  bun start
elif [[ "$MODE" == 'sleep' ]]; then
  sleep infinity
else
  echo "unrecognized MODE $MODE"
  exit 1
fi
