(function() {
  function SongPlayer($rootScope, Fixtures) {
    var SongPlayer = {};

    // PRIVATE ATTRIBUTES
    /**
    * @desc Information for current album
    * @type {Object}
    */
    var currentAlbum = Fixtures.getAlbum();
    /**
    * @desc Buzz object audio file
    * @type {Object}
    */
    var currentBuzzObject = null;

    // PRIVATE FUNCTIONS
    /**
    * @function setSong
    * @desc Stops currently playing song and loads new audio file as currentBuzzObject
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

      // timeupdate is one of a number of HTML5 audio events to use with Buzz's bind() method
      // bind() method adds an event listener to the Buzz sound object – in this case, it listens for a timeupdate event
      currentBuzzObject.bind('timeupdate', function() {
        // update the song's playback progress from anywhere with $rootScope.$apply
        // creates a custom event that other parts of the Angular application can "listen" to
        $rootScope.$apply(function() {  // $apply the time update change to the $rootScope
          SongPlayer.currentTime = currentBuzzObject.getTime(); // getTime() gets the current playback position in seconds
        });
      });

      SongPlayer.currentSong = song;
    };
    /**
    * @function playSong
    * @desc Play a song
    * @param {Object} song
    */
    var playSong = function(song) {
      currentBuzzObject.play();
      song.playing = true;
    };
    /**
    * @function stopSong
    * @desc Stop a song
    * @param {Object} song
    */
    var stopSong = function(song) {
      currentBuzzObject.stop();
      song.playing = null;
    };
    /**
    * @function getSongIndex
    * @desc Get index of song in the songs array
    * @param {Object} song
    * @returns {Number}
    */
    var getSongIndex = function(song) {
      return currentAlbum.songs.indexOf(song);
    };

    // PUBLIC ATTRIBUTES
    /**
    * @desc Active song object from list of songs
    * @type {Object}
    */
    SongPlayer.currentSong = null;
    /**
    * @desc Current play time (in seconds) of currently playing song
    * @type {Number}
    */
    SongPlayer.currentTime = null;
    /**
    * @desc Volume used for songs
    * @type {Number}
    */
    SongPlayer.volume = 80;

    // PUBLIC METHODS
    /**
    * @function play
    * @desc Play current or new song
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
    * @function pause
    * @desc Pause current song
    * @param {Object} song
    */
    SongPlayer.pause = function(song) {
      song = song || SongPlayer.currentSong;
      currentBuzzObject.pause();
      song.playing = false;
    };
    /**
    * @function previous
    * @desc Set song to previous song in album
    */
    SongPlayer.previous = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;

      if (currentSongIndex < 0) {
        stopSong(SongPlayer.currentSong);
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };
    /**
    * @function next
    * @desc Set song to next song in album
    */
    SongPlayer.next = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex++;

      var lastSongIndex = currentAlbum.songs.length - 1;

      if (currentSongIndex > lastSongIndex) {
        stopSong(SongPlayer.currentSong);
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
    // checks if there is a current Buzz object, and, if so, uses the Buzz library's setTime method to set the playback position in seconds
    SongPlayer.setCurrentTime = function(time) {
      if (currentBuzzObject) {
        currentBuzzObject.setTime(time);
      }
    };
    /**
    * @function setVolume
    * @desc Set volume for songs
    * @param {Number} volume
    */
    SongPlayer.setVolume = function(volume) {
      if (currentBuzzObject) {
        currentBuzzObject.setVolume(volume);
      }
      SongPlayer.volume = volume;
    };

    return SongPlayer;
  };

  angular
    .module('blocJams')
    .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
