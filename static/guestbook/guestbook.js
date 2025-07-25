document.addEventListener("DOMContentLoaded", async () => {
    let pageNum = 1;
    async function loadSigns(page = pageNum) {
        let response = await (await fetch(`/api/signs?page=${page}`)).json();
        if (response.last) {
            document.getElementById("load-more").style.display = "none";
        }
        return response;
    }

    function renderSign(sign) {
        let base = document.createElement("div");
        base.className = "sign";

        const namei = sign[1];
        const commenti = sign[2];
        const websitei = sign[3];
        const timei = sign[4];

        if (websitei && commenti) {
            let name = document.createElement("a");
            if (websitei.includes("https://") || websitei.includes("http://")) {
                name.href = websitei;
            } else {
                name.href = "http://" + websitei;
            }
            name.className = "sign-name";
            name.innerText = namei;

            let comment = document.createElement("p");
            comment.innerText = commenti;

            let time = document.createElement("p");
            time.innerText = new Date(timei * 1000).toLocaleString();
            time.className = "sign-time";

            base.appendChild(name);
            base.appendChild(comment);
            base.appendChild(time);
        } else if (commenti && !websitei) {
            let name = document.createElement("p");
            name.className = "sign-name";
            name.innerText = namei;

            let comment = document.createElement("p");
            comment.innerText = commenti;

            let time = document.createElement("p");
            time.innerText = new Date(timei * 1000).toLocaleString();
            time.className = "sign-time";

            base.appendChild(name);
            base.appendChild(comment);
            base.appendChild(time);
        } else {
            let name = document.createElement("p");
            name.className = "sign-name";
            name.innerText = namei;

            let time = document.createElement("p");
            time.innerText = new Date(timei * 1000).toLocaleString();
            time.className = "sign-name";

            base.appendChild(name);
            base.appendChild(time);
        }

        document.getElementById("signs").appendChild(base);
    }
    document.getElementById("load-more").addEventListener("click", async () => {
        pageNum++;
        let signs = await loadSigns(pageNum);
        for (let i = 0; i < signs.entries.length; i++) {
            renderSign(signs.entries[i]);
        }
    });

    document.getElementById("submit").addEventListener("click", async () => {
        let name = document.getElementById("input-name").value;
        let comment;
        let website;
        if (document.getElementById("input-comment").style.display != "none") {
            comment = document.getElementById("input-comment").value;
        } else {
            comment = null;
        }
        if (document.getElementById("input-website").style.display != "none") {
            website = document.getElementById("input-website").value;
        } else {
            website = null;
        }

        let response = await fetch("/api/sign", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                comment: comment,
                website: website,
            }),
        });
        if (response.ok) {
            localStorage.setItem("signed", "true");
            window.location.reload();
        } else {
            let message = await response.json();
            console.error(`${response.statusText}: ${message.message}`);
            alert(
                `Error ${response.status} ${response.statusText}\n${message.message}`
            );
        }
    });

    let signs = await loadSigns();
    for (let i = 0; i < signs.entries.length; i++) {
        renderSign(signs.entries[i]);
    }
});
