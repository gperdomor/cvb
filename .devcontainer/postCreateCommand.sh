#!/bin/sh

# Update the underlying (Debian) OS, to make sure we have the latest security patches and libraries like 'GLIBC'
echo "⚙️ Updating the underlying OS..."
sudo apt-get update && sudo apt-get -y upgrade

# Install NPM dependencies
echo "⚙️ Installing NPM dependencies..."
npm install