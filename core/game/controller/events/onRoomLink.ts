export function onRoomLinkListener(url: string): void {
    // Event called when the room link is created.
        // this bot application provides some informations by DOM control.
        
        /* the example for how to access on IFrame in haxball headless page
        // access on 'a href' tag in the iframe and get the room link (url)
        var roomLinkIframe: any = document.getElementsByTagName('iframe');
        var roomLinkElement: any = roomLinkIframe[0].contentDocument.getElementById('roomlink').getElementsByTagName('p');
        var roomLinkValue: any = roomLinkElement[0].getElementsByTagName('a');
        console.log(roomLinkValue[0].href); // room link (url)
        */

    window.gameRoom.link = url;
    window.gameRoom.logger.i('onRoomLink', `This room has a link now: ${url}`);
}
