"use strict";

import axios from "axios";

class rawWordData {
  constructor(query) {
    this.#query = query;
  }
  //init
  #query = null;
  #NNB = null;
  #RAWDATA = null;

  //functions
  async fetchData() {
    const nnbResponse = await axios.get(`https://lcs.naver.com/m?u=https://en.dict.naver.com/#/search?range=all&query=${this.#query}`).then((r) => {
      if (this.#query == undefined || null) {
        return;
      } else {
        return r.headers["set-cookie"][0].split(" ")[0].slice(4, -1);
      }
    });

    this.#NNB = nnbResponse;

    const rawDataResponse = await axios
      .get(`https://en.dict.naver.com/api3/enko/search?query=${this.#query}&range=all&shouldSearchVlive=false&lang=ko`, {
        headers: {
          Cookie: `NNB=${this.#NNB};`,
          Referer: "https://en.dict.naver.com/",
        },
      })
      .then((r) => {
        if (this.#query == undefined || null) {
          return;
        } else {
          return r.data;
        }
      });

    this.#RAWDATA = rawDataResponse;
  }

  //getter
  get essential() {
    return { ...this.#RAWDATA };
  }
}

//word info init
async function fetchData(query) {
  const instance = new rawWordData(query);
  await instance.fetchData();
  return instance.essential.searchResultMap.searchResultListMap;
}

class WORD {
    constructor(rawData) {
    // have to input fetchData(query)
    this.rawData = rawData;
  }
  // query: rawWordData.Cookie;
}
console.log(JSON.parse((await fetchData("chicken")).WORD).data);
