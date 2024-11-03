#!/bin/bash
docker rm $(docker ps -a | grep sandbox-blockly-guest | awk -F ' ' '{print $1}' | tr "\n" " ")