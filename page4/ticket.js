import data from "../abi/data.js";
import { userAccount } from "../src/index.js";

let userAddress = userAccount;
let userBalance = "";
let tokenId = "";
let tokenUrl = "";
const contractAddress = "0x9688Ad40a73B3a025E8924c2c35f7024D95F6D0e";
const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(data, contractAddress);

function getMetaMaskAddress() {
  if (typeof window.ethereum !== "undefined") {
    // 사용자에게 DApp 접근 권한 요청
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then(function (accounts) {
        // 첫 번째 계정 주소 반환
        userAddress = accounts[0];
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

const callGetTokenId = async () => {
  try {
    tokenId = await contract.methods.getTokenId(userAddress).call();
    console.log(tokenId);
    return tokenId;
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

//카드 이미지 입력
function changeImg() {
  $("#cont_img").attr("src", tokenUrl);
}

getBalance();

callTokenUri();

$("#account_address").text(userAddress);
$("#balance_int").text(userBalance);
