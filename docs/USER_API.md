# 목업서버 스프링 변환 예제

```java
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        User user = userService.getUserByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        user.setPassword(null); // Password should not be returned
        return ResponseEntity.ok(user);
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        if (userService.isUserExist(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(userService.createUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User user) {
        User loggedInUser = userService.login(user);
        if (loggedInUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(loggedInUser);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        // Logout logic here...
        return ResponseEntity.ok("Logged out successfully.");
    }

    @PatchMapping("/{email}/nickName")
    public ResponseEntity<User> updateNickname(@PathVariable String email, @RequestBody User user) {
        User updatedUser = userService.updateNickname(email, user.getNickName());
        if (updatedUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{email}")
    public ResponseEntity<String> deleteUser(@PathVariable String email) {
        boolean isDeleted = userService.deleteUser(email);
        if (!isDeleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok("User successfully deleted");
    }
}
```

이 코드는 Spring에서 `RestController`로 사용자 관련 요청을 처리하는 `UserController` 클래스를 정의합니다. `UserService`는 사용자 관련 로직을 수행하는 서비스 클래스를 참조합니다. 이 서비스 클래스는 아직 정의되지 않았으며, 필요에 따라 구현해야 합니다. 또한, JSON Web Token(JWT)를 처리하는 로직 및 인증 관련 로직은 별도의 Spring Security 설정이 필요합니다. 

비밀번호 암호화를 위한 bcrypt와 같은 라이브러리 사용, 실제 DB와의 연결 등 추가적인 구현이 필요합니다. 그리고 에러 처리에 대한 세부적인 부분도 보완해야 합니다. 위 코드는 기본적인 구조를 제공하며, 실제 서비스에서 사용하기 위해서는 적절한 수정과 보완이 필요합니다.

코드를 완전히 작성하는 것은 상당히 큰 작업이며, 여러 부분을 포함하고 있어서 이를 모두 한 번에 작성하는 것은 어려울 수 있습니다. 그러나 이에 대한 기본적인 지침과 예제 코드는 제공할 수 있습니다.

1. `UserService`: 이 서비스는 사용자 관련 로직을 처리합니다. 이 코드는 `UserRepository`를 주입 받아야하며 `UserRepository`는 Spring Data JPA의 인터페이스입니다.

```java
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    // Implement your service methods like createUser, getUserByEmail, isUserExist, etc.
}
```

2. `UserRepository`: UserRepository는 Spring Data JPA를 사용하여 User 엔티티에 대한 CRUD 작업을 수행하는 인터페이스입니다.

```java
public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    boolean existsByEmail(String email);
    
    // Define other necessary methods
}
```

3. `User`: User는 사용자를 나타내는 JPA 엔티티 클래스입니다.

```java
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    // Define other necessary fields and methods
}
```

4. 인증 및 보안: Spring Security를 사용하여 JWT 기반의 인증 및 보안을 구현할 수 있습니다. 이는 설정 클래스, 필터, 유틸리티 클래스 등을 포함하는 별도의 구성이 필요합니다.

5. 암호화: Spring에서는 `BCryptPasswordEncoder`를 사용하여 비밀번호를 암호화 할 수 있습니다. 이는 UserService에서 비밀번호를 해싱하는 데 사용할 수 있습니다.

```java
BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
String hashedPassword = passwordEncoder.encode(rawPassword);
```

위에 제공된 코드는 각 부분의 기본적인 틀을 제공합니다. 실제 사용을 위해서는 적절히 구현 및 확장하셔야 합니다. 각각의 기능을 구현하는 것은 복잡하고 광범위한 작업이므로, 이를 단계별로 나누어서 처리하는 것이 좋습니다.

더 구체적으로 작성하려면 모든 요소를 다루는 데 필요한 상당한 양의 코드가 필요합니다. 여기서는 기본적인 로그인 및 사용자 조회 로직의 Spring Boot 버전을 제공합니다.

1. `UserController`: 사용자 관련 HTTP 요청을 처리합니다.

```java
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtProvider jwtProvider;

    @GetMapping("/")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> loginUser(@RequestBody UserLogin userLogin) {
        User user = userService.validateUser(userLogin);
        String token = jwtProvider.createToken(user.getEmail());
        UserResponse userResponse = new UserResponse(user, token);
        return ResponseEntity.ok(userResponse);
    }

    // Implement other endpoints
}
```

2. `JwtProvider`: JWT 토큰을 생성하고 검증하는 클래스입니다.

```java
@Service
public class JwtProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    public String createToken(String subject) {
        return Jwts.builder()
                .setSubject(subject)
                .setExpiration(new Date(System.currentTimeMillis() + 3600000)) // 1 hour
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    public String getSubjectFromToken(String token) {
        return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject();
    }

    // Implement other necessary methods
}
```

3. `UserResponse`: HTTP 응답에 필요한 사용자 데이터와 JWT 토큰을 포함하는 클래스입니다.

```java
public class UserResponse {

    private User user;
    private String token;

    // Implement necessary methods (getters, setters, constructors, etc.)
}
```

이것은 간단한 로그인 및 사용자 조회 로직의 Spring Boot 버전입니다. 나머지 기능 (회원 가입, 로그아웃, 패스워드 변경 등) 또한 비슷한 방식으로 구현할 수 있습니다. 각 엔드포인트는 해당 HTTP 메소드와 일치하는 메소드로 `UserController`에 추가됩니다. 각각의 메소드는 `UserService`를 통해 필요한 비즈니스 로직을 처리합니다.

그러나 이 코드는 간략화되어 있으며, 실제 사용을 위해서는 적절하게 확장 및 구현해야 합니다. 또한 보안 및 에러 핸들링 등의 중요한 요소가 생략되어 있습니다. 이러한 부분은 프로젝트의 요구 사항에 따라 적절히 처리해야 합니다.
