import React, { createContext, useContext, useState } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import FilterButton from '../components/DropdownFilter';
import Datepicker from '../components/Datepicker';
import Banner from '../partials/Banner';
import SheetCanvas from '../components/SheetCanvas';
import Uploadsheet from '../components/sheetcanvas/UploadSheet';
import { applyLatestChanges, displaySheet as Ds } from '../functions/notes';
import { createTheme, Grow } from '@mui/material';
import easinateVPSheet from '../functions/easinateVPSheet';
import EasinateSheet from '../components/sheetcanvas/EasinateSheet';
import TransposeSheet from '../components/sheetcanvas/TransposeSheet';
import { transposeVPSheet } from '../functions/transpose';
import DownloadButton from '../components/sheetcanvas/DownloadButton';
import FloatingActionCard from '../components/sheetcanvas/FloatingDarkCard';

const context = createContext({})
export const useMain = () => useContext(context)

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});


function Dashboard() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false)
  const [easinateOpen, setEasinateOpen] = useState(false)

  const [sheet, setSheet] = useState('')
  const [displaySheet, setDisplaySheet] = useState([])
  const [noteChanges, setNoteChanges] = useState([])
  // [
  //   {
  //     i: 17,
  //     changes: [
  //       '[0dz]',
  //       '[0d]',
  //       '0'
  //     ]
  //   }
  // ]

function applyChange(prevState, input) {
  const inputs = Array.isArray(input) ? input : [input];

  return inputs.reduce((state, { i, change }) => {
    const historyItem = state.find(item => item.i === i);

    // 🔹 FIRST time this note is touched
    if (!historyItem) {
      const original = displaySheet.find(n => n.i === i)?.note;

      // safety guard
      if (original === undefined || original === change) {
        return [...state, { i, changes: [change] }];
      }

      return [
        ...state,
        {
          i,
          changes: [original, change],
        },
      ];
    }

    // 🔹 Subsequent changes
    return state.map(item =>
      item.i === i
        ? { ...item, changes: [...item.changes, change] }
        : item
    );
  }, prevState);
}
  function detectChanges(arr1, arr2) {
    // build lookup for arr1: i -> note
    const baseMap = new Map(
      arr1.map(item => [item.i, item.note])
    );

    // collect diffs from arr2
    return arr2
      .filter(item => {
        const prevNote = baseMap.get(item.i);
        return prevNote !== undefined && prevNote !== item.note;
      })
      .map(({ i, note }) => ({
        i,
        change: note,
      }));
  }


  return (
    <context.Provider value={{
      sheet,
      displaySheet,
      noteChanges,
      setNoteChanges: ev => {
        setNoteChanges(prev => applyChange(prev, ev))
      },
      onEasinate: ev => {
        setNoteChanges(prev => applyChange(prev, detectChanges(displaySheet, Ds(easinateVPSheet(sheet, ev)))))
        // setTimeout(() => {
        //   setDisplaySheet(Ds(easinateVPSheet(sheet, ev)))
        // }, 100)
      },
      changeTranspose: ev => {
        setDisplaySheet(transposeVPSheet(displaySheet, 1))
      }
    }}>
      <div className="flex h-screen overflow-hidden">
        {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}

        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <main className="grow">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="sm:flex sm:justify-between sm:items-center mb-8">
                <div className="mb-4 sm:mb-0">
                </div>
                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                  {/* <TransposeSheet /> */}
                  <DownloadButton />
                  <EasinateSheet />

                  <button onClick={() => setModalOpen(prev => !prev)} className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
                    <svg className="fill-current shrink-0 xs:hidden" width="16" height="16" viewBox="0 0 16 16">
                      <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                    <span className="max-xs:sr-only">Add Sheet</span>
                  </button>
                </div>

              </div>
              <div className="">
                {/* {JSON.stringify(displaySheet)} */}
                {/* {JSON.stringify(noteChanges)} */}
                <SheetCanvas />
              </div>
            </div>
          </main>

          <Banner />

        </div>
        <Uploadsheet open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={sheet => {
          setNoteChanges([])
          setSheet(sheet)
          // console.log(displaySheet(sheet))
          setDisplaySheet(Ds(sheet))
        }} />
        <Grow in={noteChanges.length > 0}>
          <div>
            <FloatingActionCard onCancel={() => setNoteChanges([])} onSubmit={() => { 

              setDisplaySheet(applyLatestChanges(displaySheet,noteChanges))
              setTimeout(() => {
                setNoteChanges([])
              }, 100)

             }} />
          </div>
        </Grow>
      </div>
    </context.Provider>
  );
}

export default Dashboard;