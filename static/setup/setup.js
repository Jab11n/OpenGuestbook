document.addEventListener("DOMContentLoaded", async () => {
    let step = 1;
    let setup = {
        name: "",
        description: "",
        theme: "",
        custom_theme: "",
        website: "",
        fields: [],
        char_limits: [],
        restricted_words: [],
        access: "",
        key: "",
    };

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

    async function runSetup(step) {
        if (step == 1) {
            document.getElementById("middle").innerHTML = await (
                await fetch("/static/setup/step1.html")
            ).text();

            let nameInput = document.getElementById("name");
            nameInput.addEventListener("change", () => {
                setup.name = nameInput.value;
            });

            let descInput = document.getElementById("description");
            descInput.addEventListener("change", () => {
                setup.description = descInput.value;
            });

            let themeChanger = document.getElementById("theme");
            themeChanger.addEventListener("change", () => {
                if (themeChanger.value == "custom") {
                    document.getElementById("custom-css").style.display =
                        "block";
                    document.getElementById("custom-css-p").style.display =
                        "block";
                } else {
                    document.getElementById("custom-css").style.display =
                        "none";
                    document.getElementById("custom-css-p").style.display =
                        "none";
                    if (themeChanger.value == "retro-space") {
                        document.getElementById("theme-css").href =
                            "/static/retro-space.css";
                    } else if (themeChanger.value == "retro-dark") {
                        document.getElementById("theme-css").href =
                            "/static/retro-dark.css";
                    } else if (themeChanger.value == "retro-light") {
                        document.getElementById("theme-css").href =
                            "/static/retro-light.css";
                    } else if (themeChanger.value == "modern-dark") {
                        document.getElementById("theme-css").href =
                            "/static/modern-dark.css";
                    } else if (themeChanger.value == "modern-light") {
                        document.getElementById("theme-css").href =
                            "/static/modern-light.css";
                    }
                }
            });

            document
                .getElementById("continue")
                .addEventListener("click", () => {
                    let theme = document.getElementById("theme").value;
                    setup.theme = theme;
                    if (theme == "Custom!") {
                        setup.custom_theme =
                            document.getElementById("custom-css").value;
                    } else {
                        setup.custom_theme = null;
                    }
                    setup.website = document.getElementById("website").value;

                    runSetup(2);
                });
        } else if (step == 2) {
            document.getElementById("middle").innerHTML = await (
                await fetch("/static/setup/step2.html")
            ).text();

            let stepsElement = document.getElementById("steps");
            stepsElement.children[0].className = "step step-done";
            stepsElement.children[0].innerText += " ✓";
            stepsElement.children[1].className = "step step-active";

            let fields = document.getElementById("fields");
            fields.addEventListener("change", () => {
                if (fields.value == "name") {
                    document.getElementById("charlimit-name").style.display =
                        "block";
                    document.getElementById(
                        "charlimit-name-label"
                    ).style.display = "block";
                    document.getElementById("charlimit-comment").style.display =
                        "none";
                    document.getElementById(
                        "charlimit-comment-label"
                    ).style.display = "none";
                    document.getElementById("charlimit-website").style.display =
                        "none";
                    document.getElementById(
                        "charlimit-website-label"
                    ).style.display = "none";
                } else if (fields.value == "name-comment") {
                    document.getElementById("charlimit-name").style.display =
                        "block";
                    document.getElementById(
                        "charlimit-name-label"
                    ).style.display = "block";
                    document.getElementById("charlimit-comment").style.display =
                        "block";
                    document.getElementById(
                        "charlimit-comment-label"
                    ).style.display = "block";
                    document.getElementById("charlimit-website").style.display =
                        "none";
                    document.getElementById(
                        "charlimit-website-label"
                    ).style.display = "none";
                } else {
                    document.getElementById("charlimit-name").style.display =
                        "block";
                    document.getElementById(
                        "charlimit-name-label"
                    ).style.display = "block";
                    document.getElementById("charlimit-comment").style.display =
                        "block";
                    document.getElementById(
                        "charlimit-comment-label"
                    ).style.display = "block";
                    document.getElementById("charlimit-website").style.display =
                        "block";
                    document.getElementById(
                        "charlimit-website-label"
                    ).style.display = "block";
                }
            });

            document
                .getElementById("add-restricted-word")
                .addEventListener("click", () => {
                    let word = document.getElementById("restricted-word").value;
                    setup.restricted_words.push(word);
                    let wordElement = document.createElement("p");
                    wordElement.className = "restricted-word-item";
                    wordElement.innerText = word.trim();
                    let wordX = document.createElement("button");
                    wordX.innerText = "x";
                    wordX.addEventListener("click", () => {
                        let i = setup.restricted_words.indexOf(word);
                        if (i !== -1) {
                            setup.restricted_words.splice(i, 1);
                        }
                        wordX.parentElement.remove();
                    });
                    wordElement.appendChild(wordX);
                    document
                        .querySelector(".restrictedwords")
                        .appendChild(wordElement);
                    document.getElementById("restricted-word").value = "";
                });
            document
                .getElementById("restricted-word")
                .addEventListener("keydown", (e) => {
                    if (e.key == "Enter") {
                        let word =
                            document.getElementById("restricted-word").value;
                        setup.restricted_words.push(word);
                        let wordElement = document.createElement("p");
                        wordElement.className = "restricted-word-item";
                        wordElement.innerText = word.trim();
                        let wordX = document.createElement("button");
                        wordX.innerText = "x";
                        wordX.addEventListener("click", () => {
                            let i = setup.restricted_words.indexOf(word);
                            if (i !== -1) {
                                setup.restricted_words.splice(i, 1);
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

            document
                .getElementById("continue")
                .addEventListener("click", () => {
                    if (document.getElementById("fields").value == "name") {
                        setup.fields.push("name");
                        setup.char_limits.push(
                            document.getElementById("charlimit-name").value
                        );
                        setup.char_limits.push(null);
                        setup.char_limits.push(null);
                    } else if (
                        document.getElementById("fields").value ==
                        "name-comment"
                    ) {
                        setup.fields.push("name");
                        setup.fields.push("comment");
                        setup.char_limits.push(
                            document.getElementById("charlimit-name").value
                        );
                        setup.char_limits.push(
                            document.getElementById("charlimit-comment").value
                        );
                        setup.char_limits.push(null);
                    } else {
                        setup.fields.push("name");
                        setup.fields.push("comment");
                        setup.fields.push("website");
                        setup.char_limits.push(
                            document.getElementById("charlimit-name").value
                        );
                        setup.char_limits.push(
                            document.getElementById("charlimit-comment").value
                        );
                        setup.char_limits.push(
                            document.getElementById("charlimit-website").value
                        );
                    }

                    runSetup(3);
                });
        } else if (step == 3) {
            document.getElementById("middle").innerHTML = await (
                await fetch("/static/setup/step3.html")
            ).text();
            let stepsElement = document.getElementById("steps");
            stepsElement.children[1].className = "step step-done";
            stepsElement.children[1].innerText += " ✓";
            stepsElement.children[2].className = "step step-active";

            let accessChooser = document.getElementById("access");
            let copyButton = document.getElementById("copy");

            copyButton.addEventListener("click", () => {
                if (accessChooser.value == "link") {
                    navigator.clipboard.writeText(window.location.origin);
                } else if (accessChooser.value == "embed") {
                    navigator.clipboard.writeText(
                        `<iframe src="${window.location.origin}"></iframe>`
                    );
                }
            });

            accessChooser.addEventListener("change", () => {
                if (accessChooser.value == "link") {
                    copyButton.innerText = "Copy link";
                    document.getElementById("access-hint").innerText =
                        "You'll be able to link to your guestbook, and users will access it in a separate tab. (Recommended)";
                } else if (accessChooser.value == "embed") {
                    copyButton.innerText = "Copy embed code";
                    document.getElementById("access-hint").innerText =
                        "You'll add code to embed your guestbook somewhere on your website.";
                }
            });

            document
                .getElementById("continue")
                .addEventListener("click", () => {
                    setup.access = accessChooser.value;
                    runSetup(4);
                });
        } else if (step == 4) {
            document.getElementById("middle").innerHTML = await (
                await fetch("/static/setup/step4.html")
            ).text();
            let stepsElement = document.getElementById("steps");
            stepsElement.children[2].className = "step step-done";
            stepsElement.children[2].innerText += " ✓";
            stepsElement.children[3].className = "step step-active";

            let key;
            document
                .getElementById("generate")
                .addEventListener("click", () => {
                    key = genKey(24);
                    document.getElementById("key").innerText = key;
                });
            document.getElementById("copy").addEventListener("click", () => {
                navigator.clipboard.writeText(key);
            });

            document
                .getElementById("finish")
                .addEventListener("click", async () => {
                    setup.key = document.getElementById("key").innerText;
                    let response = await fetch("/api/setup", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(setup),
                    });
                    if (response.ok) {
                        document.cookie = `Admin=${encodeURIComponent(
                            setup.key
                        )}; max-age=${
                            60 * 60 * 24 * 30
                        }; path=/; SameSite=Strict`;
                        window.location.reload();
                    } else {
                        console.error(response.statusText);
                        alert(
                            "There was an error completing setup: " +
                                response.statusText +
                                " (" +
                                response.status +
                                ")"
                        );
                    }
                });
        }
    }

    runSetup(step, setup);
});
