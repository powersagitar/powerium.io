#!/bin/bash

bun install

if [[ "$BUILD_MODE" == 'development' ]]; then
    bun dev
else
    echo "bun docker image wouldn't produce a full next.js production build"
    echo "bug is reported at https://github.com/oven-sh/bun/issues/4795"
    exit 1

    bun run build
    bun start
fi
