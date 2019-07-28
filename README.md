# Calendar Server

17년 1,2학기 캡스톤 디자인 프로젝트에 사용된 캘린더 API 서버입니다.  

1학기는 안드로이드 앱과 연동한 프로젝트 였으나 코드가 유실되었고,  
2학기 프로젝트에 대한 정보는 [여기](https://github.com/Normaltic/calendar-project)에서 확인할 수 있습니다.

## 기술 스택
- node.js
- express
- babel
- MongoDB
- other libaraies ( jsonwebtoken, bcryptjs.. )
## Script
    npm start     // babel-node server.js
## API
Account를 제외한 나머지는 로그인시 발급되는 토큰이 필요

### Account
* 계정 등록
* 로그인 ( 토큰 발급 )
* 계정 확인

### Schedule 
* 일정 등록
* 일정 조회
* 일정 수정
* 일정 삭제

### Vote 
* 조율일정 등록
* 조율일정 수정
* 조율일정 삭제
* 조율일정 투표
* 조율일정 댓글 등록
* 조율일정=>공유일정
* 조율일정 리스트 조회

### Group 
* 그룹 개설
* 소속 그룹 조회
* 특정 그룹 일정 조회
* 그룹 정보 수정
* 그룹 해체

# Version

## 2.2
Group 수정 추가  
Group,Vote,Schedule Routes 오류 수정 및 개선  

## 2.1
Group Model,Route 추가  
Schedule getMonthSchedule에 개인, 공유, 그룹 한번에 조회 가능  

## 2.0
ES5 => ES6  
CallBack 패턴 => Promise패턴  
Route별 파일 분리 ( account , schedule , vote )  
JWT 미들웨어를 통한 토큰 인증 적용  
Bcrypt를 통한 패스워드 해싱  
분리된 commentWriter, commentContent를 comment { writer, comment } 로 통합.

## 1.0
ES5와 CallBack을 통한 코드 작성  
mongoose를 이용한 MongoDB 연동, 스키마 정의  
Express Route를 통한 API 작성
