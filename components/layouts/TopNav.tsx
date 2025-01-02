"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaRegFileVideo } from "react-icons/fa"
import { IoFolderOutline, IoHomeOutline } from "react-icons/io5"

const TopNav = () => {
  const pathname = usePathname()

  const routes = [
    { path: "/", label: "/", icon: <IoHomeOutline className="mr-2" /> },
    {
      path: "/subjects",
      label: "Subjects",
      icon: <IoFolderOutline className="mr-2" />,
    },
    {
      path: "/subjects/[chapterSlug]",
      label: "Chapters",
      icon: <IoFolderOutline className="mr-2" />,
    },
    {
      path: "/subjects/[chapterSlug]/[contentSlug]",
      label: "Videos",
      icon: <FaRegFileVideo className="mr-2" />,
    },
  ]

  return (
    <div className="breadcrumbs text-sm p-6">
      <ul>
        {routes.map((route) => {
          const isActive = new RegExp(
            `^${route.path.replace(/\[.*?\]/g, "[^/]+")}$`
          ).test(pathname)
          return (
            <li key={route.path}>
              <Link
                href={route.path.replace(/\[.*?\]/g, "example")}
                className={`inline-flex items-center ${
                  isActive ? "font-bold" : ""
                }`}
              >
                {route.icon}
                {route.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default TopNav
