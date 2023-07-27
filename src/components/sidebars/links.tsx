import { AiOutlineHome } from "solid-icons/ai";
import { CgMoreO, CgProfile } from "solid-icons/cg";
import { IoNotificationsCircleOutline } from "solid-icons/io";
import { RiMapCompassDiscoverLine } from "solid-icons/ri";

const SIZE = 24;

export const links = [
  {
    name: "Home",
    href: "/",
    icon: () => <AiOutlineHome size={SIZE} fill="white" />,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: () => <CgProfile size={SIZE} />,
  },
  {
    name: "More",
    href: "/more",
    icon: () => <CgMoreO size={SIZE} />,
  },
  {
    name: "Notification",
    href: "/notification",
    icon: () => <IoNotificationsCircleOutline size={SIZE} fill="white" />,
  },
  {
    name: "Discover",
    href: "/discover",
    icon: () => <RiMapCompassDiscoverLine size={SIZE} />,
  },
];
