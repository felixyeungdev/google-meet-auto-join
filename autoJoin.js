const defaultTimeout = 500;

async function sleep(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}

(async function () {
    let meetingId = window.location.href.split("https://meet.google.com/")[1];
    if (!meetingId || meetingId.includes("/")) {
        return;
    }

    async function waitForCameraButton() {
        return new Promise((resolve, reject) => {
            let loop = setInterval(() => {
                try {
                    let button = document.querySelectorAll(
                        'div[role="button"][jsname="BOHaEe"][data-is-muted]'
                    )[1];
                    if (button) {
                        clearInterval(loop);
                        resolve(button);
                    }
                } catch (error) {}
            }, defaultTimeout);
        });
    }

    async function waitForJoinButton() {
        return new Promise((resolve, reject) => {
            let loop = setInterval(() => {
                try {
                    let button = document.querySelector(
                        'div[role="button"][jsname="Qx7uuf"]'
                    );
                    if (button) {
                        clearInterval(loop);
                        resolve(button);
                    }
                } catch (error) {}
            }, defaultTimeout);
        });
    }

    async function waitForMeetingInitialise() {
        return new Promise((resolve, reject) => {
            let loop = setInterval(() => {
                try {
                    let button = document.querySelector(
                        'div[jscontroller="moXjHd"]'
                    );
                    if (button) {
                        clearInterval(loop);
                        resolve(button);
                    }
                } catch (error) {}
            }, defaultTimeout);
        });
        // document.querySelector('')
    }

    async function startCountdownConfirmJoin(element) {
        var cancelled = false;
        element.style.cursor = "pointer";
        element.addEventListener("click", () => {
            cancelled = true;
            element.innerText = "Auto-join cancelled";
            element.styles.cursor = "";
        });
        for (let i = 5; i >= 0; i--) {
            await sleep(1000);
            if (cancelled) break;
            element.innerText = `Auto-joining meeting in ${i} seconds\nClick me to cancel`;
        }
        return !cancelled;
    }

    let cameraButton = await waitForCameraButton();
    let joinButton = await waitForJoinButton();
    let messageDisplay = (await waitForMeetingInitialise()).querySelector(
        "div"
    );
    messageDisplay.innerText = "Auto-joining meeting soon";
    if (cameraButton.getAttribute("data-is-muted") == "false") {
        cameraButton.click();
    }
    let confirmJoin = await startCountdownConfirmJoin(messageDisplay);
    if (confirmJoin) joinButton.click();
})();

(async function () {
    let lookupId1 = window.location.href.split(
        "https://meet.google.com/lookup/"
    )[1];
    let validLookupId1 = !!lookupId1 && !lookupId1.includes("/");
    let lookupId2 = window.location.href.split(
        "https://meet.google.com/_meet/whoops"
    )[1];
    let validLookupId2 = !!lookupId2 && !lookupId2.includes("/");
    if (!(validLookupId1 || validLookupId2)) return;

    let meetingLookupId;

    if (validLookupId1) {
        meetingLookupId = lookupId1.split("?")[0];
    } else {
        meetingLookupId = new URLSearchParams(window.location.search).get(
            "alias"
        );
    }

    if (!meetingLookupId || ["null", "undefined"].includes(meetingLookupId))
        return;

    async function waitForMessageDisplay() {
        return new Promise((resolve, reject) => {
            let loop = setInterval(() => {
                try {
                    let button = document.querySelector(
                        'div[jscontroller="FwWxCe"] > div'
                    );
                    if (button) {
                        clearInterval(loop);
                        resolve(button);
                    }
                } catch (error) {}
            }, defaultTimeout);
        });
    }

    async function startCountdownConfirmReload(element) {
        let originalMessage = element.innerText;

        var cancelled = false;
        element.style.cursor = "pointer";
        element.addEventListener("click", () => {
            cancelled = true;
            element.innerText = `${originalMessage}\nRefresh cancelled`;
            element.style.cursor = "";
        });
        for (let i = 5; i >= 0; i--) {
            await sleep(1000);
            if (cancelled) break;
            element.innerText = `${originalMessage}\nRefreshing page in ${i} seconds\nClick me to cancel`;
        }
        return !cancelled;
    }

    let messageDisplay = await waitForMessageDisplay();
    let confirmReload = await startCountdownConfirmReload(messageDisplay);
    if (confirmReload)
        window.location.href = `https://meet.google.com/lookup/${meetingLookupId}`;
})();
