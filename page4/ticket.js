$("#cont_img").on("click", function (e) {
  window.location.href =
    "https://ipfs.io/ipfs/bafkreie2lvrq6azrgri6eijabwoduca7irndhnsrxij3fps6fefg6achku?filename=NormalTicket";
});

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
  callGetTokenId();
  callTokenUri();
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
  $("#cont_img").attr("src", tokenUrl);
}
