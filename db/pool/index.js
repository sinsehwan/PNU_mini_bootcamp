/**
 * #TODO MariaDB 풀링 모듈
 *  - 환경변수값을 읽어서(참조해서) DB연동값 세팅(외부에서 관리)
 */

const mariadb = require('mariadb');
// 개별 모듈화
exports.pool = mariadb.createPool({
    host            : 'localhost',
    port            : 3306,
    database        : 't1', //'test'
    user            : 'root', 
    password        : '[password]',
    // 서비스가 구동되고 최초 요청 혹은 요청이 5개 이상 동시에 진행될 때 -> 풀로 채워짐
    connectionLimit : 5 //동시접속자수. 필요시 수치 증가
});