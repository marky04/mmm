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
	var playCompleteAudio = new Audio('sound/background_music.mp3');
	playCompleteAudio.currentTime == 0;
	playCompleteAudio.play();
}

// Wait for device API libraries to load
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
function onDeviceReady()
{
	var db = window.openDatabase('memory_game_centre', '1.0', 'Memory Game Local Storage', 200000);
	successCB();
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