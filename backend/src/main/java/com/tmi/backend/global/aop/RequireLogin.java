package com.tmi.backend.global.aop;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.METHOD, ElementType.TYPE}) //메서드에서만 사용 가능
@Retention(RetentionPolicy.RUNTIME) // 런타임에도 유지하여 동작 수행
public @interface RequireLogin {

}