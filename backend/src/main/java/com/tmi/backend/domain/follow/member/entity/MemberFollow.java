package com.tmi.backend.domain.follow.member.entity;


import com.tmi.backend.domain.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "member_follow", uniqueConstraints = {
    @UniqueConstraint(name = "uk_member_follow", columnNames = {"follower_id", "followee_id"})
})
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberFollow {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long memberFollowId;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "follower_id", nullable = false)
  private Member follower;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "followee_id", nullable = false)
  private Member followee;

  private LocalDateTime createdAt;

}

