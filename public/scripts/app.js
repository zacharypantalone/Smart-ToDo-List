// Client facing scripts here
const loadReminders = async function() {
  let reminders = [];
  await $.get("/reminder").then((array) => {
    console.log(array);
    reminders = [...array];
  });

  return reminders;
};

const renderReminders = function(tweets) {
  $("#reminders-container").html(' ');
  for (let tweet of tweets) {
    const text = createReminderElement(tweet);
    $("#reminders-container").append(text);
  }
};

const onSubmit = async function(event) {
  event.preventDefault();
  const form = $(this);
  const data = form.serialize();

  // if (data.length <= 5) {
  //   $('#error').slideDown();
  //   setTimeout(() => $('#error').slideUp(), 3000);
  //   return;
  // }

  // if (data.length > 145) {
  //   $('#errorTwo').slideDown();
  //   setTimeout(() => $('#errorTwo').slideUp(), 3000);
  //   return;
  // }

  $.post("/reminder", data).then(async() => {

    const data = await loadReminders();
    renderReminders(data);
    this.reset();
  });
};

const createReminderElement = (reminderData) => {
  const ago = timeago.format(reminderData.created_at);
  const reminderHtml = `<article class="tweet">
        <div class="tweet-content">
          <div class="name-and-user-img">
            <img class="user-img" src="${reminderData.user.avatars}">
          <h3>${reminderData.user.name}</h3>
          <h5>${reminderData.user.handle}</h5>
        </div>
        <div class="tweet-text">
          <p>${escape(reminderData.content.text)}</p>
        </div>
      </div>
      <footer class="time-stamp">
      <span>${ago}</span>
        <div class="bottom-right-buttons">
          <i class="fa-solid fa-flag" onMouseOver="this.style.color='rgb(31, 193, 27)'" onMouseOut="this.style.color='rgb(78, 81, 83)'"></i>
          <i class="fa-solid fa-retweet" onMouseOver="this.style.color='rgb(255, 217, 19)'" onMouseOut="this.style.color='rgb(78, 81, 83)'"></i>
          <i class="fa-solid fa-heart" onMouseOver="this.style.color='rgb(255, 85, 85)'" onMouseOut="this.style.color='rgb(78, 81, 83)'"></i>
        </div>
      </footer>
      </article>`;
  return reminderHtml;
};





$(document).ready(async function() {
  $(".form-inline").on("submit", onSubmit);

  const data = await loadTweets();
  console.log(data);
  renderTweets(data);
});
