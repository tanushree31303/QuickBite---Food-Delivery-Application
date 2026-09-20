package in.tanu.quickbite.repository;

import in.tanu.quickbite.entity.FoodEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FoodRespository extends MongoRepository<FoodEntity,String> {
}
