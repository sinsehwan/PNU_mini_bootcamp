/**
 * #TODO 게시판 기능 제공
 * 목록 표기, 검색, 데이터보기, 데이터수정, 데이터 쓰기, ...
 */

var express = require('express');
var router = express.Router();

const {
    selectSignin, 
    selectCitys, 
    selectCountryCode,
    selectCCode,
    selectDetail, // 세부사항 가져오기
    updateCountry
} = require('../db');

let rows;
// 게시판 홈페이지
// 전달된 데이터는 무조건 문자열이다!!(바이너리 제외하고)
router.get('/', (req, res, next) => {
    // selectCitys 정보를 조회해서 (기본값 1000000, 1, 10) 데이터 가져온다.
    let {pop, pno, pcount} = req.query;

    selectCitys({
        pop : Number(pop) || 1000000, 
        pno : Number(pno) || 1, 
        pcount : Number(pcount) || 10
    })
    .then(({err, rows}) => {
        // console.log(rows.length, rows[0]);
        // 데이터를 가지고 화면 처리
        res.render('board', {title : '게시판', citys : rows});
    })
    //res.send('게시판 홈페이지');
});

// ajax <-> 서버(API 서버 혹은 단순 쿼리 or 연산 후 결과만 리턴, 화면 X)
router.post('/search', (req, res, next) => {
    // 데이터 추출

    // 1. json으로 전송된 데이터 추출
    // 항상 name옵션이 키값이다
    let { keyword } = req.body;
    console.log(`keyword => ${keyword}`);
    // 2. 처리(검색, DB 쿼리)
    selectCountryCode({
        countryCode : keyword.trim(), // 좌우공백제거(데이터 클리닝 작업)
    }).then((data) => {
        // 3. 응답(json)
        res.json(data);
    });
});

// 국가 코드만 출력 -> 일종의 API
router.get('/ccode', (req, res, next) => {
    selectCCode().then(data => res.json(data));
});

// 상세페이지
router.get('/detail/:id', (req, res, next) => {
    let {id} = req.params;
    res.render('board/detail', {
        title : '상세 페이지',
        id
    });
  });


//세부사항 post
router.post('/detail', (req, res, next) => {
    
    let { id } = req.body;
    // 2. 처리(검색, DB 쿼리)
    selectDetail({
        id, // 좌우공백제거(데이터 클리닝 작업)
    }).then((data) => {
        // 3. 응답(json)
        res.json(data || {});
    });
});

router.post('/modify', (req, res, next) => {
    let {ID} = req.body;
    //console.log(req.body);
    updateCountry(req.body)
    .then(({err, result}) => {
        // 에러 체크는 생략
        if(result.affectedRows == 0) // 영향받은 row가 없다.
        {
            res.render('error', {msg : '수정실패'});
            return;
        }
        // 상세보기페이지로 이동
        // 만약 삭제(추가) 작업이었다면 게시판목록으로 이동
        res.render('alert', { msg:'수정 성공' , url : `/board/detail/${ID}`}); 
    })
});
// 객체 모듈화
module.exports = router;