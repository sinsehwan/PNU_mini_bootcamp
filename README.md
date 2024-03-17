# 개요
    - 순수 node.js로 백엔트를 구성하는 것은 많은 시간 소요
    - 일일이 만들어줄 기능이 많다.
    - 결론
        - 서드 파티 프레임웍을 이용해 개발
        - expressjs사용
            - 오래되었음
            - 사용자 많음
            - 개발된 사이트 많다
            - 참고 자료가 많다
            - https://expressjs.com
        - vs nextjs, ...

# 서드 파티 모듈 검색
    - https://www.npmjs.com/
    - 특정 기능을 사용하기 위해 특정 모듈을 찾아서 사용 가능

# 패키지 관리자
    - 서드 파트 모듈(node자체에 내장돼있는 것 제외한 나머지 애들) 검색, 설치, 유명도, 관리
    - 설치하는 명령어
        - npm (파이썬의 pip or conda, 리눅스의 apt등)
        - yarn (npm의 보안 이슈를 해결한 패키지 관리자)

# node 프로젝트 생성
    - 기본 가이드
        - mkdir svr1
        - npm init
            - package.json 생성됨
            - 생성시 내용 입력 가능, 생성 후 수정 가능
            - package.json은 이 프로젝트를 설명하는 메타 정보
                - 타인 코드 참고시 1순위 확인 파일
                - 텍스트 파일이므로 수정 가능
                - json형식
                - 엔트리포인트, 앱의 이름, 버전, 사용 패키지, 명령어 나열되어 있음
        - 필요한 패키지 기술 (필요시 언제든지 추가)
            - 버전 명시한 패키지명
            - "dependencies" or "devdependencies" 등 항목 추가
                - dependencies : 서비스 개발에 사용하는 패키지
                - devdependencies : 개발에 사용하는 패키지, 도구, 유틸, 실제 서비스에는 사용 X
                    - node.js에서 exnext(2016~) 기능중 미지원하는 부분 서포트 패키지
                        - ex) import ~ from ~
            - npm 명령어를 통해서 추가 가능 -> 차후 확인
        - npm install (필요시 언제든지 추가)
            - 맥 : sudo npm install
            - 기본적으로 설치해야할 모듈이 설치(서드파트, 해당 프로젝트만 해당)
            - 이 명령어 실행 결과로 나온 내용
                - node_modules
                    - 이하 모듈 설치
                - 이 부분은 git에 업로드 X => .gitignore 파일에 기술
        - 코드 작성
            - 엔트리포인트부터 작성 (node, 파이썬 같은애들은 엔트리부터 만듦)
                - index.js 등등
        - npm start

    - yarn으로 프로젝트 구성
        - 사전 작업 (1회성)
            - npm을 이용하여 글로벌(vs 로컬, 프로젝트에만)로 설치
            - pw에서 권한이슈 생기면 오류 관리자 모드로 들어가서 고치면 된다.
            - npm install yarn -g <-global 옵션임
            - npm i yarn
        - mkdir svr2
        - cd svr2
        - yarn init
        - 필요한 패키지 기술 (필요시 언제든지 추가)
        - yarn install (필요시 언제든지 추가)
        - 코드작성
        - yarn start
            - Scripts 항목에 명령어 추가 필요

    - 문제점
        - 제로베이스에서 백엔드 프로젝트 기반 만드는 건 시간/검증 둘다 부족.
        - 제안
            - 일종의 특정 플랫폼 기반 제너레이터 사용
                - express-generator 사용
            - git 기반으로 공개된 보일러플레이트를 사용

# express 개발 환경 구축
    - 설치
        - yarn
            - 최신버전으로 설치
                - yarn global add express express-generator
            - 특정버전 설치
                - yarn global add express@x.x.x express-generator@x.x.x
        - npm
            - 최신버전으로 설치
                - npm install -g express express-generator
            - 특정버전 설치
                - npm install -g express@x.x.x express-generator@x.x.x

    - 프로젝트 생성
        - express --help
            - 명령 옵션 체크
        - mkdir helloExpress
        - cd helloExpress
        - express 기반 웹서비스 프로젝트 프레임웍 구성 + 템플릿엔진은 ejs 사용
            - express -e
        - yarn install or npm install // 보조 도구들이 깔림(node_modules)
        - npm start

    - 프로젝트 구조 이해
        - tree >> 구조.txt

    - 개발 동선 개선
        - 코드 수정 -> 자동 리로드 -> 새로고침 -> 변경내용 확인
        - nodemon or forever, ...
        - yarn global add nodemon or npm install nodemon -g
        - package.json
            - Scripts > start 항목 값 수정
            - nodemon ./bin/www


# 데이터베이스 연동
    - 데이터
        - 구조와 형식
            - 정형 => RDS / 스키마
            - 비정형 => no sql / 바이너리, 로그, ..문서
            - 반정형 => 구조 + 데이터 결합 => JSON, XML, ...
        - 데이터 내용
            - 정량 데이터
            - 정성 데이터

    - npmjs.com에서 해당 db제품명 검색 -> 지원 패키지 검색됨
        - 전용(ORM, sql 지원, 속도 유리), 범용(ORM 스타일로 지원 => 쿼리문을 직접 안써도 됨 => 느리지만 유지보수는 유리함)
    - RDS(행 기반 데이터베이스) -> ERD 구성, 모델링 -> sql 구성
        - 관계형 데이터베이스
        - Oracle (java쪽인듯)
        - mysql, **mariadb**, 오로라(AWS) (보편적으로 쓰는 라인업)
        - mssql (c#)
        - postgress
        - ...
    - No-SQL
        - Key-Value
            - **Redis**, AWS Dynamic DB
        - Document
            - **MongoDB** <- JSON을 통으로 때려넣는게 이거임>
        - Column-Familly
            - Cassandra, HBase
        - Graph
            - sns(계열)
    - 하둡(HDFS) <-빅데이터 상징>
        - 대용량 비정형 데이터 저장
    - 검색기반 데이터 스토어
        - 엘라스틱 서치
        - 스플렁크
    - 열기반 데이터베이스
        - 아마존 레드시프트, 스노우프레이크, 버티카, ...

# mariadb 설치
    - https://mariadb.com/kb/en/postdownload/
    - 설치 중 주의사항
        - root 계정 비번 따로 체크
        - 원격 접속 체크
        - UTF-8 기본 인코딩 체크
    -접속
        - 터미널
            - 비밀번호 입력
            - show databases;
            - create database test;
            - show databases;
                ```
                    +--------------------+
                    | Database           |
                    +--------------------+
                    | information_schema |
                    | mysql              |
                    | performance_schema |
                    | sys                |
                    | test               |
                    +--------------------+
                    5 rows in set (0.001 sec)    
                ```
            - use test;
            - MariaDB [test] > 쿼리작업 진행
            ```
                CREATE TABLE `users` (
                    `no` INT NOT NULL AUTO_INCREMENT,
                    `uid` VARCHAR(32) NOT NULL,
                    `upw` VARCHAR(128) NOT NULL,
                    `name` VARCHAR(32) NOT NULL,
                    `ragdate` TIMESTAMP NOT NULL DEFAULT NOW([precision]) ON UPDATE NOW([precision])
                )
                COMMENT='회원 테이블'
                COLLATE='utf8mb4_general_ci'
                ;
                /* SQL 오류 (1064): You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near '[precision]) ON UPDATE NOW([precision])
                )
                COMMENT='회원 테이블'
                COLLA...' at line 6 */
            ```

            # 회원가입

            INSERT INTO `test`.`users` (`no`, `uid`, `upw`, `name`, `ragdate`) VALUES (1, 'guest', '1234', '게스트', '2024-01-24 16:34:18');

            # 로그인
            select 
                `no`, `uid`, `name`, `ragdate` 
            from    
                users
            where
                uid='guest' and upw='1234'
            ;

            # 회원 탈퇴

            # 회원 정보 수정

        - GUI 클라이언트 툴 사용
            - db설치 + 클라이언트툴 같이 세팅됨
            - IDE에 확장 프로그램으로 설치

# nodejs에서 mariadb access 방법
    - sql 직접 사용
        - mariadb 패키지 사용
        - npm install mariadb --save
            - --save : 패키지 이름, 버전을 package.json > dependencies 항목에 추가, 패키지 설치
            - --save-dev : 개발시에만 사용하는 dev-dependencies에 항목 추가, 패키지 설치
    - orm 사용
        - sequelize 패키지 사용

# 프런트 사이드 JS
    - 브라우저에서 작동
        - 해당 브라우저가 특정기능을 지원하는 여부
        - 가장 안전한 것은 순수 JS로 작성, 대부분 기능을 지원하는 프레임웍 사용
    - jQuery 프레임웍 사용
        - jQuery.com
        - cdn
            - <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
            - <head> 태그 내에 삽입
    - 순수 JS로 구현
    - 프런트사이드에서 JS 구현 코드 위치
        - <head> 요소 내부에 기술
            - 이벤트를 구현해서 (윈도우가 모두 로드되었다 등) 그 상황에서 나머지 코드가 진행되게 구현
        - </body> 바로 직전(위)에서 기술
            - 엑세스하는 모든 요소(DOM tree)가 메모리에 적제된 다음 위치
        - 간혹 급하게 구성
            - 엑세스 하는 요소 바로 밑에서 구현

# 로그인 연동
    - 세션
        - 클라이언트의 정보를 서버측에 저장
            - 서버측 메모리(express-session), 서버측 DB(redis, ...), 쿠키(JWT활용)를 연동 등등, passport등 모듈
    - 쿠키
        - 클라이언트 브라우저에 저장
            - 보안에 취약한 측면이 존재, 만료 시간, 응답시 쿠키를 세팅해서 전송
    - 로그인 UI + 세션처리
        - express-session 설치 사용
            - npm install --save express-session
        - UI 적용
    - Rule
        - 로그인해서 서버측에(혹은 JWT, passport등) 인증이 되지 않은 유저는 무조건 로그인 페이지로 redirect
        - 로그인 성공
            -> 세션 성공(JWT 생성 등등)
            -> 홈페이지(특정 페이지에서 세션만료된 경우 -> 이상없으면 원래 머물렀던 페이지로 이동)로 redirect

# 세션 유지
    - 서버 재가동시에 세션이 유지되게 처리
        - 개발시에만 적용
        - 세션을 서버 메모리가 아닌 파일에 저장
            - npm i session-file-store --save
