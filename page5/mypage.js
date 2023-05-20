//클릭이벤트 붙이기
$("#btn_logout").on("click", function (e) {
  location.reload();
  //해야함
});
$(".v66_428").on("click", function (e) {
  location.href = "../index.html";
});
///////
var userAddress = "";
var userBalance = "";
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
window.addEventListener("load", function () {
  if (typeof web3 !== "undefined") {
    console.log("Web3 Detected! " + web3.currentProvider.constructor.name);
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.log("No Web3 Detected... using HTTP Provider");
    window.web3 = new Web3(
      new Web3.providers.HttpProvider(
        "https://api.avax-test.network/ext/bc/C/rpc"
      )
    );
  }
});
function getBalance() {
  try {
    web3.eth.getBalance(userAddress, function (error, wei) {
      if (!error) {
        var balance = web3.fromWei(wei, "ether");
        userBalance = balance + " AVAX";
      }
    });
  } catch (err) {
    console.log(err);
  }
}

getMetaMaskAddress().then(function (address) {
  userAddress = address;
  getBalance();
});

$("#account_address").text(userAddress);
$("#balance_int").text(userBalance);

let tokenId = "";
let tokenUrl = "";

const callGetTokenId = async () => {
  try {
    tokenId = await contract.methods.getTokenId(userAddress).call();
    console.log(tokenId);
  } catch (err) {
    console.log(err);
  }
};

const callTokenUri = async () => {
  try {
    tokenUrl = await contract.methods.tokenURI(tokenId).call();
    console.log(tokenUrl);
  } catch (err) {
    console.log(err);
  }
};

//카드 이미지 입력
function changeImg(tokenUrl) {
  $(".image").attr("src", tokenUrl);
}
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
