const express = require("express");
const { body } = require("express-validator");
const {
  myprofile,
  createprofile,
  getProfiles,
  getProfile,
  deleteProfile,
  addExperience,
  deleteExperience,
  addEducation,
  deleteEducation,
  githubRepo,
} = require("../controllers/ProfileController");
const auth = require("../middleware/auth");
const router = express.Router();

/* 
@ profile routes
@my profile
*/
router.get("/me", auth, myprofile);

router.post(
  "/",
  [
    auth,
    [
      body("status", "Status is required").not().isEmpty(),
      body("skill", "Skill is required").not().isEmpty(),
    ],
  ],
  createprofile
);

/* 
@get all profiles api/profile/
*/
router.get("/", getProfiles);

/* 
@get all profiles api/profile/user/user_id
@acess public
*/
router.get("/user/:user_id", getProfile);

/* 
@delete profile api/profile/
@desc delete profile user posts
@acess priovate

*/
router.delete("/", auth, deleteProfile);

/* 
@put  api/profile/experience
@desc add profile experience
@acess priovate

*/
router.put(
  "/experience",
  [
    auth,
    [
      body("title", "Title is required").not().isEmpty(),
      body("company", "Company is required").not().isEmpty(),
      body("from", "From date is required").not().isEmpty(),
    ],
  ],
  addExperience
);

/* 
@delete  api/profile/experience/:exp_id
@desc delete experience from profile
@acess priovate
*/
router.delete("/experience/:exp_id", auth, deleteExperience);
/* 
@put  api/profile/education
@desc add profile education
@acess priovate

*/
router.put(
  "/education",
  [
    auth,
    [
      body("school", "Title is required").not().isEmpty(),
      body("degree", "Degree is required").not().isEmpty(),
      body("fieldofstudy", "Study is required").not().isEmpty(),
      body("from", "From is required").not().isEmpty(),
    ],
  ],
  addEducation
);

/* 
@delete  api/profile/eeducation/:edu_id
@desc delete education from profile
@acess priovate
*/
router.delete("/education/:edu_id", auth, deleteEducation);

/*
@ get api/profile/github/:username 
@ get user repo from github
@access public
*/
router.get("/github/:username", githubRepo);
module.exports = router;
