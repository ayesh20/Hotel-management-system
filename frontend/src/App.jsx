import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";



// Pages
import Login from "./pages/Login/Login.jsx";
import Dashboard from "./pages/Dashboard/dashboard.jsx";
import AddRoom from "./pages/Room/addRoom.jsx";
import AllRooms from "./pages/Room/AllRooms.jsx";
import EditRoom from "./pages/Room/editRoom.jsx";
import AllCleaners from "./pages/HouseKeeping/AllCleaners.jsx";
import AddCleaners from "./pages/HouseKeeping/AddCleaners.jsx";
import EditCleaners from "./pages/HouseKeeping/EditCleaners.jsx";

import EditReservation from "./pages/Reservations/EditReservation.jsx";
import AddReservation from "./pages/Reservations/AddReservation.jsx";
import AllReservations from "./pages/Reservations/AllReservations.jsx";



function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: "#363636", color: "#fff" },
          success: {
            duration: 3000,
            iconTheme: { primary: "#4ade80", secondary: "#fff" },
          },
          error: {
            duration: 4000,
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
          },
        }}
      />

      
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/addroom" element={<AddRoom/>}/>
            <Route path="/allrooms" element={<AllRooms/>}/>
            <Route path="/editroom/:id" element={<EditRoom/>}/>
            <Route path="/allCleaners" element={<AllCleaners/>}/>
            <Route path="/addCleaner" element={<AddCleaners/>}/>
            <Route path="/editCleaner/:id" element={<EditCleaners/>}/>
            <Route path="/allReservation" element={<AllReservations/>}/>
            <Route path="/addReservation" element={<AddReservation/>}/>
            <Route path="/editReservation/:id" element={<EditReservation/>}/>

           
          
           
          </Routes>
        </BrowserRouter>
     
    </>
  );
}

export default App;