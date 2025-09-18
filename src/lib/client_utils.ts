export  function isAppleClient(){
    if (navigator.platform.substr(0,2) === 'iP') { // iOS устройство
        // @ts-ignore
        if (window.webkit && window.webkit.messageHandlers) {
            return true; // WKWebView
        }
        // Дополнительные проверки, если необходимо
    }
    return false;
}