package za.ac.cput.findyourpathwholeproject.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Industry {
    @Id
    private String industryID;
    private String name;
    private double averageSalary;
    private String jobGrowth;
    private String educationLevel;
    private String bannerImage;

    public Industry(){}

    public Industry(Builder builder){
        this.industryID = builder.industryID;
        this.name= builder.name;
        this.averageSalary = builder.averageSalary;
        this.jobGrowth = builder.jobGrowth;
        this.educationLevel = builder.educationLevel;
        this.bannerImage = builder.bannerImage;
    }

    public String getIndustryID() {
        return industryID;
    }

    public String getName() {
        return name;
    }

    public double getAverageSalary() {
        return averageSalary;
    }

    public String getJobGrowth() {
        return jobGrowth;
    }

    public String getEducationLevel() {
        return educationLevel;
    }

    public String getBannerImage() {
        return bannerImage;
    }

    @Override
    public String toString() {
        return "Industry{" +
                "industryID='" + industryID + '\'' +
                ", name='" + name + '\'' +
                ", averageSalary=" + averageSalary +
                ", jobGrowth='" + jobGrowth + '\'' +
                ", educationLevel='" + educationLevel + '\'' +
                ", bannerImage='" + bannerImage + '\'' +
                '}';
    }
    public static class Builder{
        private String industryID;
        private String name;
        private String surname;
        private double averageSalary;
        private String jobGrowth;
        private String educationLevel;
        private String bannerImage;

        public Builder setIndustryID(String industryID) {
            this.industryID = industryID;
            return this;
        }
        public Builder setName(String name){
            this.name = name;
            return this;
        }
        public Builder setAverageSalary(double averageSalary){
            this.averageSalary = averageSalary;
            return this;
        }
        public Builder setJobGrowth(String jobGrowth){
            this.jobGrowth = jobGrowth;
            return this;
        }
        public Builder setEducationLevel(String educationLevel){
            this.educationLevel = educationLevel;
            return this;
        }
        public Builder setBannerImage(String bannerImage){
            this.bannerImage = bannerImage;
            return this;
        }
        public Builder copy(Industry copy){
            this.industryID = copy.industryID;
            this.name = copy.name;
            this.averageSalary = copy.averageSalary;
            this.jobGrowth = copy.jobGrowth;
            this.educationLevel = copy.educationLevel;
            this.bannerImage = copy.bannerImage;
            return this;
        }
        public Industry Build(){
            return new Industry(this);
        }
    }
}
