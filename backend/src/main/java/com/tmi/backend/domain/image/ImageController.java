package com.tmi.backend.domain.image;

import com.tmi.backend.global.Utils.FileUtil;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/image")
@RequiredArgsConstructor
public class ImageController {

  private final FileUtil fileUtil;
  private final ImageService imageService;

  @GetMapping("/{domain}/{filename}")
  public ResponseEntity<byte[]> getImage(@PathVariable String domain,
      @PathVariable String filename) {
    try {
      return imageService.getImage(domain, filename);
    } catch (IOException e) {
      log.error("파일을 찾을 수 없습니다: {}", e.getMessage());
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }
}