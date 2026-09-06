package za.ac.cput.findyourpathwholeproject.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Student {
    @Id
    private String studentId;
    private String userName;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String studentType;

    public Student(){}
    public Student(Builder builder){
        this.studentId = builder.studentId;
        this.userName = builder.userName;
        this.firstName =builder.firstName;
        this.lastName = builder.lastName;
        this.email = builder.email;
        this.password = builder.password;
        this.studentType = builder.studentType;
    }

    public String getStudentId() {
        return studentId;
    }

    public String getUserName() {
        return userName;
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

    public String getPassword() {
        return password;
    }

    public String getStudentType() {
        return studentType;
    }

    @Override
    public String toString() {
        return "Student{" +
                "studentId='" + studentId + '\'' +
                ", userName='" + userName + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", studentType='" + studentType + '\'' +
                '}';
    }
    public static class Builder{
        private String studentId;
        private String userName;
        private String firstName;
        private String lastName;
        private String email;
        private String password;
        private String studentType;

        public Builder setStudentId(String studentId){
            this.studentId = studentId;
            return this;
        }
        public Builder setUserName(String userName){
            this.userName = userName;
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
        public Builder setPassword(String password){
            this.password = password;
            return this;
        }
        public Builder setStudentType(String studentType){
            this.studentType = studentType;
            return this;
        }
        public Builder copy(Student copy){
            this.studentId = copy.studentId;
            this.userName = copy.userName;
            this.firstName = copy.firstName;
            this.lastName = copy.lastName;
            this.email = copy.email;
            this.password = copy.password;
            this.studentType = copy.studentType;
            return this;
        }
        public Student build(){
            return new Student(this);
        }
    }
}
