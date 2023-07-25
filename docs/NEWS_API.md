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
```
{
keyword: [
  "것이다.",
  "얼마나",
  "피가",
  "교향악이다.",
  "아름다우냐?",
  "있는"
]
}
```

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
```
{
  result: [
    {
    _id: "64bf68f9ed351393c74f82b2",
    id: "1",
    image_url: "https://news.samsungdisplay.com/wp-content/uploads/2018/08/8.jpg",
    title: "Dummy article title 1",
    content: "인생에 놀이 것이다. 목숨이 용기가 그들의 풀이 역사를 일월과 맺어, 것이다. 사라지지 인간은 있는 하였으며, 힘차게 하는 그들을 아름다우냐?
    심장은 든 광야에서 할지라도 얼마나 들어 기쁘며, 하였으며, 사라지지 청춘 밝은 관현악이며, 뜨고, 이상의 것이다. 찬미를 더운지라 청춘 거친 없으면 주는 뿐이다. 그들은 그들의 황금시대다. 방황하였으며, 두손을 전인 할지니, 이상의 밝은 튼튼하며, 위하여 원대하고, 것이다.보라, 가진 그림자는 인간의 가는 사막이다.",
    category: "XAI",
    article_date: "2023-07-25T06:17:29.230Z",
    createdAt: "2023-07-25T06:17:29.231Z",
    updatedAt: "2023-07-25T06:17:29.231Z",
    __v: 0
    }
  ]
}
```

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
