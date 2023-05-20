import data from "../abi/data.js";

//내용 전환
$(".switch.nft").on("click", function () {
  $(".switch.detail").addClass("gray");
  $(".switch.nft").removeClass("gray");
  $("#nft_ticket").show();
  $("#nft_detail").hide();
});
$(".switch.detail").on("click", function () {
  $(".switch.nft").addClass("gray");
  $(".switch.detail").removeClass("gray");
  $("#nft_ticket").hide();
  $("#nft_detail").show();
});
$(".switch.nft").trigger("click");
//민트 위한 변수 선언
var userAddress = "";

//민트를 위한 함수 선언
function getMetaMaskAddress() {
  if (typeof window.ethereum !== "undefined") {
    // 사용자에게 DApp 접근 권한 요청
    return window.ethereum
      .enable()
      .then(function () {
        // 메타마스크 계정 주소 가져오기
        return window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then(function (accounts) {
            // 첫 번째 계정 주소 반환
            return accounts[0];
          });
      })
      .catch(function (error) {
        console.error(error);
      });
  } else {
    return Promise.reject("메타마스크를 설치해주세요.");
  }
}
getMetaMaskAddress().then(function (address) {
  userAddress = address;
  console.log("메타마스크 주소:", address);
});
// 잔고 컴
//결제창 오픈

// 민트 클릭
$("#ticket_button").on("click", function () {
  const mintTicket = async (contractAddress, userAddress) => {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(data, contractAddress);
    contract.methods
      .mintTicket()
      .send({ from: userAddress, value: 1000000000000000 })
      .on("receipt", function (receipt) {
        window.location.href = "../page5/index.html";
        console.log(receipt);
      })
      .on("error", function (error) {
        console.log(error);
      });
  };
  mintTicket("0xb6ACb4Bc6e19A19B6E44A4fb5Ce74D2F1a3FE2E6", userAddress);
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
