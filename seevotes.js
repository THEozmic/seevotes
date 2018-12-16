(function() {
  window.addEventListener("load", function() {
    createVoteCounts();
  });

  window.addEventListener("scroll", function() {
    createVoteCounts();
  });

  function addVoteButtonEventListener(innerDoc, i) {
    let voteButtons = innerDoc.body.querySelectorAll(
      ".PollXChoice-vote--button"
    )[0];
    if (voteButtons) {
      if (document.addEventListener) {
        voteButtons.addEventListener("click", function() {
          let parentElem =
            voteButtons.parentElement.parentElement.parentElement.parentElement;

          let childNodes = parentElem.querySelectorAll(".VoteCount");
          [...childNodes].forEach(function(elem) {
            elem.style.cssText = "display:none";
          });
        });
      } else {
        voteButtons[i].attachEvent("onclick", function() {
          let parentElem =
            voteButtons.parentElement.parentElement.parentElement.parentElement;

          let childNodes = parentElem.querySelectorAll(".VoteCount");
          [...childNodes].forEach(function(elem) {
            elem.style.cssText = "display:none";
          });
        });
      }
    }
  }

  function createVoteCounts() {
    const iframes = document.querySelectorAll("iframe[id^='xdm_default']");
    for (let i = 0; i < iframes.length; i++) {
      let innerDoc =
        iframes[i].contentDocument || iframes[i].contentWindow.document;
      if (innerDoc.body) {
        addVoteButtonEventListener(innerDoc, i);

        let script = innerDoc.body.querySelectorAll(
          "script[type='text/twitter-cards-serialization']"
        );
        if (script[0]) {
          let jsonObject = JSON.parse(script[0].innerText);
          let card = jsonObject.card;
          if (card.choice_count) {
            for (let j = 1; j <= card.choice_count; j++) {
              if (!card.selected_choice && card.is_open) {
                let voteCount = card["count" + j];
                let optionElem = innerDoc.body.querySelectorAll(
                  ".PollXChoice-choice"
                )[j - 1];

                let existingVoteCountElem = optionElem.querySelectorAll(
                  ".VoteCount"
                );
                if (existingVoteCountElem.length === 0) {
                  let newElem = document.createElement("span");
                  newElem.className = "VoteCount";
                  newElem.style.cssText = `background-color: #FFC107;padding: 5px;
                    border-radius: 4px;font-size: 12px;font-weight: 600;margin-left: 20px`;
                  if (Number(voteCount) === 1) {
                    newElem.innerHTML = `(${voteCount} vote)`;
                  } else {
                    newElem.innerHTML = `(${new Intl.NumberFormat().format(
                      voteCount
                    )} votes)`;
                  }

                  optionElem.appendChild(newElem);
                }
              }
            }
          }
        }
      }
    }
  }
})();
