export function startCursor(hands) {

    const customCursor =
        document.getElementById("custom-cursor");


    function setCursorArt(art) {

        customCursor.textContent =
            art;

    }


    function moveCursor(event) {

        customCursor.style.left =
            `${event.clientX}px`;

        customCursor.style.top =
            `${event.clientY}px`;

        customCursor.style.display =
            "block";

    }


    function cursorDown() {

        setCursorArt(
            hands.clicked
        );

    }


    function cursorUp() {

        setCursorArt(
            hands.idle
        );

    }


    setCursorArt(
        hands.idle
    );


    document.addEventListener(
        "mousemove",
        moveCursor
    );

    document.addEventListener(
        "mousedown",
        cursorDown
    );

    document.addEventListener(
        "mouseup",
        cursorUp
    );

}