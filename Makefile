mplayer:
	[ -e MPlayer-1.3.0 ] || curl http://www.mplayerhq.hu/MPlayer/releases/MPlayer-1.3.0.tar.xz | tar xJ && mv MPlayer-1.3.0 mplayer
	patch -p0 <mplayer.patch
