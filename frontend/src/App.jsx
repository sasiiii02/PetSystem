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
import AdoptionHomePage from "./Pages/AdoptionHomePage";
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
<<<<<<< Updated upstream
import PetAdoptionCoordinatorDashboard from "./Pages/AdoptionCoordinatorDashBoard";
import AdoptionScheduler from "./Pages/HomeVisitScheduler";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
=======
import AppointmentManagerLayout from "./Component/AppointmentManagerLayout";
import Appointment_dashboard from "./Pages/Appointment_dashboard";
import Appointment_report from "./Pages/Appointment_report";
import App_history_page from "./Pages/Appoinment_for_history";
import Appointment_for_vet from "./Pages/Appointment_for_vet";
import Appointment_for_groomer from "./Pages/Appointment_for_groomer";
import Appointment_for_trainer from "./Pages/Appointment_for_trainer";
import Availability_for_vet from "./Pages/AvailabilityVetTable";
import Availability_for_groomer from "./Pages/AvailabilityGroomerTable";
import Availability_for_trainer from "./Pages/AvailabilityTrainerTable";
import CancelationReq from "./Pages/CancelationReqPage";
import ActiveProfessionals from "./Pages/ActiveProfessionals";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";

// Layout for pet owner routes with UserHeader and UserFooter
const MainLayout = ({ children }) => {
  return (
    <>
      <UserHeader />
      {children}
      <UserFooter />
    </>
  );
};
>>>>>>> Stashed changes

const App = () => {
  return (
    <BrowserRouter>
<<<<<<< Updated upstream
          <UserHeader />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PetPlatformHomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
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
            
=======
      <Routes>
        {/* Public Routes with MainLayout */}
        <Route
          path="/"
          element={
            <MainLayout>
              <PetPlatformHomePage />
            </MainLayout>
          }
        />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/signup" element={<MainLayout><Signup /></MainLayout>} />
        <Route
          path="/stafflogin"
          element={
            <MainLayout>
              <StaffLogin />
            </MainLayout>
          }
        />
        <Route
          path="/AdminRegister"
          element={
            <MainLayout>
              <AdminRegister />
            </MainLayout>
          }
        />
        <Route
          path="/aboutus"
          element={
            <MainLayout>
              <AboutUs />
            </MainLayout>
          }
        />
        <Route
          path="/UserEdit"
          element={
            <MainLayout>
              <UserEdit />
            </MainLayout>
          }
        />
        <Route
          path="/UsersList"
          element={
            <MainLayout>
              <UsersList />
            </MainLayout>
          }
        />
        <Route
          path="/contactus"
          element={
            <MainLayout>
              <ContactUs />
            </MainLayout>
          }
        />
        <Route
          path="/PetRegister"
          element={
            <MainLayout>
              <PetRegister />
            </MainLayout>
          }
        />
        <Route
          path="/ProfessionalRegistration"
          element={
            <MainLayout>
              <ProfessionalRegistration />
            </MainLayout>
          }
        />
        <Route
          path="/ProfessionalsList"
          element={
            <MainLayout>
              <ProfessionalsList />
            </MainLayout>
          }
        />
        <Route
          path="/events"
          element={
            <MainLayout>
              <UserEventsPage />
            </MainLayout>
          }
        />
        <Route
          path="/appointment"
          element={
            <MainLayout>
              <AppointmentPrfList />
            </MainLayout>
          }
        />
        <Route
          path="/adoption"
          element={
            <MainLayout>
              <AdoptionHomePage />
            </MainLayout>
          }
        />
        <Route
          path="/info_adoptable_pet"
          element={
            <MainLayout>
              <AdoptablePetList />
            </MainLayout>
          }
        />
        <Route
          path="/add_adoptable_pet"
          element={
            <MainLayout>
              <AddForAdoption />
            </MainLayout>
          }
        />
        <Route
          path="/info_select_pet"
          element={
            <MainLayout>
              <AdoptionHomePage />
            </MainLayout>
          }
        />
        <Route
          path="/adopt"
          element={
            <MainLayout>
              <AdoptionForm />
            </MainLayout>
          }
        />
        <Route
          path="/Submit_adoption_Form"
          element={
            <MainLayout>
              <AdoptionHomePage />
            </MainLayout>
          }
        />
>>>>>>> Stashed changes

            <Route path="/events" element={<UserEventsPage />} />
            <Route path="/appointment" element={<AppointmentPrfList />} />

            <Route path="/adoption" element={<AdoptionHomePage />} />
            <Route path="/info_adoptable_pet" element={<AdoptablePetList />} />
            <Route path="/add_adoptable_pet" element={<AddForAdoption />} />
            <Route path="/info_select_pet" element={<AdoptionHomePage />} />
            <Route path="/adopt" element={<AdoptionForm />} />
            <Route path="/Submit_adoption_Form" element={<AdoptionHomePage />} />
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