import React, { useState } from "react";
const { requestQuerySolr, addDataSolr } = require("./solrConnector.js"); //returns response obj from Solr Query

function App() {
  const [showSearch, setSearchShow] = useState(true); //set to false
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  // const [searchInfo, setSearchInfo] = useState({});
  const toggleSearch = () => {
    setSearchShow(!showSearch);
  };

  // ***** VERY IMPORTANT *****
  // Don't forget the Chrome Plugin for CORS
  // ===  Moesif CORS  ===

  const fromObjToArr = (obj) => {
    let tempArray = [];
    for (const property in obj) {
      tempArray.push(`${property}: ${obj[property]}`);
    }
    console.log(tempArray);
    return tempArray.join("\r\n");
  };

  const getImgString = function (element) {
    const imgIndex = element.search("img"); // It's the same as indexOf()
    const imgJPG = element.search(".jpg");
    const imgPNG = element.search(".png");

    // String.prototype.search() returns -1 if it doesn't find a match
    if (imgIndex > 0) {
      return imgJPG > 0
        ? element.substring(imgIndex + 5, imgJPG + 5)
        : element.substring(imgIndex + 5, imgPNG + 5);
      // imgJPG > 0
      //   ? console.log(element.substring(imgIndex + 5, imgJPG))
      //   : console.log(element.substring(imgIndex + 5, imgPNG));
    } else console.log(`This element: ${element.slice(0, 10)} has no Image`);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (search === "") return;
    try {
      let queryRsult = await requestQuerySolr(50); // <-- Arg = Number Of Rows to fetch
      console.log(queryRsult.data.response.docs);
      const dataArray = queryRsult.data.response.docs; // <-- This is of type "Array"
      setResults(dataArray); // <-- This is a React hook that handles "State"
      // "State" is just a variable that can dynamically change from User Inputs and/or Code
    } catch (err) {
      console.error(
        `😅 It seems that something went wrong when App.js was trying to request a query from Solr server through the solrConnector.js
        Error Origin: App.js
        ${err}`
      );
    }
  };
  return (
    <>
      <div className="title">
        <h1>Solr Apache Seeker</h1>
      </div>
      <div className={`search-icon ${showSearch ? "open" : null}`}>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            className="search-icon__input"
            placeholder="search ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <div className="search-icon__wrapper" onClick={toggleSearch}>
          <div className="search-icon__glass"></div>
          <div className="search-icon__handle"></div>
        </div>
      </div>
      {true ? (
        <p className="search-result">Search results : {results.length}</p>
      ) : (
        ""
      )}

      {/* 🤯 Here we will need to make a React Component which takes as a prop(or arg) */}
      {/* an object from the dataArray. Then it will check if there is a img property. */}
      {/* A) If there is, display it || B) If there is NOT, display a default image    */}
      <div className="results">
        {/* The map() is a Array method, and is used to manipulate an Array and also */}
        {/* returns a new array. It does Not mutate that original array */}
        {results.map((result, indx, arr) => {
          // const url = `https://en.wikipedia.org/?curid=${result.pageid}`;
          return (
            // ######################################
            // Here the "key={indx}" prop of the <div> element
            // must be set, cuz we create multiple divs and React must have
            // a way of handling them, works as an ID for the divs
            // ######################################
            <div className="result" key={indx}>
              {/* <h3>{result.title}</h3> */}
              {/* <p dangerouslySetInnerHTML={{ __html: result.snippet }}></p> */}
              {/* <a href={url} target="_blank" rel="noreferrer"> */}
              {/* </a> */}

              {/* 
              ######################################
                React can not render objects, thats 
                why I created the "fromObjToArr()" function
              ######################################
              */}
              {fromObjToArr(result)}
              {/* ### Below is an example, ofc it needs to be styled from the css file ### */}
              <div>
                <img
                  src={getImgString(fromObjToArr(result))}
                  alt="the Item's Img"
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// // const url = `https://en.wikipedia.org/?curid=${result.pageid}`;
// console.log(result);
// <h3>{result}</h3>;
// return (
//   <div className="result" key={indx}>
//     <p>aaaaa</p>
//     {/* <p dangerouslySetInnerHTML={{ __html: result.snippet }}></p> */}
//     {/* <a href={url} target="_blank" rel="noreferrer"> */}
//     Read more
//     {/* </a> */}

export default App;
