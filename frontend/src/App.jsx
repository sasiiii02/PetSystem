import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserHeader from "./Component/UserHeader";
import UserFooter from "./Component/UserFooter";
import PetPlatformHomePage from "./Component/PetPlatformHomePage";
import AboutUs from "./Component/AboutUs";
import StaffLogin from "./Pages/StaffLogin";
import ContactUs from "./Component/ContactUs";
import PrivateRoute from "./Component/PrivateRoute";
import ProfessionalRegistration from "./Pages/ProfessionalRegistration";
import PetRegister from "./Pages/PetRegister";
import UserEdit from "./Pages/UserEdit";
import ProfilePage from "./Component/UserProfileViewAppointment";
import SysAdminDashboard from "./Pages/SysAdminDashboard";
import UsersList from "./Pages/UsersList";
import ProfessionalsList from "./Pages/ProfessionalsList";
import AdminRegister from "./Pages/AdminRegister";
import UserPageView from "./Pages/UserPageView";
import AdoptablePetList from "./Pages/AdoptablePetList";
import AddForAdoption from "./Pages/AddForAdoption";
import AdoptionForm from "./Pages/AdoptionForm";
import PetOwnerDashboard from "./Pages/PetOwnerDashboard";
import EditPetForm from "./Pages/EditPetForm";
import Success from "./Pages/Success";
import Cancel from "./Pages/Cancel";
import AppointmentPrfList from "./Pages/AppointmentPrfList";
import AppointmentForm from "./Component/AppointmentForm";
import UserEventsPage from "./Pages/UserEventsPage";
import UserEventDetailsPage from "./Pages/UserEventDetails";
import UserRegisteredEventsPage from "./Pages/UserRegisteredEventsPage";
import Notifications from "./Pages/Notifications";
import PetRegisterUserDashboard from "./Pages/PetRegisterUserDashboard";
import EditAdoptionForm from "./Pages/EditAdoptionForm";
import PetAdoptionCoordinatorDashboard from "./Pages/AdoptionCoordinatorDashBoard";
import AdoptionScheduler from "./Pages/HomeVisitScheduler";
const App = () => {
  return (
    <BrowserRouter>
          <UserHeader />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PetPlatformHomePage />} />
            <Route path="/stafflogin" element={<StaffLogin />} />
            <Route path="/AdminRegister" element={<AdminRegister />} />
            <Route path="/admin/redirect/user_admin" element={<SysAdminDashboard />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/UserEdit" element={<UserEdit />} />
            <Route path="/UsersList" element={<UsersList />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/PetRegister" element={<PetRegister />} />
            <Route path="/ProfessionalRegistration" element={<ProfessionalRegistration />} />
            <Route path="/ProfessionalsList" element={<ProfessionalsList />} />
            

            <Route path="/events" element={<UserEventsPage />} />
            <Route path="/appointment" element={<AppointmentPrfList />} />

            <Route path="/adoption" element={<UserPageView />} />
            <Route path="/info_adoptable_pet" element={<AdoptablePetList />} />
            <Route path="/add_adoptable_pet" element={<AddForAdoption />} />
            <Route path="/info_select_pet" element={<UserPageView />} />
            <Route path="/adopt" element={<AdoptionForm />} />
            <Route path="/Submit_adoption_Form" element={<UserPageView />} />
            <Route path="/AdoptionCoordinatorDashboard" element={<PetAdoptionCoordinatorDashboard />} />
            <Route path="/schedule-visit" element={<AdoptionScheduler />} />
            
            <Route
          path="/event/:id"
          element={
            <PrivateRoute>
              <UserEventDetailsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-events"
          element={
            <PrivateRoute>
              <UserRegisteredEventsPage />
            </PrivateRoute>
          }
        />
          <Route
    path="/notifications"
    element={
      <PrivateRoute>
        <Notifications />
      </PrivateRoute>
    }
  />
       
        <Route
          path="/appointment-form"
          element={
            <PrivateRoute>
              <AppointmentForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/success"
          element={
            <PrivateRoute>
              <Success />
            </PrivateRoute>
          }
        />
        <Route
          path="/cancel"
          element={
            <PrivateRoute>
              <Cancel />
            </PrivateRoute>
          }
        />

        <Route
          path="/pet-owner-dashboard"
          element={
            <PrivateRoute>
              <PetOwnerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/pet-register-dashboard"
          element={
            <PrivateRoute>
              <PetRegisterUserDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-adoption-form/:id"
          element={
            <PrivateRoute>
              <EditAdoptionForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-pet/:id"
          element={
            <PrivateRoute>
              <EditPetForm />
            </PrivateRoute>
          }
        />
          </Routes>
          <UserFooter />
    </BrowserRouter>
  );
};

export default App;