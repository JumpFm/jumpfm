#!/bin/bash

rm -rf ~/demo
mkdir -p ~/demo/mybooklive/Tv.Show

for i in {1..5}; do
	folder=~/demo/downloads/Tv.Show.S01E0$i
	mkdir -p $folder
	touch $folder/Tv.Show.S01E0$i.{mkv,srt,nfo}
done
