function getPhoneGapPath() {

    var path = window.location.pathname;
    path = path.substr( path, path.length - 10 );
    return 'file://' + path;

};

function closeOverlay()
{
	$('#overlay-holder').fadeOut('fast');
	$('#tutorial-memorygame').fadeIn();
	$('.title-holder .title').fadeIn();
	$('.score-holder').fadeIn();
}

function playAgain()
{
	location.href = 'easy.html';
}

function confirmBackHome()
{
	var r = confirm("Are you Sure?");
	if(r==true)
	{
		location.href = 'index.html';
	}
}

function playMusic()
{
	//playback sound
	/*var playCompleteAudio = new Audio('sound/background_music.mp3');
	playCompleteAudio.currentTime == 0;
	playCompleteAudio.play();*/
}

// Wait for device API libraries to load
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
function onDeviceReady()
{
	var db = window.openDatabase('memory_game_centre', '1.0', 'Memory Game Local Storage', 200000);
	successCB();
	alert(getPhoneGapPath() + 'background_music.mp3');
	playAudio(getPhoneGapPath() + 'background_music.mp3');
}

// Query the database
function queryDB(tx)
{
	tx.executeSql('SELECT * FROM config WHERE 1', [], querySuccess, errorCB);
}

// Query the success callback
function querySuccess(tx, results)
{
	var resultCount = results.rows.length;
	var strRows = '';
	for (var i = 0; i < resultCount; i++)
	{
		/*strRows += '<tr>' +
			'<td align="center">' + (i + 1) + '</td>' +
			'<td>' + results.rows.item(i).config_key + '</td>' +
			'<td align="center">' + results.rows.item(i).config_value + '</td>' +
		'</tr>';*/

		if(results.rows.item(i).config_value == 'on')
		{
			$('#' + results.rows.item(i).config_key).attr('checked', 'checked');
		}
		else
		{
			$('#' + results.rows.item(i).config_key).removeAttr('checked');
		}
	}

	$('#debug').html(strRows);
}

// Transaction error callback
function errorCB(err)
{
	$('#debug').html('Local Database Connection Success');
}

// Transaction success callback
function successCB()
{
	var db = window.openDatabase('memory_game_centre', '1.0', 'Memory Game Local Storage', 200000);
	db.transaction(queryDB, errorCB);
	//$('#debug').html('Local Database Connection Success');
}

function editConfig(id)
{
	var db = window.openDatabase('memory_game_centre', '1.0', 'Memory Game Local Storage', 200000);
	if(id == 'sound_effects')
	{
		db.transaction(updateConfigSound, errorCB, successCB);
	}
	else
	{
		db.transaction(updateConfigMusic, errorCB, successCB);
	}
}

function updateConfigSound(tx)
{
	var configValue = 'off';
	if($('#sound_effects').prop('checked'))
	{
		configValue = 'on';
	}

	tx.executeSql('UPDATE config SET config_value = "' + configValue + '" WHERE config_key = "sound_effects"');
}

function updateConfigMusic(tx)
{
	var configValue = 'off';
	if($('#music_tracks').prop('checked'))
	{
		configValue = 'on';
	}

	tx.executeSql('UPDATE config SET config_value = "' + configValue + '" WHERE config_key = "music_tracks"');
}

// Audio player
var my_media = null;
var mediaTimer = null;

// Play audio
//
function playAudio(src) {
	// Create Media object from src
	my_media = new Media(src, onSuccess, onError);

	// Play audio
	my_media.play();

	// Update my_media position every second
	if (mediaTimer == null) {
		mediaTimer = setInterval(function() {
			// get my_media position
			my_media.getCurrentPosition(
				// success callback
				function(position) {
					if (position > -1) {
						setAudioPosition((position) + " sec");
					}
				},
				// error callback
				function(e) {
					console.log("Error getting pos=" + e);
					setAudioPosition("Error: " + e);
				}
			);
		}, 1000);
	}
}

// Pause audio
//
function pauseAudio() {
	if (my_media) {
		my_media.pause();
	}
}

// Stop audio
//
function stopAudio() {
	if (my_media) {
		my_media.stop();
	}
	clearInterval(mediaTimer);
	mediaTimer = null;
}

// onSuccess Callback
//
function onSuccess() {
	console.log("playAudio():Audio Success");
}

// onError Callback
//
function onError(error) {
	alert('code: '    + error.code    + '\n' +
		  'message: ' + error.message + '\n');
}

// Set audio position
//
function setAudioPosition(position) {
	document.getElementById('audio_position').innerHTML = position;
}