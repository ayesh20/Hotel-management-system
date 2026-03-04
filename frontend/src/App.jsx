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
import Payment from "./pages/Payment/Payment.jsx";
import AllStaff from "./pages/Staff/allstaff.jsx";
import AddStaff from "./pages/Staff/addStaff.jsx";
import EditStaff from "./pages/Staff/editStaff.jsx";
import CheckoutForm from "./pages/Payment/CheckoutForm.jsx";
import PendingPayment from "./pages/Payment/PendingPayment.jsx";
import PaymentSuccess from "./pages/Payment/PaymentSuccess.jsx";
import AllTransport from "./pages/Transport/allTransport.jsx";
import AddTransport from "./pages/Transport/addTransport.jsx";
import EdiTransport from "./pages/Transport/editTransport.jsx";
import AllCustomers from "./pages/Customers/AllCustomers";
import AddCustomer from "./pages/Customers/AddCustomer";
import EditCustomer from "./pages/Customers/EditCustomer";
import FeedbackPage from "./pages/Feedback&review/FeedbackPage.jsx";

//  Event Pages
import AllEvents from "./pages/Events/AllEvents.jsx";
import AddEvent from "./pages/Events/AddEvent.jsx";
import EditEvent from "./pages/Events/EditEvent.jsx";
import EventDashboard from "./pages/Events/EventDashboard.jsx";

import AddInventory from "./pages/Inventory/AddInventory.jsx";
import EditInventory from "./pages/Inventory/EditInventory.jsx";
import AllInventory from "./pages/Inventory/AllInventory.jsx";

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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/addroom" element={<AddRoom />} />
          <Route path="/allrooms" element={<AllRooms />} />
          <Route path="/editroom/:id" element={<EditRoom />} />
          <Route path="/allCleaners" element={<AllCleaners />} />
          <Route path="/addCleaner" element={<AddCleaners />} />
          <Route path="/editCleaner/:id" element={<EditCleaners />} />
          <Route path="/allReservation" element={<AllReservations />} />
          <Route path="/addReservation" element={<AddReservation />} />
          <Route path="/editReservation/:id" element={<EditReservation />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/checkoutform" element={<CheckoutForm />} />
          <Route path="/pendingpayment" element={<PendingPayment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/allstaff" element={<AllStaff />} />
          <Route path="/addstaff" element={<AddStaff />} />
          <Route path="/editstaff/:id" element={<EditStaff />} />
          <Route path="/allTransport" element={<AllTransport />} />
          <Route path="/addTransport" element={<AddTransport />} />
          <Route path="/editTransport/:id" element={<EdiTransport />} />
          <Route path="/customers" element={<AllCustomers />} />
          <Route path="/customers/add" element={<AddCustomer />} />
          <Route path="/customers/edit/:id" element={<EditCustomer />} />
          <Route path="/feedback" element={<FeedbackPage />} />

          {/* ✅ Event Routes */}
          <Route path="/allevents" element={<AllEvents />} />
          <Route path="/addevent" element={<AddEvent />} />
          <Route path="/editevent/:id" element={<EditEvent />} />
          <Route path="/eventdashboard" element={<EventDashboard />} />

          <Route path="/inventory" element={<AllInventory />} />
          <Route path="/add-inventory" element={<AddInventory />} />
          <Route path="/edit-inventory/:id" element={<EditInventory />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;