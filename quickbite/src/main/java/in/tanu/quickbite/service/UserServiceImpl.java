package in.tanu.quickbite.service;


import in.tanu.quickbite.entity.UserEntity;
import in.tanu.quickbite.io.UserRequest;
import in.tanu.quickbite.io.UserResponse;
import in.tanu.quickbite.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService{


   private final UserRepository userRepository;
   private final PasswordEncoder passwordEncoder;
   private final AutheticationFacade autheticationFacade;

    @Override
    public UserResponse registerUser(UserRequest request) {
         UserEntity newUser = convertToEntity(request);
         newUser =  userRepository.save(newUser);
         return convertToResponse(newUser);

    }

    @Override
    public String findByUserId() {
        Authentication auth = autheticationFacade.getAuthentication();
        String loggedInUserEmail = auth.getName();
       UserEntity ue = userRepository.findByEmail(loggedInUserEmail).orElseThrow(()->new  UsernameNotFoundException("User not found"));
       return ue.getId();
    }

    private UserEntity convertToEntity(UserRequest request){
       return  UserEntity.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .build();
     }

    private UserResponse convertToResponse(UserEntity request){
        return  UserResponse.builder()
                .id(request.getId())
                .email(request.getEmail())
                .name(request.getName())
                .build();
    }



}
