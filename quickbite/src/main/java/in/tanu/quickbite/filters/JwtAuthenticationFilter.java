package in.tanu.quickbite.filters;

import in.tanu.quickbite.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;


//    @Override
//    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
//          final String authHeader = request.getHeader("Authorization");
//          if(StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")){
//              String token = authHeader.substring(7);
//              String email = jwtUtil.extractUsername(token);
//              if(email!=null && SecurityContextHolder.getContext().getAuthentication()==null){
//                  UserDetails userDetails = userDetailsService.loadUserByUsername(email);
//
//                  if(jwtUtil.validateToken(token , userDetails)){
//                      UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
//                              userDetails , null,userDetails.getAuthorities()
//                      );
//                      authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
//                      SecurityContextHolder.getContext().setAuthentication(authenticationToken);
//
//                  }
//
//              }
//
//          }
//        filterChain.doFilter(request , response);
//    }
@Override
protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
) throws ServletException, IOException {

    final String authHeader = request.getHeader("Authorization");

    System.out.println("=================================");
    System.out.println("REQUEST: " + request.getMethod() + " " + request.getRequestURI());
    System.out.println("AUTH HEADER: " + authHeader);

    if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {

        String token = authHeader.substring(7);

        System.out.println("TOKEN RECEIVED");

        try {
            String email = jwtUtil.extractUsername(token);

            System.out.println("EMAIL FROM TOKEN: " + email);

            if (email != null &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(email);

                if (jwtUtil.validateToken(token, userDetails)) {

                    System.out.println("JWT VALID");

                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authenticationToken.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder.getContext()
                            .setAuthentication(authenticationToken);

                } else {
                    System.out.println("JWT INVALID");
                }
            }

        } catch (Exception e) {
            System.out.println("JWT ERROR: " + e.getClass().getSimpleName());
            System.out.println("JWT ERROR MESSAGE: " + e.getMessage());
        }
    } else {
        System.out.println("NO BEARER TOKEN");
    }

    filterChain.doFilter(request, response);
}
}
