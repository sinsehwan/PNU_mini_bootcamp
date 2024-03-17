// #TODO 엔트리포인트 app.js 각종 설정, 라우팅 설정, 정적위치 지정, 템플릿엔진 설정

// 필요한 라이브러리 가져오기(경로가 아님)
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// TODO express-session 적용
const session = require('express-session');
// npmjs session-file-store 사용법 참조
let FileStore = require('session-file-store')(session);

// 커스텀으로 구현한 모듈(라우팅처리, 비즈니스로직 구현)
// 라우팅 => 클라이언트가 요청 -> url -> url 해석 -> 누가 처리할 지 할당
// 업무별로 세분화 -> 메인서비스, 고객인증, cs, 메뉴별 상세기능, ... => 업무할당
//var indexRouter = require('./routes/index');
var indexRouter = require('./routes');
var usersRouter = require('./routes/users');

//게시판을 위한 board 라우팅을 추가
var boardRouter = require('./routes/board');

// 객체 생성 express() => 내부적으로 객체를 생성해서 리턴할것이다.
var app = express();

// TODO session 구동을 위한 기본 설정
app.set('trust proxy', 1) // trust first proxy
// app.use( 객체 ) => req.객체 접근 가능
app.use(session({
  secret: '[secret]', // 해시값, 쿠키 암호값, 암호화시 재료값
  resave: false, // 요청이 왔을 때 수정 사항이 없더라도 다시 저장할 것인가?
  saveUninitialized: true, // 세션에 저장할 내용이 없을때라도 세션을 저장할 것인가
  // 별도 옵션이 없기에 기본값 sessions에 파일이 생성됨.
  store: new FileStore(), // 세션 저장소를 메모리(기본) -> 파일(스토리지)
  rolling : true,
  cookie: { // 쿠키 설정
    maxAge:600000,// 세션 만료 시간
    //secure: false
   } // 코드를 풀면 세션 저장이 안됨. secure = false
}))

// 템플릿 엔진, 템플릿 파일 위치 지정
// view engine setup
// app.set(키, 값) => 환경변수로 확장 가능 => 전역적으로 사용 가능하다
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 사용기능 설정 개발, json 처리, url 파싱, 쿠키파싱 기능 사용하는 것으로 설정
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// 정적폴더 위치 지정
console.log(`__dirname ${__dirname}`); // node에서 제공하는 사전정의된 전역변수
// 현재 위치 / public 으로 경로를 동적 구성해서 정적위치 지정
app.use(express.static(path.join(__dirname, 'public')));

// express 3.x -> 4.x 추가된 기능
// 블루프린트, 라우팅 별 prefix 부여, url을 기본 경로를 설정

// http://도메인/users, http://도메인/users/x, http://도메인/users/xx, ...
// 로그인 등 세션 없이도 접근 가능한 페이지만 이쪽으로 배치
app.use('/users', usersRouter);

// 세션처리 => 진입로에서 요청을 분석해서 특정 prefix로 오면 세션체크 수행

// http://도메인/x, http://도메인/xx, http://도메인
app.use('/', indexRouter);

// 게시판을 위한 prefix 추가
app.use('/board', boardRouter);


// 에러 헨들링 등록
// 주요 에러 코드(100~, 200~, 300~, [(유저 접근권한)400~, (백엔드)500~])
// 에 대응하는 함수들 공통적으로 구성, 필요시 추가
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// 객체 모듈화 -> 모듈의 대표 지정
module.exports = app;
