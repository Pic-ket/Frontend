const w = $(window).width();

$("#outcover").width(w);
//클릭이벤트 붙이기
$("#btn_mypage").on("click", function(e) {
    //그전에, 메타 마슼?
    
    location.href = "./page5/index.html";
});
$(".v66_428").on("click", function(e) {
    location.reload();
});
function initiate() {

}

// 이벤트
/*1. 피켓 -> 리로드
2. 마이페이지 -> 연결
3. 다음으로 만들기
 */

//카드 스크롤 시작
const list = document.querySelector('.list');
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
    window.addEventListener('mousemove', onScrollMove);
    window.addEventListener('touchmove', onScrollMove);
    window.addEventListener('mouseup', onScrollEnd);
    window.addEventListener('touchend', onScrollEnd);
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

    window.removeEventListener('mousedown', onScrollStart);
    window.removeEventListener('touchstart', onScrollStart);
    window.removeEventListener('mousemove', onScrollMove);
    window.removeEventListener('touchmove', onScrollMove);
    window.removeEventListener('mouseup', onScrollEnd);
    window.removeEventListener('touchend', onScrollEnd);
    window.removeEventListener('click', onClick);

    setTimeout(() => {
        bindEvents();
        list.style.transition = '';
    }, 300);
};
const onClick = (e) => {
    if (startX - endX !== 0) {
        e.preventDefault();
    }
};

const bindEvents = () => {
    list.addEventListener('mousedown', onScrollStart);
    list.addEventListener('touchstart', onScrollStart);
    list.addEventListener('click', onClick);
};
bindEvents();

//카드 스크롤 끝