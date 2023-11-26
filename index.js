const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempval, orgval) => {
  let temp = tempval.replace("{%tempVal%}", orgval.main.temp);
  temp = temp.replace("{%tempMin%}", orgval.main.temp_min);
  temp = temp.replace("{%tempMax%}", orgval.main.temp_max);
  temp = temp.replace("{%location%}", orgval.name);
  temp = temp.replace("{%country%}", orgval.sys.country);
  temp = temp.replace("{%tempstatus%}", orgval.weather[0].main);
  return temp;
};

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=Lahore&units=metric&appid=cfb6040de9bb88eea04125349df10cba"
    )
      .on("data", (chunk) => {
        const objData = JSON.parse(chunk);
        const arrData = [objData];
        //   console.log(arrData[0].main.temp);
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.error("connection lost due to errors", err);
        res.end();
      });
  }
});

server.listen(8000, "127.0.0.1");
