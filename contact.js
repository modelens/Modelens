function copyToClipboard() {

    var copyText = document.getElementById("mobileNumber");


    copyText.select();
    copyText.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(copyText.value).then(() => {

        var notification = document.getElementById("notification");
        notification.classList.add("show");


        setTimeout(() => {
            notification.classList.remove("show");
        }, 3000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}
