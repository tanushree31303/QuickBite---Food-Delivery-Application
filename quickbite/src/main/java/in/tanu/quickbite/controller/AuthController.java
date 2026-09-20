package in.tanu.quickbite.controller;

import in.tanu.quickbite.io.AuthenticationRequest;
import in.tanu.quickbite.io.AuthenticationResponse;
import in.tanu.quickbite.service.AppUserDetailsService;
import in.tanu.quickbite.util.JwtUtil;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService userDetailsService;
   private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody AuthenticationRequest request){
      authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail() , request.getPassword()));
      final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
      final String jwtToken = jwtUtil.generateToken(userDetails);
      return new AuthenticationResponse(request.getEmail() , jwtToken);
    }
}
