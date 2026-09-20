package in.tanu.quickbite.controller;


import in.tanu.quickbite.io.UserRequest;
import in.tanu.quickbite.io.UserResponse;
import in.tanu.quickbite.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@RequestBody UserRequest request){
        UserResponse response = userService.registerUser(request);
        return response;
    }


}
