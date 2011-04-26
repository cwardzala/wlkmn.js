/**
 * @author Cameron Wardzala
 */
 
var hasClass = function (ele,cls) {return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)')); };
var addClass = function (ele,cls) { if (!hasClass(ele,cls)) {ele.className += " "+cls;} };
var removeClass = function (ele,cls) { if (hasClass(ele,cls)) { var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)'); ele.className=ele.className.replace(reg,' '); } };
var wlkmn = wlkmn || null;


if (wlkmn !== null) {
	
	wlkmnUI = {
		Init: function (Controls,Settings) {
			addClass(Controls.Pause,'inactive');
		},
		Setup: function (i,Tracks,Controls,Settings) {
			
			var item = Tracks[i], ttext = item.split('/');
			if (Settings.Playlist === true) {
				var current = Controls.PlaylistUL.getElementsByClassName('current')[0];
				if (current !== undefined) { removeClass(current,'current'); }
				
				addClass(Controls.PlaylistLI[i],'current');
				if (Controls.PlaylistLI[i].getElementsByClassName('progress').length === 0) {
					var pbar = document.createElement('span');
					pbar.className = 'progress';
					Controls.PlaylistLI[i].appendChild(pbar);
				}
			}
			if (Settings.InfoScreen === true) { text(Controls.InfoScreen.Txt,ttext[ttext.length-1]); }
		},
		Play: function (Controls) {
			removeClass(Controls.Pause,'inactive');
			addClass(Controls.Pause,'active');
			
			addClass(Controls.Play,'inactive');
			removeClass(Controls.Play,'active');
		},
		Pause: function (Controls) {
			removeClass(Controls.Play,'inactive');
			addClass(Controls.Play,'active');
			
			addClass(Controls.Pause,'inactive');
			removeClass(Controls.Pause,'active');
		},
		Next: function (i, Controls) {},
		Prev: function (i, Controls) {},
		End: function (index,count,Controls,Settings) {
			if (index === count) { 
				Controls.Pause.style.display = 'none'; // Hide the pause button
				Controls.Play.style.display = 'inline'; // Show the play button
				if (Settings.Playlist === true) {
					var current = Controls.PlaylistUL.getElementsByClassName('current')[0];
					if (current !== undefined) { removeClass(current,'current'); }
					current.getElementsByClassName('progress').width = 0;
				}
				
				if (Settings.InfoScreen === true ) {
					text(Controls.InfoScreen.Txt,'--');
					text(Controls.InfoScreen.Time,'0:00');
				}
				
			 }
		},
		TimeUpdate: function (s,m,p,Controls,Settings) {
			if (Settings.InfoScreen === true) {
				text(Controls.InfoScreen.Time,(m + ':' + (s < 10 ? '0' : '') + s));
				text(Controls.InfoScreen.Progress, p);
				Controls.InfoScreen.Progress.style.width = p+'%';
			}
			if (Settings.Playlist === true) {
				var current = Controls.PlaylistUL.getElementsByClassName('current')[0];
				current.querySelectorAll('.progress')[0].style.width = p+'%';
			}
			
		}
	};

}