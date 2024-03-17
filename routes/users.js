/**
 * 회원 가입, 인증, 로그인, 로그아웃, 회원 정보 수정, 마이페이지, ...
 *  - /users/signin, /users/auth, /users/signup, /users/signout, /users/modify,
 *  - /users/mypage, ...
 */

var express = require('express');
var router = express.Router();

const {selectSignin, selectCitys} = require('../db');

/* GET users listing. */
router.get('/', function(req, res, next) {

  // 회원 업무에 대한 모든 링크, 데스트 화면 제공 (개발용)
  res.render('users', {title:'회원처리 메인'});
});

//http://localhost:3000/users/signin
// 로그인 화면
router.get('/signin', function(req, res, next) {
  res.render('users/signin',{title:'로그인 화면'});
});

function showMsg(res, msgStr)
{
  res.render('msg', {msg:`${msgStr}`});
    return;
}

// 로그인 처리 -> 포워딩 혹은 에러처리
router.post('/signin', function(req, res, next) {
  // 1. 아이디, 비번 정보 획득, 유효성 검사(데이터 누락 체크)
  const {uid, upw} = req.body;
  console.log(uid, upw);
  // 값 검사해서 유효성 보장
  if(uid == null || upw == null || uid === '' || upw ==='')
  {
    console.log(`[${uid}]-[${upw}]`);
    // 에러메시지 전송
    // 이전페이지(URL 상태로)로 되돌아 간다
    showMsg(res,'아이디 혹은 비밀번호를 정확하게 입력하세요' );
    return;
  }
  // 2. 아이디, 비번 정보를 이용하여 데이터베이스에 쿼리 수행
  
  selectSignin({
    uid,
    upw
  })
  .then(({err, rows}) => {
    // [ { name:'게스트', ...}]
    if(rows.length > 0)
    {
      // 3. 계정 정보가 존재하면
      console.log(rows);
      console.log('회원 정보 존재')
    // 3-1. 회원 정보 획득 (전부 혹은 일부)
    // 3-2. 로그처리 등등 필요 작업 수행
    // 3-3. 세션 처리, 필요 정보 저장
    // TODO 세션 생성

    // 객체 확장
    req.session.uid = uid;
    req.session.name = rows[0].name; // 쿼리 결과에서 0번 취하고(일치하는 회원은 1명),
    // 그 밑에 멤버 name 추출
    console.log('req.session.uid', uid);
    console.log('req.session.name', rows[0].name);

    // 3-4. 홈페이지로 이동
      res.redirect('/');
    }
    else
    {
      // 4. 계정 정보가 없다면
      console.log('회원 정보 없음')
      // 오류 메세지 전송 -> 특정 페이지로 포워딩(혹은 뒤로가게 처리)
      showMsg(res, '일치되는 회원 정보가 없습니다');
    }
  })
  //res.send('로그인 처리');
});

// 로그아웃
router.get('/signout', function(req, res, next) {
  // TODO 세션 해제
  // 정보가 있든 없든 일단 널처리
  req.session.uid = null;
  req.session.name = null;
  //세션이 종료되었으므로 -> 로그인으로 이동 혹은 홈페이지로 이동(알아서 로그인으로 이동함)
  req.session.destroy(() => {
    res.redirect('/');
  })
});

// 로그아웃 처리
router.post('/signout', function(req, res, next) {
  res.send('로그아웃 처리');
});

// 회원가입 화면
router.get('/signup', function(req, res, next) {
  res.send('회원가입 화면');
});

// 회원 가입 처리
router.put('/signup', function(req, res, next) {
  res.send('회원가입 처리');
});

// 회원 탈퇴
router.delete('/signup', function(req, res, next) {
  res.send('회원 탈퇴');
});

// 인증
router.post('/auth', function(req, res, next) {
  res.send('respond with a resource');
});

// 마이페이지
router.get('/mypage', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
