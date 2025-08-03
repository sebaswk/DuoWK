let checkLesson = setInterval(() => {
  if (window.location.href.includes("/lesson")) {
    if (document.getElementById("CEROLINGO") === null) run();
  } else {
    chrome.storage.sync.get(["url", "loop"], (data) => {
      if (data.url && data.url != null && data.loop === true) {
        console.log(data.loop);
        window.location.href = data.url.replace("level", "legendary");
      }
    });
  }
}, 1000);

document.addEventListener("click", (event) => {
  if (
    !document.getElementById("legendaryBypass") &&
    !window.location.href.includes("/lesson")
  ) {
    let practiceButton = document.querySelector(
      'a[data-test*="skill-path-state-legendary"]'
    );
    let legendaryBypass = practiceButton.cloneNode(true);
    legendaryBypass.innerText = "Legendary Bypass +<40px";
    let currentHref = legendaryBypass.getAttribute("href");
    let updatedHref = currentHref.replace("level", "legendary");
    legendaryBypass.setAttribute("href", updatedHref);
    legendaryBypass.setAttribute("id", "legendaryBypass");
    practiceButton.parentNode.appendChild(legendaryBypass);
  }
});

function run() {
  const cerolingo = document.createElement("div");
  cerolingo.id = "CEROLINGO";
  document.body.appendChild(cerolingo);

  let jsons;
  let jsonInterval = setInterval(() => {
    jsons = performance
      .getEntriesByType("resource")
      .filter((resource) =>
        resource.name.startsWith("https://stories.duolingo.com/api2/")
      )
      .map((resource) => resource.name);
    let lessonJsonURL = jsons[0];
    if (jsons.length > 0) {
      let linkToSave = jsons[0].split("?")[0];
      chrome.storage.sync.set({ storyId: linkToSave }, () => {
        console.log("Story ID saved to storage:", linkToSave);
      });
      console.log(lessonJsonURL);
      clearInterval(jsonInterval);
      fetchJSON(lessonJsonURL);
    }
  }, 200);
  setTimeout(() => {
    clearInterval(jsonInterval);
  }, 10000);
}

async function fetchJSON(url) {
  let cookies = document.cookie;
  let jwtToken = cookies.match(/jwt_token=([^;]*)/)?.[1];
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
        Cookie: cookies,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const questionList = data.elements.filter(
      (item) =>
        item.type !== "LINE" &&
        item.type !== "CHALLENGE_PROMPT" &&
        item.type !== "HEADER"
    );
    console.log(questionList);
    let answerMP = getAnswers(questionList, "MULTIPLE_CHOICE");
    let answerSP = getAnswers(questionList, "SELECT_PHRASE");
    let answerPTP = getAnswers(questionList, "POINT_TO_PHRASE");
    let answerA = getAnswers(questionList, "ARRANGE");
    let answerM = getAnswers(questionList, "MATCH");

    const storyStart = setInterval(() => {
      const storyStartButton = document.querySelector(
        'button[data-test="story-start"]'
      );
      if (storyStartButton) {
        storyStartButton.click();
        clearInterval(storyStart);
      }
      setTimeout(() => clearInterval(storyStart), 10000);
    }, 100);

    const contClicker = setInterval(() => {
      let continueButton = document.querySelector(
        'button[data-test="stories-player-continue"]'
      );
      if (continueButton && !continueButton.disabled) {
        continueButton.click();
      } else {
        let buttons = document.querySelectorAll(
          'button[data-test="stories-choice"]'
        );
        buttons.forEach((btn) => {
          if (answerSP.includes(btn.innerText)) btn.click();
          else if (answerMP.includes(btn.nextElementSibling?.textContent))
            btn.click();
        });
        if (buttons.length === 0) {
          let challengeButtons = document.querySelectorAll(
            'button[data-test*="challenge-tap-token"]'
          );
          if (challengeButtons.length < 8) {
            let filled = false;
            challengeButtons.forEach((i) => {
              if (answerPTP.includes(i.innerText)) {
                filled = true;
                i.click();
              }
              if (
                i === challengeButtons[challengeButtons.length - 1] &&
                filled === false
              ) {
                answerA.forEach((ansA) => {
                  ansA.forEach((a) => {
                    challengeButtons.forEach((cbtn) => {
                      if (cbtn.innerText === a) cbtn.click();
                    });
                  });
                });
              }
            });
          } else {
            answerM.forEach((match) => {
              challengeButtons.forEach((btn) => {
                let btntext = btn.innerText.replace(/[\d\n]/g, "");
                if (match.includes(btntext)) btn.click();
              });
            });
          }
        }
        let endButton = document.querySelector(
          'button[data-test="stories-player-done"]'
        );
        if (endButton) {
          clearInterval(contClicker);
          endButton.click();
          document.getElementById("CEROLINGO").remove();
        }
      }
    }, 100);
    return data;
  } catch (error) {
    console.error("Error fetching the JSON:", error);
  }
}

function getAnswers(elements, type) {
  let filteredElements = elements.filter((item) => item.type === type);
  let answers = [];
  filteredElements.forEach((element) => {
    if (type === "MULTIPLE_CHOICE") {
      answers.push(element.answers[element.correctAnswerIndex].text);
    } else if (type === "SELECT_PHRASE") {
      answers.push(element.answers[element.correctAnswerIndex]);
    } else if (type === "POINT_TO_PHRASE") {
      let selectableTranscript = element.transcriptParts.filter(
        (item) => item.selectable === true
      );
      answers.push(selectableTranscript[element.correctAnswerIndex].text);
    } else if (type === "MATCH") {
      element.matches.forEach((m) => {
        answers.push([m.phrase, m.translation]);
      });
    } else if (type === "ARRANGE") {
      let tempanswers = element.phraseOrder;
      let phrases = element.selectablePhrases;
      for (var i = 0; i < tempanswers.length; i++) {
        tempanswers[i] = phrases[tempanswers[i]];
      }
      answers.push(tempanswers);
    }
  });
  console.log(answers);
  return answers;
}
