package com.tmi.backend.domain.image;

import com.tmi.backend.global.Utils.FileUtil;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ImageService {

  private final FileUtil fileUtil;

  public ResponseEntity<byte[]> getImage(String domain, String filename) throws IOException {
    byte[] fileBytes = fileUtil.getFile(filename, domain);

    HttpHeaders headers = new HttpHeaders();
    Path filePath = Paths.get(fileUtil.getUploadDir(), domain, filename);
    headers.setContentType(MediaType.parseMediaType(Files.probeContentType(filePath)));

    return new ResponseEntity<>(fileBytes, headers, HttpStatus.OK);
  }
}
