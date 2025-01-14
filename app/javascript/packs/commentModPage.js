function applyReactedClass(category) {
  const upVote = document.querySelector("[data-category='thumbsup']");
  const downVote = document.querySelector("[data-category='thumbsdown']");
  const vomitVote = document.querySelector("[data-category='vomit']");

  if (category === 'thumbsup') {
    downVote.classList.remove('reacted');
    vomitVote.classList.remove('reacted');
  } else {
    upVote.classList.remove('reacted');
  }
}

async function updateMainReactions(reactableType, category, reactableId) {
  const clickedBtn = document.querySelector(`[data-category="${category}"]`);
  try {
    const response = await fetch('/reactions', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'X-CSRF-Token': window.csrfToken,
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        reactable_type: reactableType,
        category,
        reactable_id: reactableId,
      }),
    });

    const outcome = await response.json();

    if (outcome.result === 'create') {
      clickedBtn.classList.add('reacted');
    } else {
      clickedBtn.classList.remove('reacted');
    }
  } catch (error) {
    // eslint-disable-next-line no-alert
    alert(error);
  }
}

// Experience-Level JS
function clearExpLevels() {
  Array.from(
    document.getElementsByClassName('level-rating-button selected'),
  ).forEach((el) => {
    el.classList.remove('selected');
  });
}

async function updateExperienceLevel(currentUserId, articleId, rating, group) {
  try {
    const response = await fetch('/rating_votes', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'X-CSRF-Token': window.csrfToken,
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        user_id: currentUserId,
        article_id: articleId,
        rating,
        group,
      }),
    });

    const outcome = await response.json();

    if (outcome.result === 'Success') {
      clearExpLevels();
      document
        .getElementById(`js__rating__vote__${rating}`)
        .classList.add('selected');
    } else {
      // eslint-disable-next-line no-alert
      alert(outcome.error);
    }
  } catch (error) {
    // eslint-disable-next-line no-alert
    alert(error);
  }
}

document.querySelectorAll('.level-rating-button').forEach((btn) => {
  btn.addEventListener('click', () => {
    updateExperienceLevel(
      btn.dataset.userId,
      btn.dataset.articleId,
      btn.value,
      btn.dataset.group,
    );
  });
});

document.querySelectorAll('.reaction-button, .reaction-vomit-button').forEach((btn) => {
  btn.addEventListener('click', () => {
    applyReactedClass(btn.dataset.category);
    updateMainReactions(
      btn.dataset.reactableType,
      btn.dataset.category,
      btn.reactableId,
    );
  });
});

const form = document.getElementsByClassName('button_to')[0];
form.addEventListener('submit', e => {
  e.preventDefault();
  if (confirm('Are you SURE you want to delete this comment?')) {
    form.submit();
  }
});
