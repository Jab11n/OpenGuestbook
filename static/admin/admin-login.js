document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("submit").addEventListener("click", async () => {
        let pwField = document.getElementById("key-input");
        if (pwField.value) {
            let response = await fetch("/api/admin/login", {
                method: "POST",
                headers: {
                    Authorization: pwField.value,
                },
            });
            if (response.ok) {
                document.cookie = `Admin=${encodeURIComponent(
                    pwField.value
                )}; max-age=${60 * 60 * 24 * 30}; path=/; SameSite=Strict`;
                window.location.reload();
            } else {
                let resData = await response.json();
                alert(
                    `ERROR ${response.status}: ${response.statusText}\n${resData.message}`
                );
            }
        }
    });
});
