// Load dependency
const SolrNode = require("solr-node");

// Create a client
const client = new SolrNode({
  host: "127.0.0.1", //
  port: "8983",
  core: "new_core",
  protocol: "http",
});

client.autoCommit = true;

// 💡 @futureUpdate: Should a make separate fuonction for constructing Queries!

// @param: data ===> must be of type object
/*Example:
 const data = {
  id: 12345,
  title: "SuperHuman 2"
  isAvail: true,
  etc...
}
*/
const addDataSolr = async function (data) {
  let query = await client.query().q({}).addParams({
    wt: "json",
    indent: true,
  });
  try {
    // Update/Add documentData to Solr server
    client.update(data, function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Response:", result.responseHeader);
      console.log("Response:", result);
    });
  } catch (err) {
    console.error(
      `😲 Something Went Wrong while trying to connect with Solr Apache! 😭
      Error Origin: SolrConnector.js
      Check: 1) If Solr Server is Active, 2) If CORS are set up correctly
      ${err}`
    );
  }
};

const requestQuerySolr = async function () {
  let query = await client.query().q({}).addParams({
    wt: "json",
    indent: true,
  });
  // .rows(6);
  try {
    let data = await client.search(query);
    let result = {
      // 😡 Search why JSON.parse not working
      test: "OK",
      data: data,
    };
    return result;
  } catch (err) {
    console.error(
      `😲 Something Went Wrong while trying to connect with Solr Apache! 😭
      Error Origin: SolrConnector.js
      Check: 1) If Solr Server is Active, 2) If CORS are set up correctly
      ${err}`
    );
  }
};

/*
 ### Testing Data ###
addDataSolr({
  id: 100200300,
  company: "AMD",
  prodName: "Ryzen 9 7950X",
  img: "https://c1.neweggimages.com/ProductImage/19-113-771-S02.jpg",
});
addDataSolr({
  id: 100200301,
  company: "NVIDIA",
  prodName: "RTX 4090",
  img: "https://ironbladeonline.com/wp-content/uploads/2022/09/1662816639_Gigabyte-NVIDIA-GeForce-RTX-4090-Dedicated-Graphics-Cards-Listed-By-1024x780.png",
});
addDataSolr({
  id: 100200302,
  company: "Seasonic",
  prodName: "PRIME TX-1600",
  img: "https://c1.neweggimages.com/ProductImage/17-151-255-V01.jpg",
});
*/
module.exports = { requestQuerySolr, addDataSolr };

// var data = {
//   text: "test",
//   title: "test",
// };
