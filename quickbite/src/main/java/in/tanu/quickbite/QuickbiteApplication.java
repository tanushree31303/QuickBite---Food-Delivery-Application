package in.tanu.quickbite;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.core.MongoTemplate;

@SpringBootApplication
public class QuickbiteApplication {

	public static void main(String[] args) {
		SpringApplication.run(QuickbiteApplication.class, args);
	}
	@Bean
	CommandLineRunner checkMongoDatabase(MongoTemplate mongoTemplate) {
		return args -> {
			System.out.println("=================================");
			System.out.println("DATABASE: " + mongoTemplate.getDb().getName());
			System.out.println("=================================");
		};
	}

}
