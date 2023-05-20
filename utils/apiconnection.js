const getUrl = (addOn, queryString) => {
  const urlBase = "http://3.139.103.120:8080/" + addOn;
  const payload = { userAddress: queryString };
  const urlAddon = "?" + new URLSearchParams(payload).toString();
  console.log(urlAddon);
  console.log(urlBase);

  const url = urlBase + (queryString ? urlAddon : "");
  console.log(url);

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const mapData = data.map((x) => {
        return {
          isChanged: x.isChanged,
          mintTime: x.mintTime,
          tokenId: x.tokenId,
          tokenImage: x.tokenImage,
          tokenUrl: x.tokenUrl,
          updateTime: x.updateTime,
          userAddress: x.userAddress,
        };
      });
      console.log("mapData:", mapData);
    })
    .catch((error) => console.log("error:", error));
};
