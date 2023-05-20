// import { getUrl } from "../utils/apiconnection.js";

$(".v66_428").on("click", function (e) {
  location.reload();
});
$(".item").on("dblclick", function (e) {
  location.href = "./page2/index.html";
});

const account_text = "";

const getUrl = (addOn, queryString) => {
  const urlBase = "http://3.139.103.120:8080/" + addOn;
  const payload = { userAddress: queryString };
  const urlAddon = "?" + new URLSearchParams(payload).toString();
  const url = urlBase + (queryString ? urlAddon : "");

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

//참고하세요!
//getUrl("status");
//뒤 인자가 useraddress값
//getUrl("tokenInfo", "test");

//클릭이벤트 붙이기
$("#btn_mypage").on("click", function async(e) {
  if (typeof window.ethereum !== "undefined") {
    window.ethereum
      .enable()
      .then(function (accounts) {
        account_text = accounts[0];
        alert("accounts[0]");
        location.href = "./page5/index.html";
      })
      .catch(function (error) {
        console.error(error);
        location.reload();
      });
  } else {
    alert("메타마스크를 설치해주세요.");
    location.reload();
  }
});

//카드 스크롤 시작
const list = document.querySelector(".list");
const listScrollWidth = list.scrollWidth;
const listClientWidth = list.clientWidth;

let startX = 0;
let nowX = 0;
let endX = 0;
let listX = 0;

const getClientX = (e) => {
  const isTouches = e.touches ? true : false;
  return isTouches ? e.touches[0].clientX : e.clientX;
};

const getTranslateX = () => {
  return parseInt(getComputedStyle(list).transform.split(/[^\-0-9]+/g)[5]);
};

const setTranslateX = (x) => {
  list.style.transform = `translateX(${x}px)`;
};

const onScrollStart = (e) => {
  startX = getClientX(e);
  window.addEventListener("mousemove", onScrollMove);
  window.addEventListener("touchmove", onScrollMove);
  window.addEventListener("mouseup", onScrollEnd);
  window.addEventListener("touchend", onScrollEnd);
};

const onScrollMove = (e) => {
  nowX = getClientX(e);
  setTranslateX(listX + nowX - startX);
};

const onScrollEnd = (e) => {
  endX = getClientX(e);
  listX = getTranslateX();
  if (listX > 0) {
    setTranslateX(0);
    list.style.transition = `all 0.3s ease`;
    listX = 0;
  } else if (listX < listClientWidth - listScrollWidth) {
    setTranslateX(listClientWidth - listScrollWidth);
    list.style.transition = `all 0.3s ease`;
    listX = listClientWidth - listScrollWidth;
  }

  window.removeEventListener("mousedown", onScrollStart);
  window.removeEventListener("touchstart", onScrollStart);
  window.removeEventListener("mousemove", onScrollMove);
  window.removeEventListener("touchmove", onScrollMove);
  window.removeEventListener("mouseup", onScrollEnd);
  window.removeEventListener("touchend", onScrollEnd);
  window.removeEventListener("click", onClick);

  setTimeout(() => {
    bindEvents();
    list.style.transition = "";
  }, 300);
};
const onClick = (e) => {
  if (startX - endX !== 0) {
    e.preventDefault();
  }
};

const bindEvents = () => {
  list.addEventListener("mousedown", onScrollStart);
  list.addEventListener("touchstart", onScrollStart);
  list.addEventListener("click", onClick);
};
bindEvents();

//카드 스크롤 끝
