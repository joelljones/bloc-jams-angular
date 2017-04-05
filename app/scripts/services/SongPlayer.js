(function() {
    function SongPlayer(Fixtures) {
		var SongPlayer = {};
		
		/**
		* @desc Album info
		* @type {Object}
		*/
		var currentAlbum = Fixtures.getAlbum();
		
		/**
		* @desc Buzz object audio file
		* @type {Object}
		*/
     	var currentBuzzObject = null;
		
		/**
		* @function setSong
		* @desc Stops currently playing audio file and loads new audio file as currentBuzzObject
		* @param {Object} song
		*/
		var setSong = function(song) {
			if (currentBuzzObject) {
				currentBuzzObject.stop();
				SongPlayer.currentSong.playing = null;
			}

			currentBuzzObject = new buzz.sound(song.audioUrl, {
				formats: ['mp3'],
				preload: true
			});

			SongPlayer.currentSong = song;
		};
		
		/**
		* @function playSong
		* @desc Plays new audio file as currentBuzzObject
		* @param {Object} song
		*/
		var playSong = function(song) {
			currentBuzzObject.play();
			song.playing = true;
		};
		
		/**
		* @function getSongIndex
		* @desc Obtains the index of song
		* @param {Object} song
		*/
		var getSongIndex = function(song) {
    		return currentAlbum.songs.indexOf(song);
		};
		
		/**
		* @desc Currently playing audio file
		* @type {Object}
		*/
		SongPlayer.SongPlayer.currentSong = null;
		
		/**
		* @function SongPlayer.play
		* @desc If currently playing audio file is not the same as selected, plays new audio file. If it is, and is paused, it will play
		* @param {Object} song
		*/
		SongPlayer.play = function(song) {
			song = song || SongPlayer.currentSong;
			if (SongPlayer.currentSong !== song) {
            	setSong(song);
				playSong(song);				
			} else if (SongPlayer.currentSong === song) {
				if (currentBuzzObject.isPaused()) {
					currentBuzzObject.play();
				}
			}
		};
		
		/**
		* @function SongPlayer.pause
		* @desc Pauses currently playing audio file
		* @param {Object} song
		*/
		SongPlayer.pause = function(song) {
			song = song || SongPlayer.currentSong;
			currentBuzzObject.pause();
			song.playing = false;
		};
		
		/**
		* @function SongPlayer.previous
		* @desc Gets the index of the currently playing song and then decreases that index by one
		* @param {Object} song
		*/
		SongPlayer.previous = function(song) {
			var currentSongIndex = getSongIndex(SongPlayer.currentSong);
			currentSongIndex--;
			
			if (currentSongIndex < 0) {
				currentBuzzObject.stop();
				SongPlayer.currentSong.playing = null;
			} else {
				var song = currentAlbum.songs[currentSongIndex];
        		setSong(song);
        		playSong(song);
			}
		};
		
        return SongPlayer;
    }

    angular
        .module('blocJams')
        .factory('SongPlayer', ['Fixtures', SongPlayer]);
})();