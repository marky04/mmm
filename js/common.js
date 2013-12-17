//this will return the following phonegap path
//iOS: /var/mobile/Applications/{GUID}/{appName}/www/
//Android: /android_asset/www/
function getPhoneGapPath()
{
    'use strict';
    var path = window.location.pathname;
    var phoneGapPath = path.substring(0, path.lastIndexOf('/') + 1);
    return phoneGapPath;
}

// Wait for device API libraries to load
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady()
{
	//playback sound
	if($('#sound_effects_text').val() == 'on')
	{
		playAudio(getPhoneGapPath() + 'sound/background_music.mp3');
	}

	document.addEventListener("menubutton", onMenuKeyDown, false);
	document.addEventListener("pause", onPause, false);

	var db = window.openDatabase('memory_game_centre', '1.0', 'Memory Game Local Storage', 200000);
	db.transaction(createTable, errorCB, successCB);
	db.transaction(queryConfig, errorCB);
}

function onMenuKeyDown()
{
    stopAudio();
}

function onPause()
{
    stopAudio();
}

// Create score_ranks table
function createTable(tx)
{alert('taz create table');
	tx.executeSql('DROP TABLE IF EXISTS score_ranks');
	//tx.executeSql('CREATE TABLE IF NOT EXISTS score_ranks (name, score, difficulty)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS score_ranks (id INTEGER PRIMARY KEY AUTOINCREMENT, score, difficulty)');
	var db = window.openDatabase('memory_game_centre', '1.0', 'Memory Game Local Storage', 200000);
	db.transaction(testInsertScore, errorCB, successCB);
	//tx.executeSql('DROP TABLE IF EXISTS config');
	tx.executeSql('CREATE TABLE IF NOT EXISTS config (config_id unique, config_key, config_value)');
	tx.executeSql('INSERT INTO config (config_id, config_key, config_value) VALUES (1, "sound_effects", "on")');
	tx.executeSql('INSERT INTO config (config_id, config_key, config_value) VALUES (2, "level_hint", "on")');
}

function testInsertScore(tx)
{
	var dateToday = new Date();
	var dateAdded = dateToday.getFullYear() + '-' + (dateToday.getMonth() + 1) + '-' + dateToday.getDate() + ' ' + dateToday.getHours() + ':' + dateToday.getMinutes() + ':' + dateToday.getSeconds();

	//tx.executeSql('INSERT INTO score_ranks (name, score, difficulty) VALUES ("' + $('#score_rank_name').val() + '", ' + $('span#points').html() + ', "easy")');
	alert(dateAdded);
	tx.executeSql('INSERT INTO score_ranks (score, difficulty) VALUES ("21", "easy")');
}

// Query the database
function queryConfig(tx)
{
	tx.executeSql('SELECT * FROM config WHERE 1', [], queryConfigSuccess, errorCB);
}

// Query the success callback
function queryConfigSuccess(tx, results)
{
	var resultCount = results.rows.length;
	var strRows = '';
	for (var i = 0; i < resultCount; i++)
	{
		strRows += (i + 1) + ' ' + results.rows.item(i).config_key  + ' ' + results.rows.item(i).config_value + '<br />';

		if(results.rows.item(i).config_key == 'level_hint')
		{
			$('#level_hint_text').val(results.rows.item(i).config_value);
		}

		if(results.rows.item(i).config_key == 'sound_effects')
		{
			stopAudio();
			$('#sound_effects_text').val(results.rows.item(i).config_value);
			if(results.rows.item(i).config_value == 'on')
			{
				playAudio(getPhoneGapPath() + 'sound/background_music.mp3');
			}
		}
	}

	//$('#debug').html(strRows);
}

// Transaction error callback
function errorCB(err)
{
	$('#debug').html('Error processing SQL: ' + err.code);
}

// Transaction success callback
function successCB()
{
	//$('#debug').html('Local Database Connection Success');
}

/***********************Audio Player Functions***********************/
var my_media = null;
var mediaTimer = null;

function playAudio(src)
{
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
					//$('#debug').html('Error getting pos=' + e);
					setAudioPosition("Error: " + e);
				}
			);
		}, 1000);
	}
}

function pauseAudio()
{
	if (my_media) {
		my_media.pause();
	}
}

function stopAudio()
{
	if (my_media) {
		my_media.stop();
	}
	clearInterval(mediaTimer);
	mediaTimer = null;
}

function onSuccess()
{
	//$('#debug').html('playAudio():Audio Success');
}

function onError(error)
{
	//alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
}

function setAudioPosition(position)
{
	document.getElementById('audio_position').innerHTML = position;
}
/***********************EOF Audio Player Functions***********************/


/***********************Audio Effect Functions***********************/
var effects_media = null;
var effectsMediaTimer = null;

function playAudioEffects(src)
{
	// Create Media object from src
	effects_media = new Media(src, onSuccessEffects, onErrorEffects);

	// Play audio
	effects_media.play();

	// Update effects_media position every second
	if (effectsMediaTimer == null) {
		effectsMediaTimer = setInterval(function() {
			// get effects_media position
			effects_media.getCurrentPosition(
				// success callback
				function(position) {
					if (position > -1) {
						setAudioPositionEffects((position) + " sec");
					}
				},
				// error callback
				function(e) {
					//$('#debug').html('Error getting pos=' + e);
					setAudioPositionEffects("Error: " + e);
				}
			);
		}, 1000);
	}
}

function pauseAudioEffects()
{
	if (effects_media) {
		effects_media.pause();
	}
}

function stopAudioEffects()
{
	if (effects_media) {
		effects_media.stop();
	}
	clearInterval(effectsMediaTimer);
	effectsMediaTimer = null;
}

function onSuccessEffects()
{
	//$('#debug').html('playAudio():Audio Success');
}

function onErrorEffects(error)
{
	//alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
}

function setAudioPositionEffects(position)
{
	document.getElementById('audio_position_effects').innerHTML = position;
}
/***********************EOF Audio Effect Functions***********************/