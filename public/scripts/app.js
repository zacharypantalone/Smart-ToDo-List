// Display category
const categories = {
  1: 'watch',
  2: 'visit',
  3: 'read',
  4: 'buy',
  5: 'other'
};

const getCategoryById = (id) => {
  return categories[id];
};



// Client facing scripts here
const loadReminders = async function () {
  let reminders = [];
  await $.get("/reminder/json").then((response) => {
    console.log(response);
    reminders = [...response.toDos];
  });

  return reminders;
};

const renderReminders = function (reminders) {
  $("#reminder-container").empty();
  for (let reminder of reminders) {
    const text = createReminderElement(reminder);
    $("#reminder-container").prepend(text);
  }
};

const onSubmit = async function (event) {
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
  //console.log(form);

  $.post("/reminder/json", data).then(async () => {

    const data = await loadReminders();
    // console.log("data", data);
    renderReminders(data);
    this.reset();
  });
};

const injectionProtection = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const generateDropdownItem = (id) => {
  let output = "";
  for (const key in categories) {
    if (Number(key) !== Number(id)) {
      output += `<a class ="drop-down-cat" href="#">${getCategoryById(key)}</a>`;
    };
  };
  return output;
};

const createReminderElement = (reminderData) => {

  console.log(reminderData);

  const ago = timeago.format(reminderData.create_date);
  const reminderHtml = `
      <article class="reminder">
        <div class="reminder-content">
          <div class="name-and-user-img">
          <div class="dropdown">
            <button class="dropbtn ${reminderData.category_id} ${reminderData.id}">${getCategoryById(reminderData.category_id)}</button>
            <div class="dropdown-content">
              ${generateDropdownItem(reminderData.category_id)}
            </div>
          </div>
            <img class="user-img" src="${reminderData.img_url}">
            </div>
            <div class="reminder-text">
              <p>${injectionProtection(reminderData.title)}</p>
            </div>
          </div>
          <footer class="time-stamp">
          <span>${ago}</span>
            <div class="bottom-right-buttons">
              <i class="fa-solid fa-flag" onMouseOver="this.style.color='rgb(31, 193, 27)'" onMouseOut="this.style.color='rgb(78, 81, 83)'"></i>
              <i class="fa-solid fa-retweet" onMouseOver="this.style.color='rgb(255, 217, 19)'" onMouseOut="this.style.color='rgb(78, 81, 83)'"></i>
              <i class="fa-solid fa-heart" onMouseOver="this.style.color='rgb(255, 85, 85)'" onMouseOut="this.style.color='rgb(78, 81, 83)'"></i>
            </div>


            <form class="form-inline" method="POST" action="/reminder/json/delete/${reminderData.id}">
            <button type="submit" class="btn btn-primary">Delete</button>


          </footer>
          </article>`;


  return reminderHtml;
};

// MAKE SURE TO ASK A MENTOR IF IT'S APPROPRIATE FOR THIS TO BE IN HERE //


$(document).ready(async function () {
  $(".form-inline").on("submit", onSubmit);
  //change the.form-inline to a ID: thatwe have to create at main,ejs

  const data = await loadReminders();
  //console.log("data2", data);
  renderReminders(data);

  $("#reminder-container").on("click", ".drop-down-cat", function(event)  {
    $(this).parent().siblings(".dropbtn").text($(this).text());
    const category = $(this).parent().siblings(".dropbtn").text();
    const categoryId = Object.keys(categories).find(key => categories[key] === category);
    console.log(categoryId)
    const id = $(this).parent().siblings(".dropbtn").attr("class").split(" ")[2];
    console.log(category, id);
      $.post("/main/category", {
        category: categoryId,
        id
      });
  });



});


