
Radioman - Online Radio Management
==================================

## Content

1.	Content
2.	Features
3.	Prerequists
4.	Install
5.	Usage
6.	TODO
7.	LICENSE


## Features

-	Web based administration
-	Create channels and stream them over icecast2
-	Manage a remote media library
-	Create playlists
-	Schedule your playlists
-	Live statistics of your icecast2 servers (number of listeners, traffic, etc..)
-	Live last played history for your channels

## Prerequists

-	Liquidsoap 0.9.1 (http://savonet.sourceforge.net/index.html)
-	icecast2 >= 2.3.2
-	php5 >= 5.2.4 with json, socket, mysql (and optionally apc) extensions
-	Apache >= 2.2
-	MySql >= 5.1

Tested on Ubuntu 9.10 Karmic

## Install

-	Extract the tarball to a directory [RADIOMAN].
-	Install all prerequists. Please refer to the project pages for further instructions.
-	Create the mysql database.
-	Create the table structure using the installscript [RADIOMAN]/database.sql.
-	Edit the [RADIOMAN]/config.inc.php file to your needs.
-	Configure your apache server to point to [RADIOMAN]/admin.
-	Configure your icecast2 server.
-	Copy the [RADIOMAN]/liquidsoap/radio.liq file to /etc/liquidsoap/
-	Edit the /etc/liquidsoap/radio.liq file  and change first section of the file to your
	needs.
-	Start apache2.
-	Navigate to http://localhost (or any other host depending on your apache configuration)
-	Select the channel tab. Add a new channel.
-	Start the icecast2 server.
-	Start liquidsoap.


Note: For security reasons you should restrict the access to the admin directory of your host.
Refer to the apache2 manual for more information on securing access to a directory.

## Usage

## TODO

-	Jingles: Add a source on top of the regular playlist stream, that checks radioman for jingle
	schedules. This could be used for playing advertisements every 30min for example.
-	Dynamic channel creation: Channels can't yet be created on the fly. Liquidsoap has to be restarted
	before new channels are registered to the system and start streaming. This is mainly an issue
	of Liquidsoap and will hopefully be possible in a future release.
	
## LICENSE

This software is licensed under the GNU LGPLv3.
Please refer to the LICENSE file shipped with this distribution.