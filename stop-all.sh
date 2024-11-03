#!/bin/bash
docker stop $(docker ps | grep sandbox-blockly-guest | awk -F ' ' '{print $1}' | tr "\n" " ")