#!/usr/bin/liquidsoap

# ================= LICENSE =====================
# This configuration file is part of the Radioman
# project. Read the README file for more info.
# Or visit the project homepage at:
# http://github.com/lbotsch/radioman/
# ===============================================


# ============= Global Settings =================

radioman_root = "/EXCHANGE/code/radioman/"

scripts = radioman_root ^ "utils/"
library = "/EXCHANGE/Music/"
live_archives = "/EXCHANGE/Music/live_archives/"

interlude_file = library ^ "interlude.mp3"

pass = "janvier"

telnet_host = "127.0.0.1"
telnet_port = 1234

harbor_host = "0.0.0.0"
harbor_port = 8001

ice_host = "localhost"
ice_port = 8000

url = "radio.localhost"

log_level = 3

# ===============================================





# === Settings ===

set("log.file.path","/var/log/liquidsoap/radioman.log")

set("init.daemon",true)
set("init.daemon.pidfile.path","/var/run/liquidsoap/radioman.pid")

set("server.telnet",true)
set("server.telnet.bind_addr",telnet_host)
set("server.telnet.port",telnet_port)

set("harbor.bind_addr",harbor_host)
set("harbor.port",harbor_port)
set("harbor.password",pass)

set("log.level",log_level)

set("scheduler.generic_queues",4)
set("scheduler.log",true)

# === Logging ===

mlog = log(label="Radioman")
mdebug = mlog(level=4)
minfo = mlog(level=3)
mwarn = mlog(level=2)
merror = mlog(level=1)

# === Live relays ===

def live_start(meta)
	minfo("Got live source, starting relays...")
	#ignore(execute("stream_relay.start"))
	#ignore(execute("archives.start"))
end

def live_stop()
	minfo("Live source has gone, stoping relays...")
	#ignore(execute("stream_relay.stop"))
	#ignore(execute("archives.stop"))
end

# Live source through harbor
live = input.harbor(id="live",on_connect=live_start,on_disconnect=live_stop,"live")
live_safe = mksafe(live)

# Live relay
#output.icecast.lame(id="stream_relay",start=false,restart=true,host=ice_host,port=ice_port,password=pass,mount="live",live_safe)

# File source for archiving
title = '$(if $(title),"$(title)","Emission inconnue")$(if $(artist)," par $(artist)") - %d-%m-%Y %H:%M:%S'
#output.file.lame(id="archives",start=false,reopen_on_metadata=true,live_archives ^ title ^ ".mp3",live_safe)

# === Main script ===

out = output.icecast.lame(restart=true,url=url,public=false,host=ice_host,port=ice_port,password=pass,bitrate=128,description="Powered by Radioman")

# A file for playing during failures
interlude = single(interlude_file)

def fallback.transition(previous,next)
	add([fade.in(next),fade.final(duration=5.,previous)])
end

# === Channels ===

def mklive(source)
	# Rewrite metadata..
	# Got data from annotate..
	rewrite_metadata(
	 [("artist",'$(if $(display_artist),"$(display_artist)","$(artist)")'),
	  ("comment",""),
	  ("title",'$(if $(display_title),"$(display_title)","$(title)")'),
	  ("album",'$(if $(display_album),"$(display_album)","$(album)")'),
	  ("item_id",""),
	  ("playlist_id",""),
	  ("schedule_id","")],

	 # Default fallback
	 fallback(track_sensitive=false,[
	 	# Strip blank to avoid live streaming only blank..
		strip_blank(live,length=10.,threshold=-50.),
		source,interlude])
	)
end

# === Basic sources ===

# Create a radioman-driven source
def channel_radioman(~skip=true,name)
	minfo("Creating channel #{name}")

	# Request function
	def request () =
		minfo("Request for #{name}")
		cmd = scripts ^ "radioman-getnext.php " ^ quote(name)
		mdebug("Running command: " ^ cmd)
		r = get_process_output(cmd)
		mdebug("Next item: " ^ r)
		request.create(audio=true,r)
	end

	# Basic source
	source = request.dynamic(id="dyn_"^name,request)

	# Add smart crossfading
	source = smart_crossfade(source)

	# Only skip some channels
	if skip then
		skip_blank(source,length=10.,threshold=-40.)
	else
		source
	end
end

# Create a channel using mklive(), encode and output it to icecast
def mkoutput(mount,name,genre,descr)
	source = channel_radioman(name)
	out(id=name,mount=mount,name=descr,genre=genre,mklive(source))
end

# === Outputs ===

# These channels are encoded on this machine
#mkoutput("test","test","electro", "Minimal Electro Radio powered by Radioman")

# Make an output channel from radioman output
def mkchannel (channel)
	c = string.split(separator="\|", channel)
	minfo("Registered channel #{list.nth(c,1)}")
	mkoutput(
		list.nth(c,0),
		list.nth(c,1),
		list.nth(c,2),
		list.nth(c,3)
	)
end

def channel.skip(s)
	source.skip(s)
	"Done"
end

def channel.register (channel)
	minfo("Registering new channel dynamically.")
	mdebug("Channel info: #{channel}")
	mkchannel(channel)
	"Done"
end

server.register(
	namespace="channel",
	description="Start a radioman controlled channel.",
	usage="register '<mount>|<name>|<genre>|<description>'",
	"register",
	channel.register)

# Create channels registered with radioman
list.iter(
	fun(channel) -> ignore(mkchannel(channel)),
	get_process_lines(scripts ^ "radioman-getchannels.php")
)


# === On Shutdown ===

def radioman_shutdown_feedback () =
	system(scripts ^ "radioman-feedback.php shutdown")
end

on_shutdown(radioman_shutdown_feedback)