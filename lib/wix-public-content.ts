import type { StaticImageData } from 'next/image';

import aboutStoryImage from '@/images/diceministry/story.avif';
import aboutHeroImage from '@/images/diceministry/maurice-story.avif';
import historyLeadImage from '@/images/diceministry/history-1 (1).avif';
import historyBaptistImage from '@/images/diceministry/history-1 (2).avif';
import historyHighSchoolImage from '@/images/diceministry/history-1 (3).avif';
import historyGalleryOneA from '@/images/diceministry/history-1 (1).avif';
import historyGalleryOneB from '@/images/diceministry/history-1 (2).avif';
import historyGalleryOneC from '@/images/diceministry/history-1 (3).avif';
import historyGalleryTwoA from '@/images/diceministry/history-1 (4).avif';
import historyGalleryTwoB from '@/images/diceministry/010ba8_40d213f48508494cbb7ee327d19ce366~mv2.jpg';
import historyGalleryTwoC from '@/images/diceministry/010ba8_9e4f49fe89d54f29b5a82fcfc2b4e6dc~mv2.jpg';
import ourWorkHighSchoolImage from '@/images/diceministry/Mission-4_edited.jpg';
import ourWorkMissionsImage from '@/images/diceministry/Mission-5_edited.jpg';
import ourWorkIgniteImage from '@/images/diceministry/Edit-171_edited.jpg';
import igniteLeadImage from '@/images/diceministry/ignite.webp';
import igniteMentoringImage from '@/images/diceministry/peer-mentoring-practical-life-skills.avif';
import igniteComputerImage from '@/images/diceministry/basic-computer-skills.avif';
import supportLeadImage from '@/images/diceministry/010ba8_40d213f48508494cbb7ee327d19ce366~mv2.jpg';
import contactHeroImage from '@/images/diceministry/contact (1).avif';
import contactLeadImage from '@/images/diceministry/contact (2).avif';
import contactSupportImage from '@/images/diceministry/contact (3).avif';
import contactGalleryFour from '@/images/diceministry/contact (4).avif';
import contactGalleryFive from '@/images/diceministry/contact (5).avif';
import contactGallerySix from '@/images/diceministry/contact (6).avif';

type RichSection = {
  title: string;
  body: string;
  image?: StaticImageData;
};

export const wixPublicContent = {
  about: {
    eyebrow: 'Faith-based organization',
    title: 'About Us',
    subtitle: 'Our Story',
    heroImage: aboutHeroImage,
    story: [
      'DICE [Discipleship In Context of Evangelism] Ministry CBO is a faith-based organization that was founded in March 2008 by Maurice Agunda. It was founded as a 9-month discipleship and evangelism training program for the youth. It is duly registered as a community-based organization by the Directorate of Social Development in accordance with The Community Groups Registration Act (No. 30 of 2022).',
      'DICE is dedicated to helping young people maximize their God-given potential by applying spiritual principles in all spheres of life resulting in a lifestyle that is balanced, focused, and purposeful.',
    ],
    storyImage: aboutStoryImage,
    mission: 'We exist to mobilize resources and design programs that promote godliness, skillfulness, and empowerment!',
    vision: 'We see a generation of young people who know God, are skillful, and empowered!',
  },
  history: {
    eyebrow: 'Our History',
    title: 'Our Journey',
    leadImage: historyLeadImage,
    intro: [
      'DICE Ministry CBO was founded in the early 2000s. In 2004, Maurice Agunda noticed a troubling pattern - many young people were coming to faith with passion and excitement, but over time, that initial fire for Jesus would fade. The desire to pray, attend church, and boldly share their faith would slowly diminish, leaving them feeling disconnected and discouraged.',
      'In 2007, Maurice received a clear vision: to create a ministry that would provide a strong, lasting foundation for youth and new believers. This ministry would serve as a guiding framework - one that captures both the cost and the joy of true discipleship, and helps young people grow upward in their faith with purpose and consistency.',
    ],
    sections: [
      {
        title: 'Partnership with Baptist Chapel',
        body: 'In 2008, Maurice partnered with Baptist Chapel in Lucky Summer to launch a 9-month discipleship training program for teenagers and young adults within the church. He utilized the New Life Training Curriculum developed by Campus Crusade for Christ (now Life Ministry Kenya). The program proved to be a great success, igniting spiritual growth and deeper commitment among the youth. Building on this momentum, Maurice and his team expanded the training in 2009, running additional discipleship programs at both Baptist Chapel and Highridge Baptist Church in Korogocho.',
        image: historyBaptistImage,
      },
      {
        title: 'Discipleship in High Schools',
        body: "In 2010, we launched our high school ministry at St. Mary's Keris High School in Lucky Summer, marking a significant step in our mission to reach the next generation. The following year, we secured our current office space to support the growing work. Through these weekly discipleship sessions, students were encouraged to grow in faith, develop strong values, and navigate life with a clear sense of purpose rooted in Christ.",
        image: historyHighSchoolImage,
      },
      {
        title: 'Inaugural SURGE (now Ignite)',
        body: 'In 2012, we launched our first SURGE program - a 9-month discipleship training initiative designed to help young people deepen their relationship with God, build a strong foundation for their future, discover their unique gifts and calling, and develop essential leadership skills. The program included training in Discipleship and Evangelism, Peer Education and Life Skills, and Basic Computer Skills. Additionally, students had the opportunity to choose one specialized course from Basic Music Skills, Graphic Design, or Video Editing and Production.',
      },
      {
        title: 'Short-term Missions',
        body: "In 2015, we began our partnership with Reign Ministries, and since then, we've hosted various Royal Servants and Kairos mission trips. This collaboration has provided valuable opportunities for us to engage in short-term missions, allowing our students to gain hands-on experience in sharing their faith and discipling others.",
      },
    ] as RichSection[],
    galleries: {
      surge: [historyGalleryOneA, historyGalleryOneB, historyGalleryOneC],
      missions: [historyGalleryTwoA, historyGalleryTwoB, historyGalleryTwoC],
    },
  },
  belief: {
    eyebrow: 'What We Believe',
    title: 'Statement of Faith',
    subtitle: 'The convictions that ground everything we do.',
    statements: [
      {
        title: 'God',
        body: 'We believe in the one ever-living, eternal God: infinite in power, holy in nature, attributes and purpose; and possessing absolute, indivisible deity. This one true God has revealed Himself as Father, through His Son in redemption, and as the Holy Spirit dwelling within us. (Genesis 1:1; John 1:1-4)',
      },
      {
        title: 'Jesus Christ',
        body: 'We believe that Jesus Christ is the Son of God, born of a virgin; that he lived a sinless life, was crucified on Calvary for our sins, and bodily rose from the grave; and that he has been exalted to the throne of God where He is the only mediator between God and man. We believe that through his death and life we have personal salvation and power for victorious living. (Matthew 1:18-25)',
      },
      {
        title: 'The Holy Spirit',
        body: 'We believe that the Holy Spirit is the third person of the Trinity and dwells in all believers. We believe He convicts sinners, guides man into truth and regenerates believers to new life, baptizes them in Christ, and serves as their assurance to eternal life. (John 16:8; Ephesians 1:13, 4:30)',
      },
      {
        title: 'Salvation',
        body: 'We believe that all men have sinned and stand in need of redemption, which is obtained through the new birth by faith in the shed blood of the Lord Jesus Christ. We believe that salvation is the gift of God that is received through faith and not by works. (Romans 3:23; Ephesians 2:8-9)',
      },
      {
        title: 'The Bible',
        body: 'We believe the Bible is the inspired Word of God, a divine revelation from God to man. We accept the Scriptures as the final authority in all matters of faith and conduct. (2 Timothy 3:16-17)',
      },
      {
        title: 'The Church',
        body: 'We believe the Church has been "called out" of the world to be a habitation of God through the Spirit. As the body of Christ on earth, the church offers hope to mankind. The church is one body made up of many members, diverse in their gifts and calling. (Romans 12:4-5; 1 Corinthians 12:12-26)',
      },
      {
        title: 'The Return of Christ',
        body: "We believe in the pre-millennial return of Jesus Christ to receive his bride, the church, unto Himself. At his coming, we believe the dead in Christ will be resurrected from the grave. We believe in Christ's millennial reign upon the earth. (Hebrews 9:28; 1 Thessalonians 4:16-17)",
      },
    ],
  },
  ourWork: {
    eyebrow: 'Our Work',
    title: 'Our Programs',
    subtitle: 'The work we do is designed to strengthen discipleship, skill-building, and mission-minded service.',
    programs: [
      {
        title: 'High School Ministry',
        body: "We're actively engaged in weekly discipleship programs at local high schools. We focus on empowering and mentoring students to build Christ-centered foundations that shape their academics, relationships, and future paths.",
        image: ourWorkHighSchoolImage,
      },
      {
        title: 'Missions Hosting',
        body: "We partner with like-minded Christian organizations, both locally and internationally, to engage in short-term mission projects. This is a vital part of our commitment to help fulfill the Great Commission by demonstrating God's love in action.",
        image: ourWorkMissionsImage,
      },
      {
        title: 'Ignite (formerly SURGE)',
        body: 'A 6-month discipleship & mentorship program for high school graduates. Our students are trained in Discipleship & Evangelism, Peer Education & Life Skills, and Basic Computer Skills.',
        image: ourWorkIgniteImage,
      },
    ],
  },
  ignite: {
    eyebrow: 'Flagship program',
    title: 'Ignite (formerly SURGE)',
    leadImage: igniteLeadImage,
    overview: [
      'IGNITE is a 6-month fully-sponsored program designed to equip recent high school graduates for success in campus life, community involvement, or the marketplace. The program focuses on empowering young people to deepen their relationship with God, establish a strong foundation for their future, identify their unique gifts and calling, and develop essential leadership skills.',
      'At the heart of IGNITE is the practice of spending daily time alone with God, combined with weekly experiences of prayer, Bible study, and worship. Participants are also challenged through life-changing activities that push them beyond their comfort zones. Additionally, they have the chance to engage with guest speakers from diverse professional backgrounds, gaining valuable insights into various fields.',
      'A typical IGNITE session includes lectures on Discipleship Foundations, Peer Mentoring & Practical Life Skills, and Basic Computer Skills.',
      'Ultimately, IGNITE aims to cultivate a generation that is godly, empowered, and skillful - transforming learning into real-life application and impact.',
    ],
    courses: [
      {
        title: 'Discipleship Foundations',
        body: 'Covers basic concepts on cultivating our relationship with God and discipleship concepts.',
      },
      {
        title: 'Peer Mentoring & Practical Life Skills',
        body: 'Covers basic concepts on personality traits, career choice, leadership, and healthy relationships.',
        image: igniteMentoringImage,
      },
      {
        title: 'Basic Computer Skills',
        body: 'Covers eight basic Microsoft Office packages that prepare students for academic and workplace demands.',
        image: igniteComputerImage,
      },
    ],
  },
  support: {
    eyebrow: 'Support Us',
    title: "Let's Make A Change",
    intro: 'Your gifts provide resources and training for teenagers and young adults. Thank you for choosing to partner with us. Here are some ways you can donate:',
    leadImage: supportLeadImage,
    methods: [
      {
        title: 'Bank Deposit',
        details: [
          'Co-operative Bank',
          'Branch: Thika Road Mall',
          'A/C Name: DICE Ministry CBO',
          'A/C No.: 01100178076001',
        ],
      },
      {
        title: 'M-PESA',
        details: ['Paybill - 400200', 'Account - 6458'],
      },
      {
        title: 'Online Giving',
        details: ['Make a fast, secure donation online through our giving partner.'],
        cta: 'Click to Give',
        href: 'https://donorbox.org/dice-ministries-kenya',
      },
    ],
  },
  contact: {
    eyebrow: 'Contact Us',
    title: 'Get in Touch',
    heroImage: contactHeroImage,
    introTitle: 'Contact Form',
    intro: "You can contact us using the form below, and we'll get back to you as soon as possible. Or, if you prefer, you may contact us using the contact information below the form.",
    success: "Thank you for reaching out to DICE Ministry CBO. We'll get back to you as soon as possible!",
    leadImage: contactLeadImage,
    supportImage: contactSupportImage,
    gallery: [contactLeadImage, contactSupportImage, contactGalleryFour, contactGalleryFive, contactGallerySix, contactHeroImage],
    labels: {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      message: 'Write a message',
      submit: 'Submit',
    },
    details: [
      {
        title: 'Address',
        body: 'Baba Dogo - Lucky Summer Road\nKanyoro House (opp. The Oasis Gym), 3rd Floor',
      },
      {
        title: 'Phone numbers',
        body: '+254 725 248 788\n+254 115 447 886',
      },
      {
        title: 'Email',
        body: 'diceministrykenya@gmail.com',
      },
    ],
  },
};
