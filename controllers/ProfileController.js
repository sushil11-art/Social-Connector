const { validationResult } = require("express-validator");
const Profile = require("../models/Profile");
const User = require("../models/User");
const request = require("request");
// const config = require("config");

exports.myprofile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    return res.json(profile);
  } catch (err) {
    return res.status(500).send("Server error");
  }
};
exports.getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    return res.json(profile);
  } catch (err) {
    console.log(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    return res.status(500).send("Server error");
  }
};
exports.getProfiles = async (req, res, next) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    return res.json(profiles);
  } catch (err) {
    return res.status(500).send("Server error");
  }
};
exports.deleteProfile = async (req, res, next) => {
  try {
    // delete profile
    await Profile.findOneAndRemove({ user: req.user.id });

    // remove user
    await User.findOneAndRemove({ _id: req.user.id });
    return res.json({ msg: "User removed successfully" });
  } catch (err) {
    return res.status(500).send("Server error");
  }
};

exports.addExperience = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { title, company, from, to, description, location, current } = req.body;
  const newExp = {
    title,
    company,
    from,
    to,
    description,
    location,
    current,
  };
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    console.log(profile);
    profile.experience.push(newExp);
    await profile.save();
    return res.json({ profile });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server error");
  }
};

exports.deleteExperience = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    console.log(profile);
    const removeIndex = profile.experience
      .map((exp) => exp.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    return res.json({ profile });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server error");
  }
};
exports.githubRepo = async (req, res, next) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${process.env.githubClientId}&client_secret=${process.env.githubClientSecret}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };

    request(options, (err, response, body) => {
      if (err) console.error(err);
      console.log(response.statusCode);
      if (response.statusCode !== 200)
        return res.status(404).json({ msg: "Github user not found" });

      res.status(200).json(JSON.parse(body));
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server error");
  }
};
exports.addEducation = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    school,
    degree,
    from,
    to,
    description,
    fieldofstudy,
    current,
  } = req.body;
  const newEdu = {
    school,
    degree,
    from,
    to,
    description,
    fieldofstudy,
    current,
  };
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    console.log(profile);
    profile.education.push(newEdu);
    await profile.save();
    return res.json({ profile });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server error");
  }
};

exports.deleteEducation = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    console.log(profile);
    const removeIndex = profile.education
      .map((edu) => edu.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    return res.json({ profile });
  } catch (err) {
    console.log(err.message);
    return res.status(500).send("Server error");
  }
};
exports.createprofile = async (req, res, next) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    facebook,
    twitter,
    linkedin,
    instagram,
    youtube,
  } = req.body;
  const profileFields = {};
  profileFields.user = req.user.id;
  // if (req.body.handle) profileFields.handle = req.body.handle;
  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubusername) profileFields.githubusername = githubusername;
  if (skills) {
    profileFields.skills = skills.split(",").map((skill) => skill.trim());
  }
  console.log(profileFields.skills);
  profileFields.social = {};
  if (youtube) profileFields.company = youtube;
  if (facebook) profileFields.company = facebook;
  if (twitter) profileFields.company = twitter;
  if (linkedin) profileFields.company = linkedin;
  if (instagram) profileFields.company = instagram;
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    // console.log(profile);
    if (profile) {
      // update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json({ profile });
    }
    // else create
    profile = new Profile(profileFields);
    await profile.save();
    return res.json({ profile });
    // console.log(profileFields);
    // profile = new Profile(profileFields);
    // // await Profile.save();
    // await Profile.save();
    // res.json({ profile });
  } catch (err) {
    return res.status(500).send("Server error");
  }
};
