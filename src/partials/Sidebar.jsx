import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";

import SidebarLinkGroup from "./SidebarLinkGroup";
import SongListItem from "../components/sidebar";

import { SHEET_EXAMPLE } from "../constants";
import { calculateVpDifficulty, genEasy, generateEasinatedDifficultyTiers, getDifficultyName, nameDifficultyTier } from "../functions/sheetdifficulty";
import AddSheet from "../components/sidebar/addSheet";
import { saveSheet, saveVersion } from "../functions";
import { Icon, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddVersion from "../components/sidebar/addVersion";
import SongEditModal from "../components/sidebar/SongEditModal";
import Swal from "sweetalert2";

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  variant = 'default',
}) {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const [key, setKey] = useState(null)

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === "true");
  const [addSheet, setAddSheet] = useState(false)
  const [editSheet, setEditSheet] = useState(false)
  const [addVersion, setAddVersion] = useState(false)

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  const onAddVersion = (id) => {
    setKey(id)
    setAddVersion(prev => !prev)
  }

  const onSubmitVersion = (ev) => {
    saveVersion(key, { name: ev, sheet: JSON.parse(localStorage.getItem('songs')).find(el => el.id === key).sheet })
    setKey(null)
  }

  const deleteSheet = async(id) => {
    const result = await Swal.fire({
      title: "Delete Song?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",

      // 🎨 Dark theme
      background: "#111827", // gray-900
      color: "#E5E7EB",      // gray-200
      iconColor: "#F87171",  // red-400

      confirmButtonColor: "#7C3AED", // purple-600
      cancelButtonColor: "#374151",  // gray-700
      focusCancel: true,
    });

    if (!result.isConfirmed) return false;

    const stored = localStorage.getItem("songs");
    if (!stored) return false;

    let songs;
    try {
      songs = JSON.parse(stored);
      if (!Array.isArray(songs)) return false;
    } catch {
      return false;
    }

    const next = songs.filter(song => song.id !== id);

    localStorage.setItem("songs", JSON.stringify(next));

    // ✅ Success feedback
    await Swal.fire({
      title: "Deleted",
      text: "Song has been removed.",
      icon: "success",

      background: "#111827",
      color: "#E5E7EB",
      confirmButtonColor: "#7C3AED",
    });

    window.location.reload()

    return true;
  }

  return (
    <div className="min-w-fit">
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-gray-900/30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex lg:flex! flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:w-64! shrink-0 bg-white dark:bg-gray-800 p-4 transition-all duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} ${variant === 'v2' ? 'border-r border-gray-200 dark:border-gray-700/60' : 'rounded-r-2xl shadow-xs'}`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-gray-500 hover:text-gray-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <NavLink end to="/" className="block">
            <svg className="fill-violet-500" xmlns="http://www.w3.org/2000/svg" width={32} height={32}>
              <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z" />
            </svg>
          </NavLink>
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                •••
              </span>
              <div className="flex items-center gap-1 justify-between">
                <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                  Songs
                </span>

                <IconButton size="small" onClick={() => setAddSheet(prev => !prev)}>
                  <AddIcon fontSize="small" className="text-gray-400" />
                </IconButton>
              </div>
            </h3>
            <ul className="mt-3">
              {/* Dashboard */}
              {
                localStorage.getItem('songs') ? JSON.parse(localStorage.getItem('songs')).map((el, i) => {
                  return (
                    <>
                      <SongListItem
                        title={el.title}
                        artist={el.artist}
                        id={el.id}
                        songs={
                          generateEasinatedDifficultyTiers(el.sheet).concat({ name: null, sheet: el.sheet, type: 0 }).concat(el.sheets).sort((a, b) => calculateVpDifficulty(a.sheet) - calculateVpDifficulty(b.sheet)).map((x, i) => {
                            return {
                              i: Object.keys(x).includes('i') ? x.i : null,
                              name: x.name,
                              difficulty: getDifficultyName(calculateVpDifficulty(x.sheet)),
                              sheet: x.sheet,
                              type: Object.keys(x).includes('type') ? x.type : 1
                            }
                          })
                        }
                        onAddVersion={onAddVersion}
                        onEditSheet={() => {
                          setKey(el.id)
                          setEditSheet(prev => !prev)
                        }}
                        onDeleteSheet={() => {
                          deleteSheet(el.id)
                        }}
                      // onSelectSheet={(sheet) => {
                      //   setCurrentSheet(sheet);
                      // }}
                      />
                    </>
                  )
                }) : ''
              }

            </ul>
          </div>
        </div>

        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="w-12 pl-4 pr-3 py-2">
            <button className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400" onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg className="shrink-0 fill-current text-gray-400 dark:text-gray-500 sidebar-expanded:rotate-180" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path d="M15 16a1 1 0 0 1-1-1V1a1 1 0 1 1 2 0v14a1 1 0 0 1-1 1ZM8.586 7H1a1 1 0 1 0 0 2h7.586l-2.793 2.793a1 1 0 1 0 1.414 1.414l4.5-4.5A.997.997 0 0 0 12 8.01M11.924 7.617a.997.997 0 0 0-.217-.324l-4.5-4.5a1 1 0 0 0-1.414 1.414L8.586 7M12 7.99a.996.996 0 0 0-.076-.373Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <AddSheet open={addSheet} onClose={() => setAddSheet(false)} onSubmit={(ev) => {
        saveSheet(ev)
      }} />
      <AddVersion open={addVersion} onClose={() => setAddVersion(prev => !prev)} onSubmit={onSubmitVersion} />
      <SongEditModal id={key} open={editSheet} onClose={() => setEditSheet(false)} onSubmit={() => {
        setKey(null)
      }} />
    </div>
  );
}

export default Sidebar;
