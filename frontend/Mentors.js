// ==========================================
// FINDYOURPATH - MENTORS
// ==========================================

const mentorsGrid = document.getElementById("mentorsGrid");
const searchInput = document.getElementById("searchInput");

let mentors = [];


// ==========================================
// LOAD MENTORS FROM SUPABASE
// ==========================================

async function loadMentors() {

    if (!mentorsGrid) {
        console.error("mentorsGrid was not found.");
        return;
    }

    mentorsGrid.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading mentors...</p>
        </div>
    `;

    try {

        // Check that Supabase is connected
        if (!window.sb) {
            throw new Error(
                "Supabase has not been initialized."
            );
        }

        // Get mentors from the database
        const { data, error } = await window.sb
            .from("mentors")
            .select("*")
            .order("full_name", {
                ascending: true
            });

        if (error) {
            throw error;
        }

        console.log(
            "Mentors loaded from Supabase:",
            data
        );

        mentors = data || [];

        displayMentors(mentors);

    } catch (error) {

        console.error(
            "Error loading mentors:",
            error
        );

        mentorsGrid.innerHTML = `
            <div class="database-error">

                <i class="fas fa-exclamation-triangle"></i>

                <p>
                    Unable to load mentors.
                </p>

                <small>
                    ${escapeHTML(error.message)}
                </small>

            </div>
        `;
    }
}


// ==========================================
// DISPLAY MENTORS
// ==========================================

function displayMentors(mentorList) {

    mentorsGrid.innerHTML = "";

    if (!mentorList || mentorList.length === 0) {

        mentorsGrid.innerHTML = `
            <div class="loading">

                <i class="fas fa-users"></i>

                <p>
                    No mentors have been added yet.
                </p>

            </div>
        `;

        return;
    }


    mentorList.forEach(mentor => {

        const card =
            document.createElement("div");

        card.className = "card";


        // Database fields
        const name =
            mentor.full_name || "Mentor";

        const jobTitle =
            mentor.job_title || "Mentor";

        const company =
            mentor.company || "";


        card.innerHTML = `

            <div class="card-cover"></div>


            <div class="avatar-wrapper">

                <img
                    src="https://via.placeholder.com/150?text=Mentor"
                    alt="${escapeHTML(name)}"
                    class="mentor-avatar"
                >

            </div>


            <div class="card-info">

                <h3>
                    ${escapeHTML(name)}
                </h3>


                <p class="job-title">

                    ${escapeHTML(jobTitle)}

                    ${
                        company
                            ? ` | ${escapeHTML(company)}`
                            : ""
                    }

                </p>


                <button
                    class="follow-button"
                    type="button"
                    data-mentor-id="${escapeHTML(
                        String(mentor.id)
                    )}"
                >
                    Follow
                </button>

            </div>
        `;


        mentorsGrid.appendChild(card);

    });


    addFollowButtons();
}


// ==========================================
// FOLLOW BUTTONS
// ==========================================

function addFollowButtons() {

    const buttons =
        document.querySelectorAll(
            ".follow-button"
        );


    let following =
        JSON.parse(
            localStorage.getItem(
                "followingMentors"
            )
        ) || [];


    buttons.forEach(button => {

        const mentorId =
            button.dataset.mentorId;


        if (
            following.includes(mentorId)
        ) {

            button.textContent =
                "Following";

        }


        button.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();


                let currentFollowing =
                    JSON.parse(
                        localStorage.getItem(
                            "followingMentors"
                        )
                    ) || [];


                if (
                    currentFollowing.includes(
                        mentorId
                    )
                ) {

                    currentFollowing =
                        currentFollowing.filter(
                            id => id !== mentorId
                        );

                    button.textContent =
                        "Follow";

                } else {

                    currentFollowing.push(
                        mentorId
                    );

                    button.textContent =
                        "Following";

                }


                localStorage.setItem(
                    "followingMentors",
                    JSON.stringify(
                        currentFollowing
                    )
                );

            }
        );

    });
}


// ==========================================
// SEARCH
// ==========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function() {

            const searchValue =
                this.value
                    .toLowerCase()
                    .trim();


            const filteredMentors =
                mentors.filter(mentor => {

                    const name =
                        (
                            mentor.full_name || ""
                        ).toLowerCase();


                    const jobTitle =
                        (
                            mentor.job_title || ""
                        ).toLowerCase();


                    const company =
                        (
                            mentor.company || ""
                        ).toLowerCase();


                    return (
                        name.includes(
                            searchValue
                        ) ||

                        jobTitle.includes(
                            searchValue
                        ) ||

                        company.includes(
                            searchValue
                        )
                    );

                });


            displayMentors(
                filteredMentors
            );

        }
    );

}


// ==========================================
// HTML SECURITY
// ==========================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ==========================================
// START
// ==========================================

loadMentors();