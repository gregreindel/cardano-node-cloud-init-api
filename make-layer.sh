# create archive of node_modules to upload as AWS Lambda layer
cp -R node_modules nodejs 
zip -r -X nodejs.zip nodejs
rm -rf nodejs