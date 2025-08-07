package com.tmi.backend.global.Utils;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.apache.tika.Tika;

@Component
@Slf4j
public class FileUtil {

  @Value("${file.upload-dir}")
  private String uploadDir;

  private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(".jpg", ".jpeg", ".png",
      ".gif");

  public String getUploadDir() {
    return uploadDir;
  }

  public String saveFile(MultipartFile multipartFile, String domain) throws IOException {
    if (multipartFile.isEmpty()) {
      throw new IllegalArgumentException("업로드할 파일이 없습니다.");
    }
    String originalFilename = multipartFile.getOriginalFilename();
    if (originalFilename == null) {
      throw new IllegalArgumentException("파일 원본 이름이 없습니다.");
    }
    validateFileExtension(originalFilename);

    byte[] fileBytes = multipartFile.getBytes();

    validateMimeType(fileBytes);

    String extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
    String storedFileName = UUID.randomUUID().toString() + extension;

    Path targetPath = Paths.get(uploadDir, domain, storedFileName);
    Files.createDirectories(targetPath.getParent());
    Files.write(targetPath, fileBytes);

    return storedFileName;
  }

  /**
   * 디스크에 저장된 파일을 byte[] 배열로 반환합니다.
   *
   * @param filename 저장된 파일명 (UUID)
   * @param domain   파일이 저장된 하위 디렉토리
   * @return 파일의 byte[]
   */
  public byte[] getFile(String filename, String domain) throws IOException {
    Path filePath = Paths.get(uploadDir, domain, filename);

    if (!Files.exists(filePath) || !Files.isReadable(filePath)) {
      throw new FileNotFoundException("요청한 파일을 찾을 수 없거나 읽을 수 없습니다: " + filePath);
    }

    return Files.readAllBytes(filePath);
  }

  /**
   * 파일 확장자 검증 (Whitelist 방식)
   */
  private void validateFileExtension(String filename) {
    String extension = filename.substring(filename.lastIndexOf(".")).toLowerCase();
    if (!ALLOWED_EXTENSIONS.contains(extension)) {
      throw new IllegalArgumentException("허용되지 않는 파일 확장자입니다: " + extension);
    }
  }

  /**
   * Tika를 사용한 파일 시그니처(MIME 타입) 검증
   */
  private void validateMimeType(byte[] fileBytes) {
    Tika tika = new Tika();
    String mimeType = tika.detect(fileBytes);
    log.info("Detected MIME type: {}", mimeType);

    if (!mimeType.startsWith("image/")) {
      throw new IllegalArgumentException("파일 시그니처를 확인한 결과, 이미지 파일이 아닙니다.");
    }
  }
}