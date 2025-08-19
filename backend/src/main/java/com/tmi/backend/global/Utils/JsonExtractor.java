package com.tmi.backend.global.Utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class JsonExtractor {

  // ```json { ... } ``` 또는 ``` { ... } ``` 에서 {...}만 추출
  private static final Pattern FENCED_JSON =
      Pattern.compile("(?s)```\\s*(?:json)?\\s*(\\{.*?\\})\\s*```");

  private JsonExtractor() {
  }

  /**
   * content 안에서 첫 번째 JSON 오브젝트를 찾아 반환. 없으면 원문 trim
   */
  public static String extractFirstJsonObject(String content) {
    if (content == null) {
      return null;
    }
    String s = content.trim();

    // 1) 코드펜스 안의 {...} 우선 추출
    Matcher m = FENCED_JSON.matcher(s);
    if (m.find()) {
      return m.group(1).trim();
    }

    // 2) 백틱만 제거 (```json, ``` 등)
    s = s.replace("```json", "")
        .replace("```", "").trim();

    // 3) 텍스트 중 첫 번째 최상위 { ... } 구간만 균형 잡아 추출
    int start = s.indexOf('{');
    if (start < 0) {
      return s; // 어쩔 수 없이 원문 반환
    }

    int depth = 0;
    boolean inStr = false;
    boolean esc = false;
    for (int i = start; i < s.length(); i++) {
      char c = s.charAt(i);
      if (esc) {
        esc = false;
        continue;
      }
      if (c == '\\') {
        esc = true;
        continue;
      }
      if (c == '"') {
        inStr = !inStr;
        continue;
      }
      if (!inStr) {
        if (c == '{') {
          depth++;
        } else if (c == '}') {
          depth--;
          if (depth == 0) {
            return s.substring(start, i + 1).trim();
          }
        }
      }
    }
    // 닫는 괄호를 못 찾으면 시작부터 끝까지 반환
    return s.substring(start).trim();
  }
}

