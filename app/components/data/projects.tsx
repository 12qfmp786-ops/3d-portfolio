import AceTernityLogo from "@/app/components/logos/aceternity";
import SlideShow from "@/app/components/slide-show";
import { Button } from "@/components/ui/button";
import { TypographyH3, TypographyP } from "@/app/components/ui/typography";
import { ArrowUpRight, ExternalLink, Link2, MoveUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { RiNextjsFill, RiNodejsFill, RiReactjsFill } from "react-icons/ri";
import {
  SiChakraui,
  SiDocker,
  SiExpress,
  SiFirebase,
  SiJavascript,
  SiMongodb,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReactquery,
  SiSanity,
  SiShadcnui,
  SiSocketdotio,
  SiSupabase,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVuedotjs,
} from "react-icons/si";
import { TbBrandFramerMotion } from "react-icons/tb";
const BASE_PATH = "/assets/project-screenshots";

const ProjectsLinks = ({ live, repo }: { live: string; repo?: string }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-start gap-3 my-13 mb-8 !pl-3">
      <Link
        className="font-mono underline flex gap-6"
        rel="noopener"
        target="_new"
        href={live}
      >
        <Button variant={"default"} className="gap-2 !pl-3" >
          Visit Website
          <ArrowUpRight className=" w-15 h-5 !mr-3" />
        </Button>
      </Link>
      {repo && (
        <Link
          className="font-mono underline flex gap-2"
          rel="noopener"
          target="_new"
          href={repo}
        >
          
        </Link>
      )}
    </div>
  );
};

export type Skill = {
  title: string;
  bg: string;
  fg: string;
  icon: ReactNode;
};
const PROJECT_SKILLS = {
  next: {
    title: "Next.js",
    bg: "black",
    fg: "white",
    icon: <RiNextjsFill />,
  },
  chakra: {
    title: "Chakra UI",
    bg: "black",
    fg: "white",
    icon: <SiChakraui />,
  },
  node: {
    title: "Node.js",
    bg: "black",
    fg: "white",
    icon: <RiNodejsFill />,
  },
  python: {
    title: "Python",
    bg: "black",
    fg: "white",
    icon: <SiPython />,
  },
  prisma: {
    title: "prisma",
    bg: "black",
    fg: "white",
    icon: <SiPrisma />,
  },
  postgres: {
    title: "PostgreSQL",
    bg: "black",
    fg: "white",
    icon: <SiPostgresql />,
  },
  mongo: {
    title: "MongoDB",
    bg: "black",
    fg: "white",
    icon: <SiMongodb />,
  },
  express: {
    title: "Express",
    bg: "black",
    fg: "white",
    icon: <SiExpress />,
  },
  reactQuery: {
    title: "React Query",
    bg: "black",
    fg: "white",
    icon: <SiReactquery />,
  },
  shadcn: {
    title: "ShanCN UI",
    bg: "black",
    fg: "white",
    icon: <SiShadcnui />,
  },
  aceternity: {
    title: "Aceternity",
    bg: "black",
    fg: "white",
    icon: <AceTernityLogo />,
  },
  tailwind: {
    title: "Tailwind",
    bg: "black",
    fg: "white",
    icon: <SiTailwindcss />,
  },
  docker: {
    title: "Docker",
    bg: "black",
    fg: "white",
    icon: <SiDocker />,
  },
  yjs: {
    title: "Y.js",
    bg: "black",
    fg: "white",
    icon: (
      <span>
        <strong>Y</strong>js
      </span>
    ),
  },
  firebase: {
    title: "Firebase",
    bg: "black",
    fg: "white",
    icon: <SiFirebase />,
  },
  sockerio: {
    title: "Socket.io",
    bg: "black",
    fg: "white",
    icon: <SiSocketdotio />,
  },
  js: {
    title: "JavaScript",
    bg: "black",
    fg: "white",
    icon: <SiJavascript />,
  },
  ts: {
    title: "TypeScript",
    bg: "black",
    fg: "white",
    icon: <SiTypescript />,
  },
  vue: {
    title: "Vue.js",
    bg: "black",
    fg: "white",
    icon: <SiVuedotjs />,
  },
  react: {
    title: "React.js",
    bg: "black",
    fg: "white",
    icon: <RiReactjsFill />,
  },
  sanity: {
    title: "Sanity",
    bg: "black",
    fg: "white",
    icon: <SiSanity />,
  },
  spline: {
    title: "Spline",
    bg: "black",
    fg: "white",
    icon: <SiThreedotjs />,
  },
  gsap: {
    title: "GSAP",
    bg: "black",
    fg: "white",
    icon: "",
  },
  framerMotion: {
    title: "Framer Motion",
    bg: "black",
    fg: "white",
    icon: <TbBrandFramerMotion />,
  },
  supabase: {
    title: "Supabase",
    bg: "black",
    fg: "white",
    icon: <SiSupabase />,
  },
};
export type Project = {
  id: string;
  category: string;
  title: string;
  src: string;
  screenshots: string[];
  skills: { frontend: Skill[]; backend: Skill[] };
  content: React.ReactNode | any;
  github?: string;
  live: string;
};
const projects: Project[] = [
  {
    id: "codingducks",
    category: "Coding platform",
    title: "Coding Ducks",
    src: "/assets/project-screenshots/codingducks/landing.png",
    screenshots: ["landing.png"],
    skills: {
      frontend: [
        PROJECT_SKILLS.ts,
        PROJECT_SKILLS.next,
        PROJECT_SKILLS.chakra,
        PROJECT_SKILLS.reactQuery,
        PROJECT_SKILLS.firebase,
      ],
      backend: [
        PROJECT_SKILLS.node,
        PROJECT_SKILLS.express,
        PROJECT_SKILLS.prisma,
        PROJECT_SKILLS.python,
        PROJECT_SKILLS.postgres,
        PROJECT_SKILLS.sockerio,
      ],
    },
    live: "https://www.codingducks.xyz/",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center !mt-4">
            Coding ducks = LeetCode + CodePen + CSS Battles
          </TypographyP>
          <p className="font-mono pb-10 !mt-5 !mb-10 !pl-3">
            Coding Ducks is your coding dojo — where you level up your skills,
            battle in real-time code duels, and earn badges like a true code
            warrior. Track your progress, flex your brain, and climb the
            leaderboard. Ready to quack the code?
          </p>
          <ProjectsLinks  live={this.live} repo={this.github} />
          <TypographyH3 className="my-14 mt-32 !pb-5 !pt-10 !pl-3">Problems </TypographyH3>
          <p className="font-mono mb-2 !pl-3 !mb-5">
            Solve coding problems similar to LeetCode, enhancing your
            problem-solving skills across various languages.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/codingducks/problems.png`,
              `${BASE_PATH}/codingducks/problem.png`,
            ]}
          />
          <TypographyH3 className="my-4 !mt-8">Ducklets</TypographyH3>
          <p className="font-mono !mb-5">
            Collaborate in real-time with others in a multiplayer coding
            environment, just like CodePen but with a social twist.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/codingducks/ducklets.png`,
              `${BASE_PATH}/codingducks/ducklet1.png`,
              `${BASE_PATH}/codingducks/ducklet2.png`,
            ]}
          />
          <TypographyH3 className="my-4 !mt-8">UI Battles </TypographyH3>

          <p className="font-mono !mb-5">
            Challenge yourself to create UI components with HTML/CSS/JS, and get
            instant feedback with an automated similarity scoring.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/codingducks/css-battles.png`,
              `${BASE_PATH}/codingducks/css-battle.png`,
              `${BASE_PATH}/codingducks/css-battle2.png`,
            ]}
          />
          <TypographyH3 className="my-4 !mt-8">Contests </TypographyH3>
          <p className="font-mono !mb-5">
            Organize or participate in coding competitions. Successfully used to
            host three contests during college.
          </p>
          <SlideShow images={[`${BASE_PATH}/codingducks/contests.png`]} />
          <TypographyH3 className="my-4 !mt-8">Playground </TypographyH3>
          <p className="font-mono !mb-5">
            Test and execute your code instantly in my versatile online code
            runner.
          </p>
          <SlideShow images={[`${BASE_PATH}/codingducks/playground.png`]} />
          <TypographyH3 className="my-4 !mt-8">Users</TypographyH3>

          <p className="font-mono !mb-5">
            Track your progress, earn badges, and climb the rankings with
            detailed user profiles and activity tracking.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/codingducks/users.png`,
              `${BASE_PATH}/codingducks/user.png`,
            ]}
          />
        </div>
      );
    },
  },

  {
    id: "portfolio",
    category: "Portfolio",
    title: "My Portfolio",
    src: "/assets/project-screenshots/portfolio/image_copy.png",
    screenshots: ["image_copy.png"],
    live: "http://nareshkhatri.vercel.app",
    github:"https://github.com/Naresh-Khatri/Portfolio",
    skills: {
      frontend: [
        PROJECT_SKILLS.ts,
        PROJECT_SKILLS.next,
        PROJECT_SKILLS.shadcn,
        PROJECT_SKILLS.aceternity,
        PROJECT_SKILLS.framerMotion,
        PROJECT_SKILLS.tailwind,
        PROJECT_SKILLS.spline,
      ],
      backend: [],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono !mb-5 !mt-5 !pl-3">
            Welcome to my digital playground, where creativity meets code in the
            dopest way possible.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 !mt-8 !pl-3">
            Beautiful 3D Objects{" "}
          </TypographyH3>
          <p className="font-mono !mb-5 !mt-5 !pl-3">
            Did you see that 3D keyboard modal? Yeah! I made that. That
            interactive keyboard is being rendered in 3D on a webpage 🤯, and
            pressing each keycap reveals a skill in a goofy way. It&apos;s like
            typing, but make it art.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/portfolio/image_copy.png`,
              `${BASE_PATH}/portfolio/skills_section.png`,
            ]}
          />
          <TypographyH3 className="my-4 !mt-5 !pl-3">Space Theme</TypographyH3>
          <p className="font-mono !mb-5 !mt-5 !pl-3">
            Dark background + floating particles = out-of-this-world cool.
          </p>
          <SlideShow images={[`${BASE_PATH}/portfolio/skills_section.png`]} />
          <TypographyH3 className="my-4 !mt-8 !pl-3">Projects</TypographyH3>

          <p className="font-mono !mb-5 !mt-5 !pl-3">
            My top personal and freelance projects — no filler, all killer.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/portfolio/image.png`,
              `${BASE_PATH}/portfolio/project_dialog.png`,
            ]}
          />
          <p className="font-mono mb-2 mt-8 text-center !pl-3">
            This site&apos;s not just a portfolio — it&apos;s a whole vibe.
          </p>
        </div>
      );
    },
  },
  {
    id: "ghostchat",
    category: "Anonymous chat",
    title: "GhostChat",
    src: "/ghostchat/ghostpic.png",
    screenshots: ["1.png", "2.png", "3.png", "4.png"],
    live: "https://ghostchat.vercel.app",
    github:"https://github.com/Naresh-Khatri/GhostChat",
    skills: {
      frontend: [PROJECT_SKILLS.js, PROJECT_SKILLS.next, PROJECT_SKILLS.chakra],
      backend: [PROJECT_SKILLS.supabase],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono !mb-5 !mt-5 !pl-3">
            Ghostchat is your go-to spot for sending anonymous messages without
            leaving a trace. Powered by Supabase, it&apos;s all about keeping things
            low-key and secure. Whether you&apos;re sharing secrets, giving feedback,
            or just having some fun, Ghostchat ensures your identity stays
            hidden, while your voice is heard. Say what you want, without the
            worry.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 !mt-8 !pl-3 !mb-5">Features</TypographyH3>
          <SlideShow
            images={[
              `${BASE_PATH}/ghostchat/1.png`,
              `${BASE_PATH}/ghostchat/2.png`,
              `${BASE_PATH}/ghostchat/3.png`,
              `${BASE_PATH}/ghostchat/4.png`,
            ]}
          />
        </div>
      );
    },
  },
 
];
export default projects;
