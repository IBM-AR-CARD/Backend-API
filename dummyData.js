function getRandomProfileImage(male) {
  let gender = male ? "men" : "women";
  let url = `https://randomuser.me/api/portraits/${gender}/${Math.floor(
    Math.random() * 30
  ) + 1}.jpg`;
  return url;
}

const randomFrom = arr => {
  return arr[Math.floor(Math.random() * arr.length)];
};

function generateHistoryProfile() {
  let name = randomFrom([
    "Jerry",
    "Leo",
    "Yide Fan",
    "John",
    "Henry",
    "Davies"
  ]);
  let description = randomFrom([
    "Student",
    "Software Developer",
    "Sales",
    "Management",
    "Professor",
    "Doctor"
  ]);

  return {
    name: name,
    description: description,
    avatar: getRandomProfileImage(randomFrom(["men", "women"])),
    country: "UK"
  };
}

module.exports = {
  getProileDummy: function() {
    return {
      dummyid: "dummy1",
      username: "jonmcnamara",
      profile:
        "https://media-exp2.licdn.com/dms/image/C5603AQFA_oQhi6-2Cg/profile-displayphoto-shrink_800_800/0?e=1584576000&v=beta&t=QfVEJg5DU7IHXBiUlaZ2nRjI5gHTqok20eL17iHHa8Y",
      firstname: "John",
      lastname: "McNamara",
      description:
        "John is a Senior Inventor, Research Fellow, Impact Fellow and currently provides technical leadership for the IBM Hursley Innovation Centre. John has a diverse background that includes consultancy, performance, service & product delivery, all underpinned by a passion for innovation. Most recently his work leading the Innovation Centre technologist team has allowed him to combine these interests in order to maximise the potential of new technology while solving real problems. John has overseen the delivery of many cognitive cloud-based solutions and understands how to combine technologies to quickly provide value for customers. John is an active inventor with an invention portfolio spanning mobile, A.I, messaging, integration and predictive analytics.",
      experience:
        "Senior Inventor at IBM and Hursley Innovation Labs Technologist Lead",
      education:
        "I have studied at University of Humberside, on Field Of StudyInformation Systems. And received a 2:1 Grade",
      gender: 2
    };
  },

  getHistoryDummy: function(userid) {
    return {
      userid: userid ? userid : "dummy",
      list: [
        generateHistoryProfile(),
        generateHistoryProfile(),
        generateHistoryProfile(),
        generateHistoryProfile(),
        generateHistoryProfile(),
        generateHistoryProfile()
      ]
    };
  }
};
