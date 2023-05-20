import data from "../abi/data.js";

//클릭이벤트 붙이기
$("#btn_logout").on("click", function (e) {
  location.reload();
  //해야함
});
$(".v66_428").on("click", function (e) {
  location.href = "../index.html";
});
///////
let userAddress = "";
let userBalance = "";
let tokenId = "";
let tokenUrl = "";

const contractAddress = "0x9688Ad40a73B3a025E8924c2c35f7024D95F6D0e";
const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(data, contractAddress);

function getBalance() {
  try {
    web3.eth.getBalance(userAddress, function (error, wei) {
      if (!error) {
        var balance = web3.utils.fromWei(wei, "ether");
        userBalance = balance + " AVAX";
      }
    });
  } catch (err) {
    console.log(err);
  }
}

const callGetTokenId = async () => {
  try {
    return await contract.methods.getTokenId(userAddress).call();
  } catch (err) {
    console.log(err);
  }
};

const callTokenUri = async () => {
  try {
    tokenId = await callGetTokenId();
    tokenUrl = await contract.methods.tokenURI(tokenId).call();

    if (!tokenUrl) {
      $("#cont_img").attr("src", tokenUrl);
    }
    console.log(tokenUrl);
  } catch (err) {
    console.log(err);
  }
};

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
  getBalance();
  callGetTokenId();
  callTokenUri();
});

window.addEventListener("load", function () {
  if (typeof web3 !== "undefined") {
  } else {
    console.log("No Web3 Detected... using HTTP Provider");
    window.web3 = new Web3(
      new Web3.providers.HttpProvider(
        "https://api.avax-test.network/ext/bc/C/rpc"
      )
    );
  }
});

// //카드 이미지 입력
// function changeImg() {
//   $("#cont_img").attr("src", tokenUrl);
// }
// changeImg();

// $("#account_address").text(userAddress);
// $("#balance_int").text(userBalance);

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
  $("#account_address").text(userAddress);
  $("#balance_int").text(userBalance);
};
bindEvents();

//카드 스크롤 끝
