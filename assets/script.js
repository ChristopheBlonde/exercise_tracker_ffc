const fetchUser = async (data) => {
  try {
    const response = await fetch(
      `${window.location.href}api/users${data && `?username=${data}`}`,
      {
        method: "GET",
        headers: new Headers(),
        mode: "cors",
        cache: "default",
      }
    );
    const responseData = await response.json();
    displayTable(false);
    responseData.forEach((user) => {
      createTableLineUser(user, "Users Results");
    });
  } catch (error) {
    console.log(error);
  }
};

const submitUser = async (value) => {
  try {
    displayTable(true, 1);
    const data = new FormData();
    data.append("username", `${value}`);
    const response = await fetch(`${window.location.href}api/users`, {
      method: "POST",
      headers: new Headers(),
      cache: "default",
      mode: "cors",
      body: data,
    });
    const responseData = await response.json();
    displayTable(false);
    createTableLineUser(responseData, "Users Added");
  } catch (error) {
    console.log(error);
  }
};

const createTableLineUser = (data, label) => {
  displayTable(true, 1);
  const newLine = document.createElement("tr");
  newLine.setAttribute("class", "table-line");
  newLine.setAttribute("id", `${data._id}`);
  const tdUser = document.createElement("td");
  tdUser.setAttribute("class", "table-td");
  tdUser.innerText = `${data.username}`;
  const tdId = document.createElement("td");
  tdId.setAttribute("class", "table-td");
  tdId.innerText = `${data._id}`;
  newLine.appendChild(tdUser);
  newLine.appendChild(tdId);
  document.getElementById("search-result-legend").innerText = `${label}`;
  document.getElementById("user-body").appendChild(newLine);
};

const fetchLogs = async (id, filters) => {
  let filter;
  if (Object.keys(filters).length !== 0) {
    filter = Object.keys(filters)
      .map((elem, index) => {
        if (index === 0) {
          return `?${elem}=${filters[elem]}`;
        } else {
          return `&${elem}=${filters[elem]}`;
        }
      })
      .join("");
  }

  try {
    const response = await fetch(
      `${window.location.href}api/users/${id}/logs${!filter ? "" : filter}`,
      {
        method: "GET",
        headers: new Headers(),
        mode: "cors",
        cache: "default",
      }
    );
    const responseData = await response.json();
    displayTable(false);
    responseData.log.forEach((elem) =>
      createTableLineLogs(
        elem,
        `${responseData.count} Result(s) for ${responseData.username}'s log`
      )
    );
  } catch (error) {
    console.log(error);
  }
};

const SubmitLogs = async (values) => {
  displayTable(true, 2);
  const formData = new FormData();
  Object.keys(values).forEach(
    (elem) => elem !== "_id" && formData.append(`${elem}`, `${values[elem]}`)
  );

  try {
    const response = await fetch(
      `${window.location.href}api/users/${values._id}/exercises`,
      {
        method: "POST",
        headers: new Headers(),
        mode: "cors",
        cache: "default",
        body: formData,
      }
    );
    const responseData = await response.json();
    displayTable(false);
    createTableLineLogs(
      responseData,
      `${responseData.username} added exercise `
    );
  } catch (error) {
    console.log(error);
  }
};

const createTableLineLogs = (data, label) => {
  displayTable(true, 2);
  const legend = document.getElementById("search-result-legend-logs");
  legend.innerText = `${label}`;
  const table = document.getElementById("logs-body");
  const newLine = document.createElement("tr");
  newLine.setAttribute("class", "table-line");
  newLine.setAttribute("id", `${data._id}`);
  const td1 = document.createElement("td");
  td1.setAttribute("id", "description");
  td1.setAttribute("class", "table-td");
  td1.innerText = `${data.description}`;
  const td2 = document.createElement("td");
  td2.setAttribute("id", "duration");
  td2.setAttribute("class", "table-td");
  td2.innerText = `${data.duration}`;
  const td3 = document.createElement("td");
  td3.setAttribute("id", "date");
  td3.setAttribute("class", "table-td");
  td3.innerText = `${data.date}`;
  newLine.appendChild(td1);
  newLine.appendChild(td2);
  newLine.appendChild(td3);
  table.appendChild(newLine);
};

const displayTable = async (bool, table) => {
  const tableUser = document.getElementById("user-list");
  const tableLogs = document.getElementById("logs-list");

  const arrId = Array.from(document.getElementsByClassName("table-line")).map(
    (elem) => elem.getAttribute("id")
  );

  if (bool) {
    table === 2 &&
      tableLogs.classList.remove("hidden") &&
      tableUser.classList.add("hidden");
    table === 1 &&
      tableUser.classList.remove("hidden") &&
      tableLogs.classList.add("hidden");
  } else {
    if (arrId.length !== 0) {
      arrId.forEach((elem) => document.getElementById(`${elem}`).remove());
    }
    tableUser.classList.add("hidden");
    tableLogs.classList.add("hidden");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  console.log("Document was loaded !");

  /* Add user */
  document.getElementById("user-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const inputUser = document.getElementById("user-input");
    submitUser(inputUser.value);
    inputUser.value = "";
  });

  /* Search user */
  document.getElementById("search-icon").addEventListener("click", async () => {
    const inputSearch = document.getElementById("search-input");
    const user = inputSearch.value;
    await fetchUser(user);
    inputSearch.value = "";
  });

  /* Search logs */
  document.getElementById("search-icon-logs").addEventListener("click", () => {
    const inputLogs = document.getElementById("search-input-logs");
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const limit = document.getElementById("limit").value;
    const filters = {};
    if (from) {
      filters.from = from;
    }
    if (to) {
      filters.to = to;
    }
    if (limit) {
      filters.limit = limit;
    }
    fetchLogs(inputLogs.value, filters);
  });

  /* Add exercise */
  document
    .getElementById("exercises-form")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const inputsValues = {};
      Array.from(document.getElementsByClassName("exercises-input")).forEach(
        (elem) => {
          return (inputsValues[`${elem.getAttribute("id")}`] = elem.value);
        }
      );
      SubmitLogs(inputsValues);
      Array.from(document.getElementsByClassName("exercises-input")).forEach(
        (elem) => {
          return (elem.value = "");
        }
      );
    });
});
