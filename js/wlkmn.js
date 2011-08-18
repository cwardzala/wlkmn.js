/**
 * wlkmn.js V2
 * @author Cameron Wardzala
 * License: http://wlkmn.com/license
 */
 
var extend = function (obj, extObj) { var i,a; if (arguments.length > 2) { for (a = 1; a < arguments.length; a++) { extend(obj, arguments[a]); } } else { for (i in extObj) { obj[i] = extObj[i]; } } return obj; };
var text = function (node, val) { if (document.innerText) { node.innerText = val; } else { node.textContent = val; } };
var isIOS = function () { if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))){ return true; }; };
var isFF = function () { if ((navigator.userAgent.match(/Firefox/i))){ return true; } else {return false;} };
function getFlashMovie(movieName) {   var isIE = navigator.appName.indexOf("Microsoft") != -1;   return (isIE) ? window[movieName] : document[movieName];  }

function FlashAlert(s) {console.log(s);}

var wlkmn = function (p,t,s) {
	if (typeof p === "string") { p = document.getElementById(p); } else { p = p; }
	var master = this; 
	this.Tracks = t || [];
	this.audio = null;
	this.Settings = {
		AutoAdvance: true,
		CurrentTrack: null,
		Vol: 0.5,
		Mute:false,
		CustomUIClass: null,
		Playlist:false,
		InfoScreen:false,
		oid: 'Player'
	};
	this.Settings = extend(master.Settings,s);
	if (typeof wlkmnUI !== "undefined") { this.uic = wlkmnUI; this.Settings.UI = true; }
	else { this.Settings.UI = false; }
	
	this.Settings.mobile = isIOS();
	this.Settings.Flash = isFF();
	
	this.Controls = {
		Play: p.getElementsByClassName('Play')[0],
		Pause: p.getElementsByClassName('Pause')[0],
		Next: p.getElementsByClassName('Next')[0],
		Prev: p.getElementsByClassName('Prev')[0],
		Volume: p.getElementsByClassName('volume')[0],
		Mute: p.getElementsByClassName('Mute')[0],
		_Setup: function () {
			if (master.Settings.InfoScreen === true) {
				master.Controls.InfoScreen = {
					Screen: p.getElementsByClassName('infoScreen')[0],
					Time: p.getElementsByClassName('infoScreen')[0].getElementsByClassName('time')[0],
					Progress: p.getElementsByClassName('infoScreen')[0].getElementsByClassName('progress')[0],
					Txt: p.getElementsByClassName('infoScreen')[0].getElementsByClassName('text')[0]
				};
			}
			
			if (master.Settings.Playlist === true) {
				master.Controls.Playlist = p.getElementsByClassName('playlist')[0];
				master.Controls.PlaylistUL = p.getElementsByClassName('playlist')[0].getElementsByTagName('ul')[0];
				
				var tl = master.Tracks.length;
				for (var ti=0;ti<tl;++ti ) {
					var li = '<a href="'+master.Tracks[ti]+'">'+master.Tracks[ti]+'</a>';
					var temp = document.createElement('li');
					temp.innerHTML = li;
					p.getElementsByClassName('playlist')[0].getElementsByTagName('ul')[0].appendChild(temp);
				}
				
				master.Controls.PlaylistLI = p.getElementsByClassName('playlist')[0].getElementsByTagName('ul')[0].getElementsByTagName('li');
				master.Controls.PlaylistA = p.getElementsByClassName('playlist')[0].getElementsByTagName('ul')[0].getElementsByTagName('a');
				
				function attachClick(i) {
					master.Controls.PlaylistA[i].addEventListener('click',function (e) {
						e.preventDefault();
						master.Track.Setup(i);
					},false);
				}

				for (var a=0;a<master.Controls.PlaylistA.length;++a) { attachClick(a); }
			}
			
			if (master.Settings.Flash === true) {
				var fd = document.createElement('div');
				fd.id = "flashDiv";
				p.appendChild(fd);
				if (!document[p.id+"-mp3Swf"]) {
				    var flashvars = false;
				    var params = { 'allowfullscreen': 'false', 'allowscriptaccess': 'always' };
				    var attributes = {
				    	'id': p.id+"-mp3Swf",
				    	'name': p.id+"-mp3Swf",
				    	'class':'wlkmn-FlashShim'
				    };
				    swfobject.embedSWF('MP3-Player.swf', "flashDiv", '1', '1', '10', 'false', flashvars, params, attributes);
				}
			}

			master.Controls.Play.addEventListener('click',function (e) {
				e.preventDefault();
				master.Track.Play();
			},false);
			
			master.Controls.Pause.addEventListener('click',function (e) {
				e.preventDefault();
				master.Track.Pause();
			},false);
			
			master.Controls.Next.addEventListener('click',function (e) {
				e.preventDefault();
				master.Track.Next();
			}, false);
			
			master.Controls.Prev.addEventListener('click',function (e) {
				e.preventDefault();
				master.Track.Prev();
			},false);
			
			master.Controls.Volume.value = master.Settings.Vol*10;
			master.Controls.Volume.addEventListener('change', function(e){
				e.preventDefault();
			    var vol = parseFloat(this.value / 10);
			    master.Track.AudioAdjust(vol,null);
			}, false);
			
			
			master.Controls.Mute.addEventListener('click',function (e) {
				e.preventDefault();
				var v = 0, m = true;
				if (master.Settings.Mute === true) { v = master.Settings.Vol; m = false; }
				master.Settings.Mute = m;
				master.Track.AudioAdjust(v,'mute');
			}, false);
			
		}
	};
	
	this.CreateAudio = function (track,autoplay) {
		autoplay = autoplay || false;
		if ( master.audio !== null && master.Settings.Flash !== true ) { master.Track.Pause(); }
		if ( master.audio === null && master.Settings.Flash !== true ) { master.audio = new Audio(); }
		if ( master.audio === null && master.Settings.Flash === true ) { master.audio = document[p.id+"-mp3Swf"]; }
		console.log(master.audio);
		if ( master.Settings.Flash === true ) { master.audio.Setup(track, master.Settings.Vol, master.Settings.oid, autoplay); }
		
		if (master.Settings.Flash !== true) {
			master.audio.src = track;
			master.audio.addEventListener("timeupdate", function (e) {e.preventDefault(); master.Track.TimeUpdate() }, false);
			master.audio.addEventListener("ended", master.Track.End, false);
			master.audio.volume = parseFloat(master.Controls.Volume.value / 10);
		}
		
		if ( autoplay === true ){ master.Track.Play(); }
		
	};
	
	this.Destroy = {
		All: function () {
			// Audio
			master.audio.src = '';
			master.audio = null;
			master.Settings.CurrentTrack = null;
		},
		Audio: function () {
			master.audio.src = '';
			master.audio = null;
			master.Settings.CurrentTrack = null;
		}
	}
	
	this.Track = {
		Duration: 0,
		Setup: function (i) {
			master.CreateAudio(master.Tracks[i],true);
			master.Settings.CurrentTrack = i;
			if (master.Settings.UI === true) { master.uic.Setup(i,master.Tracks,master.Controls,master.Settings); }
		},
		Play: function () {
			if (master.audio !== null) {
				master.audio.play();
				 // Play the audio
				if (master.Settings.UI === true) { master.uic.Play(master.Controls); }
			}
			if (master.audio === null) { master.Track.Setup(0); }
		},
		Pause: function () {
			if (master.audio !== null){
				master.audio.pause();
				if (master.Settings.UI === true) { master.uic.Pause(master.Controls); }
			}
		},
		Next: function () {
			if (master.Settings.CurrentTrack !== null) {
				var nti = master.Settings.CurrentTrack +1, Ntrack = master.Tracks[nti];
				if (Ntrack) { master.Track.Setup(nti); }
				if (master.Settings.UI === true) { master.uic.Next(nti,master.Controls); }
			}
		},
		Prev: function () {
			if (master.Settings.CurrentTrack !== null) {
				var pti = master.Settings.CurrentTrack-1, Ptrack = master.Tracks[pti];
				if (Ptrack) { master.Track.Setup(pti); }
				if (master.Settings.UI === true) { master.uic.Prev(pti,master.Controls); }
			}
		},
		End: function () {
			console.log("end");
			var i = master.Settings.CurrentTrack,c = (master.Tracks.length-1);
			if (i === c) { master.Destroy.Audio(); }
			if (master.Settings.AutoAdvance === true) { master.Track.Next(); }
			if (master.Settings.UI === true) { master.uic.End(i,c,master.Controls,master.Settings); }
		},
		AudioAdjust: function (lvl,task) {
			if (master.audio !== null) {  
				if (master.Settings.Flash === true) { master.audio.Volume(lvl); } 
				else { master.audio.volume = lvl; }
			}
			if (task === 'mute') { master.Controls.Volume.value = lvl*10; }
			else {master.Settings.Vol = lvl;}
		},
		TimeUpdate: function (t) {
			if (master.Settings.Flash === true ) {
				t = parseInt(t/1000,10);
				var d = parseInt(master.Track.Duration/1000,10);
				var s = parseInt(t % 60,10), m = parseInt((t / 60) % 60,10), p = Math.floor((t / d) * 100);
			} 
			else {
				var s = parseInt(master.audio.currentTime % 60,10), m = parseInt((master.audio.currentTime / 60) % 60,10), p = Math.floor((master.audio.currentTime / master.audio.duration) * 100);	
			}
			if (master.Settings.UI === true) { master.uic.TimeUpdate(s,m,p,master.Controls,master.Settings); }
		},
		SetDuration: function (t) { master.Track.Duration = t; }
	};
	
	if (master.Settings.CustomUIClass !== null) { addClass(p,master.Settings.CustomUIClass); }
	
	if (master.Settings.UI === true) { master.uic.Init(master.Controls, master.Settings); }

	this.Controls._Setup();
	
	return {
		Tracks: this.Tracks,
		Controls: this.Controls,
		Track: this.Track
	};
};