package za.ac.cput.findyourpathwholeproject.factory;

import org.junit.jupiter.api.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.ws.soap.addressing.server.annotation.Address;
import za.ac.cput.findyourpathwholeproject.domain.Industry;

import static org.junit.jupiter.api.Assertions.*;
@TestMethodOrder(MethodOrderer.MethodName.class)
class IndustryFactoryTest {

    private static Industry industry,industry1;


    @Test
    void a_create(){
        industry = IndustryFactory.createIndustry("Nursing",20000,"High","Diploma","ryyt");
        assertNotNull(industry);
        System.out.println(industry);
    }
    @Test
    void b_toFail(){
        industry1 = IndustryFactory.createIndustry("",20000,"High","Diploma","ryyt");
        assertNotNull(industry1);
        System.out.println(industry1);
    }
}