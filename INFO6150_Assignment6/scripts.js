/*
 * @Author: Jiang Han
 * @Date: 2025-03-18 15:58:39
 * @Description: 
 */
const apiKey = "ndJuCepQRR1hrMIwrsKGGgM9jtwyp3tO0A0gXopi";

async function fetchAPOD() {
    const date = document.getElementById("datePicker").value;
    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        document.getElementById("title").innerText = data.title;
        document.getElementById("explanation").innerText = data.explanation;
        document.getElementById("copyright").innerText = data.copyright ? `Copytright: ${data.copyright}` : "Public Domain";

        const mediaContainer = document.getElementById("media");
        mediaContainer.innerHTML = "";
        if (data.media_type === "image") {
            const img = document.createElement("img");
            img.src = data.url;
            mediaContainer.appendChild(img);
        } else if (data.media_type === "video") {
            const iframe = document.createElement("iframe");
            iframe.src = data.url;
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute("allowfullscreen", "true");
            mediaContainer.appendChild(iframe);
        }
    } catch (error) {
        console.error("Failed to get AOPD: ", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("datePicker").valueAsDate = new Date();
    fetchAPOD();
});