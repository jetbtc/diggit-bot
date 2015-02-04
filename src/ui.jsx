$(function() {

    var $botui = $('<div>').insertAfter('.mfbetarea');

    React.render(
        <h1>JetBot!</h1>,
        $botui[0]
    );
});
