package za.ac.cput.findyourpathwholeproject.util;

import org.apache.commons.validator.routines.EmailValidator;

public class Helper {
    public static boolean notNullOrEmpty(String notNull){
        if ((notNull == null) || (notNull.isEmpty())){
            return true;
        }
        return false;
    }
    public static boolean isEmailValid(String email){
        if((email == null) || (email.isEmpty())){
            return false;
        }
        return EmailValidator.getInstance().isValid(email.trim());
    }
}
