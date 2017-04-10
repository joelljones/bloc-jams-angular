(function() {
    function SongPlayer($rootScope, Fixtures) {
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
				stopSong();
				SongPlayer.currentSong.playing = null;
			}

			currentBuzzObject = new buzz.sound(song.audioUrl, {
				formats: ['mp3'],
				preload: true
			});
			
			currentBuzzObject.bind('timeupdate', function() {
				$rootScope.$apply(function() {
					SongPlayer.currentTime = currentBuzzObject.getTime();
				});
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
		* @function stopSong
		* @desc Stops currentBuzzObject audio file
		* @param {Object} song
		*/
		var stopSong = function(song) {
			currentBuzzObject.stop();
			song.playing = null;
		};
		
		/**
		* @desc Currently playing audio file
		* @type {Object}
		*/
		SongPlayer.currentSong = null;
		
		/**
		* @desc Current playback time (in seconds) of currently playing song
		* @type {Number}
		*/
		SongPlayer.currentTime = null;
		
		/**
		* @desc Volume of currently playing song
		* @type {Number}
		*/
		SongPlayer.volume = null;
		
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
					playSong(song);
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
				stopSong();
				SongPlayer.currentSong.playing = null;
			} else {
				var song = currentAlbum.songs[currentSongIndex];
        		setSong(song);
        		playSong(song);
			}
		};
		
		/**
		* @function SongPlayer.next
		* @desc Gets the index of the currently playing song and then increases that index by one
		* @param {Object} song
		*/
		SongPlayer.next = function(song) {
			var currentSongIndex = getSongIndex(SongPlayer.currentSong);
			currentSongIndex++;
			
			if (currentSongIndex > currentAlbum.songs.length) {
				stopSong();
				SongPlayer.currentSong.playing = null;
			} else {
				var song = currentAlbum.songs[currentSongIndex];
        		setSong(song);
        		playSong(song);
			}
		};
		
		/**
		* @function setCurrentTime
		* @desc Set current time (in seconds) of currently playing song
		* @param {Number} time
		*/
		SongPlayer.setCurrentTime = function(time) {
			if (currentBuzzObject) {
				currentBuzzObject.setTime(time);
			}
		};
		
		/**
		* @function setVolume
		* @desc Set volume of currently playing song on a scale from 0-100
		* @param {Number} volume
		*/
		SongPlayer.setVolume = function(volume) {
			if (currentBuzzObject) {
				currentBuzzObject.setVolume(volume);
			}
		};
		
        return SongPlayer;
    }

    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();