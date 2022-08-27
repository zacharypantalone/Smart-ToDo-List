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
      output += `<a href="#">${getCategoryById(key)}</a>`;
    };
  };
  return output;
};

const createReminderElement = (reminderData) => {

  const ago = timeago.format(reminderData.create_date);
  const reminderHtml = `

  <div class="container" style="margin-top:50px ;">
        <div class="row">
            <div >
                <div class="card-sl">

                    <div class="card-image">
                        <img class="user-img" src="${reminderData.img_url}"/>
                    </div>

                    <a class="card-action" href="#"><i class="fa fa-heart"></i> ${reminderData.category_name}
                    </a>


                    <div class="card-heading">
                    <p>${injectionProtection(reminderData.title)}</p>
                    </div>


                    <div class="card-text">
                    <span>${ago}</span>
                    </div>

                    <form class="form-inline" method="POST" action="/reminder/json/delete/${reminderData.id}">
                    <button type="submit" class="card-button">Delete</button>

                </div>
            </div>
        </div>


  `;

  return reminderHtml;
};

// MAKE SURE TO ASK A MENTOR IF IT'S APPROPRIATE FOR THIS TO BE IN HERE //


$(document).ready(async function () {
  $("#submitreminder").on("submit", onSubmit);
  //change the.form-inline to a ID: thatwe have to create at main,ejs

  const data = await loadReminders();
  //console.log("data2", data);
  renderReminders(data);
});


