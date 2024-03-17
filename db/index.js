/**
 * #TODO 로그인(DB연동) 최종버전(select 기본모형)
 *  - 
 */

const {pool} = require('./pool');

//exports.selectSignin=async funtion({uid, upw})
async function selectSignin({uid, upw}) {
  let conn;
  let rows;     // 결과
  let err = {}; // 에러

  try {
    
	conn = await pool.getConnection(); 

	rows = await conn.query(`
        select 
            no, uid, name, ragdate 
        from    
            users
        where
            uid=? and upw=?
        ;
    `, [uid, upw]);
    
	// rows: [ {val: 1}, meta: ... ]

	//const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
	// res: { affectedRows: 1, insertId: 1, warningStatus: 0 }
  } 
  catch (e)
  {
    console.log('sql 오류', e);
    err = e;
  } 
  finally {
	  if (conn) conn.release(); //release to pool
  }

  return { 
    err, 
    rows
  };
}


/*
// 사용법

// 함수 호출시 데이터를 객체에 담아서 1개 파라미터 형태로 전송
let res = selectSignin({
  uid:'guest',
  upw:'1234'
});

res
.then(({err, rows}) => {
  //에러체크 -> 처리?
  //if(err === {}){} //TODO 현재는 오류, 조건식 변경 요망
  if(rows.length == 0)
  {
    console.log("회원 아님 혹은 아이디/비번 오류 혹은 내부 오류");
  }
  //정상이면 결과 확인 및 다음단계
  console.log(rows);
})

/**
 * 이렇게 줄일 수 있다. 
selectSignin({
  uid:'guest',
  upw:'1234'
})
.then((data) => {
  console.log(data);
})
 */

// 게시판용 쿼리 수행 함수
// 목록 가져오기,
// 함수명 : selectCitys
// 인자 : 기준인구수(int), 페이지번호(int), 페이지당데이터 개수(int)
// 출력 : [{데이터, ..}, {}, ...]

//exports.selectCitys = async ({pop, pno, pcount})
//exports로 해버리면 여기에서 함수를 쓸 수 없다.
async function selectCitys({pop, pno, pcount}) {
  let conn;
  let rows;     // 결과
  let err = {}; // 에러

  try {
  
    //커넥션 빌리기
	conn = await pool.getConnection(); 

	rows = await conn.query(`
    SELECT
	    *
    FROM
      city2
    WHERE
      city2.Population >= ?
    ORDER BY Population DESC
    LIMIT ?, ?
    ;
  `,[pop, (pno - 1) * pcount, pcount]);
  } 
  catch (e)
  {
    console.log('sql 오류', e);
    err = e;
  } 
  finally {
	  if (conn) conn.release(); //release to pool
  }

  return { 
    err, 
    rows
  };
}
/*
selectCitys({
  pop : 1000000, 
  pno : 1, 
  pcount : 5})
.then(({err, rows}) => {
  console.log(rows)
})
*/

// 검색어(여기서는 국가코드)를 넣어서 해당 국가의 도시를 추출한다.
// 검색하면 => 도시명 + Id만 가져온다
async function selectCountryCode({countryCode}) {
  let conn;
  let rows;     // 결과
  let err = {}; // 에러

  try {
  
    //커넥션 빌리기
	conn = await pool.getConnection(); 

  // 별칭 부여하여 컬럼명 간결하게, 숨김 등등 목적
	rows = await conn.query(`
    SELECT
      ID as id, NAME as nm, Population as popu
    FROM
      city2
    WHERE
      city2.CountryCode = ?
    ORDER BY Population DESC 
    LIMIT 5
    ;
  `,[countryCode]);
  } 
  catch (e)
  {
    console.log('sql 오류', e);
    err = e;
  } 
  finally {
	  if (conn) conn.release(); //release to pool
  }

  return { 
    err, 
    rows
  };
}

// 함수명 selectCCode
// 인자 X
// {{code:'KOR'}, ...}
async function selectCCode() {
  let conn;
  let rows;     // 결과
  let err = {}; // 에러

  try {
  
    //커넥션 빌리기
	conn = await pool.getConnection(); 

  /*
    -- 특정컬럼 중복제거
    SELECT  
      distinct CountryCode as code
    FROM 
      city2; 
  */ 
	rows = await conn.query(`
    SELECT 
      CountryCode as code
    FROM 
      city2 
    GROUP BY 
      CountryCode
    ORDER BY Population desc
    ;
  `);
  } 
  catch (e)
  {
    console.log('sql 오류', e);
    err = e;
  } 
  finally {
	  if (conn) conn.release(); //release to pool
  }

  return { 
    err, 
    rows
  };
}

// 특정 id에 해당하는 도시 정보와 그 도시가 속한 국가 정보를 리턴
async function selectDetail({id}) {
  let conn;
  let rows;     // 결과
  let err = {}; // 에러

  try {
  
    //커넥션 빌리기
	conn = await pool.getConnection(); 

	rows = await conn.query(`
    SELECT
      A.ID, A.Name AS cityName, 
      A.CountryCode, B.Code, B.Name, B.Region, B.surfaceArea
    FROM 
      (SELECT * FROM city2 WHERE id=?) AS A
    JOIN 
      country2 AS B
    ON A.CountryCode=B.Code;
  `, [id]);
  } 
  catch (e)
  {
    console.log('sql 오류', e);
    err = e;
  } 
  finally {
	  if (conn) conn.release(); //release to pool
  }

  return { 
    err, 
    rows
  };
}

// 국가 정보 업데이트
// 코드의 구성은 (수정, 추가, 삭제) 모두 동일
// 쿼리수행 -> 커밋 (기본 루틴, DB에 실제적으로 적용하는 명령)
async function updateCountry({surfaceArea, Code})
{
  let conn;
  let result;     // 결과
  let err = {}; // 에러

  try {
  
    //커넥션 빌리기
	conn = await pool.getConnection(); 

	result = await conn.query(`
      UPDATE country2 
      SET SurfaceArea=?
      WHERE CODE=?
      ;
  `, [surfaceArea, Code]);
  // 수정, 삭제, 추가 수행을 했는데, 성공했다고 리턴
  commit_result = await conn.commit();
  console.log(commit_result);

  //const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
	// res: { affectedRows: 1, insertId: 1, warningStatus: 0 }
  } 
  catch (e)
  {
    console.log('sql 오류', e);
    err = e;
  } 
  finally {
	  if (conn) conn.release(); //release to pool
  }

  return { 
    err, 
    result
  };
}

module.exports = {
  selectSignin,// : selectSignin
  selectCitys,
  selectCountryCode,
  selectCCode,
  selectDetail,
  updateCountry
};
