let total = 0;
const start = () => {
  async function getData() {
    const res = await fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vTzBpjYKwzChzCtjToCns9jIO6ZP29XjrQYGzCipQn2hoJ0pIrenTWm9asKZfcfIw9mxt7mZrN4CaC3/pub?output=tsv"
    );
    const text = await res.text();
    const lines = text.split("\n");
    let skills = lines.map((line) => {
      const parts = line.split("\t");
      return parts[3];
    });

    skills.shift();
    total = skills.length;
    parseSkills(skills);
  }

  getData();
};
function parseSkills(skills) {
  let data = [];
  skills.forEach((skillList) => {
    data = [...data, ...skillList.split(",")];
  });

  const trimmed = data.map((s) => s.trim().toLowerCase());
  removeCommonWords(trimmed);
}
function removeCommonWords(data) {
  let removed = data.filter((item) => {
    if ([""].includes(item)) {
      return false;
    }
    return item;
  });
  remapInconsistencies(removed);
}
function remapInconsistencies(skills) {
  const translate = (word) => {
    switch (word) {
      case "reactnative":
        return "react native";
      case "vanilla js":
        return "js";
      case "mostly javascript (react":
        return "react";
      case "node)":
        return "nodejs";
      case "wordpress(php)":
        return "wordpress";
      case "php & laravel":
        return "laravel";
      default:
        return word;
    }
  };
  const clean = skills.map((item) => {
    return translate(item);
  });
  //console.log(clean);
  prepareForChart(clean);
}
start();

function prepareForChart(data) {
  let nextData = {};
  data.forEach((item) => {
    if (nextData[item]) {
      nextData[item]++;
    } else {
      nextData[item] = 1;
    }
  });
  console.log(nextData);
  /* let labels = new Set(data);
  console.log(labels); */
  showChart(Object.keys(nextData), Object.values(nextData));
}
function showChart(labels, dataSet) {
  //const labels = ["January", "February", "March", "April", "May", "June"];
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Frontend skills in use: " + total + " answers",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: dataSet, //[0, 10, 5, 2, 20, 30, 45],
      },
    ],
  };
  const config = {
    type: "bar",
    data: data,
    options: {},
  };

  var myChart = new Chart(document.getElementById("myChart"), config);
}
//showChart();
