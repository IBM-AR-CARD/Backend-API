let ObjectID = require("mongodb").ObjectID;
let db = require("./db.js");

function getRandomProfileImage(male) {
  let gender = male ? "men" : "women";
  let url = `https://randomuser.me/api/portraits/${gender}/${Math.floor(Math.random() * 30) +
    1}.jpg`;
  return url;
}

const randomFrom = arr => {
  return arr[Math.floor(Math.random() * arr.length)];
};

async function generateHistoryProfile() {
  let name = randomFrom(["Jerry", "Leo", "Yide", "John", "Yoyo", "Davies"]);
  let model = randomFrom([
    "ManInSuit",
    "BusinessWomanPFB",
    "TestMale",
    "Luffy",
    "FitFemale",
    "Jiraiya",
    "YodaRigged",
    "BusinessMale",
    "BusinessFemale",
    "SmartMale",
    "UnityChan",
    "SmartFemale"
  ]);
  let description = randomFrom([
    "Student",
    "Software Developer",
    "Sales",
    "Management",
    "Professor",
    "Doctor"
  ]);
  let profileImage = getRandomProfileImage(randomFrom([true, false]));

  let randomUserName = "Dummy." + Math.random() * 10000000;

  let newUser = {
    profile: profileImage,
    isDummy: true,
    firstname: name,
    lastname: "Dummy",
    phone: "12345678901",
    website: "http://ar-card.henryz.cc/",
    model: model,
    description: "Dummy description: " + description,
    experience: "Dummy Experience",
    education: "Dummy Education",
    username: randomUserName,
    gender: 0
  };

  await db.dbInsert("profiles", newUser);

  let userObj = await db.dbFind("profiles", { username: randomUserName });

  console.log("!!!", userObj._id, userObj._id.toString());
  return {
    _id: ObjectID(),
    isDummy: true,
    userid: userObj._id.toString() + ""
  };
}

module.exports = {
  getEmptyProfile: function() {
    return {
      profile: "",
      firstname: "",
      lastname: "",
      phone: "",
      website: "",
      model: "TestMale",
      description: "",
      experience: "",
      education: "",
      gender: 0
    };
  },

  getProileDummy1: function() {
    return {
      dummyid: "dummy1",
      username: "jonmcnamara",
      email: "john@ucl.ac.uk",
      phone: "12345678901",
      website: "ar-card.henryz.cc",
      password: "$2a$08$C4AgFAgj8a0BCYZpCexqx.Tl8p42.hSs6Jm7guc9oBWx3N928zU0q", //content: password
      profile: "https://cloud-minapp-24046.cloud.ifanrusercontent.com/1jJhq4RVhcY98s2q.jpg",
      firstname: "John",
      lastname: "McNamara",
      model: "TestMale",
      description:
        "John is a Senior Inventor, Research Fellow, Impact Fellow and currently provides technical leadership for the IBM Hursley Innovation Centre. John has a diverse background that includes consultancy, performance, service & product delivery, all underpinned by a passion for innovation.",
      experience: "Senior Inventor at IBM and Hursley Innovation Labs Technologist Lead",
      education:
        "I have studied at University of Humberside, on Field Of StudyInformation Systems. And received a 2:1 Grade",
      gender: 2
    };
  },

  getProileDummy2: function() {
    return {
      dummyid: "dummy2",
      username: "amy-pajak",
      email: "amy@ucl.ac.uk",
      phone: "12345678901",
      website: "ar-card.henryz.cc",
      password: "$2a$08$C4AgFAgj8a0BCYZpCexqx.Tl8p42.hSs6Jm7guc9oBWx3N928zU0q", //content: password
      profile: "https://cloud-minapp-24046.cloud.ifanrusercontent.com/1jJhq4qcpHl5imPC.jpg",
      firstname: "Amy",
      lastname: "Pajak",
      model: "BusinessFemale",
      description:
        "Second year student at the University of Birmingham reading BSc Artificial Intelligence and Computer Science with Industrial Year. Passionate for code. I possess necessary programming skills and well-developed social skills. Flexible attitude to work and strong organisational skills for a variety of situations to achieve deadlines. Strong initiative and can work independently or as part of a team. ",
      experience:
        "Software Developer Placement at IBM. Placement year as L3 Support Engineer in cloud and cognitive software primarily working in C++ and Java.",
      education:
        "I have studied at University of Birmingham. Pursuing Degree NameBachelor of Science - BSField Of Study. I have studied Artificial Intelligence and Computer Science, Data Structures and Algorithms, Databases, Java Project, C/C++. Currently at my Second year - Achieved 2:1.",
      gender: 1
    };
  },

  getProileDummy3: function() {
    return {
      dummyid: "dummy3",
      username: "ben-jones",
      email: "ben@ucl.ac.uk",
      phone: "12345678901",
      website: "ar-card.henryz.cc",
      password: "$2a$08$C4AgFAgj8a0BCYZpCexqx.Tl8p42.hSs6Jm7guc9oBWx3N928zU0q", //content: password
      profile: "https://cloud-minapp-24046.cloud.ifanrusercontent.com/1jJhq5WJMIbSTz7z.jpg",
      firstname: "Ben",
      lastname: "Jones",
      model: "SmartMale",
      description:
        "Hi, My Name is Ben Jones, I am a Marketing Undergraduate who is currently working at IBM on placement as a UK&I and MEA Recruitment - Attraction, Employer Branding & Events Co-ordinator.",
      experience:
        "Student ambassador at As a student ambassador I work in the university in a number ways: I have been a mentor for students; worked in the university outreach program; and been part of the marketing and communications team on open days giving presentations and conducting campus tours. During this time I have been promoted from a student ambassador to a student leader. Next year I am also going to be vlogging for the university as part of their marketing campaign.",
      education:
        "I have studied at Bournemouth University. Pursuing Degree NameBachelor of Science - BSField Of Study. ",
      gender: 2
    };
  },

  removeProfileDummy: async function(db, id) {
    try {
      console.log("removing dummy profile with id ", id);
      await db.dbDeleteMany("profiles", { dummyid: id });
    } catch (error) {
      console.log(error);
    }
  },

  getHistoryDummy: async function(userid) {
    const list = [
      await generateHistoryProfile(),
      await generateHistoryProfile(),
      await generateHistoryProfile(),
      await generateHistoryProfile(),
      await generateHistoryProfile(),
      await generateHistoryProfile()
    ];
    console.log(list);

    return {
      userid: userid ? ObjectID(userid) : "dummy",
      isDummy: true,
      list: list
    };
  }
};
