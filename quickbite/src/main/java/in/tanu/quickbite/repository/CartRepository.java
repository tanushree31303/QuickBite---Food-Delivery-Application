package in.tanu.quickbite.repository;

import in.tanu.quickbite.entity.CartEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CartRepository extends MongoRepository<CartEntity , String> {

    Optional<CartEntity> findByUserId(String userId);
    void deleteByUserId(String userId);
}
