package com.tmi.backend.domain.follow.company.dto.response;

public record SimpleCompanyFollow(Long companyFollowId,
                                  Long companyId,
                                  String name,
                                  String companyProfileUrl
) {

}
