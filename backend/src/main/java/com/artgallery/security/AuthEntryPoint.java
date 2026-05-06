package com.artgallery.security;

import com.artgallery.dto.response.ApiErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

/**
 * Returns a 401 JSON response when an unauthenticated request reaches a protected resource.
 */
@Component
public class AuthEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    public AuthEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        ApiErrorResponse error = new ApiErrorResponse("Unauthorised", List.of());
        response.getWriter().write(objectMapper.writeValueAsString(error));
    }
}
