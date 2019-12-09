$(function () {

    function setMessagesHeight() {
        var height = window.innerHeight - $('.input-block').height() - 60;
        $('.messages').css('minHeight', height);
        $('.messages').css('maxHeight', height);
    }

    setMessagesHeight();

    window.onresize = function () {
        setMessagesHeight();
    };

    //Приветствие
    addBotText('Привет! Я Sherlock BOT. Мне всего 1 день, но я уже кое-что умею. Поговори со мной:)');
});

//Отправить сообщение
function sendMessage() {

    var text = $('#text').val();
    var sessionId = getSessionId();

    if (text) {

        addUserText(text);

        $.getJSON("/api/sendtext", { text: text, sessionId: sessionId })
            .done(function (res) {

                addBotText(res.data);

                if (!res.IsSuccess)
                    console.log(res.error);
            });

        $('#text').val('');
    }
}

//Any key press
document.addEventListener('keypress', function (e) {
    if (e.code === 'Enter') {
        sendMessage();
    }
});

//Клик по кнопке Отправить
$('button').on('click', function (e) {
    sendMessage();
});

//Отобразить текст сообщения пользоваетя в окне сообщений
function addUserText(text) {
    var html = '' +
        '<div class="row user-div">' +
        '    <div class="col-md-3">' +
        '        &nbsp;' +
        '    </div>' +
        '    <div class="col-md-9 text-right user">' +
        '        <p class="text">' + text + '<span><img src="/images/user.png" /></span></p>' +
        '    </div>' +
        '</div>';
    $('.messages').append(html);
    $(".messages").animate({ scrollTop: $('.messages').height() }, 1000);
}

//Отбразить текст ответа бота в окне сообщений
function addBotText(text) {
    var html = '' +
        '<div class="row bot-div">' +
        '    <div class="col-md-9 text-left bot">' +
        '        <img src="/images/bot.png" /><span class="text">' + text + '</span>' +
        '    </div>' +
        '    <div class="col-md-3">' +
        '        &nbsp;' +
        '    </div>' +
        '</div>';
    $('.messages').append(html);
    $(".messages").animate({ scrollTop: $('.messages').height() }, 1000);
}

//Возвращает из куки SessionId или создает новый
function getSessionId() {

    var sessionId = getCookie('sessionId');
    if (sessionId === null) {
        sessionId = uuid();
        setCookie('sessionId', sessionId, 365);
    }
    return sessionId;
}

//Установка Cookie
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

//Получение Cookie
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

//Генерация UUID
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}