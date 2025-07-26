document.addEventListener("DOMContentLoaded", async () => {
    function genKey(length) {
        let result = "";
        let characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            );
        }
        return result;
    }

    document.getElementById("name").value = currentConfig.name;
    document.getElementById("description").value = currentConfig.description;
    document.getElementById("website").value = currentConfig.website;
    document.getElementById("theme").value = currentConfig.theme;
    if (document.getElementById("theme").value == "custom") {
        document.getElementById("custom-css").style.display = `block`;
        document.getElementById("custom-css-p").style.display = `block`;
    } else {
        document.getElementById("custom-css").style.display = `none`;
        document.getElementById("custom-css-p").style.display = `none`;
    }
    if (currentConfig.fields.includes("website")) {
        document.getElementById("fields").value = "name-comment-website";
        document.getElementById("charlimit-name").value =
            currentConfig.char_limits[0];
        document.getElementById("charlimit-comment").value =
            currentConfig.char_limits[1];
        document.getElementById("charlimit-website").value =
            currentConfig.char_limits[2];
    } else if (
        currentConfig.fields.includes("comment") &&
        !currentConfig.fields.includes("website")
    ) {
        document.getElementById("fields").value = "name-comment";
        document.getElementById("charlimit-website").style.display = "none";
        document.getElementById("charlimit-name").value =
            currentConfig.char_limits[0];
        document.getElementById("charlimit-comment").value =
            currentConfig.char_limits[1];
    } else {
        document.getElementById("fields").value = "name";
        document.getElementById("charlimit-website").style.display = "none";
        document.getElementById("charlimit-comment").style.display = "none";
        document.getElementById("charlimit-name").value =
            currentConfig.char_limits[0];
    }
    for (let i = 0; i < currentConfig.restricted_words.length; i++) {
        let word = currentConfig.restricted_words[i];
        let wordElement = document.createElement("p");
        wordElement.className = "restricted-word-item";
        wordElement.innerText = word.trim();
        let wordX = document.createElement("button");
        wordX.innerText = "x";
        wordX.addEventListener("click", () => {
            wordX.parentElement.remove();
        });
        wordElement.appendChild(wordX);
        document.querySelector(".restrictedwords").appendChild(wordElement);
        document.getElementById("restricted-word").value = "";
    }
    document
        .getElementById("add-restricted-word")
        .addEventListener("click", () => {
            let word = document.getElementById("restricted-word").value;
            currentConfig.restricted_words.push(word);
            let wordElement = document.createElement("p");
            wordElement.className = "restricted-word-item";
            wordElement.innerText = word.trim();
            let wordX = document.createElement("button");
            wordX.innerText = "x";
            wordX.addEventListener("click", () => {
                let i = currentConfig.restricted_words.indexOf(word);
                if (i !== -1) {
                    currentConfig.restricted_words.splice(i, 1);
                }
                wordX.parentElement.remove();
            });
            wordElement.appendChild(wordX);
            document.querySelector(".restrictedwords").appendChild(wordElement);
            document.getElementById("restricted-word").value = "";
        });
    document
        .getElementById("restricted-word")
        .addEventListener("keydown", (e) => {
            if (e.key == "Enter") {
                let word = document.getElementById("restricted-word").value;
                currentConfig.restricted_words.push(word);
                let wordElement = document.createElement("p");
                wordElement.className = "restricted-word-item";
                wordElement.innerText = word.trim();
                let wordX = document.createElement("button");
                wordX.innerText = "x";
                wordX.addEventListener("click", () => {
                    let i = currentConfig.restricted_words.indexOf(word);
                    if (i !== -1) {
                        currentConfig.restricted_words.splice(i, 1);
                    }
                    wordX.parentElement.remove();
                });
                wordElement.appendChild(wordX);
                document
                    .querySelector(".restrictedwords")
                    .appendChild(wordElement);
                document.getElementById("restricted-word").value = "";
            }
        });

    document.getElementById("current").addEventListener("click", () => {
        navigator.clipboard.writeText(currentConfig.key);
    });
    let newKey;
    document.getElementById("generate").addEventListener("click", () => {
        newKey = genKey(24);
        navigator.clipboard.writeText(newKey);
        currentConfig.key = newKey;
    });

    document.getElementById("save").addEventListener("click", async () => {
        let data = {
            name: document.getElementById("name").value,
            description: document.getElementById("description").value,
            website: document.getElementById("website").value,
            theme: document.getElementById("theme").value,
            custom_theme:
                document.getElementById("theme").value == "custom"
                    ? document.getElementById("custom-theme").value
                    : null,
            fields:
                document.getElementById("fields").value ==
                "name-comment-website"
                    ? ["name", "comment", "website"]
                    : document.getElementById("fields").value == "name-comment"
                    ? ["name", "comment"]
                    : ["name"],
            char_limits:
                document.getElementById("fields").value ==
                "name-comment-website"
                    ? [
                          Number(
                              document.getElementById("charlimit-name").value
                          ),
                          Number(
                              document.getElementById("charlimit-comment").value
                          ),
                          Number(
                              document.getElementById("charlimit-website").value
                          ),
                      ]
                    : document.getElementById("fields").value == "name-comment"
                    ? [
                          Number(
                              document.getElementById("charlimit-name").value
                          ),
                          Number(
                              document.getElementById("charlimit-comment").value
                          ),
                          null,
                      ]
                    : [
                          Number(document.getElementById("charlimit-name")),
                          null,
                          null,
                      ],
            restricted_words: currentConfig.restricted_words,
            key: newKey ? newKey : currentConfig.key,
        };

        let response = await fetch("/api/admin", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status == 200) {
            if (newKey != currentConfig.key) {
                document.cookie = `Admin=${encodeURIComponent(
                    currentConfig.key
                )}; max-age=${60 * 60 * 24 * 30}; path=/; SameSite=Strict`;
            }
            window.location.reload();
        } else {
            alert(
                `ERROR ${response.status} - ${
                    response.statusText
                }\n${await response.text()}`
            );
        }
    });
    document.getElementById("logout").addEventListener("click", () => {
        document.cookie =
            "Admin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/";
    });
});
