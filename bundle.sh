#!/usr/bin/env bash
##############################################################################
##
##  Package JS Bundles
##
##############################################################################
CURRENT_DIR=$(cd $(dirname $0); pwd)

cd $CURRENT_DIR/doric-js && npm run build
