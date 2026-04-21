export interface Municipality {
  name: string;
  nameNep: string;
}

export interface District {
  name: string;
  nameNep: string;
  municipalities: Municipality[];
}

export interface Province {
  id: number;
  name: string;
  nameNep: string;
  districts: District[];
}

export const NEPAL_LOCATIONS: Province[] = [
  {
    id: 1,
    name: "Koshi Province",
    nameNep: "कोशी प्रदेश",
    districts: [
      { 
        name: "Morang", 
        nameNep: "मोरङ",
        municipalities: [
          { name: "Biratnagar Metropolitan City", nameNep: "विराटनगर महानगरपालिका" },
          { name: "Belbari Municipality", nameNep: "बेलबारी नगरपालिका" }
        ]
      },
      { name: "Sunsari", nameNep: "सुनसरी", municipalities: [{ name: "Itahari Sub-Metropolitan City", nameNep: "ईटहरी उपमहानगरपालिका" }] },
      { name: "Jhapa", nameNep: "झापा", municipalities: [{ name: "Birtamod Municipality", nameNep: "बिर्तामोड नगरपालिका" }] }
    ]
  },
  {
    id: 2,
    name: "Madhesh Province",
    nameNep: "मधेश प्रदेश",
    districts: [
      { name: "Dhanusha", nameNep: "धनुषा", municipalities: [{ name: "Janakpur Sub-Metropolitan City", nameNep: "जनकपुर उपमहानगरपालिका" }] },
      { name: "Parsa", nameNep: "पर्सा", municipalities: [{ name: "Birgunj Metropolitan City", nameNep: "वीरगञ्ज महानगरपालिका" }] }
    ]
  },
  {
    id: 3,
    name: "Bagmati Province",
    nameNep: "बागमती प्रदेश",
    districts: [
      { 
        name: "Kathmandu", 
        nameNep: "काठमाडौं",
        municipalities: [
          { name: "Kathmandu Metropolitan City", nameNep: "काठमाडौं महानगरपालिका" },
          { name: "Budhanilkantha Municipality", nameNep: "बूढानीलकण्ठ नगरपालिका" }
        ]
      },
      { name: "Lalitpur", nameNep: "ललितपुर", municipalities: [{ name: "Lalitpur Metropolitan City", nameNep: "ललितपुर महानगरपालिका" }] },
      { name: "Bhaktapur", nameNep: "भक्तपुर", municipalities: [{ name: "Bhaktapur Municipality", nameNep: "भक्तपुर नगरपालिका" }] }
    ]
  },
  {
    id: 4,
    name: "Gandaki Province",
    nameNep: "गण्डकी प्रदेश",
    districts: [
      { 
        name: "Kaski", 
        nameNep: "कास्की",
        municipalities: [
          { name: "Pokhara Metropolitan City", nameNep: "पोखरा महानगरपालिका" }
        ]
      },
      { name: "Baglung", nameNep: "बागलुङ", municipalities: [{ name: "Baglung Municipality", nameNep: "बागलुङ नगरपालिका" }] },
      { name: "Myagdi", nameNep: "म्याग्दी", municipalities: [{ name: "Beni Municipality", nameNep: "बेनी नगरपालिका" }] },
      { name: "Mustang", nameNep: "मुस्ताङ", municipalities: [{ name: "Gharapjhong Rural Municipality", nameNep: "घरपझोङ गाउँपालिका" }] }
    ]
  },
  {
    id: 5,
    name: "Lumbini Province",
    nameNep: "लुम्बिनी प्रदेश",
    districts: [
      { name: "Rupandehi", nameNep: "रुपन्देही", municipalities: [{ name: "Butwal Sub-Metropolitan City", nameNep: "बुटवल उपमहानगरपालिका" }] },
      { name: "Dang", nameNep: "दाङ", municipalities: [{ name: "Tulsipur Sub-Metropolitan City", nameNep: "तुलसीपुर उपमहानगरपालिका" }] }
    ]
  },
  {
    id: 6,
    name: "Karnali Province",
    nameNep: "कर्णाली प्रदेश",
    districts: [
      { name: "Surkhet", nameNep: "सुर्खेत", municipalities: [{ name: "Birendranagar Municipality", nameNep: "वीरेन्द्रनगर नगरपालिका" }] }
    ]
  },
  {
    id: 7,
    name: "Sudurpashchim Province",
    nameNep: "सुदूरपश्चिम प्रदेश",
    districts: [
      { name: "Kailali", nameNep: "कैलाली", municipalities: [{ name: "Dhangadhi Sub-Metropolitan City", nameNep: "धनगढी उपमहानगरपालिका" }] },
      { name: "Kanchanpur", nameNep: "कञ्चनपुर", municipalities: [{ name: "Bhimdatta Municipality", nameNep: "भीमदत्त नगरपालिका" }] }
    ]
  }
];
