const fs = require("fs");
const file = require("../covidreport/src/data/uscounties_geojson.json");
const Papa = require("papaparse");
const path = require("path");
const lookup = path.join(__dirname, "stateData.csv");

//* Gets max number of State #'s from list.
function stateTotal() {
  const max = file.features.reduce(function(prev, current) {
    return prev.properties.STATE > current.properties.STATE ? prev : current;
  });
  return parseInt(max.properties.STATE, 10);
}

function returnInState(state) {
  return file.features.filter(ele => ele.properties.STATE == state);
}

function parseLookUp() {
  return new Promise((resolve, reject) => {
    const readstream = fs.createReadStream(lookup);
    let data = "";

    readstream.on("data", function(chunk) {
      data += chunk;
    });

    return readstream.on("end", function() {
      Papa.parse(data, {
        header: true,
        delimiter: ",",
        complete: function(results) {
          //console.log(results.errors);
          resolve(results.data);
        }
      });
    });
  });
}
(async () => {
  //* Load Dependancies, Statefile will be the "working" file.
  let lookfile = await parseLookUp();
  let statefile = file;

  // Cross reference the STATE ID# from statefile with the state name from lookfile & replace ID# with State Name.
  //! The lookup codes were a pain in the ass to find, thanks government data!

  statefile.features.forEach(
    element =>
      (element.properties.STATE = lookfile
        .filter(x => x.state_fips == element.properties.STATE)
        .map(ele => ele.state_name)[0])
  );

  fs.writeFile("countiesdata.json", JSON.stringify(statefile, null, 2), function(err) {
    if (err) {
      return console.log(err);
    }
  });
  //console.log(statefile.features[500]);
})();

//parseLookUp().then(x => console.log(x));
