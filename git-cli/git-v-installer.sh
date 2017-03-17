#!/bin/bash

DEST_DIR="/usr/local/bin"
SOURCE_REPO="omfgitsklampz"
SOURCE_REPO_GIT="https://github.com/UTSCC09/omfgitsklampz.git"
SOURCE_REPO_CLI_PATH="git-cli"
INSTALL_FILES="git-vinit"

case "$1" in
	uninstall)
		echo "Uninstalling KanHub Git CLI from $DEST_DIR"
		if [ -d "$DEST_DIR" ] ; then
			for file in $INSTALL_FILES ; do
				echo "rm -vf $DEST_DIR/$file"
				rm -vf "$DEST_DIR/$file"
			done
		else
			echo "'$DEST_DIR' not found"
		fi
		exit
		;;
	*)
		echo "Installing KanHub Git CLI to $DEST_DIR"

		git clone "$SOURCE_REPO_GIT" "$SOURCE_REPO"
		install -v -d -m 0755 "$DEST_DIR"
        
		for file in $INSTALL_FILES ; do
			install -v -m 0755 "$SOURCE_REPO/$SOURCE_REPO_CLI_PATH/$file" "$DEST_DIR"
		done
        rm -rf "$SOURCE_REPO"
		exit
		;;
esac