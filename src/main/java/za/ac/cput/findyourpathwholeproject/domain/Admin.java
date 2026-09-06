package za.ac.cput.findyourpathwholeproject.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Admin {
    @Id
    private String adminId;
    private String firstName;
    private String lastName;
    private String email;
    private String administratorType;
    private String password;

    public Admin(){}
    public Admin(Builder build){

    }

    public String getAdminId() {
        return adminId;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getAdministratorType() {
        return administratorType;
    }

    public String getPassword() {
        return password;
    }

    @Override
    public String toString() {
        return "Admin{" +
                "adminId='" + adminId + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", administratorType='" + administratorType + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
    public static class Builder{
        private String adminId;
        private String firstName;
        private String lastName;
        private String email;
        private String administratorType;
        private String password;

        public Builder setAdminId(String adminId){
            this.adminId = adminId;
            return this;
        }
        public Builder setFirstName(String firstName){
            this.firstName = firstName;
            return this;
        }
        public Builder setLastName(String lastName){
            this.lastName = lastName;
            return this;
        }
        public Builder setEmail(String email){
            this.email = email;
            return this;
        }
        public Builder setAdministrator(String administratorType){
            this.administratorType = administratorType;
            return this;
        }
        public Builder setPassword(String password){
            this.password = password;
            return this;
        }
        public Builder copy(Admin copy){
            this.adminId = copy.adminId;
            this.firstName = copy.firstName;
            this.lastName = copy.lastName;
            this.email = copy.email;
            this.administratorType = copy.administratorType;
            this.password = copy.password;
            return this;
        }
        public Admin build(){
            return new Admin(this);
        }
    }
}
