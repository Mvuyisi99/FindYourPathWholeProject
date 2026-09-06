package za.ac.cput.findyourpathwholeproject.factory;

import za.ac.cput.findyourpathwholeproject.domain.Industry;
import za.ac.cput.findyourpathwholeproject.util.Helper;

public class IndustryFactory {
    public static Industry createIndustry(String name, double averageSalary, String jobGrowth, String educationLevel, String bannerImage) {

        if ( Helper.notNullOrEmpty(name)  || Helper.notNullOrEmpty(jobGrowth) || Helper.notNullOrEmpty(educationLevel) || Helper.notNullOrEmpty(bannerImage)) {
            return null;
        }
        if(averageSalary == 0 ){
            return null;
        }
        return new Industry.Builder()
                .setName(name)
                .setAverageSalary(averageSalary)
                .setJobGrowth(jobGrowth)
                .setEducationLevel(educationLevel)
                .setBannerImage(bannerImage)
                .Build();

    }
}