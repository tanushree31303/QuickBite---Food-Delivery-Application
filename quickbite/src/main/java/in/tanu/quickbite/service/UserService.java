package in.tanu.quickbite.service;

import in.tanu.quickbite.io.UserRequest;
import in.tanu.quickbite.io.UserResponse;

public interface UserService {

   UserResponse registerUser(UserRequest request);

   String findByUserId();
}
