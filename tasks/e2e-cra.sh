#!/bin/bash

# ******************************************************************************
# This creates an app with the global create-react-app.
# It is useful for testing the end-to-end flow locally.
# ******************************************************************************

# Start in tasks/ even if run from root directory
cd "$(dirname "$0")"

function cleanup {
  echo 'Cleaning up.'
  # Uncomment when snapshot testing is enabled by default:
  # rm ./template/src/__snapshots__/App.test.js.snap
}

# Error messages are redirected to stderr
function handle_error {
  echo "$(basename $0): ERROR! An error was encountered executing line $1." 1>&2;
  cleanup
  echo 'Exiting with error.' 1>&2;
  exit 1
}

function handle_exit {
  cleanup
  echo 'Exiting without error.' 1>&2;
  exit
}

# Exit the script with a helpful error message when any error is encountered
trap 'set +x; handle_error $LINENO $BASH_COMMAND' ERR

# Cleanup before exit on any termination signal
trap 'set +x; handle_exit' SIGQUIT SIGTERM SIGINT SIGKILL SIGHUP

# Echo every command being executed
set -x

# Go to root
cd ..
root_path=$PWD

# ******************************************************************************
# Pack react-typescripts so we can verify they work.
# ******************************************************************************

scripts_path="$root_path"/`npm pack`

# ******************************************************************************
# Now that we have packed them, call the global CLI.
# ******************************************************************************

# If Yarn is installed, clean its cache because it may have cached react-scripts
yarn cache clean || true

# Go back to the root directory and run the command from here
cd "$root_path"
create-react-app --scripts-version="$scripts_path" "$@"

# Cleanup
cleanup
