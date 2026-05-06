package com.artgallery.security;

import com.artgallery.dto.response.ApiErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * JWT authentication filter that runs once per request.
 *
 * <p>Extracts the Bearer token from the {@code Authorization} header, validates it
 * via {@link JwtService}, checks the {@link TokenDenylist}, and populates the
 * {@link SecurityContextHolder} with the authenticated principal.
 */
@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final TokenDenylist tokenDenylist;
    private final ObjectMapper objectMapper;

    public JwtFilter(JwtService jwtService, TokenDenylist tokenDenylist, ObjectMapper objectMapper) {
        this.jwtService = jwtService;
        this.tokenDenylist = tokenDenylist;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        // 1. No Authorization header or not a Bearer token — pass through
        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        // 2. Extract the raw token
        String token = header.substring(7);

        // 3. Parse and validate the token
        Claims claims;
        try {
            claims = jwtService.parseToken(token);
        } catch (JwtException e) {
            writeErrorResponse(response, "Unauthorised");
            return;
        }

        // 4. Check the denylist
        String jti = claims.getId();
        if (tokenDenylist.isDenylisted(jti)) {
            writeErrorResponse(response, "Unauthorised");
            return;
        }

        // 5. Build the authentication token
        String userId = claims.getSubject();
        String role = claims.get("role", String.class);

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                userId,
                null,
                List.of(new SimpleGrantedAuthority("ROLE_" + role))
        );

        // 6. Attach request details
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        // 7. Store in the security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 8. Continue the filter chain
        chain.doFilter(request, response);
    }

    private void writeErrorResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        ApiErrorResponse error = new ApiErrorResponse(message, List.of());
        response.getWriter().write(objectMapper.writeValueAsString(error));
    }
}
