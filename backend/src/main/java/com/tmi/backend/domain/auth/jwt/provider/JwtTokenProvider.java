package com.tmi.backend.domain.auth.jwt.provider;

import com.tmi.backend.domain.auth.service.CustomUserDetailsService;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

  @Value("${jwt.secret}")
  private String secretKeyBase64;

  @Value("${jwt.access-token-expiration-minutes}")
  private long accessTokenExpiryMinutes;

  @Value("${jwt.refresh-token-expiration-minutes}")
  private long refreshTokenExpiryMinutes;

  @Value("${jwt.registration-token-expiration-minutes}")
  private long registrationTokenExpirationMinutes;

  private Key key;
  private final CustomUserDetailsService userDetailsService;

  @PostConstruct
  public void init() {
    byte[] keyBytes = Decoders.BASE64.decode(secretKeyBase64);
    this.key = Keys.hmacShaKeyFor(keyBytes);
  }


  /**
   * Access Token 생성
   */
  public String createAccessToken(Long memberId) {
    Date now = new Date();
    Date expiry = new Date(now.getTime() + accessTokenExpiryMinutes * 60 * 1000);
    return Jwts.builder()
        .setSubject(memberId.toString())
        .setIssuedAt(now)
        .setExpiration(expiry)
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();
  }

  /**
   * Refresh Token 생성
   */
  public String createRefreshToken(Long memberId) {
    Date now = new Date();
    Date expiry = new Date(now.getTime() + refreshTokenExpiryMinutes * 60 * 1000);
    return Jwts.builder()
        .setSubject(memberId.toString())
        .setIssuedAt(now)
        .setExpiration(expiry)
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();
  }

  public String createRegistToken(String provider, String providerMemberId) {
    Date now = new Date();
    Date expiry = new Date(now.getTime() + registrationTokenExpirationMinutes * 60 * 1000);

    return Jwts.builder()
        .setSubject("registration")
        .claim("provider", provider)
        .claim("providerMemberId", providerMemberId)
        .setIssuedAt(now)
        .setExpiration(expiry)
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();
  }

  /**
   * JWT 토큰을 기반으로 Authentication 객체 생성
   */
  public Authentication getAuthentication(String token) {
    String subject = getSubject(token);
    UserDetails userDetails = userDetailsService.loadUserByUsername(subject);
    return new UsernamePasswordAuthenticationToken(
        userDetails,
        null,
        userDetails.getAuthorities()
    );
  }

  /**
   * 토큰에서 subject(회원ID) 추출
   */
  public String getSubject(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(key)
        .build()
        .parseClaimsJws(token)
        .getBody()
        .getSubject();
  }

  /**
   * 토큰 유효성 검사 (서명 및 만료)
   */
  public boolean validateToken(String token) {
    try {
      Jwts.parserBuilder()
          .setSigningKey(key)
          .build()
          .parseClaimsJws(token);
      return true;
    } catch (JwtException | IllegalArgumentException e) {
      return false;
    }
  }

  public LocalDateTime getTokenExpiration(String token) {
    Date expiry = Jwts.parserBuilder()
        .setSigningKey(key)
        .build()
        .parseClaimsJws(token)
        .getBody()
        .getExpiration();
    return expiry.toInstant().atZone(ZoneOffset.UTC).toLocalDateTime();
  }

}
