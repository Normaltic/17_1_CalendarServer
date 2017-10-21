# 17_CalendarProject
Calendar Project for Capstone design <br />
17년 상반기 캡스톤 디자인 관련 MongoDB 연동 express API 서버.<br />

JWT 인증 적용, Bcrypt 해싱 적용

## Script
    npm start     // babel-node server.js
## API

### Account
* 계정 등록
* 로그인 ( 토큰 발급 )
* 계정 확인

### Schedule ( 토큰 필요)
* 일정 등록(or 공유)
* 일정 수정
* 일정 삭제
* (공유)일정 조회

### Vote ( 토큰 필요)
* 조율일정 등록
* 조율일정 수정
* 조율일정 삭제
* 조율일정 투표
* 조율일정 댓글 등록
* 조율일정=>공유일정
* 조율일정 리스트 조회

### Group ( 토큰 필요)
* 그룹 개설
* 특정 그룹 일정 조회
* 그룹 해체
* 그룹 조회 (Not used)


# Version

## 2.1
Group Model 추가<br />
Group Routes 추가<br />
Schedule getMonthSchedule에 개인, 공유, 그룹 한번에 조회 가능<br />



## 2.0
ES5 => ES6<br />
CallBack 패턴 => Promise패턴<br />
Route별 파일 분할 ( account , schedule , vote )<br />
JWT 미들웨어를 통한 토큰 인증 적용<br />
Bcrypt를 통한 패스워드 해싱<br />

<small>
Vote Schema 조정중 <br />
분리된 commentWriter, commentContent를 comment { writer, comment } 로 통합.
</small>

## 1.0
ES5와 CallBack을 통한 코드 작성 <br />
mongoose를 이용한 MongoDB 연동, 스키마 정의 <br />
Express Route를 통한 API 작성
