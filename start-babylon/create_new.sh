#!/bin/bash
name=$1
cwd=$(cd $(dirname $0)/.. && pwd)
cd $cwd
cp -r start-babylon $name
cd $name
rm -rf node_modules
rm -rf package.json
cat ../start-babylon/package.json | jq ".name = \"$name\"" > package.json && \
        npm i && \
        rm create_new.sh
cd -
echo -e "you can start $name by running:\n cd $name && npm run dev"