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