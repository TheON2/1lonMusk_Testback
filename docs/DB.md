# API 스프링 변환 예제

## 테이블

Mongoose와 같은 NoSQL 데이터베이스를 사용하면 스키마에 유연성을 가질 수 있지만, 관계형 데이터베이스인 MySQL을 사용하려면 테이블을 더 엄격하게 정의해야 합니다. 

위의 Mongoose 스키마를 MySQL 테이블로 변환하면 다음과 같습니다:

```sql
CREATE TABLE Comment (
    id VARCHAR(255) NOT NULL,
    recipeId VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    writerEmail VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
```

주의해야 할 것은, MySQL에서는 자동으로 생성되는 timestamp는 `created_at`과 `updated_at` 두 개의 컬럼을 사용하여 처리할 수 있습니다. 

또한, NoSQL 데이터베이스는 대소문자를 구별하지 않는 반면, SQL은 대소문자를 구별합니다. 따라서 모든 컬럼 이름은 소문자로 작성하는 것이 좋습니다. 

마지막으로, 이 SQL 쿼리는 Comment 테이블을 생성하는데, 실제 환경에서는 recipeId 컬럼에 대한 외래 키 제약조건을 추가해주는 것이 좋습니다. 하지만 이는 당신의 데이터베이스 구조에 따라 달라질 수 있습니다.

---

Mongoose 스키마를 MySQL 테이블로 변환하면 다음과 같습니다:

```sql
CREATE TABLE Content (
    id VARCHAR(255) NOT NULL,
    recipeId VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
```

이 SQL 쿼리는 Content 테이블을 생성합니다. 아래 사항들을 유의해 주세요:

1. Mongoose 스키마에서는 `url` 필드가 required: false로 되어 있습니다. 이는 MySQL에서는 NULL 값을 허용하도록 TEXT 데이터 타입을 사용하여 표현했습니다.
2. SQL은 대소문자를 구별합니다. 따라서 모든 컬럼 이름은 소문자로 작성하는 것이 좋습니다.
3. MySQL에서는 자동으로 생성되는 timestamp는 `created_at`과 `updated_at` 두 개의 컬럼을 사용하여 처리할 수 있습니다.
4. 실제 환경에서는 recipeId 컬럼에 대한 외래 키 제약조건을 추가하는 것이 좋습니다. 하지만 이는 당신의 데이터베이스 구조에 따라 달라질 수 있습니다.

---
Mongoose 스키마를 MySQL 테이블로 변환하면 다음과 같습니다:

```sql
CREATE TABLE Recipe (
    id VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    ingredient TEXT,
    tip TEXT,
    url TEXT,
    writerEmail VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
```

이 SQL 쿼리는 Recipe 테이블을 생성합니다. 아래 사항들을 유의해 주세요:

1. Mongoose 스키마에서는 `ingredient`, `tip`, `url` 필드가 required: false로 되어 있습니다. 이는 MySQL에서는 NULL 값을 허용하도록 TEXT 데이터 타입을 사용하여 표현했습니다.
2. SQL은 대소문자를 구별합니다. 따라서 모든 컬럼 이름은 소문자로 작성하는 것이 좋습니다.
3. MySQL에서는 자동으로 생성되는 timestamp는 `created_at`과 `updated_at` 두 개의 컬럼을 사용하여 처리할 수 있습니다.

---
Mongoose 스키마를 MySQL 테이블로 변환하면 다음과 같습니다:

```sql
CREATE TABLE User (
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    nickName VARCHAR(255) NOT NULL,
    method VARCHAR(255) NOT NULL,
    profileUrl TEXT,
    profileContent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (email)
);
```

이 SQL 쿼리는 User 테이블을 생성합니다. 아래 사항들을 유의해 주세요:

1. Mongoose 스키마에서는 `profileUrl`와 `profileContent` 필드가 required: false로 되어 있습니다. 이는 MySQL에서는 NULL 값을 허용하도록 TEXT 데이터 타입을 사용하여 표현했습니다.
2. SQL은 대소문자를 구별합니다. 따라서 모든 컬럼 이름은 소문자로 작성하는 것이 좋습니다.
3. MySQL에서는 자동으로 생성되는 timestamp는 `created_at`과 `updated_at` 두 개의 컬럼을 사용하여 처리할 수 있습니다.
4. 이메일이 기본키(primary key)로 설정되어 있습니다. 이는 각 사용자가 고유한 이메일을 가지고 있어야 한다는 의미입니다.
