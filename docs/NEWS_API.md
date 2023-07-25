# News Api

네, 알겠습니다. 더 자세한 API 문서를 작성하겠습니다.

# API 문서

## 1. GET /api/search

제공된 검색 쿼리에 기반하여 기사를 검색합니다.

**요청 파라미터**
- q (문자열): 검색 쿼리.
- page (정수): 페이지 번호 (페이지네이션을 위함).

**응답**
- 검색에 일치하는 기사의 리스트, 전체 페이지 수, 그리고 전체 기사 수를 포함하는 JSON 객체를 반환합니다. 각 기사는 제목, 내용, 이미지 URL, 카테고리, 게시일 등의 정보를 포함합니다.
```
  {  content:[
    {article_date: "2023-07-25T06:14:41.916Z",
    category: "tesla",content: "기관과 대한 무엇을 수 그들에게 교향악이다. 거선의 인간의 얼음 위하여서 인생의 봄바람이다.",
    createdAt: "2023-07-25T06:14:41.921Z",
    id: "1",
    image_url: "https://news.samsungdisplay.com/wp-content/uploads/2018/08/8.jpg",
    title: "Dummy article title 1",
    updatedAt: "2023-07-25T06:14:41.921Z"},],

     totalElements:총 검색개수
     totalPages:총페이지수 }
```
  
## 2. GET /api/keyword

최근 20개의 기사에서 상위 키워드를 가져옵니다.

**응답**
- 상위 키워드의 리스트를 포함하는 JSON 객체를 반환합니다. 리스트는 가장 자주 등장하는 단어 순서로 정렬됩니다.

## 3. GET /api/main

기사를 페이지네이션하여 보여줍니다.

**요청 파라미터**
- page (정수): 페이지 번호.

**응답**
- 지정된 페이지의 기사 리스트, 전체 페이지 수, 그리고 전체 기사 수를 포함하는 JSON 객체를 반환합니다. 각 기사는 제목, 내용, 이미지 URL, 카테고리, 게시일 등의 정보를 포함합니다.

```
  {  content:[
    {article_date: "2023-07-25T06:14:41.916Z",
    category: "tesla",content: "기관과 대한 무엇을 수 그들에게 교향악이다. 거선의 인간의 얼음 위하여서 인생의 봄바람이다.",
    createdAt: "2023-07-25T06:14:41.921Z",
    id: "1",
    image_url: "https://news.samsungdisplay.com/wp-content/uploads/2018/08/8.jpg",
    title: "Dummy article title 1",
    updatedAt: "2023-07-25T06:14:41.921Z"},],

     totalElements:총 검색개수
     totalPages:총페이지수 }
```

## 4. GET /api/main/:id

특정 아이디의 기사를 가져옵니다.

**요청 파라미터**
- id (정수): 기사 아이디.

**응답**
- 요청된 아이디의 기사 정보를 포함하는 JSON 객체를 반환합니다. 기사는 제목, 내용, 이미지 URL, 카테고리, 게시일 등의 정보를 포함합니다.

## 5. GET /api/tag

특정 카테고리에 대한 기사를 페이지네이션하여 보여줍니다.

**요청 파라미터**
- category (문자열): 카테고리.
- page (정수): 페이지 번호.

**응답**
- 지정된 카테고리 및 페이지의 기사 리스트, 전체 페이지 수, 그리고 해당 카테고리의 전체 기사 수를 포함하는 JSON 객체를 반환합니다.

```
  {  content:[
    {article_date: "2023-07-25T06:14:41.916Z",
    category: "tesla",content: "기관과 대한 무엇을 수 그들에게 교향악이다. 거선의 인간의 얼음 위하여서 인생의 봄바람이다.",
    createdAt: "2023-07-25T06:14:41.921Z",
    id: "1",
    image_url: "https://news.samsungdisplay.com/wp-content/uploads/2018/08/8.jpg",
    title: "Dummy article title 1",
    updatedAt: "2023-07-25T06:14:41.921Z"},],

     totalElements:총 검색개수
     totalPages:총페이지수 }
```

## 6. GET /api/likes

사용자가 좋아요를 누른 기사를 페이지네이션하여 보여줍니다.

**요청 파라미터**
- page (정수): 페이지 번호.

**응답**
- 사용자가 좋아요를 누른 기사의 리스트, 전체 페이지 수, 그리고 사용자가 좋아요를 누른 전체 기사 수를 포함하는 JSON 객체를 반환합니다.
```
  {  content:[
    {article_date: "2023-07-25T06:14:41.916Z",
    category: "tesla",content: "기관과 대한 무엇을 수 그들에게 교향악이다. 거선의 인간의 얼음 위하여서 인생의 봄바람이다.",
    createdAt: "2023-07-25T06:14:41.921Z",
    id: "1",
    image_url: "https://news.samsungdisplay.com/wp-content/uploads/2018/08/8.jpg",
    title: "Dummy article title 1",
    updatedAt: "2023-07-25T06:14:41.921Z"},],

     totalElements:총 검색개수
     totalPages:총페이지수 }
```

## 7. GET /api/reads

사용자가 읽은 기사를 페이지네이션하여 보여줍니다.

**요청 파라미터**
- page (정수): 페이지 번호.

**응답**
- 사용자가 읽은 기사의 리스트, 전체 페이지 수, 그리고 사용자가 읽은 전체 기사 수를 포함하는 JSON 객체를 반환합니다.
```
  {  content:[
    {article_date: "2023-07-25T06:14:41.916Z",
    category: "tesla",content: "기관과 대한 무엇을 수 그들에게 교향악이다. 거선의 인간의 얼음 위하여서 인생의 봄바람이다.",
    createdAt: "2023-07-25T06:14:41.921Z",
    id: "1",
    image_url: "https://news.samsungdisplay.com/wp-content/uploads/2018/08/8.jpg",
    title: "Dummy article title 1",
    updatedAt: "2023-07-25T06:14:41.921Z"},],

     totalElements:총 검색개수
     totalPages:총페이지수 }
```
