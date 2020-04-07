#!/usr/bin/env bash
set -e

dev () {
  cd bestegg-app

  # Put a copy of the css into the build dir so we get tailwind autocomplete in the ide
  if [[ $(ls build/*.css | wc -l) -eq 0 ]]; then
    yarn run build
    mkdir -p build
    cp .next/static/css/*.css build/
  fi

  yarn install
  yarn run dev
}

help () {
  cat <<TXT

usage: ./go.sh <subcommand>

  dev - Start a development mode


TXT
}

subcommand=$1
case $subcommand in
    "" | "-h" | "--help")
        help
        ;;
    "dev")
        dev ${@:2}
        ;;
    *)
        if [ $? = 127 ]; then
            echo "Error: '$subcommand' is not a known subcommand." >&2
            help
            exit 1
        fi
        ;;
esac
