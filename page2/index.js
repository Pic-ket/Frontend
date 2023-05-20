import metamask from "../utils/metamask";

//내용 전환
$(".switch.nft").on("click", function (e) {
  $(".switch.detail").addClass("gray");
  $(".switch.nft").removeClass("gray");
  $("#nft_ticket").show();
  $("#nft_detail").hide();
});
$(".switch.detail").on("click", function (e) {
  $(".switch.nft").addClass("gray");
  $(".switch.detail").removeClass("gray");
  $("#nft_ticket").hide();
  $("#nft_detail").show();
});
$(".switch.nft").trigger("click");
//민트 위한 변수 선언
var userAddress = "";
var contractAddress = "";

$("#ticket_button").on("click", function (e) {
  //민트? 시작하는 코드 ㄱㄱ
  // useraddress <- 전역에 지정
  useraddress = metamask.getWallet();
  console.log("계좌번호 테스트 로그 : " + userAddress);
  //
  const mintTicket = async () => {
    try {
      const nonce = await web3.eth.getTransactionCount(userAddress, "latest");
      const data = web3.eth.abi.encodeFunctionCall(
        {
          inputs: [],
          name: "mintTicket",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        []
      );
      console.log();
      const signTx = await web3.eth.accounts.signTransaction(
        {
          from: userAddress,
          to: contractAddress,
          data: data,
          gas: 2000000,
          nonce: nonce,
        },
        privateKey
      );

      await web3.eth
        .sendSignedTransaction(signTx.rawTransaction)
        .on("error", (err) => {
          results.error.push("sendSignedTransaction ERROR");
        })
        .then((receipt) => {
          console.log(receipt);
        });
    } catch (err) {
      console.log(err);
    }
    return {};
  };

  mintTicket();
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
