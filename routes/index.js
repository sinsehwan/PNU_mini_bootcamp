// 이미 만들어진 express 모듈을 캐싱해서 사용함.
var express = require('express');
// 라우팅을 하기 위해서 라우트 객체를 획득 -> prefix => http://도메인:/3000/
var router = express.Router();

/* 
  - GET 방식의 요청만 처리하는 페이지
    - router.get()
      - router.메소드명() 특정 메소드 방식의 라우팅처리 가능
    - get or post or put => 메소드 -> c <-> server 요청할 때 데이터를 전달하는 방법/수단/의도
      - get : 서버로 보내는 데이터의 크기가 작다, 프로토콜의 헤더를 통해서 데이터를 전송,
        중요하지 않은 데이터(의도를 알아도 문제되지 않는 데이터)를 사용
      - post : 서버로 보내는 데이터의 크기가 커도 된다(클 수 있다, 파일 업로드 등) 
        프로토콜의 바디를 통해서 데이터를 전송(여러 번 나눠서 보낼 수 있다. 대용량 전송 가능)
        보안이슈, 암호화 가능, 숨겨서 전송 가능, 로그인, 회원가입 등 민감한 정보 처리
      - put : 데이터 입력 요청을 할 때(ex) 회원가입) (sql : insert into ~)
      - delete : 데이터를 삭제 요청할 때(sql : delete from ~)

    - http, https 프로토콜에서 정의되어 있다. (메소드에 대한 정의)
  - home page (http://도메인 이렇게 요청할 때 최초로 나오는 화면) 
*/

/*
  - 아래에서 정의되는 경로는 http://도메인:포트 + prefix + 정의한 경로
  - router.get('url or url 경로', 콜백함수(요청객체(전달), 응답객체준비, 포워딩을 위한 함수(다른곳으로 넘김)) {응답처리} )
  //서버관점에서 응답은 비동기적으로 처리해야하는 것임
*/
router.get('/', function(req, res, next) {
  // 세션을 체크하고 싶은 URL에 세션 점검 기능 부여
  // 미들웨어로 연동방법
  // TODO 세션체크를 라우팅 처리 개별 함수 내에서 수행. 콜백함수내에서 처리하는 방법
  console.log(req.session);
  console.log(req.session.uid);
  console.log(req.session.name);

  if( req.session.uid == undefined || req.session.uid == null )
  {
    res.redirect('/users/signin');
    return;
  }
  // 응답객체를 통해서 index.ejs 파일을 읽고 -> 데이터를 넣어서 -> 렌더링(템플릿엔진이 동적 생성) -> 응답
  // SSR (Server Side Rendering)서버쪽에서 모든 화면을 구성해서 내려주는것 <-> CSR 클라이언트에서 화면구성 ex)게임
  res.render('index', { title: {v : 'Express 3' } });
});

// URL 새로 정의 -> 요구사항 정의서를 기반으로 설계
// /custom, get, 내용은 custom.ejs를 읽어서 처리, 요구사항에 없는 부분은 적절히 구현
// TODO 리소스(텍스트, 설정값) 등등 외부에서 관리하는 것
router.get('/custom', (req, res, next) => {
  res.render('custom', { title : '고객센터'});
});

/* 
  -클라이언트가 데이터를 서버쪽으로 전송
    - 메소드  
      - get           : http 헤더
        - <form> 전송 -> 화면 깜박, 새로고침마크가 x로 잠시변경됨 <-> ajax로 처리됨(백그라운드 비동기 통신)
        - 링크 클릭 -> url에 입력 후 요청 맥락 같음
        - url에 입력 후 요청
          - http://localhost:3000/gettest?no=1234&nm=sdf
          - ? : url과 전송데이터의 구분자.
          - & : 데이터와 데이터를 구분
          - = : 데이터를 표현하는 키와 값을 구분
        - restapi 구성시 테스트를 위한 요청 전문 툴 사용
          - 브라우저 사용 X
          - 툴에서 임의로 요청을 구성하여 수행 (비정상적인 접근)
            - postman or thunderclient
          - 프로그래밍언어에서 직접 요청, 특정 서버에서 요청 (ex) c -> s -> gpt -> s -> c)
            - 비정상적인 접근 or openAPI(허가) (get or post + http 헤더에 토큰/인증값 요구)
      - post, put...  : http 바디
    - 동적 파라미터 (URL에 심어서 보냄)
      - 프로토타입, 무한대의 URL을 생성해야 할 때
      - url의 특정값만 바꾸는 식으로 페이지가 무수히 많을 때
    - 웹소켓 (다음주)
      - 채팅, 챗봇
*/

// -TODO GET방식 전송 테스트
router.get('/gettest', (req, res, next) => {
  // 유저의 모든 전송 데이터는 req(request : 요청 객체)를 통해서 전달된다.
  console.log('get 방식 전송 데이터 추출', req.query);
  let {no, nm} = req.query;
  console.log(no, nm);
  res.render('custom', { title : 'get방식 데이터 전송 테스트'});
});
// 주소도 결국 헤더에 담기는 것임


/*
  -TODO 동적 파라미터 전송테스트
    - URL에 데이터를 심어서 전송
    - http의 헤더를 타고 전송
    - 데이터양이 적고 노출되어도 문제 없는 데이터를 사용
    - get과 post에서 모두 사용 가능
    - 무한 URL을 만들어야 한다면, 특정 부분이 계속 변경되는 URL을 사용해야 한다면, 프로토타입(초기)
  - 형식
    - url/:변수명/a/:변수명
*/

router.get('/dyparam/:nm', (req, res, next) => {
  // 서버가 res 처리가 없으면 클라이언트 계속 빙빙돌면서 대기한다 -> timeout 제한 필요
  // res.end() 이 부분이 기본이고 내재된 함수(render(), ...)들도 존재
  console.log(req.params);
  let {nm} = req.params;
  // 전달된 값을 추출해서 "hi 전달된데이터" 자리에 세팅해서 응답
  // 이러면 화면구성을 프론트쪽에서 해야됨.
  
  res.json({'msg':`hi ${nm}`});
});

// 무한확장 가능하다.
router.get('/dyparam/:nm/a/:no', (req, res, next) => {
  console.log(req.params);
  let {nm, no} = req.params;
  res.json({'msg':`hi ${nm} ${no}`});
});

/*
  TODO Post 방식 전송
    - body를 통해 데이터 전송, 대량데이터 전송 가능
    - 데이터를 숨기거나, 보안적 이슈가 있는 경우 사용
    - 다양한 형태로 전송할 수 있다.
*/

// 페이지가 없다 : 404
// 해당 url로 해당 메소드가 구성된 게 없다, 허락되어 지지 않았다 : 405

router.post('/posttest', (req, res, next) => {
  // 데이터 추출
  let {uid, upw} = req.body;
  res.json({'uid':uid, 'upw':upw});
});
// url은 동일한데, 메소드만 다르다 => 다른 url로 인지
router.get('/posttest', (req, res, next) => {
  res.render('custom', {title : 'post전송테스트'});
});

// json으로 전송된 데이터 처리
router.post('/posttestjson', (req, res, next) => {
  console.log(req.body);
  let {uid, upw} = req.body;
  res.json({"uid":uid, "upw":upw});
});

module.exports = router;
