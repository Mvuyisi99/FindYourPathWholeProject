<script>

    /* =========================
       ELEMENTS
    ========================= */

    const form =
        document.getElementById("resetForm");

    const email =
        document.getElementById("email");

    const newPassword =
        document.getElementById("newPassword");

    const confirmPassword =
        document.getElementById("confirmPassword");

    const emailError =
        document.getElementById("emailError");

    const passwordError =
        document.getElementById("passwordError");

    const confirmError =
        document.getElementById("confirmError");

    const successMessage =
        document.getElementById("successMessage");

    const resetButton =
        document.querySelector(".reset-btn");


    /* =========================
       CHECK ELEMENTS
    ========================= */

    if (
        !form ||
        !email ||
        !newPassword ||
        !confirmPassword ||
        !emailError ||
        !passwordError ||
        !confirmError ||
        !successMessage ||
        !resetButton
    ) {

        console.error(
            "Reset password page: required elements are missing."
        );

    }


    /* =========================
       SHOW / HIDE PASSWORD
    ========================= */

    function togglePassword(inputId, button) {

        const input =
            document.getElementById(inputId);

        if (!input || !button) {
            return;
        }


        const icon =
            button.querySelector("i");


        if (input.type === "password") {

            /* Show password */

            input.type = "text";


            if (icon) {

                icon.classList.remove(
                    "fa-eye"
                );

                icon.classList.add(
                    "fa-eye-slash"
                );

            }


            button.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            /* Hide password */

            input.type = "password";


            if (icon) {

                icon.classList.remove(
                    "fa-eye-slash"
                );

                icon.classList.add(
                    "fa-eye"
                );

            }


            button.setAttribute(
                "aria-label",
                "Show password"
            );

        }

    }


    /* =========================
       RESET PASSWORD
    ========================= */

    form.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            let valid = true;


            /* =========================
               HIDE OLD MESSAGES
            ========================= */

            emailError.style.display =
                "none";

            passwordError.style.display =
                "none";

            confirmError.style.display =
                "none";

            successMessage.style.display =
                "none";


            /* =========================
               REMOVE OLD STYLES
            ========================= */

            email.classList.remove(
                "input-error",
                "input-success"
            );

            newPassword.classList.remove(
                "input-error",
                "input-success"
            );

            confirmPassword.classList.remove(
                "input-error",
                "input-success"
            );


            /* =========================
               CHECK EMAIL
            ========================= */

            if (!email.checkValidity()) {

                emailError.textContent =
                    "Please enter a valid email address.";

                emailError.style.display =
                    "block";

                email.classList.add(
                    "input-error"
                );

                valid = false;

            } else {

                email.classList.add(
                    "input-success"
                );

            }


            /* =========================
               CHECK PASSWORD LENGTH
            ========================= */

            if (
                newPassword.value.length < 6
            ) {

                passwordError.textContent =
                    "Password must be at least 6 characters.";

                passwordError.style.display =
                    "block";

                newPassword.classList.add(
                    "input-error"
                );

                valid = false;

            } else {

                newPassword.classList.add(
                    "input-success"
                );

            }


            /* =========================
               CHECK PASSWORD MATCH
            ========================= */

            if (
                newPassword.value !==
                confirmPassword.value
            ) {

                confirmError.textContent =
                    "Passwords do not match.";

                confirmError.style.display =
                    "block";

                confirmPassword.classList.add(
                    "input-error"
                );

                valid = false;

            } else {

                confirmPassword.classList.add(
                    "input-success"
                );

            }


            /* =========================
               STOP IF INVALID
            ========================= */

            if (!valid) {

                return;

            }


            /* =========================
               DISABLE BUTTON
            ========================= */

            resetButton.disabled =
                true;

            resetButton.textContent =
                "Resetting...";


            try {


                /* =========================
                   CHECK SUPABASE CLIENT
                ========================= */

                if (
                    typeof sb === "undefined"
                ) {

                    throw new Error(
                        "Supabase client is not loaded."
                    );

                }


                /* =========================
                   GET CURRENT USER
                ========================= */

                const {
                    data: {
                        user
                    },
                    error: userError
                } =
                    await sb.auth.getUser();


                if (
                    userError ||
                    !user
                ) {

                    throw new Error(
                        "Your password reset session has expired. Please request a new reset email."
                    );

                }


                /* =========================
                   CHECK EMAIL
                ========================= */

                const accountEmail =
                    user.email || "";


                if (
                    accountEmail.toLowerCase() !==
                    email.value.trim().toLowerCase()
                ) {

                    emailError.textContent =
                        "The email address does not match this account.";

                    emailError.style.display =
                        "block";

                    email.classList.remove(
                        "input-success"
                    );

                    email.classList.add(
                        "input-error"
                    );

                    return;

                }


                /* =========================
                   UPDATE SUPABASE PASSWORD
                ========================= */

                const {
                    error: passwordUpdateError
                } =
                    await sb.auth.updateUser({

                        password:
                            newPassword.value

                    });


                if (
                    passwordUpdateError
                ) {

                    throw new Error(
                        passwordUpdateError.message
                    );

                }


                /* =========================
                   UPDATE PROFILE
                ========================= */

                const {
                    error: profileError
                } =
                    await sb
                        .from("profiles")
                        .update({

                            password_changed_at:
                                new Date().toISOString()

                        })
                        .eq(
                            "id",
                            user.id
                        );


                /*
                   Do not undo a successful password
                   change just because the profile update
                   failed.
                */

                if (profileError) {

                    console.error(
                        "Profile update error:",
                        profileError
                    );

                }


                /* =========================
                   SUCCESS
                ========================= */

                successMessage.innerHTML =
                    '<i class="fa-solid fa-circle-check"></i> Password reset successfully!';

                successMessage.style.display =
                    "block";


                /* Clear password fields */

                newPassword.value = "";

                confirmPassword.value = "";


                /* Remove error styles */

                newPassword.classList.remove(
                    "input-error"
                );

                confirmPassword.classList.remove(
                    "input-error"
                );


                /* =========================
                   REDIRECT
                ========================= */

                setTimeout(
                    function() {

                        window.location.href =
                            "Home.html";

                    },
                    2000
                );


            } catch (error) {

                console.error(
                    "Reset password error:",
                    error
                );


                passwordError.textContent =
                    error.message ||
                    "Something went wrong. Please try again.";

                passwordError.style.display =
                    "block";


            } finally {

                resetButton.disabled =
                    false;

                resetButton.textContent =
                    "Reset";

            }

        }
    );


    /* =========================
       LIVE PASSWORD MATCHING
    ========================= */

    confirmPassword.addEventListener(
        "input",
        checkPasswords
    );

    newPassword.addEventListener(
        "input",
        checkPasswords
    );


    /* =========================
       CHECK PASSWORDS
    ========================= */

    function checkPasswords() {

        /*
           Don't show an error when the
           confirmation field is empty.
        */

        if (
            confirmPassword.value === ""
        ) {

            confirmError.style.display =
                "none";

            confirmPassword.classList.remove(
                "input-error",
                "input-success"
            );

            return;

        }


        /*
           Passwords don't match.
        */

        if (
            newPassword.value !==
            confirmPassword.value
        ) {

            confirmError.textContent =
                "Passwords do not match.";

            confirmError.style.display =
                "block";

            confirmPassword.classList.add(
                "input-error"
            );

            confirmPassword.classList.remove(
                "input-success"
            );

        }


        /*
           Passwords match.
        */

        else {

            confirmError.style.display =
                "none";

            confirmPassword.classList.remove(
                "input-error"
            );

            confirmPassword.classList.add(
                "input-success"
            );

        }

    }

</script>