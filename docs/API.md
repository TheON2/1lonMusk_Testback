# Dev && Recipe 테스트용 목업서버

# API 문서

## 엔드포인트

# /api/recipe

### `GET /api/recipe`
모든 레시피를 가져옵니다.

**응답**

- 성공 시 `200 OK`

```json
[
  {
    "id": String,
    "subtitle": String,
    "category": String,
    "title": String,
    "ingredient": String,
    "tip": String,
    "url": String,
    "writerEmail": String
  }
]
```
---

### `GET /api/recipe/:recipeId`
주어진 레시피 id에 해당하는 레시피를 가져옵니다.

**매개변수**

- `recipeId`: 레시피의 ID

**응답**

- 성공 시 `200 OK`
- 주어진 id에 해당하는 레시피가 없을 경우 `404 Not Found`

```json
{
  "id": String,
  "subtitle": String,
  "category": String,
  "title": String,
  "ingredient": String,
  "tip": String,
  "url": String,
  "writerEmail": String
}
```
---

### `POST /api/recipe`
새로운 레시피를 생성합니다.

**매개변수**

- `image`: 레시피의 이미지
- `id`: 레시피의 ID
- `subtitle`: 레시피의 부제목
- `category`: 레시피의 카테고리
- `title`: 레시피의 제목
- `ingredients`: 레시피의 재료
- `tip`: 레시피의 팁
- `url`: 레시피의 URL
- `writerEmail`: 작성자의 이메일

**응답**

- 성공 시 `200 OK`
- 레시피 생성 중 문제 발생 시 `500 Internal Server Error`

---

### `PUT /api/recipe/:id`
기존 레시피를 업데이트합니다.

**매개변수**

- `id`: 레시피의 ID
- `image`: 레시피의 이미지
- `subtitle`: 레시피의 부제목
- `category`: 레시피의 카테고리
- `title`: 레시피의 제목
- `ingredients`: 레시피의 재료
- `tip`: 레시피의 팁
- `url`: 레시피의 URL
- `writerEmail`: 작성자의 이메일

**응답**

- 성공 시 `200 OK`와 함께 업데이트된 레시피 정보 반환
- 레시피 업데이트 중 문제 발생 시 `500 Internal Server Error`

---

### `DELETE /api/recipe/:recipeId`
주어진 레시피 ID에 해당하는 레시피를 삭제합니다.

**매개변수**

- `recipeId`: 삭제할 레시피의 ID

**응답**

- 성공 시 `200 OK`와 함께 삭제 성공 메시지 반환
- 레시피를 찾지 못했을 경우 `404 Not Found`
- 레시피 삭제 중 문제 발생 시 `500 Internal Server Error`

---

### `GET /api/recipe/comments/:recipeId`
특정 레시피에 대한 모든 댓글을 가져옵니다.

**매개변수**

- `recipeId`: 댓글을 조회할 레시피의 ID

**응답**

- 성공 시 `200 OK`
- 댓글 조회 중 문제 발생 시 `500 Internal Server Error`

---

### `POST /api/recipe/comment`
새로운 댓글을 생성합니다.

**매개변수**

- `image`: 댓글의 이미지
- `commentId`: 댓글의 ID
- `recipeId`: 댓글이 작성될 레시피의 ID
- `comment`: 댓글 내용
- `writerEmail`: 댓글 작성자의 이메일

**응답**

- 성공 시 `201 Created`
- 댓글 생성 중 문제 발생 시 `400 Bad Request`
---
### `DELETE /api/recipe/comment/:commentId`
특정 댓글을 삭제합니다.

**매개변수**

- `commentId`: 삭제할 댓글의 ID

**응답**

- 성공 시 `200 OK`
- 댓글 삭제 중 문제 발생 시 `500 Internal Server Error`
---
### `GET /api/recipe/contents/:recipeId`
특정 레시피의 모든 컨텐츠를 가져옵니다.

**매개변수**

- `recipeId`: 컨텐츠를 조회할 레시피의 ID

**응답**

- 성공 시 `200 OK`
- 컨텐츠 조회 중 문제 발생 시 `500 Internal Server Error`
---

# /api/user


### 1. GET '/api/user'

**기능**: 모든 사용자 정보를 반환합니다.

**인증**: 필요합니다

**요청 헤더**:
- Authorization: Bearer {token}

**응답**:
- 200 OK: 요청이 성공하면 JSON 형태의 사용자 목록을 반환합니다.

---

### 2. GET '/api/token'

**기능**: 사용자의 토큰을 검증하고 사용자 정보를 반환합니다.

**인증**: 필요합니다

**요청 헤더**:
- Authorization: Bearer {token}

**응답**:
- 200 OK: 토큰 검증이 성공하면 JSON 형태의 사용자 정보를 반환합니다.
- 404 Not Found: 사용자를 찾을 수 없을 때 반환됩니다.
- 500 Internal Server Error: 서버 오류가 발생했을 때 반환됩니다.

---

### 3. GET '/refreshToken'

**기능**: 사용자의 리프레시 토큰을 검증하고 새로운 액세스 토큰을 반환합니다.

**인증**: 필요합니다

**요청 헤더**:
- Authorization: Bearer {token}

**응답**:
- 200 OK: 리프레시 토큰 검증이 성공하면 JSON 형태의 액세스 토큰을 반환합니다.
- 500 Internal Server Error: 서버 오류가 발생했을 때 반환됩니다.

---

### 4. GET '/api/user/:email'

**기능**: 특정 사용자 정보를 반환합니다. 이메일 주소로 사용자를 검색합니다.

**인증**: 필요합니다

**요청 헤더**:
- Authorization: Bearer {token}

**요청 매개변수**:
- email: 조회할 사용자의 이메일 주소

**응답**:
- 200 OK: 요청이 성공하면 JSON 형태의 사용자 정보를 반환합니다.
- 404 Not Found: 사용자를 찾을 수 없을 때 반환됩니다.
- 500 Internal Server Error: 서버 오류가 발생했을 때 반환됩니다.

---

### 5. POST '/api/user'

**기능**: 새로운 사용자를 생성합니다.

**인증**: 필요하지 않습니다

**요청 본문**:
- email: 사용자의 이메일 주소
- nickName: 사용자의 닉네임
- password: 사용자의 비밀번호

**응답**:
- 200 OK: 요청이 성공하면 JSON 형태의 사용자 정보를 반환합니다.
- 403 Forbidden: 이미 사용중인 이메일을 사용하려고 할 때 반환됩니다.
- 500 Internal Server Error: 서버 오류가 발생했을 때 반환됩니다.

---

### 6. POST "/api/user/login"

**기능**: 사용자 로그인을 처리합니다.

**인증**: 필요하지 않습니다

**요청 본문**:
- email: 사용자의 이메일 주소
- password: 사용자의 비밀번호

**응답**:
- 200 OK: 로그인이 성공하면 JSON 형태의 사용자 정보와 토큰을 반환합니다.
- 401 Unauthorized: 로그인에 실패했을 때 반환됩니다.

---

### 7. POST "/api/user/logout"

**기능**: 사용자 로그아웃을 처리합니다.

**인증**: 필요하지 않습니다

**응답**:
- 200 OK: 로그아웃이 성공적으로 처리되었을 때 반환됩니다.

---

### 9. PATCH '/api/user/:email/nickName'

**기능**: 특정 사용자의 닉네임을 업데이트합니다.

**인증**: 필요합니다

**요청 헤더**:
- Authorization: Bearer {token}

**요청 매개변수**:
- email: 업데이트할 사용자의 이메일 주소

**요청 본문**:
- nickName: 업데이트할 닉네임

**응답**:
- 200 OK: 요청이 성공하면 JSON 형태의 업데이트된 사용자 정보를 반환합니다.
- 404 Not Found: 사용자를 찾을 수 없을 때 반환됩니다.
- 500 Internal Server Error: 서버 오류가 발생했을 때 반환됩니다.

---

### 10. DELETE '/api/user/:email'

**기능**: 특정 사용자를 삭제합니다.

**인증**: 필요합니다

**요청 헤더**:
- Authorization: Bearer {token}

**요청 매개변수**:
- email: 삭제할 사용자의 이메일 주소

**응답**:
- 200 OK: 요청이 성공하면 삭제된 사용자에 대한 메시지를 반환합니다.
- 404 Not Found: 사용자를 찾을 수 없을 때 반환됩니다.
- 500 Internal Server Error: 서버 오류가 발생했을 때 반환됩니다.

알겠습니다, 한글로 API 문서를 작성해 보겠습니다.

### 레시피의 댓글 가져오기

**엔드포인트:** `/api/recipe/comments/:recipeId`

**메서드:** `GET`

**URL 파라미터:**
- `recipeId`: 댓글을 가져올 레시피의 고유 아이디

**성공 시 응답:**
- `200 OK` 상태 코드와 함께 해당 레시피의 댓글들이 JSON 형태로 반환됩니다.

**실패 시 응답:**
- `500 Internal Server Error` 상태 코드와 에러 메시지를 반환

### 댓글 작성하기

**엔드포인트:** `/api/recipe/comment`

**메서드:** `POST`

**요청 본문:**
- `comment.commentId`: 생성할 댓글의 고유 아이디
- `comment.recipeId`: 레시피의 고유 아이디
- `comment.comment`: 댓글의 내용
- `comment.writerEmail`: 작성자의 이메일

**성공 시 응답:**
- `201 Created` 상태 코드와 함께 작성된 댓글 정보가 JSON 형태로 반환됩니다.

**실패 시 응답:**
- `400 Bad Request` 상태 코드와 에러 메시지를 반환

### 댓글 삭제하기

**엔드포인트:** `/api/recipe/comment/:commentId`

**메서드:** `DELETE`

**URL 파라미터:**
- `commentId`: 삭제할 댓글의 고유 아이디

**성공 시 응답:**
- `200 OK` 상태 코드와 삭제된 댓글의 정보를 JSON 형태로 반환합니다.

**실패 시 응답:**
- `500 Internal Server Error` 상태 코드와 에러 메시지를 반환

네, 이 API에 대한 한글로 된 문서를 작성해보겠습니다.

### 레시피 좋아요 등록/삭제하기

**엔드포인트:** `/api/recipe/like`

**메서드:** `POST`

**요청 본문:**
- `recipe_id`: 좋아요를 등록하거나 취소할 레시피의 고유 아이디

**성공 시 응답:**
- `201 Created` 상태 코드와 함께 좋아요가 등록된 레시피의 정보를 JSON 형태로 반환합니다.
- 이미 좋아요가 등록된 경우, 좋아요를 취소하고 "Like removed" 메시지를 반환합니다.

**실패 시 응답:**
- `400 Bad Request` 상태 코드와 에러 메시지를 반환
- `500 Internal Server Error` 상태 코드와 에러 메시지를 반환

**인증:**
- 이 API는 사용자의 JWT를 쿠키에서 확인합니다. 만약 쿠키에 유효한 JWT가 없는 경우, 요청은 실패하게 됩니다.

**참고 사항:**
- 좋아요 등록 API는 idempotent하지 않습니다. 같은 레시피에 대해 여러 번 요청을 보낼 경우, 처음에는 좋아요를 등록하고 그 다음 요청부터는 좋아요를 취소합니다. 이를 통해 같은 API를 사용하여 좋아요 등록 및 취소 기능을 모두 제공합니다.
