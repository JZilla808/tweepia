import { lazy } from "solid-js";

import { Route, Routes } from "@solidjs/router";

import HomeScreen from "../screens/Home";
import ProfileScreen from "../screens/Profile";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import TweepDetailScreen from "../screens/TweepDetail";
import ComingSoonScreen from "../screens/ComingSoonScreen";

const LoginScreen = lazy(() => import("../screens/Login"));
const RegisterScreen = lazy(() => import("../screens/Register"));

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" component={MainLayout}>
        <Route path="" component={HomeScreen} />
        <Route path="/:uid/tweep/:id" component={TweepDetailScreen} />
        <Route path="profile" component={ProfileScreen} />

        <Route path="more" component={ComingSoonScreen} />
        <Route path="notification" component={ComingSoonScreen} />
        <Route path="discover" component={ComingSoonScreen} />
      </Route>

      <Route path="/auth" component={AuthLayout}>
        <Route path="/login" component={LoginScreen} />
        <Route path="/register" component={RegisterScreen} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
