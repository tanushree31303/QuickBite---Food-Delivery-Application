package in.tanu.quickbite.service;


import org.springframework.security.core.Authentication;

public interface AutheticationFacade {
    Authentication getAuthentication();
}
