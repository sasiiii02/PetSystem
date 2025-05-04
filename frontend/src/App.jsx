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

 import Collection from "./Pages/Collection";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import PlaceOrder from "./Pages/PlaceOrder";
import Orders from "./Pages/Orders";

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

const App = () => {
  return (
    <BrowserRouter>
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

        {/* Admin Dashboard Routes */}
        <Route
          path="/admin/redirect/user_admin"
          element={
            <PrivateRoute>
              <MainLayout>
                <SysAdminDashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* Appointment Manager Routes with AppointmentManagerLayout */}
        <Route
          path="/admin/redirect/appointment_manager"
          element={
            <PrivateRoute>
              <AppointmentManagerLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Appointment_dashboard />} />
          <Route path="dashboard" element={<Appointment_dashboard />} />
          <Route path="reports" element={<Appointment_report />} />
          <Route path="appointments/history" element={<App_history_page />} />
          <Route path="appointments/vet" element={<Appointment_for_vet />} />
          <Route path="appointments/grooming" element={<Appointment_for_groomer />} />
          <Route path="appointments/training" element={<Appointment_for_trainer />} />
          <Route path="professionals/active" element={<ActiveProfessionals />} />
          <Route path="availability/vet" element={<Availability_for_vet />} />
          <Route path="availability/groomer" element={<Availability_for_groomer />} />
          <Route path="availability/trainer" element={<Availability_for_trainer />} />
          <Route path="refund-request" element={<CancelationReq />} />
        </Route>

           {/* Marketplace */}
         
          <Route path = '/product/:ProductId'element = {<Product/>}/>
          <Route path = "/cart" element={<Cart/>}/>
          <Route path = "/placeOrder" element={<PlaceOrder/>}/>
          <Route path = "/orders" element={<Orders/>}/>


        {/* Protected Routes with MainLayout */}
        <Route
          path="/event/:id"
          element={
            <PrivateRoute>
              <MainLayout>
                <UserEventDetailsPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/my-events"
          element={
            <PrivateRoute>
              <MainLayout>
                <UserRegisteredEventsPage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <MainLayout>
                <Notifications />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/appointment-form"
          element={
            <PrivateRoute>
              <MainLayout>
                <AppointmentForm />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/success"
          element={
            <PrivateRoute>
              <MainLayout>
                <Success />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/cancel"
          element={
            <PrivateRoute>
              <MainLayout>
                <Cancel />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/pet-owner-dashboard"
          element={
            <PrivateRoute>
              <MainLayout>
                <PetOwnerDashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/pet-register-dashboard"
          element={
            <PrivateRoute>
              <MainLayout>
                <PetRegisterUserDashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-adoption-form/:id"
          element={
            <PrivateRoute>
              <MainLayout>
                <EditAdoptionForm />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-pet/:id"
          element={
            <PrivateRoute>
              <MainLayout>
                <EditPetForm />
              </MainLayout>
            </PrivateRoute>
          }
        />

           <Route
          path="/collection"
          element={
            <MainLayout>
              <Collection />
            </MainLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default App;