console.log("xp.js loaded");
let loopExploitEnabled = false;
let loopNum = 0;
setInterval(() => {
  if (!document.getElementById("pointExploitContainer")) {
    chrome.storage.sync.get(["storyId"], (data) => {
      console.log("Checking for storyId:", data.storyId);
      console.log("Current URL:", window.location.href);
      if (data.storyId && !window.location.href.includes("/lesson")) {
        const containerDiv = document.createElement("div");
        containerDiv.setAttribute("id", "pointExploitContainer");
        containerDiv.style.zIndex = "1000";
        containerDiv.style.userSelect = "none";
        containerDiv.style.height = "230px";
        containerDiv.style.width = "200px";
        containerDiv.style.position = "fixed";
        containerDiv.style.bottom = "20px";
        containerDiv.style.right = "20px";
        containerDiv.style.padding = "10px";
        containerDiv.style.backgroundColor = "#131F24";
        containerDiv.style.border = "2.5px solid #37464F";
        containerDiv.style.borderRadius = "16px";
        containerDiv.style.display = "flex";
        containerDiv.style.flexDirection = "column";

        const text = document.createElement("p");
        text.innerText = "Suma puntos. +90 XP";
        text.style.textAlign = "center";

        const loopCount = document.createElement("p");
        loopCount.innerText = "Contador de repeticiones: 0";
        loopCount.setAttribute("id", "loopCount");
        text.style.textAlign = "center";
        loopCount.style.fontSize = "12px";
        loopCount.style.margin = "0";
        loopCount.style.textAlign = "center";

        const button = document.createElement("button");
        button.textContent = "Dar puntos";
        button.style.display = "block";
        button.style.border = "2px solid #37464F";
        button.style.borderRadius = "14px";
        button.style.background = "#42AADC";
        button.style.color = "#F0F0F0";
        button.style.padding = "10px 20px";
        button.style.cursor = "pointer";
        button.style.transition = "all 0.2s ease";
        button.style.fontWeight = "bold";
        
        // Efectos hover
        button.addEventListener("mouseenter", () => {
          button.style.background = "#58CC02";
          button.style.transform = "scale(1.05)";
          button.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
        });
        
        button.addEventListener("mouseleave", () => {
          button.style.background = "#42AADC";
          button.style.transform = "scale(1)";
          button.style.boxShadow = "none";
        });
        
        // Efecto click
        button.addEventListener("mousedown", () => {
          button.style.transform = "scale(0.95)";
          button.style.background = "#46A302";
        });
        
        button.addEventListener("mouseup", () => {
          button.style.transform = "scale(1.05)";
          button.style.background = "#58CC02";
        });
        
        button.addEventListener("click", () => {
          // Animación de click
          button.style.transform = "scale(0.9)";
          setTimeout(() => {
            button.style.transform = "scale(1)";
            button.style.background = "#42AADC";
          }, 150);
          givePoint();
        });

        const loopPoints = document.createElement("button");
        loopPoints.setAttribute("id", "loopPoints");
        loopPoints.textContent = "Iniciar repetición";
        loopPoints.style.display = "block";
        loopPoints.style.border = "2px solid #37464F";
        loopPoints.style.borderRadius = "14px";
        loopPoints.style.background = "#42AADC";
        loopPoints.style.color = "#F0F0F0";
        loopPoints.style.padding = "10px 20px";
        loopPoints.style.cursor = "pointer";
        loopPoints.style.marginTop = "5px";
        loopPoints.style.transition = "all 0.2s ease";
        loopPoints.style.fontWeight = "bold";
        
        // Efectos hover para loopPoints
        loopPoints.addEventListener("mouseenter", () => {
          if (!loopExploitEnabled) {
            loopPoints.style.background = "#58CC02";
            loopPoints.style.transform = "scale(1.05)";
            loopPoints.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
          }
        });
        
        loopPoints.addEventListener("mouseleave", () => {
          if (!loopExploitEnabled) {
            loopPoints.style.background = "#42AADC";
            loopPoints.style.transform = "scale(1)";
            loopPoints.style.boxShadow = "none";
          }
        });
        
        // Efecto click para loopPoints
        loopPoints.addEventListener("mousedown", () => {
          if (!loopExploitEnabled) {
            loopPoints.style.transform = "scale(0.95)";
            loopPoints.style.background = "#46A302";
          }
        });
        
        loopPoints.addEventListener("mouseup", () => {
          if (!loopExploitEnabled) {
            loopPoints.style.transform = "scale(1.05)";
            loopPoints.style.background = "#58CC02";
          }
        });
        
        loopPoints.addEventListener("click", () => {
          if (!loopExploitEnabled) {
            // Animación de click
            loopPoints.style.transform = "scale(0.9)";
            setTimeout(() => {
              loopPoints.style.transform = "scale(1)";
            }, 150);
          }
          loopPointExploit();
        });

        containerDiv.appendChild(text);
        containerDiv.appendChild(button);
        containerDiv.appendChild(loopPoints);
        containerDiv.appendChild(loopCount);
        document.body.appendChild(containerDiv);
        console.log("Panel flotante creado exitosamente");

        // Draggable menu
        const draggable = document.getElementById("pointExploitContainer");
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        draggable.addEventListener("mousedown", (event) => {
          isDragging = true;
          offsetX = event.clientX - draggable.offsetLeft;
          offsetY = event.clientY - draggable.offsetTop;
          draggable.style.cursor = "grabbing";
        });

        draggable.addEventListener("touchstart", (event) => {
          isDragging = true;
          const touch = event.touches[0];
          offsetX = touch.clientX - draggable.offsetLeft;
          offsetY = touch.clientY - draggable.offsetTop;
          draggable.style.cursor = "grabbing";
        });

        document.addEventListener("mousemove", (event) => {
          if (isDragging) {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const elementWidth = draggable.offsetWidth;
            const elementHeight = draggable.offsetHeight;

            let x = event.clientX - offsetX;
            let y = event.clientY - offsetY;

            x = Math.max(0, Math.min(x, viewportWidth - elementWidth));
            y = Math.max(0, Math.min(y, viewportHeight - elementHeight));

            draggable.style.left = `${x}px`;
            draggable.style.top = `${y}px`;
          }
        });

        document.addEventListener("touchmove", (event) => {
          if (isDragging) {
            const touch = event.touches[0];
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const elementWidth = draggable.offsetWidth;
            const elementHeight = draggable.offsetHeight;

            let x = touch.clientX - offsetX;
            let y = touch.clientY - offsetY;

            x = Math.max(0, Math.min(x, viewportWidth - elementWidth));
            y = Math.max(0, Math.min(y, viewportHeight - elementHeight));

            draggable.style.left = `${x}px`;
            draggable.style.top = `${y}px`;
          }
        });

        document.addEventListener("mouseup", () => {
          isDragging = false;
          draggable.style.cursor = "grab";
        });

        document.addEventListener("touchend", () => {
          isDragging = false;
          draggable.style.cursor = "grab";
        });

        window.addEventListener("resize", () => {
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          const elementWidth = draggable.offsetWidth;
          const elementHeight = draggable.offsetHeight;

          let x = parseInt(draggable.style.left, 10) || 0;
          let y = parseInt(draggable.style.top, 10) || 0;

          x = Math.max(0, Math.min(x, viewportWidth - elementWidth));
          y = Math.max(0, Math.min(y, viewportHeight - elementHeight));

          draggable.style.left = `${x}px`;
          draggable.style.top = `${y}px`;
        });
        // =======================================================
      }
    });
  }
}, 1000);

function givePoint() {
  const bearerToken =
    "Bearer " + (document.cookie.match(/jwt_token=([^;]*)/)?.[1] || "");

  const currentTimeMillis = Date.now();
  const unixTimestamp = Math.floor(currentTimeMillis / 1000);

  const payload = {
    awardXp: true,
    completedBonusChallenge: true,
    dailyRefreshInfo: null,
    fromLanguage: "en",
    hasXpBoost: true,
    illustrationFormat: "svg",
    isFeaturedStoryInPracticeHub: false,
    isLegendaryMode: true,
    isListenModeReAdoption: false,
    isV2Redo: true,
    isV2Story: true,
    learningLanguage: "en",
    masterVersion: false,
    maxScore: 6,
    mode: "READ",
    numHintsUsed: 0,
    pathLevelSpecifics: {
      mode: "read",
      score: 3,
      startTime: unixTimestamp,
    },
  };

  chrome.storage.sync.get(["storyId"], (data) => {
    if (data.storyId) {
      console.log("Retrieved Story ID:", data.storyId);
      sendPOST(data.storyId, bearerToken, payload);
    } else {
      console.log("No Story ID found in storage.");
    }
  });

  function sendPOST(url, bearerToken, payload) {
    fetch(url + "/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: bearerToken,
        Accept: "application/json; charset=UTF-8",
        "Accept-Language": "en-US,en;q=0.9,en-US;q=0.8,en;q=0.7",
        "X-Duo-Request-Host": "stories-edge.duolingo.com",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => console.log("+90XP\nResponse Data:", data))
      .catch((error) => console.error("Error:", error));
  }
}

function loopPointExploit() {
  loopExploitEnabled = !loopExploitEnabled;
  let loopPointsElement = document.getElementById("loopPoints");

  if (loopExploitEnabled) {
    loopPointsElement.innerText = "Detener repetición";
    loopPointsElement.style.background = "#8FE91E";
    loopPointsElement.style.color = "#F0F0F0";
    loopPointsElement.style.transform = "scale(1)";
    loopPointsElement.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
  } else {
    loopPointsElement.innerText = "Iniciar repetición";
    loopPointsElement.style.background = "#42AADC";
    loopPointsElement.style.color = "#F0F0F0";
    loopPointsElement.style.transform = "scale(1)";
    loopPointsElement.style.boxShadow = "none";
  }

  let loopExploitInterval = setInterval(() => {
    if (loopExploitEnabled) {
      loopNum += 1;
      givePoint();
      let loopCountElement = document.getElementById("loopCount");
      loopCountElement.innerText =
        "Contador de repeticiones: " + loopNum + "\n~" + loopNum * 90 + " XP";
    } else clearInterval(loopExploitInterval);
  }, 1000);
}
