import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
// import Videos from "./pages/UiElements/Videos";
// import Images from "./pages/UiElements/Images";
// import Alerts from "./pages/UiElements/Alerts";
// import Badges from "./pages/UiElements/Badges";
// import Avatars from "./pages/UiElements/Avatars";
// import Buttons from "./pages/UiElements/Buttons";
// import LineChart from "./pages/Charts/LineChart";
// import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
// import BasicTables from "./pages/Tables/BasicTables";
// import FormElements from "./pages/Forms/FormElements";
// import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Welcome from "./pages/Welcome";
import Divisi from "./pages/divisi/Index";
import Role from "./pages/role/Index";
import Hari from "./pages/hari/Index";
import User from "./pages/users/Index";
import Shifts from "./pages/shift/Index";
import ShiftByUser from "./pages/shift/byUser";
import Absensis from "./pages/absensi/Index";
import AbsensiByUser from "./pages/absensi/ByUser";
import AbsensiByMentor from "./pages/absensi/byMentor";
import { useUserStore } from "./services/state";

export default function App() {
  const user = useUserStore((state) => state.user);
  const RoleGuard = ({ roles }: { roles: string[] }) => {
    // belum login
    if (!user) return <Navigate to="/signin" replace />;

    // tidak punya akses
    if (!roles.includes(user.roleName)) {
      return <Navigate to="/signin" replace />;
    }

    return <Outlet />;
  };

  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* main menu */}
          <Route index path="/" element={<Welcome />} />

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route
              element={<RoleGuard roles={["Admin", "Validator", "Mentee"]} />}
            >
              <Route index path="/dashboard" element={<Home />} />
              <Route path="/shift_by" element={<ShiftByUser />} />
              <Route path="/absensis" element={<Absensis />} />
              <Route path="/absensi_by" element={<AbsensiByUser />} />
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/calendar" element={<Calendar />} />
            </Route>
            {/* main dashboard */}

            <Route element={<RoleGuard roles={["Admin"]} />}>
              {/* Element */}
              <Route path="/divisi" element={<Divisi />} />
              <Route path="/role" element={<Role />} />
              <Route path="/hari" element={<Hari />} />
              <Route path="/users" element={<User />} />
              <Route path="/shifts" element={<Shifts />} />
            </Route>

            {/* Others Page */}
            <Route element={<RoleGuard roles={["Validator"]} />}>
              <Route path="/absensi_by_mentor" element={<AbsensiByMentor />} />
            </Route>

            {/* <Route path="/blank" element={<Blank />} /> */}

            {/* Forms */}
            {/* <Route path="/form-elements" element={<FormElements />} /> */}

            {/* Tables */}
            {/* <Route path="/basic-tables" element={<BasicTables />} /> */}

            {/* Ui Elements */}
            {/* <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} /> */}

            {/* Charts */}
            {/* <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} /> */}
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
